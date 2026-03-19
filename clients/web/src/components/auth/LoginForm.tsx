import { Button, Checkbox, Form, Input, Typography, message } from "antd";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { useState } from "react";

const { Title } = Typography;

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

const formContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: 'calc(100vh - 70px)', // учитываем footer
  backgroundColor: '#1C1C1C',
  padding: '20px',
};

const formCardStyle: React.CSSProperties = {
  backgroundColor: 'transparent',
  padding: '40px',
  borderRadius: '16px',
  width: '100%',
  maxWidth: '450px',
  border: '1px solid rgba(151,151,151,0.3)',
  boxShadow: '0 0 30px rgba(151,151,151,0.15)',
  backdropFilter: 'blur(10px)',
};

const titleStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#979797',
  marginBottom: '32px',
  fontSize: '32px',
  fontWeight: 400,
  fontFamily: "'Six Caps', sans-serif",
  letterSpacing: '2px',
  textTransform: 'uppercase',
};

const inputStyle: React.CSSProperties = {
  backgroundColor: 'transparent',
  border: '1px solid rgba(151,151,151,0.3)',
  borderRadius: '8px',
  padding: '12px',
  color: '#ffffff',
  fontSize: '16px',
};

const buttonStyle: React.CSSProperties = {
  width: '100%',
  height: '48px',
  fontSize: '18px',
  fontWeight: 500,
  background: '#2C2C2C',
  color: '#ffffff',
  border: '1px solid rgba(151,151,151,0.3)',
  boxShadow: '0 0 15px rgba(151,151,151,0.2)',
  borderRadius: '8px',
  transition: 'all 0.3s ease',
};

const labelStyle: React.CSSProperties = {
  color: '#979797',
  fontSize: '16px',
  fontWeight: 400,
};

export const LoginForm = observer(() => {
  const { t } = useTranslation("system");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: FieldType) => {
    setLoading(true);
    try {
      // Здесь ваш реальный API вызов
      // await login(values.username, values.password);
      
      // Имитация успешного логина
      console.log("Success:", values);
      message.success(t("loginSuccess"));
      
      // Перенаправление после успешного входа
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      console.error("Login error:", error);
      message.error(t("loginError"));
      
      // Очистка полей пароля при ошибке
      form.setFieldsValue({ password: '' });
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: unknown) => {
    console.log("Failed:", errorInfo);
    message.warning(t("usernameRequired"));
  };

  return (
    <div style={formContainerStyle}>
      <div style={formCardStyle}>
        <Title level={2} style={titleStyle}>
          {t("loginTitle")}
        </Title>
        
        <Form
          form={form}
          name="login-form"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            label={<span style={labelStyle}>{t("username")}</span>}
            name="username"
            rules={[
              { required: true, message: t("usernameRequired") },
              { min: 3, message: t("usernameMinLength") }
            ]}
          >
            <Input 
              style={inputStyle}
              placeholder={t("username")}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = '0 0 20px rgba(151,151,151,0.4)';
                e.currentTarget.style.borderColor = '#979797';
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'rgba(151,151,151,0.3)';
              }}
            />
          </Form.Item>

          <Form.Item
            label={<span style={labelStyle}>{t("password")}</span>}
            name="password"
            rules={[
              { required: true, message: t("passwordRequired") },
              { min: 6, message: t("passwordMinLength") }
            ]}
          >
            <Input.Password 
              style={inputStyle}
              placeholder={t("password")}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = '0 0 20px rgba(151,151,151,0.4)';
                e.currentTarget.style.borderColor = '#979797';
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'rgba(151,151,151,0.3)';
              }}
            />
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"
          >
            <Checkbox style={{ color: '#979797' }}>
              {t("rememberMe")}
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={buttonStyle}
              loading={loading}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 25px rgba(151,151,151,0.6)';
                e.currentTarget.style.background = '#3C3C3C';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 0 15px rgba(151,151,151,0.2)';
                e.currentTarget.style.background = '#2C2C2C';
              }}
            >
              {t("submit")}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
});