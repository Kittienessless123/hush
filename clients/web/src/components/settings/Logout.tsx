import { LogoutOutlined } from "@ant-design/icons";
import { Button, Flex, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
const { Text } = Typography;

export const Logout = () => {
  const { t } = useTranslation("settings");
  const navigate = useNavigate();

  const onLogout = () => {
    // Здесь логика выхода
    message.success("Вы вышли из системы");
    navigate("/");
  };

  return (
    <Flex align="center" justify="space-between" style={{ padding: "8px 0" }}>
      <Text style={{ color: "#ff4d4f" }}>{t("logout")}</Text>
      <Button 
        onClick={onLogout} 
        icon={<LogoutOutlined />}
        danger
        style={{
          backgroundColor: "transparent",
          border: "1px solid #ff4d4f",
          color: "#ff4d4f",
        }}
      />
    </Flex>
  );
};