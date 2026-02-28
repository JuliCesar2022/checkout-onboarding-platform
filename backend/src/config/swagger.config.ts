import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Checkout Onboarding API')
    .setDescription('Payment checkout API with Wompi integration')
    .setVersion('1.0')
    .addTag('products', 'Product catalog and stock')
    .addTag('customers', 'Customer management')
    .addTag('transactions', 'Payment transactions')
    .addTag('deliveries', 'Delivery information')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
}
