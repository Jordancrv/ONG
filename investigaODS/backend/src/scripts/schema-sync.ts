import 'reflect-metadata';
import { DataSource } from 'typeorm';
import configuration from '../config/configuration';
import { SnakeNamingStrategy } from '../database/snake-naming.strategy';
import * as entities from '../entities';

async function bootstrap() {
  const config = configuration();
  const dataSource = new DataSource({
    type: 'mysql',
    host: config.database.host,
    port: config.database.port,
    username: config.database.username,
    password: config.database.password,
    database: config.database.name,
    logging: config.database.logging,
    synchronize: false,
    entities: Object.values(entities),
    namingStrategy: new SnakeNamingStrategy(),
  });

  await dataSource.initialize();
  await dataSource.synchronize(false);
  await dataSource.destroy();
  // eslint-disable-next-line no-console
  console.log('Schema synchronization completed.');
}

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Schema sync failed', error);
  process.exit(1);
});
