import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { version } = require('../../package.json') as { version: string };

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
