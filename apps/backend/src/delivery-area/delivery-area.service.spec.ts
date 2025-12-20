import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryAreaService } from './delivery-area.service';

describe('DeliveryAreaService', () => {
  let service: DeliveryAreaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeliveryAreaService],
    }).compile();

    service = module.get<DeliveryAreaService>(DeliveryAreaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
