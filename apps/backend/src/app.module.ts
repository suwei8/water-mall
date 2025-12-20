import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ShopGuard, ShopContextService, PermissionGuard } from './common';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { DeliveryAreaModule } from './delivery-area/delivery-area.module';
import { OrderModule } from './order/order.module';
import { UploadModule } from './upload/upload.module';
import { ApiModule } from './api/api.module';
import { UserModule } from './user/user.module';
import { CouponModule } from './coupon/coupon.module';
import { StatsModule } from './stats/stats.module';
import { ShopModule } from './shop/shop.module';
import { WaterTicketModule } from './water-ticket/water-ticket.module';
import { DepositModule } from './deposit/deposit.module';
import { DispatcherModule } from './dispatcher/dispatcher.module';
import { ConfigModule } from './config/config.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    AuthModule, ProductModule, CategoryModule, DeliveryAreaModule, OrderModule,
    UploadModule, ApiModule, UserModule, CouponModule, StatsModule, ShopModule,
    WaterTicketModule, DepositModule, DispatcherModule, ConfigModule, AdminModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ShopContextService,
    {
      provide: APP_GUARD,
      useClass: ShopGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class AppModule { }

