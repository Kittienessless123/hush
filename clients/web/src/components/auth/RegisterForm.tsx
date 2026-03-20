// components/auth/RegisterForm.tsx
import { Button, Form, Input, Select, Typography, message } from "antd";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTheme } from "../../hooks/useTheme"  ;
import { getFormContainer, getFormCard } from "../../styles/containers";
import { getFormTitleStyle } from "../../styles/typography";
import { 
  getInputStyle, 
  getLabelStyle, 
  getButtonStyle, 
  getSelectStyle,
  inputFocusStyles, 
  buttonHoverStyles,
  getSelectDropdownStyles 
} from "../../styles/forms";

const { Title } = Typography;

type FieldType = {
  username?: string;
  password?: string;
  confirmPassword?: string;
  gender?: string;
  note?: string;
  customizeGender?: string;
};

export const RegisterForm = observer(() => {
  const { t } = useTranslation("system");
  const navigate = useNavigate();
  const { theme } = useTheme();
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
      console.log("Success:", values);
      message.success(t("registerSuccess"));
      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      console.error("Register error:", error);
      message.error(t("registerError"));
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
    e.currentTarget.style.boxShadow = 'none';
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
      <div style={{ ...getFormCard(theme), maxWidth: '500px' }}>
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
            label={<span style={getLabelStyle(theme)}>{t("password")}</span>}
            name="password"
            rules={[
              { required: true, message: t("passwordRequired") },
              { min: 6, message: t("passwordMinLength") },
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
            label={<span style={getLabelStyle(theme)}>{t("confirmPassword")}</span>}
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

          <Form.Item
            label={<span style={getLabelStyle(theme)}>{t("note")}</span>}
            name="note"
            rules={[{ required: true, message: t("noteRequired") }]}
          >
            <Input
              style={getInputStyle(theme)}
              placeholder={t("note")}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </Form.Item>

          <Form.Item
            label={<span style={getLabelStyle(theme)}>{t("gender")}</span>}
            name="gender"
            rules={[{ required: true, message: t("genderRequired") }]}
          >
            <Select
              popupClassName="custom-select-dropdown"
              placeholder={t("selectGender")}
              onChange={onGenderChange}
              style={getSelectStyle(theme)}
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
                  label={<span style={getLabelStyle(theme)}>{t("customizeGender")}</span>}
                  name="customizeGender"
                  rules={[
                    { required: true, message: t("customizeGenderRequired") },
                  ]}
                >
                  <Input
                    style={getInputStyle(theme)}
                    placeholder={t("customizeGender")}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </Form.Item>
              ) : null
            }
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

      <style>{getSelectDropdownStyles(theme)}</style>
    </div>
  );
});