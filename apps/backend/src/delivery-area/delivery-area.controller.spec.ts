import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryAreaController } from './delivery-area.controller';

describe('DeliveryAreaController', () => {
  let controller: DeliveryAreaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveryAreaController],
    }).compile();

    controller = module.get<DeliveryAreaController>(DeliveryAreaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
