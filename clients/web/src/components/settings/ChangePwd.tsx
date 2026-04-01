import { Button, Flex, Form, Input,  App } from "antd";
import { useState } from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../hooks/useTheme";
import { useAuthStore } from "../../hooks/useStore";
import { getInputStyle, getButtonStyle, getLabelStyle, buttonHoverStyles, inputFocusStyles } from "../../styles/forms";

export const ChangePwd = observer(() => {
  const { t } = useTranslation("settings");
  const { theme } = useTheme();
  const { message } = App.useApp();
  const { changePassword } = useAuthStore();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { oldPassword: string; newPassword: string; confirmPassword: string }) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error(t("passwordsDoNotMatch"));
      return;
    }

    setLoading(true);
    try {
      await changePassword(values.oldPassword, values.newPassword);
      message.success(t("passwordChanged"));
      form.resetFields();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || t("passwordChangeError");
      message.error(errorMessage);
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
    <Flex vertical style={{ padding: "24px 20px" }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label={<span style={getLabelStyle(theme)}>{t("oldPassword")}</span>}
          name="oldPassword"
          rules={[
            { required: true, message: t("oldPasswordRequired") },
            { min: 8, message: t("passwordMinLength") }
          ]}
        >
          <Input.Password 
            style={getInputStyle(theme)}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </Form.Item>

        <Form.Item
          label={<span style={getLabelStyle(theme)}>{t("newPassword")}</span>}
          name="newPassword"
          rules={[
            { required: true, message: t("newPasswordRequired") },
            { min: 8, message: t("passwordMinLength") },
            {
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              message: t("passwordRequirements")
            }
          ]}
        >
          <Input.Password 
            style={getInputStyle(theme)}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </Form.Item>

        <Form.Item
          label={<span style={getLabelStyle(theme)}>{t("confirmPassword")}</span>}
          name="confirmPassword"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: t("confirmPasswordRequired") },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(t("passwordsDoNotMatch")));
              },
            }),
          ]}
        >
          <Input.Password 
            style={getInputStyle(theme)}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit"
            loading={loading}
            style={getButtonStyle(theme)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {t("changePassword")}
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
});