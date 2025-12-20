import {
    Controller,
    Get,
    Post,
    Param,
    Query,
    Body,
    Req,
    UseGuards,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { CouponService } from '../coupon/coupon.service';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly couponService: CouponService,
    ) { }

    /**
     * 获取用户列表
     */
    @Get()
    async findAll(
        @Req() req: any,
        @Query('current') current?: string,
        @Query('pageSize') pageSize?: string,
        @Query('search') search?: string,
    ) {
        const shopId = req.user.shopId;
        const page = current ? parseInt(current) : 1;
        const size = pageSize ? parseInt(pageSize) : 20;
        const skip = (page - 1) * size;

        return this.userService.findAll(shopId, {
            skip,
            take: size,
            search,
        });
    }

    /**
     * 获取用户详情
     */
    @Get(':id')
    async findOne(@Req() req: any, @Param('id') id: string) {
        const shopId = req.user.shopId;
        const user = await this.userService.findOne(shopId, id);

        if (!user) {
            throw new NotFoundException('用户不存在');
        }

        // 获取统计信息
        const stats = await this.userService.getUserStats(shopId, id);

        return {
            ...user,
            ...stats,
            couponCount: user._count.coupons,
        };
    }

    /**
     * 获取用户订单历史
     */
    @Get(':id/orders')
    async getUserOrders(
        @Req() req: any,
        @Param('id') id: string,
        @Query('current') current?: string,
        @Query('pageSize') pageSize?: string,
    ) {
        const shopId = req.user.shopId;
        const page = current ? parseInt(current) : 1;
        const size = pageSize ? parseInt(pageSize) : 10;
        const skip = (page - 1) * size;

        return this.userService.getUserOrders(shopId, id, {
            skip,
            take: size,
        });
    }

    /**
     * 充值余额
     */
    @Post(':id/recharge')
    async rechargeBalance(
        @Req() req: any,
        @Param('id') id: string,
        @Body() body: { amount: number; remark?: string },
    ) {
        const shopId = req.user.shopId;

        if (!body.amount || body.amount <= 0) {
            throw new BadRequestException('充值金额必须大于0');
        }

        try {
            const user = await this.userService.rechargeBalance(shopId, id, body.amount, body.remark);
            return { success: true, data: user };
        } catch (e: any) {
            throw new BadRequestException(e.message || '充值失败');
        }
    }

    /**
     * 赠送积分
     */
    @Post(':id/gift-points')
    async giftPoints(
        @Req() req: any,
        @Param('id') id: string,
        @Body() body: { amount: number; remark?: string },
    ) {
        const shopId = req.user.shopId;

        if (!body.amount || body.amount <= 0) {
            throw new BadRequestException('赠送积分必须大于0');
        }

        try {
            const user = await this.userService.giftPoints(shopId, id, body.amount, body.remark);
            return { success: true, data: user };
        } catch (e: any) {
            throw new BadRequestException(e.message || '赠送失败');
        }
    }

    /**
     * 获取用户余额记录
     */
    @Get(':id/balance-records')
    async getBalanceRecords(
        @Req() req: any,
        @Param('id') id: string,
        @Query('current') current?: string,
        @Query('pageSize') pageSize?: string,
    ) {
        const shopId = req.user.shopId;
        const page = current ? parseInt(current) : 1;
        const size = pageSize ? parseInt(pageSize) : 10;
        const skip = (page - 1) * size;

        try {
            return this.userService.getBalanceRecords(shopId, id, {
                skip,
                take: size,
            });
        } catch (e: any) {
            throw new NotFoundException(e.message || '获取余额记录失败');
        }
    }

    /**
     * 获取用户积分记录
     */
    @Get(':id/points-records')
    async getPointsRecords(
        @Req() req: any,
        @Param('id') id: string,
        @Query('current') current?: string,
        @Query('pageSize') pageSize?: string,
    ) {
        const shopId = req.user.shopId;
        const page = current ? parseInt(current) : 1;
        const size = pageSize ? parseInt(pageSize) : 10;
        const skip = (page - 1) * size;

        try {
            return this.userService.getPointsRecords(shopId, id, {
                skip,
                take: size,
            });
        } catch (e: any) {
            throw new NotFoundException(e.message || '获取积分记录失败');
        }
    }

    /**
     * 获取用户优惠券列表
     */
    @Get(':id/coupons')
    async getUserCoupons(
        @Req() req: any,
        @Param('id') id: string,
        @Query('current') current?: string,
        @Query('pageSize') pageSize?: string,
        @Query('status') status?: string,
    ) {
        const shopId = req.user.shopId;
        const page = current ? parseInt(current) : 1;
        const size = pageSize ? parseInt(pageSize) : 10;
        const skip = (page - 1) * size;

        try {
            return this.userService.getUserCoupons(shopId, id, {
                skip,
                take: size,
                status,
            });
        } catch (e: any) {
            throw new NotFoundException(e.message || '获取优惠券失败');
        }
    }

    /**
     * 发放优惠券给用户
     */
    @Post(':id/issue-coupon')
    async issueCoupon(
        @Req() req: any,
        @Param('id') userId: string,
        @Body() body: { couponId: string },
    ) {
        if (!body.couponId) {
            throw new BadRequestException('请选择优惠券');
        }

        try {
            const userCoupon = await this.couponService.issueCoupon(userId, body.couponId);
            return { success: true, data: userCoupon };
        } catch (e: any) {
            throw new BadRequestException(e.message || '发放失败');
        }
    }
}

