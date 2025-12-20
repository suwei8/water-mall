
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY } from '../decorators/permission.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSION_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredPermissions) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();
        if (!user || !user.permissions) {
            // Super admin bypass? 
            // If user.role === 'super_admin', maybe allow all?
            // Let's implement super_admin bypass for safety.
            if (user && user.role === 'super_admin') return true;
            throw new ForbiddenException('缺少必要的权限');
        }

        // Super admin bypass
        if (user.role === 'super_admin') return true;

        // Check if user has ANY of the required permissions (OR logic) or ALL (AND logic)?
        // Usually requiredPermissions are AND or OR?
        // Let's assume passed array means "Requires ALL of these"?
        // Or "Requires ANY of these"?
        // Usually single permission is passed. @RequirePermission('USER_READ')
        // If multiple: @RequirePermission('A', 'B') -> usually means ANY?
        // Let's go with ALL for strictness, or check documentation?
        // Common practice: "Has Authority A AND B".

        // For this simple system, let's assume we pass ONE permission group usually.
        // If I pass ['USER_READ'], user must have it.

        const hasPermission = requiredPermissions.every((permission) =>
            user.permissions.includes(permission),
        );

        if (!hasPermission) {
            throw new ForbiddenException('您没有权限执行此操作');
        }

        return true;
    }
}
