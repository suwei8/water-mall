import { Controller, Post, Body, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { SkipShopGuard } from '../common';

@Controller('auth')
@SkipShopGuard() // Auth endpoints don't require shop context
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() body: any) {
        // Expected body: { mobile (as username), password }
        // Ant Design Pro default login sends { username, password, type }
        const username = body.username || body.mobile;
        const password = body.password;

        const user = await this.authService.validateUser(username, password);
        if (!user) {
            throw new UnauthorizedException();
        }
        return this.authService.login(user); // Returns access_token
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('currentUser')
    async currentUser(@Req() req: any) {
        const { userId, role, permissions } = req.user;
        const user = await this.authService.getUserProfile(userId);

        return {
            data: {
                name: user?.name || 'Admin',
                avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
                userid: userId,
                email: 'admin@water-mall.com',
                access: role,
                permissions: permissions || [],
                title: '管理员',
                group: '优选送水站',
                tags: [],
                notifyCount: 0,
                unreadCount: 0,
                country: 'China',
                geographic: {
                    province: { label: '广东省', key: '440000' },
                    city: { label: '深圳市', key: '440300' },
                },
                address: '南山区',
                phone: user?.mobile || '',
            }
        };
    }
}
