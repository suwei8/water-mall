import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'dev_secret_key',
        });
    }

    async validate(payload: any) {
        // payload: { sub: userId, mobile: ... }
        const role = payload.role || 'admin';
        const shopId = payload.shopId;

        // Fetch permissions for the role
        let permissions: string[] = [];
        if (shopId) {
            const permConfig = await this.configService.get(shopId, 'PERMISSION', role);
            if (permConfig) {
                try {
                    permissions = JSON.parse(permConfig);
                } catch (e) { }
            }
        }

        return {
            userId: payload.sub,
            mobile: payload.mobile,
            shopId,
            role,
            permissions
        };
    }
}
