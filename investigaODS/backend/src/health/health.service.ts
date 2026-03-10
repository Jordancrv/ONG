import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class HealthService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async getHealth() {
    try {
      await this.dataSource.query('SELECT 1');
      return { app: 'ok', db: 'ok' };
    } catch (error) {
      return { app: 'ok', db: 'error', error: (error as Error).message };
    }
  }

  async getReadiness() {
    return this.getHealth();
  }
}
