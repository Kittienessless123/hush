import { Button, Checkbox, Form, Input, message } from "antd";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Typography } from "antd";
import { getFormContainer, getFormCard } from "../../styles/containers";
import { getFormTitleStyle } from "../../styles/typography";
import {
  getInputStyle,
  getLabelStyle,
  getButtonStyle,
  inputFocusStyles,
  buttonHoverStyles,
} from "../../styles/forms";
import { useTheme } from "../../hooks/useTheme";
import { useAuthStore } from "../../hooks/useStore";

const { Title } = Typography;

type FieldType = {
  identifier?: string;
  password?: string;
  remember?: string;
};

export const LoginForm = observer(() => {
  const { t } = useTranslation("system");
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { login } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: FieldType) => {
    if (!values.identifier || !values.password) return;

    setLoading(true);
    try {
      await login(values.identifier, values.password);
      message.success(t("loginSuccess"));
      navigate("/chats");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.message || t("loginError");
      message.error(errorMessage);
      form.setFieldsValue({ password: "" });
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
      <div style={getFormCard(theme)}>
        <Title level={2} style={getFormTitleStyle(theme)}>
          {t("loginTitle")}
        </Title>

        <Form
          form={form}
          name="login-form"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            label={
              <span style={getLabelStyle(theme)}>{t("emailOrLogin")}</span>
            }
            name="identifier"
            rules={[
              { required: true, message: t("emailOrLoginRequired") },
              { min: 3, message: t("identifierMinLength") },
            ]}
          >
            <Input
              style={getInputStyle(theme)}
              placeholder={t("emailOrLogin")}
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
            ]}
          >
            <Input.Password
              style={getInputStyle(theme)}
              placeholder={t("password")}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox style={{ color: theme.textSecondary }}>
              {t("rememberMe")}
            </Checkbox>
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
              {t("login")}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
});
