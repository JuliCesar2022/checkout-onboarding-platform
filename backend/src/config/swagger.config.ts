import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as path from 'path';
import * as fs from 'fs';

// Resolves package.json from the project root regardless of compiled output path
const pkgPath = path.resolve(__dirname, '../../../package.json');
const { version } = JSON.parse(fs.readFileSync(pkgPath, 'utf8')) as { version: string };

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Checkout Onboarding API')
    .setDescription(
      'Payment checkout API with Wompi integration — FullStack technical test.\n\n' +
      '**Flow:** Products → Card/Delivery form → Summary → Transaction → Stock update\n\n' +
      'All monetary values are in **COP cents** (e.g. 150000 = $1,500 COP).',
    )
    .setVersion(version)
    .addTag('products', 'Product catalog and stock management')
    .addTag('categories', 'Product category hierarchy')
    .addTag('customers', 'Customer upsert and management')
    .addTag('transactions', 'Payment transactions via Wompi')
    .addTag('deliveries', 'Delivery records per transaction')
    .addTag('payment', 'Wompi tokenization proxy')
    .addServer('http://localhost:3000', 'Local development')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      defaultModelsExpandDepth: 2,
      defaultModelExpandDepth: 2,
    },
  });
}
