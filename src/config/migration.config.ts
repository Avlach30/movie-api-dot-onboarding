import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { Tag } from '../entities/tag.entity';

const MigrationConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USER,
  password: process.env.DB_USER_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [Tag],
  migrations: [Tag],
  synchronize: false,
  logging: true,
  extra: {
    charset: 'utf8mb4_unicode_ci',
  },
};

export = MigrationConfig;
