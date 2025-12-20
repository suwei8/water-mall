import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { RoleController } from './role.controller';
import { AdminService } from './admin.service';
import { PrismaService } from '../prisma.service';
import { ConfigModule } from '../config/config.module';

@Module({
    imports: [ConfigModule],
    controllers: [AdminController, RoleController],
    providers: [AdminService, PrismaService],
    exports: [AdminService],
})
export class AdminModule { }
