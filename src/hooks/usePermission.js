import { useAuth } from '../context/AuthContext';
import { permissions } from '../data/mockData';

/**
 * Returns true if the current user has the given module permission.
 * @param {string} moduleName - Must match a name in mockData.permissions.modules
 */
export function usePermission(moduleName) {
  const { user } = useAuth();
  if (!user) return false;
  const roleIndex = permissions.roles.indexOf(user.role);
  if (roleIndex === -1) return false;
  const module = permissions.modules.find(m => m.name === moduleName);
  return module?.permissions[roleIndex] ?? false;
}

/**
 * Returns true if the current user has ALL of the given roles.
 */
export function useHasRole(...roles) {
  const { user } = useAuth();
  return roles.includes(user?.role);
}

/**
 * Returns a map of { [moduleName]: boolean } for all permissions.
 */
export function useAllPermissions() {
  const { user } = useAuth();
  if (!user) return {};
  const roleIndex = permissions.roles.indexOf(user.role);
  return Object.fromEntries(
    permissions.modules.map(m => [m.name, m.permissions[roleIndex] ?? false])
  );
}
