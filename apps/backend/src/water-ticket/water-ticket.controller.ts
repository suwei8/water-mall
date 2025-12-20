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
import { WaterTicketService } from './water-ticket.service';

// ==================== 管理后台 API ====================

@Controller('water-tickets')
@UseGuards(AuthGuard('jwt'))
export class WaterTicketController {
    constructor(private readonly service: WaterTicketService) { }

    /**
     * 获取水票类型列表
     */
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

        return this.service.findAllTicketTypes(shopId, { skip, take: size });
    }

    /**
     * 创建水票类型
     */
    @Post()
    async create(@Req() req: any, @Body() data: any) {
        const shopId = req.user.shopId;
        return this.service.createTicketType(shopId, data);
    }

    /**
     * 更新水票类型
     */
    @Put(':id')
    async update(@Req() req: any, @Param('id') id: string, @Body() data: any) {
        const shopId = req.user.shopId;
        const ticket = await this.service.updateTicketType(shopId, id, data);
        if (!ticket) {
            throw new NotFoundException('水票不存在');
        }
        return ticket;
    }

    /**
     * 删除水票类型
     */
    @Delete(':id')
    async delete(@Req() req: any, @Param('id') id: string) {
        const shopId = req.user.shopId;
        const result = await this.service.deleteTicketType(shopId, id);
        if (!result) {
            throw new NotFoundException('水票不存在');
        }
        return { success: true };
    }

    // ==================== 用户水票管理（管理后台查看） ====================

    /**
     * 查看用户水票记录
     */
    @Get('user/:userId')
    async getUserTickets(@Param('userId') userId: string) {
        return this.service.getUserTickets(userId);
    }

    /**
     * 查看水票使用记录
     */
    @Get('logs/:userTicketId')
    async getUsageLogs(@Param('userTicketId') userTicketId: string) {
        return this.service.getTicketUsageLogs(userTicketId);
    }
}
