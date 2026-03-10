import { DefaultNamingStrategy, NamingStrategyInterface } from 'typeorm';
import { snakeCase } from '../utils/snake-case';

export class SnakeNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
  columnName(propertyName: string, customName: string, embeddedPrefixes: string[]): string {
    return snakeCase([...embeddedPrefixes, customName ?? propertyName].join('_'));
  }

  relationName(propertyName: string): string {
    return snakeCase(propertyName);
  }

  tableName(targetName: string, userSpecifiedName?: string): string {
    return snakeCase(userSpecifiedName ?? targetName);
  }

  joinColumnName(relationName: string, referencedColumnName: string): string {
    return snakeCase(`${relationName}_${referencedColumnName}`);
  }

  joinTableName(firstTableName: string, secondTableName: string, firstPropertyName: string): string {
    return snakeCase(`${firstTableName}_${firstPropertyName}_${secondTableName}`);
  }

  joinTableColumnName(tableName: string, propertyName: string, columnName?: string): string {
    return snakeCase(`${tableName}_${columnName ?? propertyName}`);
  }
}
