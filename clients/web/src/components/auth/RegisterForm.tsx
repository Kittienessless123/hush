import { Button, Form, Input, Select, Typography, message } from "antd";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const { Title } = Typography;

type FieldType = {
  username?: string;
  password?: string;
  confirmPassword?: string;
  gender?: string;
  note?: string;
  customizeGender?: string;
};

const formContainerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "calc(100vh - 70px)",
  backgroundColor: "#1C1C1C",
  padding: "20px",
};

const formCardStyle: React.CSSProperties = {
  backgroundColor: "transparent",
  padding: "40px",
  borderRadius: "16px",
  width: "100%",
  maxWidth: "500px",
  border: "1px solid rgba(151,151,151,0.3)",
  boxShadow: "0 0 30px rgba(151,151,151,0.15)",
  backdropFilter: "blur(10px)",
};

const titleStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#979797",
  marginBottom: "32px",
  fontSize: "32px",
  fontWeight: 400,
  fontFamily: "'Six Caps', sans-serif",
  letterSpacing: "2px",
  textTransform: "uppercase",
};

const inputStyle: React.CSSProperties = {
  backgroundColor: "transparent",
  border: "1px solid rgba(151,151,151,0.3)",
  borderRadius: "8px",
  padding: "12px",
  color: "#ffffff",
  fontSize: "16px",
};

const selectStyle: React.CSSProperties = {
  backgroundColor: "transparent",
  borderRadius: "8px",
};

const buttonStyle: React.CSSProperties = {
  width: "100%",
  height: "48px",
  fontSize: "18px",
  fontWeight: 500,
  background: "#2C2C2C",
  color: "#ffffff",
  border: "1px solid rgba(151,151,151,0.3)",
  boxShadow: "0 0 15px rgba(151,151,151,0.2)",
  borderRadius: "8px",
  transition: "all 0.3s ease",
};

const labelStyle: React.CSSProperties = {
  color: "#979797",
  fontSize: "16px",
  fontWeight: 400,
};

export const RegisterForm = observer(() => {
  const { t } = useTranslation("system");
  const navigate = useNavigate();
  // const { register } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onGenderChange = (value: string) => {
    switch (value) {
      case "male":
        form.setFieldsValue({ note: t("maleGreeting") });
        break;
      case "female":
        form.setFieldsValue({ note: t("femaleGreeting") });
        break;
      case "other":
        form.setFieldsValue({ note: t("otherGreeting") });
        break;
      default:
    }
  };

  const onFinish = async (values: FieldType) => {
    setLoading(true);
    try {
      // Здесь ваш реальный API вызов для регистрации
      // await register(values);

      console.log("Success:", values);
      message.success(t("registerSuccess"));

      // Перенаправление после успешной регистрации
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.error("Register error:", error);
      message.error(t("registerError"));

      // Очистка полей пароля при ошибке
      form.setFieldsValue({
        password: "",
        confirmPassword: "",
      });
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: unknown) => {
    console.log("Failed:", errorInfo);
    message.warning(t("pleaseCheckForm"));
  };

  return (
    <div style={formContainerStyle}>
      <div style={formCardStyle}>
        <Title level={2} style={titleStyle}>
          {t("registerTitle")}
        </Title>

        <Form
          form={form}
          name="register-form"
          layout="vertical"
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
              { min: 3, message: t("usernameMinLength") },
            ]}
          >
            <Input
              style={inputStyle}
              placeholder={t("username")}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 0 20px rgba(151,151,151,0.4)";
                e.currentTarget.style.borderColor = "#979797";
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "rgba(151,151,151,0.3)";
              }}
            />
          </Form.Item>

          <Form.Item
            label={<span style={labelStyle}>{t("password")}</span>}
            name="password"
            rules={[
              { required: true, message: t("passwordRequired") },
              { min: 6, message: t("passwordMinLength") },
            ]}
          >
            <Input.Password
              style={inputStyle}
              placeholder={t("password")}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 0 20px rgba(151,151,151,0.4)";
                e.currentTarget.style.borderColor = "#979797";
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "rgba(151,151,151,0.3)";
              }}
            />
          </Form.Item>

          <Form.Item
            label={<span style={labelStyle}>{t("confirmPassword")}</span>}
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
              style={inputStyle}
              placeholder={t("confirmPassword")}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 0 20px rgba(151,151,151,0.4)";
                e.currentTarget.style.borderColor = "#979797";
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "rgba(151,151,151,0.3)";
              }}
            />
          </Form.Item>

          <Form.Item
            label={<span style={labelStyle}>{t("note")}</span>}
            name="note"
            rules={[{ required: true, message: t("noteRequired") }]}
          >
            <Input
              style={inputStyle}
              placeholder={t("note")}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 0 20px rgba(151,151,151,0.4)";
                e.currentTarget.style.borderColor = "#979797";
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "rgba(151,151,151,0.3)";
              }}
            />
          </Form.Item>

          <Form.Item
            label={<span style={labelStyle}>{t("gender")}</span>}
            name="gender"
            rules={[{ required: true, message: t("genderRequired") }]}
          >
            <Select
              popupClassName="custom-select-dropdown"
              placeholder={t("selectGender")}
              onChange={onGenderChange}
              style={selectStyle}
              options={[
                { label: t("male"), value: "male" },
                { label: t("female"), value: "female" },
                { label: t("other"), value: "other" },
              ]}
            />
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.gender !== currentValues.gender
            }
          >
            {({ getFieldValue }) =>
              getFieldValue("gender") === "other" ? (
                <Form.Item
                  label={<span style={labelStyle}>{t("customizeGender")}</span>}
                  name="customizeGender"
                  rules={[
                    { required: true, message: t("customizeGenderRequired") },
                  ]}
                >
                  <Input
                    style={inputStyle}
                    placeholder={t("customizeGender")}
                    onFocus={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 0 20px rgba(151,151,151,0.4)";
                      e.currentTarget.style.borderColor = "#979797";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.borderColor =
                        "rgba(151,151,151,0.3)";
                    }}
                  />
                </Form.Item>
              ) : null
            }
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={buttonStyle}
              loading={loading}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 0 25px rgba(151,151,151,0.6)";
                e.currentTarget.style.background = "#3C3C3C";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 0 15px rgba(151,151,151,0.2)";
                e.currentTarget.style.background = "#2C2C2C";
              }}
            >
              {t("register")}
            </Button>
          </Form.Item>
        </Form>
      </div>

      
      
      <style>{`
  .custom-select-dropdown .ant-select-item {
    background-color: #2C2C2C;
    color: #ffffff;
    transition: all 0.3s ease;
    border: none;
    margin: 0;
    padding: 8px 12px;
  }
  .custom-select-dropdown .ant-select-item:hover {
    background-color: #404040 !important;
    color: #ffffff !important;
  }
  .custom-select-dropdown .ant-select-item-option-selected {
    background-color: #3C3C3C !important;
    color: #ffffff !important;
  }
  .custom-select-dropdown .ant-select-item-option-active {
    background-color: #404040 !important;
    color: #ffffff !important;
  }
`}</style>
    </div>
  );
});
