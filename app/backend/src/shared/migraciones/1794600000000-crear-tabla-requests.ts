import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CrearTablaRequests1794600000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE requests (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        product_id INT UNSIGNED NOT NULL,
        buyer_id INT UNSIGNED NOT NULL,
        quantity INT UNSIGNED NOT NULL,
        status VARCHAR(10) NOT NULL DEFAULT 'PENDING',
        created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (id),
        CONSTRAINT FK_requests_product FOREIGN KEY (product_id) REFERENCES products (id),
        CONSTRAINT FK_requests_buyer FOREIGN KEY (buyer_id) REFERENCES users (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE requests');
  }
}