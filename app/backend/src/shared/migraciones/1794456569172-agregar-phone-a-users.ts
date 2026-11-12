import type { MigrationInterface, QueryRunner } from 'typeorm';

// Nullable: las cuentas creadas antes de este cambio no tienen celular.
// 12 caracteres: prefijo 57 + 10 dígitos (formato de wa.me).
export class AgregarPhoneAUsers1794456569172 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE users ADD COLUMN phone VARCHAR(12) NULL AFTER email',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE users DROP COLUMN phone');
  }
}
