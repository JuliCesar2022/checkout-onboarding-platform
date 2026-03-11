import { Test, TestingModule } from '@nestjs/testing';
import { DeliveriesModule } from './deliveries.module';
import { PrismaService } from '../../prisma/prisma.service';
import { DeliveriesController } from './infrastructure/controllers/deliveries.controller';

import { PrismaModule } from '../../prisma/prisma.module';

describe('DeliveriesModule', () => {
  it('should be defined and compilable', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DeliveriesModule, PrismaModule],
    }).compile();

    expect(module).toBeDefined();
    
    // Check if controller is exposed
    const controller = module.get<DeliveriesController>(DeliveriesController);
    expect(controller).toBeDefined();
  });
});
