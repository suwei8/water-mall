import { SetMetadata } from '@nestjs/common';
import { SKIP_SHOP_GUARD } from '../guards/shop.guard';

/**
 * Decorator to skip shop guard for specific routes
 * Use on public endpoints or auth endpoints
 */
export const SkipShopGuard = () => SetMetadata(SKIP_SHOP_GUARD, true);
