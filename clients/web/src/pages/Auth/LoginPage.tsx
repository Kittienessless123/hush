// pages/LoginPage.tsx
import { observer } from "mobx-react-lite";
import { LoginForm } from "../../components/auth/LoginForm";
import { useEffect } from "react";
import { useAuthStore } from "../../hooks/useStore";
import { useNavigate } from "react-router-dom";

export const LoginPage = observer(() => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  return <LoginForm />;
});