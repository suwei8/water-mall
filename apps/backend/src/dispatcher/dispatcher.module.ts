import { Module } from '@nestjs/common';
import { DispatcherController } from './dispatcher.controller';
import { DispatcherService } from './dispatcher.service';
import { PrismaService } from '../prisma.service';

@Module({
    controllers: [DispatcherController],
    providers: [DispatcherService, PrismaService],
    exports: [DispatcherService],
})
export class DispatcherModule { }
