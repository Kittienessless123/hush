import { LogoutOutlined } from "@ant-design/icons";
import { Button, Flex, Typography, message, Popconfirm } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../hooks/useStore";

const { Text } = Typography;

export const Logout = () => {
  const { t } = useTranslation("settings");
  const navigate = useNavigate();
  const { logout, logoutAll } = useAuthStore();

  const onLogout = async () => {
    try {
      await logout();
      message.success(t("logoutSuccess"));
      navigate("/login");
    } catch (error) {
      message.error(t("logoutError"));
      console.error("Logout error:", error);
    }
  };

  const onLogoutAll = async () => {
    try {
      await logoutAll();
      message.success(t("logoutAllSuccess"));
      navigate("/login");
    } catch (error) {
      message.error(t("logoutAllError"));
      console.error("Logout all error:", error);
    }
  };

  return (
    <Flex vertical gap="middle">
      <Flex align="center" justify="space-between" style={{ padding: "8px 0" }}>
        <Text style={{ color: "#ff4d4f" }}>{t("logout")}</Text>
        <Popconfirm
          title={t("logoutConfirm")}
          description={t("logoutConfirmMessage")}
          onConfirm={onLogout}
          okText={t("logout")}
          cancelText={t("cancel")}
        >
          <Button
            icon={<LogoutOutlined />}
            danger
            style={{
              backgroundColor: "transparent",
              border: "1px solid #ff4d4f",
              color: "#ff4d4f",
            }}
          />
        </Popconfirm>
      </Flex>

      <Flex align="center" justify="space-between" style={{ padding: "8px 0" }}>
        <Text style={{ color: "#ff4d4f" }}>{t("logoutAll")}</Text>
        <Popconfirm
          title={t("logoutAllConfirm")}
          description={t("logoutAllConfirmMessage")}
          onConfirm={onLogoutAll}
          okText={t("logoutAll")}
          cancelText={t("cancel")}
        >
          <Button
            icon={<LogoutOutlined />}
            danger
            style={{
              backgroundColor: "transparent",
              border: "1px solid #ff4d4f",
              color: "#ff4d4f",
            }}
          />
        </Popconfirm>
      </Flex>
    </Flex>
  );
};
