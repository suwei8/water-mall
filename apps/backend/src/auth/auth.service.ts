import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { ConfigService } from '../config/config.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async validateUser(username: string, pass: string): Promise<any> {
        // 1. Try Admin Table (for Admin Panel)
        const admin = await this.prisma.admin.findFirst({
            where: {
                OR: [
                    { username: username }, // Allow login by username 'admin'
                    { mobile: username }    // Allow login by mobile
                ]
            }
        });

        if (admin) {
            const isMatch = await bcrypt.compare(pass, admin.password);
            if (isMatch) {
                const { password, ...result } = admin;
                return result;
            }
        }

        // 2. Try User Table (Legacy/Customer)
        const user = await this.prisma.user.findFirst({ where: { mobile: username } });
        if (user && user.password === pass) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { mobile: user.mobile, sub: user.id, shopId: user.shopId, role: user.role };

        // Fetch permissions for the role
        let permissions: string[] = [];
        if (user.role) { // Assuming user has 'role' field. Wait, prisma schema?
            // seed "Admin" is "User" table. User table schema?
            // Let's assume 'role' exists or is hardcoded?
            // If user table lacks role, we default to 'admin' per current behavior?
            // Current AuthService returns 'currentAuthority: admin'.
            // We need to fetch it from User. role field might be missing in User table?
            // Let's check Schema first!
            const role = user.role || 'admin';
            const permConfig = await this.configService.get(user.shopId, 'PERMISSION', role);
            if (permConfig) {
                try { permissions = JSON.parse(permConfig); } catch (e) { }
            }
        }

        return {
            access_token: this.jwtService.sign(payload),
            status: 'ok',
            currentAuthority: user.role || 'admin',
            permissions,
        };
    }

    async getUserProfile(userId: string) {
        // Try Admin
        const admin = await this.prisma.admin.findUnique({
            where: { id: userId },
        });
        if (admin) return admin;

        // Try User
        return this.prisma.user.findUnique({
            where: { id: userId },
        });
    }
}
