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
import { DispatcherService } from './dispatcher.service';

@Controller('dispatchers')
@UseGuards(AuthGuard('jwt'))
export class DispatcherController {
    constructor(private readonly service: DispatcherService) { }

    // ==================== 配送员管理 ====================

    @Get()
    async findAll(
        @Req() req: any,
        @Query('current') current?: string,
        @Query('pageSize') pageSize?: string,
        @Query('status') status?: string,
    ) {
        const shopId = req.user.shopId;
        const page = current ? parseInt(current) : 1;
        const size = pageSize ? parseInt(pageSize) : 20;
        const skip = (page - 1) * size;

        return this.service.findAll(shopId, { skip, take: size, status });
    }

    @Post()
    async create(@Req() req: any, @Body() data: any) {
        const shopId = req.user.shopId;
        return this.service.create(shopId, data);
    }

    @Put(':id')
    async update(@Req() req: any, @Param('id') id: string, @Body() data: any) {
        const shopId = req.user.shopId;
        const result = await this.service.update(shopId, id, data);
        if (!result) {
            throw new NotFoundException('配送员不存在');
        }
        return result;
    }

    @Delete(':id')
    async delete(@Req() req: any, @Param('id') id: string) {
        const shopId = req.user.shopId;
        const result = await this.service.delete(shopId, id);
        if (!result) {
            throw new NotFoundException('配送员不存在');
        }
        return { success: true };
    }

    // ==================== 派单管理 ====================

    @Get('pending-orders')
    async getPendingOrders(@Req() req: any) {
        const shopId = req.user.shopId;
        return this.service.getPendingOrders(shopId);
    }

    @Get('dispatches')
    async getDispatches(
        @Req() req: any,
        @Query('current') current?: string,
        @Query('pageSize') pageSize?: string,
        @Query('status') status?: string,
        @Query('dispatcherId') dispatcherId?: string,
    ) {
        const shopId = req.user.shopId;
        const page = current ? parseInt(current) : 1;
        const size = pageSize ? parseInt(pageSize) : 20;
        const skip = (page - 1) * size;

        return this.service.getDispatches(shopId, { skip, take: size, status, dispatcherId });
    }

    @Post('assign')
    async assignOrder(@Body() data: { orderId: string; dispatcherId: string; note?: string }) {
        return this.service.assignOrder(data.orderId, data.dispatcherId, data.note);
    }

    @Post('dispatches/:id/status')
    async updateDispatchStatus(@Param('id') id: string, @Body() data: { status: string }) {
        return this.service.updateDispatchStatus(id, data.status);
    }

    @Get(':dispatcherId/orders')
    async getDispatcherOrders(
        @Param('dispatcherId') dispatcherId: string,
        @Query('status') status?: string,
    ) {
        return this.service.getDispatcherOrders(dispatcherId, status);
    }
}
