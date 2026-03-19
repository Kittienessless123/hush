import { observer } from "mobx-react-lite";
import { RegisterForm } from "../../components/auth/RegisterForm";
import { useEffect } from "react";
import { useAuthStore } from "../../hooks/useStore";
import { useNavigate } from "react-router-dom";

export const RegisterPage = observer(() => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {

    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  return <RegisterForm />;
});