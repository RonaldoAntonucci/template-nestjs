import { dirname, join } from 'path';
import { DataSource } from 'typeorm';

export const datasource = new DataSource({
    type: 'postgres',
    url: 'postgresql://docker:docker@localhost:35000/template?schema=public',
    entities: [join(dirname(__filename), 'src/**/*.entity.ts')],
    migrations: [
        join(dirname(__filename), 'src/shared/database/migrations/**/*.ts'),
    ],
});
