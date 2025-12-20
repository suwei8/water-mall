import { Module } from '@nestjs/common';
import { ShopApiController } from './shop-api.controller';
import { CartApiController } from './cart-api.controller';
import { OrderApiController } from './order-api.controller';
import { AddressApiController } from './address-api.controller';
import { PrismaService } from '../prisma.service';

/**
 * 小程序 API 模块
 * 包含公开接口和用户接口
 */
@Module({
    controllers: [
        ShopApiController,
        CartApiController,
        OrderApiController,
        AddressApiController,
    ],
    providers: [PrismaService],
})
export class ApiModule { }
