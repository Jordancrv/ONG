import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserFavorite } from './favorite.entity';
import { User } from '../users/user.entity';
import { Course } from '../courses/course.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(UserFavorite)
    private readonly favoritesRepository: Repository<UserFavorite>,
    @InjectRepository(Course)
    private readonly coursesRepository: Repository<Course>,
  ) {}

  async addFavorite(courseId: number, user: User) {
    // Check if course exists
    const course = await this.coursesRepository.findOne({ 
      where: { id: courseId },
      relations: ['owner']
    });
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Check if already favorited
    const existing = await this.favoritesRepository.findOne({
      where: {
        user: { id: user.id },
        course: { id: courseId },
      },
    });

    if (existing) {
      throw new ConflictException('Course already in favorites');
    }

    // Create favorite
    const favorite = this.favoritesRepository.create({
      user,
      course,
    });

    const saved = await this.favoritesRepository.save(favorite);
    
    // Reload with relations
    const reloaded = await this.favoritesRepository.findOne({
      where: { id: saved.id },
      relations: ['course', 'course.owner', 'user'],
    });
    
    return this.sanitizeFavorite(reloaded!);
  }

  async removeFavorite(courseId: number, user: User) {
    const favorite = await this.favoritesRepository.findOne({
      where: {
        user: { id: user.id },
        course: { id: courseId },
      },
    });

    if (!favorite) {
      throw new NotFoundException('Favorite not found');
    }

    await this.favoritesRepository.remove(favorite);
    return { success: true };
  }

  async getUserFavorites(user: User) {
    const favorites = await this.favoritesRepository.find({
      where: { user: { id: user.id } },
      relations: ['course', 'course.owner'],
      order: { createdAt: 'DESC' },
    });

    return favorites.map((fav) => this.sanitizeFavorite(fav));
  }

  async isFavorite(courseId: number, user: User): Promise<boolean> {
    const favorite = await this.favoritesRepository.findOne({
      where: {
        user: { id: user.id },
        course: { id: courseId },
      },
    });

    return !!favorite;
  }

  private sanitizeFavorite(favorite: UserFavorite) {
    // Remove password from user
    if (favorite.user) {
      const { passwordHash, ...user } = favorite.user as any;
      favorite.user = user as User;
    }

    // Remove password from course owner
    if (favorite.course?.owner) {
      const { passwordHash, ...owner } = favorite.course.owner as any;
      favorite.course.owner = owner as User;
    }

    // Add courseId for frontend compatibility
    const result = {
      ...favorite,
      courseId: favorite.course?.id,
    };

    return result;
  }
}
