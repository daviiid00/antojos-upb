import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AgregarStatusAProducts1794508328559 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE products ADD COLUMN status VARCHAR(10) NOT NULL DEFAULT 'ACTIVE' AFTER stock",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE products DROP COLUMN status');
  }
}