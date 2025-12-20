import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    Req,
    UseGuards,
    NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CouponService } from './coupon.service';

@Controller('coupons')
@UseGuards(AuthGuard('jwt'))
export class CouponController {
    constructor(private readonly couponService: CouponService) { }

    @Get()
    async findAll(
        @Req() req: any,
        @Query('current') current?: string,
        @Query('pageSize') pageSize?: string,
    ) {
        const shopId = req.user.shopId;
        const page = current ? parseInt(current) : 1;
        const size = pageSize ? parseInt(pageSize) : 20;
        const skip = (page - 1) * size;

        return this.couponService.findAll(shopId, { skip, take: size });
    }

    @Get(':id')
    async findOne(@Req() req: any, @Param('id') id: string) {
        const shopId = req.user.shopId;
        const coupon = await this.couponService.findOne(shopId, id);
        if (!coupon) {
            throw new NotFoundException('优惠券不存在');
        }
        return coupon;
    }

    @Post()
    async create(@Req() req: any, @Body() data: any) {
        const shopId = req.user.shopId;
        return this.couponService.create(shopId, data);
    }

    @Put(':id')
    async update(@Req() req: any, @Param('id') id: string, @Body() data: any) {
        const shopId = req.user.shopId;
        const coupon = await this.couponService.update(shopId, id, data);
        if (!coupon) {
            throw new NotFoundException('优惠券不存在');
        }
        return coupon;
    }

    @Delete(':id')
    async delete(@Req() req: any, @Param('id') id: string) {
        const shopId = req.user.shopId;
        const coupon = await this.couponService.delete(shopId, id);
        if (!coupon) {
            throw new NotFoundException('优惠券不存在');
        }
        return { success: true };
    }
}
