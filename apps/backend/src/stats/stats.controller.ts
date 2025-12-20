import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StatsService } from './stats.service';

@Controller('stats')
@UseGuards(AuthGuard('jwt'))
export class StatsController {
    constructor(private readonly statsService: StatsService) { }

    @Get('overview')
    async getOverview(@Req() req: any) {
        const shopId = req.user.shopId;
        return this.statsService.getOverview(shopId);
    }

    @Get('sales')
    async getSalesTrend(@Req() req: any, @Query('period') period?: string) {
        const shopId = req.user.shopId;
        return this.statsService.getSalesTrend(shopId, period);
    }
}
