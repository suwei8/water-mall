import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ShopContextService } from '../services/shop-context.service';

export const SKIP_SHOP_GUARD = 'skipShopGuard';

/**
 * Guard that enforces shop isolation.
 * Extracts shopId from JWT user and validates it exists.
 * Sets shop context for downstream services.
 */
@Injectable()
export class ShopGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private shopContextService: ShopContextService,
    ) { }

    canActivate(context: ExecutionContext): boolean {
        // Check if route is marked to skip shop guard
        const skipGuard = this.reflector.getAllAndOverride<boolean>(SKIP_SHOP_GUARD, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (skipGuard) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // If no user (not authenticated), let other guards handle it
        if (!user) {
            return true;
        }

        // Require shopId for authenticated requests
        if (!user.shopId) {
            throw new ForbiddenException('Shop context required');
        }

        // Attach shopId to request for easy access
        request.shopId = user.shopId;

        return true;
    }
}
