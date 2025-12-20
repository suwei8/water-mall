
import { Controller, Get, Body, Put, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '../config/config.service';
import { PERMISSION_LIST } from '../common/constants/permissions.constant';

@Controller('roles')
@UseGuards(AuthGuard('jwt'))
export class RoleController {
    constructor(private configService: ConfigService) { }

    @Get('constants')
    async getConstants() {
        return PERMISSION_LIST; // Returns [{code: 'USER_READ', label: '...'}, ...]
    }

    @Get('permissions')
    async getPermissions(@Req() req: any) {
        const shopId = req.user.shopId;
        // Fetch configs with category 'PERMISSION'
        const configs = await this.configService.getByCategory(shopId, 'PERMISSION');

        // Parse JSON strings back to arrays
        const result: Record<string, string[]> = {};
        for (const [role, value] of Object.entries(configs)) {
            try {
                result[role] = JSON.parse(value);
            } catch (e) {
                result[role] = [];
            }
        }
        return result;
    }

    @Put('permissions')
    async updatePermissions(@Req() req: any, @Body() data: Record<string, string[]>) {
        const shopId = req.user.shopId;

        // Convert arrays to JSON strings
        const configs: Record<string, string> = {};
        for (const [role, permissions] of Object.entries(data)) {
            configs[role] = JSON.stringify(permissions);
        }

        await this.configService.setMany(shopId, 'PERMISSION', configs);
        return { success: true };
    }
}
