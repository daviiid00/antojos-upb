import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AgregarWhatsappAUsers1794300000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE users ADD COLUMN whatsapp VARCHAR(20) NULL',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE users DROP COLUMN whatsapp');
  }
}