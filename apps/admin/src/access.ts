/**
 * @see https://umijs.org/docs/max/access#access
 * */
export default function access(
  initialState: { currentUser?: API.CurrentUser } | undefined,
) {
  const { currentUser } = initialState ?? {};

  // Super admin has all permissions
  const isSuperAdmin = currentUser?.access === 'super_admin';
  const permissions = currentUser?.permissions || [];

  return {
    canAdmin: currentUser && (isSuperAdmin || currentUser.access === 'admin' || currentUser.access === 'operator'),

    // Permission-based access
    canDashboard: isSuperAdmin || permissions.includes('DASHBOARD'),
    canUserRead: isSuperAdmin || permissions.includes('USER_READ'),
    canOrderRead: isSuperAdmin || permissions.includes('ORDER_READ'),
    canProductRead: isSuperAdmin || permissions.includes('PRODUCT_READ'),
    canSettings: isSuperAdmin || permissions.includes('SETTINGS_ALL'),
    canAdminRead: isSuperAdmin || permissions.includes('ADMIN_READ'),
  };
}
