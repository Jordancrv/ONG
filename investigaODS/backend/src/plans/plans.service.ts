import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MembershipPlan, MembershipPlanCode } from './membership-plan.entity';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(MembershipPlan)
    private readonly plansRepository: Repository<MembershipPlan>,
  ) {}

  findAll(): Promise<MembershipPlan[]> {
    return this.plansRepository.find();
  }

  async ensureSeeded() {
    const count = await this.plansRepository.count();
    if (count === 0) {
      const basic = this.plansRepository.create({
        code: MembershipPlanCode.BASIC,
        name: 'Basic',
        features: { proContent: false },
      });
      const pro = this.plansRepository.create({
        code: MembershipPlanCode.PRO,
        name: 'Pro',
        features: { proContent: true, liveClasses: true },
      });
      await this.plansRepository.save([basic, pro]);
    }
  }
}
