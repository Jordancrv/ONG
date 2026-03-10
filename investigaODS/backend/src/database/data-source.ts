import 'reflect-metadata';
import { DataSource } from 'typeorm';
import configuration from '../config/configuration';
import { SnakeNamingStrategy } from './snake-naming.strategy';
import * as entities from '../entities';

const config = configuration();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.name,
  logging: config.database.logging,
  synchronize: false,
  entities: Object.values(entities),
  migrations: ['dist/database/migrations/*.js'],
  namingStrategy: new SnakeNamingStrategy(),
});

export default AppDataSource;
