import { Module } from '@nestjs/common';
import { DeliveryAreaController } from './delivery-area.controller';
import { DeliveryAreaService } from './delivery-area.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [DeliveryAreaController],
  providers: [DeliveryAreaService, PrismaService]
})
export class DeliveryAreaModule { }
