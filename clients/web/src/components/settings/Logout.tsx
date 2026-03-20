import { LogoutOutlined } from "@ant-design/icons";
import { Button, Flex, Typography, message, Popconfirm } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const { Text } = Typography;

export const Logout = () => {
  const { t } = useTranslation("settings");
  const navigate = useNavigate();

  const onLogout = () => {
    message.success(t("logoutSuccess"));
    navigate("/");
  };

  return (
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
  );
};