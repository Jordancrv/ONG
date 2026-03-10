import { Controller, Get, Post, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/user.entity';

@ApiTags('Favorites')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all favorite courses for current user' })
  @ApiResponse({ status: 200, description: 'List of favorite courses retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserFavorites(@CurrentUser() user: User) {
    return this.favoritesService.getUserFavorites(user);
  }

  @Post(':courseId')
  @ApiOperation({ summary: 'Add course to favorites' })
  @ApiParam({ name: 'courseId', type: 'number', description: 'ID of the course to add to favorites' })
  @ApiResponse({ status: 201, description: 'Course added to favorites successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  @ApiResponse({ status: 409, description: 'Course already in favorites' })
  async addFavorite(@Param('courseId') courseId: number, @CurrentUser() user: User) {
    return this.favoritesService.addFavorite(Number(courseId), user);
  }

  @Delete(':courseId')
  @ApiOperation({ summary: 'Remove course from favorites' })
  @ApiParam({ name: 'courseId', type: 'number', description: 'ID of the course to remove from favorites' })
  @ApiResponse({ status: 200, description: 'Course removed from favorites successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Favorite not found' })
  async removeFavorite(@Param('courseId') courseId: number, @CurrentUser() user: User) {
    return this.favoritesService.removeFavorite(Number(courseId), user);
  }

  @Get(':courseId/check')
  @ApiOperation({ summary: 'Check if course is in favorites' })
  @ApiParam({ name: 'courseId', type: 'number', description: 'ID of the course to check' })
  @ApiResponse({ status: 200, description: 'Favorite status retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async checkFavorite(@Param('courseId') courseId: number, @CurrentUser() user: User) {
    const isFavorite = await this.favoritesService.isFavorite(Number(courseId), user);
    return { isFavorite };
  }
}
