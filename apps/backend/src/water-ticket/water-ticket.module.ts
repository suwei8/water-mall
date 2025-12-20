import { Module } from '@nestjs/common';
import { WaterTicketController } from './water-ticket.controller';
import { WaterTicketService } from './water-ticket.service';
import { PrismaService } from '../prisma.service';

@Module({
    controllers: [WaterTicketController],
    providers: [WaterTicketService, PrismaService],
    exports: [WaterTicketService],
})
export class WaterTicketModule { }
