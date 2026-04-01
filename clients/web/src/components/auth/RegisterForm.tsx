import { Button, Form, Input, Typography, message } from "antd";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTheme } from "../../hooks/useTheme";
import { getFormContainer, getFormCard } from "../../styles/containers";
import { getFormTitleStyle } from "../../styles/typography";
import {
  getInputStyle,
  getLabelStyle,
  getButtonStyle,
  inputFocusStyles,
  buttonHoverStyles,
} from "../../styles/forms";
import { useAuthStore } from "../../hooks/useStore";

const { Title } = Typography;

type FieldType = {
  username?: string;
  login?: string; 
  email?: string; 
  password?: string;
  confirmPassword?: string;
};

export const RegisterForm = observer(() => {
  const { t } = useTranslation("system");
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { register } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: FieldType) => {
    if (!values.username || !values.login || !values.email || !values.password)
      return;

    setLoading(true);
    try {
      await register(
        values.username,
        values.login,
        values.email,
        values.password,
      );
      message.success(t("registerSuccess"));
      setTimeout(() => navigate("/login"), 1500);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Register error:", error);
      const errorMessage = error.response?.data?.message || t("registerError");
      message.error(errorMessage);
      form.setFieldsValue({
        password: "",
        confirmPassword: "",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const styles = inputFocusStyles(theme);
    e.currentTarget.style.boxShadow = styles.boxShadow;
    e.currentTarget.style.borderColor = styles.borderColor;
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.boxShadow = "none";
    e.currentTarget.style.borderColor = theme.border;
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    const styles = buttonHoverStyles(theme);
    e.currentTarget.style.boxShadow = styles.boxShadow;
    e.currentTarget.style.background = styles.background;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.boxShadow = `0 0 15px ${theme.glow}`;
    e.currentTarget.style.background = theme.surface;
  };

  return (
    <div style={getFormContainer(theme)}>
      <div style={{ ...getFormCard(theme), maxWidth: "500px" }}>
        <Title level={2} style={getFormTitleStyle(theme)}>
          {t("registerTitle")}
        </Title>

        <Form
          form={form}
          name="register-form"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            label={<span style={getLabelStyle(theme)}>{t("username")}</span>}
            name="username"
            rules={[
              { required: true, message: t("usernameRequired") },
              { min: 3, message: t("usernameMinLength") },
              { max: 20, message: t("usernameMaxLength") },
              { pattern: /^[a-zA-Z0-9_]+$/, message: t("usernameInvalid") },
            ]}
          >
            <Input
              style={getInputStyle(theme)}
              placeholder={t("username")}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </Form.Item>

          <Form.Item
            label={<span style={getLabelStyle(theme)}>{t("login")}</span>}
            name="login"
            rules={[
              { required: true, message: t("loginRequired") },
              { min: 3, message: t("loginMinLength") },
              { max: 20, message: t("loginMaxLength") },
              { pattern: /^[a-zA-Z0-9_]+$/, message: t("loginInvalid") },
            ]}
          >
            <Input
              style={getInputStyle(theme)}
              placeholder={t("login")}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </Form.Item>

          <Form.Item
            label={<span style={getLabelStyle(theme)}>{t("email")}</span>}
            name="email"
            rules={[
              { required: true, message: t("emailRequired") },
              { type: "email", message: t("emailInvalid") },
            ]}
          >
            <Input
              style={getInputStyle(theme)}
              placeholder={t("email")}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </Form.Item>

          <Form.Item
            label={<span style={getLabelStyle(theme)}>{t("password")}</span>}
            name="password"
            rules={[
              { required: true, message: t("passwordRequired") },
              { min: 8, message: t("passwordMinLength") },
              {
                pattern:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message: t("passwordRequirements"),
              },
            ]}
          >
            <Input.Password
              style={getInputStyle(theme)}
              placeholder={t("password")}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </Form.Item>

          <Form.Item
            label={
              <span style={getLabelStyle(theme)}>{t("confirmPassword")}</span>
            }
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: t("confirmPasswordRequired") },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(t("passwordMismatch")));
                },
              }),
            ]}
          >
            <Input.Password
              style={getInputStyle(theme)}
              placeholder={t("confirmPassword")}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={getButtonStyle(theme)}
              loading={loading}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {t("register")}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
});
