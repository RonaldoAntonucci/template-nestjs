import { dirname, join } from 'path';
import { SnakeNamingStrategy } from 'src/shared/database/database-naming.strategy';
import { DataSource } from 'typeorm';

export const datasource = new DataSource({
    type: 'postgres',
    url: 'postgresql://docker:docker@localhost:35000/challenger?schema=public',
    entities: [join(dirname(__filename), 'src/**/*.entity.ts')],
    migrations: [
        join(dirname(__filename), 'src/shared/database/migrations/**/*.ts'),
    ],
    namingStrategy: new SnakeNamingStrategy(),
});
