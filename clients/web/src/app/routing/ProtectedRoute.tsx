// src/components/common/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
//import { useAuthStore } from "../../hooks/useStore";

export const ProtectedRoute = () => {
  //const { user } = useAuthStore();
  const isAuth = true;

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
