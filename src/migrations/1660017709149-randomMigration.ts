import { MigrationInterface, QueryRunner } from 'typeorm';

export class randomMigration1660017709149 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `users` ( `id` bigint PRIMARY KEY NOT NULL AUTO_INCREMENT, `name` varchar(255), `email` varchar(255), `password` varchar(255), `avatar` varchar(255), `is_admin` boolean, `created_at` datetime, `updated_at` datetime,`deleted_at` datetime);',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `users`');
  }
}
