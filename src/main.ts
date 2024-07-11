import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import metadata from './metadata';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule);
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
        .setTitle('Qrdapio User')
        .setDescription('The Qrdapio Client User API')
        .setVersion('0.1')
        .addBearerAuth()
        .build();

    await SwaggerModule.loadPluginMetadata(metadata);
    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('docs', app, document);

    await app.listen(process.env.PORT);
}
bootstrap();
