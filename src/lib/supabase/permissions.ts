import { RoleName, PermissionCode } from '@/types';

// Default role permissions matrix
export const ROLE_PERMISSIONS_MAP: Record<RoleName, PermissionCode[]> = {
  Owner: [
    'dashboard.view', 'settings.manage', 'staff.view', 'staff.manage', 'roles.manage',
    'products.view', 'products.manage', 'orders.view', 'orders.manage', 'pos.access',
    'payments.view', 'payments.record', 'payments.refund', 'bookings.view', 'bookings.manage',
    'bookings.approve', 'bookings.cancel', 'inventory.view', 'inventory.manage',
    'inventory.receive', 'inventory.waste', 'inventory.adjust', 'finance.view',
    'finance.manage', 'reports.view', 'cms.manage', 'audit.view'
  ],
  'General Manager': [
    'dashboard.view', 'settings.manage', 'staff.view', 'products.view', 'products.manage',
    'orders.view', 'orders.manage', 'pos.access', 'payments.view', 'payments.record',
    'bookings.view', 'bookings.manage', 'bookings.approve', 'bookings.cancel',
    'inventory.view', 'inventory.manage', 'inventory.receive', 'inventory.waste',
    'finance.view', 'reports.view', 'cms.manage'
  ],
  Administrator: [
    'dashboard.view', 'settings.manage', 'staff.view', 'staff.manage', 'products.view',
    'products.manage', 'orders.view', 'orders.manage', 'bookings.view', 'bookings.manage',
    'inventory.view', 'reports.view', 'cms.manage'
  ],
  'Booking Manager': [
    'dashboard.view', 'bookings.view', 'bookings.manage', 'bookings.approve', 'bookings.cancel',
    'reports.view'
  ],
  Cashier: [
    'dashboard.view', 'pos.access', 'orders.view', 'orders.manage', 'payments.view',
    'payments.record'
  ],
  'Kitchen Staff': [
    'orders.view', 'orders.manage'
  ],
  'Inventory Manager': [
    'dashboard.view', 'inventory.view', 'inventory.manage', 'inventory.receive',
    'inventory.waste', 'inventory.adjust'
  ],
  Accountant: [
    'dashboard.view', 'payments.view', 'finance.view', 'reports.view'
  ],
  Customer: [
    'bookings.view'
  ]
};

export function hasPermission(userRoles: RoleName[], requiredPermission: PermissionCode): boolean {
  if (!userRoles || userRoles.length === 0) return false;
  if (userRoles.includes('Owner')) return true;

  return userRoles.some(role => {
    const rolePermissions = ROLE_PERMISSIONS_MAP[role] || [];
    return rolePermissions.includes(requiredPermission);
  });
}
