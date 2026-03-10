import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1699999999999 implements MigrationInterface {
  name = 'InitialSchema1699999999999';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Initial migration placeholder. Use TypeORM CLI to generate full schema when running locally.
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop logic handled by TypeORM generate commands.
  }
}
