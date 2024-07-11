import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpStatus, ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import metadata from './metadata';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule);

    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: '1',
    });

    app.enableCors();
    app.useGlobalPipes(
        new ValidationPipe({
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            whitelist: true,
            transform: true,
            skipNullProperties: false,
            skipUndefinedProperties: false,
        }),
    );

    const config = new DocumentBuilder()
        .setTitle('Template Api')
        .setDescription('The Template API')
        .setVersion('0.1')
        .addBearerAuth()
        .build();

    await SwaggerModule.loadPluginMetadata(metadata);
    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('docs', app, document);

    const configService = app.get(ConfigService);

    await app.listen(configService.get('PORT')).then(() => {
        console.log(
            `Server running on port:${configService.get('PORT')} at ${new Date().toISOString()}`,
        );
    });
}
bootstrap();
