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
import { DepositService } from './deposit.service';

@Controller('deposits')
@UseGuards(AuthGuard('jwt'))
export class DepositController {
    constructor(private readonly service: DepositService) { }

    // ==================== 押金类型管理 ====================

    @Get('types')
    async findAllTypes(
        @Req() req: any,
        @Query('current') current?: string,
        @Query('pageSize') pageSize?: string,
    ) {
        const shopId = req.user.shopId;
        const page = current ? parseInt(current) : 1;
        const size = pageSize ? parseInt(pageSize) : 20;
        const skip = (page - 1) * size;

        return this.service.findAllTypes(shopId, { skip, take: size });
    }

    @Post('types')
    async createType(@Req() req: any, @Body() data: any) {
        const shopId = req.user.shopId;
        return this.service.createType(shopId, data);
    }

    @Put('types/:id')
    async updateType(@Req() req: any, @Param('id') id: string, @Body() data: any) {
        const shopId = req.user.shopId;
        const result = await this.service.updateType(shopId, id, data);
        if (!result) {
            throw new NotFoundException('押金类型不存在');
        }
        return result;
    }

    @Delete('types/:id')
    async deleteType(@Req() req: any, @Param('id') id: string) {
        const shopId = req.user.shopId;
        const result = await this.service.deleteType(shopId, id);
        if (!result) {
            throw new NotFoundException('押金类型不存在');
        }
        return { success: true };
    }

    // ==================== 用户押金管理 ====================

    @Get()
    async findAllDeposits(
        @Req() req: any,
        @Query('current') current?: string,
        @Query('pageSize') pageSize?: string,
        @Query('status') status?: string,
    ) {
        const shopId = req.user.shopId;
        const page = current ? parseInt(current) : 1;
        const size = pageSize ? parseInt(pageSize) : 20;
        const skip = (page - 1) * size;

        return this.service.findAllDeposits(shopId, { skip, take: size, status });
    }

    @Get('user/:userId')
    async getUserDeposits(@Param('userId') userId: string) {
        return this.service.getUserDeposits(userId);
    }

    @Post('collect')
    async collectDeposit(@Body() data: { userId: string; depositTypeId: string; quantity?: number }) {
        return this.service.collectDeposit(data.userId, data.depositTypeId, data.quantity || 1);
    }

    @Post(':id/return')
    async returnDeposit(@Param('id') id: string) {
        return this.service.returnDeposit(id);
    }

    @Post(':id/forfeit')
    async forfeitDeposit(@Param('id') id: string) {
        return this.service.forfeitDeposit(id);
    }
}
