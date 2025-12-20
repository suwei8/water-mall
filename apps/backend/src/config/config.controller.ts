import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Req,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService, CONFIG_CATEGORIES } from './config.service';
import { RequirePermission } from '../common/decorators/permission.decorator';
import { PERMISSIONS } from '../common/constants/permissions.constant';

@Controller('configs')
@UseGuards(AuthGuard('jwt'))
@RequirePermission(PERMISSIONS.SETTINGS_ALL.code)
export class ConfigController {
    constructor(private readonly configService: ConfigService) { }

    /**
     * 获取配置模板（包含所有需要配置的项）
     */
    @Get('template')
    async getTemplate(@Req() req: any) {
        const shopId = req.user.shopId;
        return this.configService.getConfigTemplate(shopId);
    }

    /**
     * 获取所有配置
     */
    @Get()
    async getAllConfigs(@Req() req: any) {
        const shopId = req.user.shopId;
        return this.configService.getAllConfigs(shopId);
    }

    /**
     * 获取指定分类的配置
     */
    @Get(':category')
    async getByCategory(@Req() req: any, @Param('category') category: string) {
        const shopId = req.user.shopId;
        return this.configService.getByCategory(shopId, category);
    }

    /**
     * 保存指定分类的配置
     */
    @Post(':category')
    async saveCategory(
        @Req() req: any,
        @Param('category') category: string,
        @Body() data: Record<string, string>,
    ) {
        const shopId = req.user.shopId;

        // 验证分类是否有效
        if (!Object.values(CONFIG_CATEGORIES).includes(category as any)) {
            return { success: false, message: '无效的配置分类' };
        }

        await this.configService.setMany(shopId, category, data);
        return { success: true };
    }
}
