import { observer } from "mobx-react-lite";
import { RegisterForm } from "../../components/auth/RegisterForm";
import { useEffect } from "react";
import { useAuthStore } from "../../hooks/useStore";
import { useNavigate } from "react-router-dom";
import { Fallback } from "../../components/common/Fallback";

export const RegisterPage = observer(() => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate("/chats", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return  <Fallback />;
  }

  return <RegisterForm />;
});
