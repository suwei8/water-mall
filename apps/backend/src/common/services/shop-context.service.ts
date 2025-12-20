import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

interface ShopContext {
    shopId: string;
    userId: string;
}

@Injectable()
export class ShopContextService {
    private static storage = new AsyncLocalStorage<ShopContext>();

    /**
     * Run a callback within a shop context
     */
    run<T>(context: ShopContext, callback: () => T): T {
        return ShopContextService.storage.run(context, callback);
    }

    /**
     * Get current shop ID from context
     */
    getShopId(): string | undefined {
        return ShopContextService.storage.getStore()?.shopId;
    }

    /**
     * Get current user ID from context
     */
    getUserId(): string | undefined {
        return ShopContextService.storage.getStore()?.userId;
    }

    /**
     * Get full context
     */
    getContext(): ShopContext | undefined {
        return ShopContextService.storage.getStore();
    }
}
