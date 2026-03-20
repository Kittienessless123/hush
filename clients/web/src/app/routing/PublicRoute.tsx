// components/common/PublicRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../hooks/useStore";
import { Fallback } from "../../components/common/Fallback";

export const PublicRoute = () => {
  const { /* user, */ isLoading } = useAuthStore();
  const isAuth = true;
  // Пока идет инициализация
  if (isLoading) {
    return <Fallback />;
  }

  // Если пользователь авторизован, редирект на чаты
  if (isAuth) {
    return <Navigate to="/chats" replace />;
  }

  return <Outlet />;
};
