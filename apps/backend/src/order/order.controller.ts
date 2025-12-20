import {
    Controller,
    Get,
    Put,
    Body,
    Param,
    Query,
    Req,
    NotFoundException,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrderService } from './order.service';

@Controller('orders')
@UseGuards(AuthGuard('jwt'))
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    @Get()
    async findAll(
        @Req() req: any,
        @Query('skip') skip?: string,
        @Query('take') take?: string,
        @Query('status') status?: string,
    ) {
        const shopId = req.user.shopId;
        return this.orderService.findAll(shopId, {
            skip: skip ? parseInt(skip) : undefined,
            take: take ? parseInt(take) : undefined,
            status,
        });
    }

    @Get(':id')
    async findOne(@Req() req: any, @Param('id') id: string) {
        const shopId = req.user.shopId;
        const order = await this.orderService.findOne(shopId, id);
        if (!order) {
            throw new NotFoundException('Order not found');
        }
        return order;
    }

    @Put(':id/status')
    async updateStatus(
        @Req() req: any,
        @Param('id') id: string,
        @Body() data: { status: string },
    ) {
        const shopId = req.user.shopId;
        const order = await this.orderService.updateStatus(shopId, id, data.status);
        if (!order) {
            throw new NotFoundException('Order not found');
        }
        return order;
    }
}
