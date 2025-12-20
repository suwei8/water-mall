import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../prisma.service';
import { CouponModule } from '../coupon/coupon.module';

@Module({
    imports: [CouponModule],
    controllers: [UserController],
    providers: [UserService, PrismaService],
    exports: [UserService],
})
export class UserModule { }

