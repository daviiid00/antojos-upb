import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CrearTablaProducts1794200000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE products (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        price INT UNSIGNED NOT NULL,
        image_url VARCHAR(500) NOT NULL,
        stock INT UNSIGNED NOT NULL,
        seller_id INT UNSIGNED NOT NULL,
        created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (id),
        CONSTRAINT FK_products_seller FOREIGN KEY (seller_id) REFERENCES users (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE products');
  }
}