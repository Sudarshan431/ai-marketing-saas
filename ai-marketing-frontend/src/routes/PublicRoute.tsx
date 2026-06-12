import { Navigate, Outlet } from 'react-router-dom';

import { useAuthStore } from '../stores/authStore';

export function PublicRoute() {
  const token = useAuthStore((state) => state.token);

  if (token) {
    return <Navigate replace to="/dashboard" />;
  }

  return <Outlet />;
}
