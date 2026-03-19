import { useTranslation } from "react-i18next";
import { Divider, Flex, Typography } from "antd";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Notification } from "./Notification";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { LastSeen } from "./LastSeen";
import { ReadReceipts } from "./ReadReceipts";
import { Logout } from "./Logout";
import { DeleteAcc } from "./DeleteAcc";
import { Routes, Route, useNavigate } from "react-router-dom";
import { BlackList } from "./BlackList";
import { ChangePwd } from "./ChangePwd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button } from "antd";

const { Title } = Typography;

export const Settings = () => {
  const { t } = useTranslation("settings");
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={
        <Flex vertical style={{ padding: "24px 20px" }}>
          <Title level={3} style={{ color: "#ffffff", marginBottom: "16px" }}>
            {t("title")}
          </Title>
          <Divider style={{ borderColor: "rgba(151,151,151,0.2)", margin: "0 0 20px 0" }} />
          
          <Flex vertical gap="middle">
            <LanguageSwitcher />
            <Notification />
            <ThemeSwitcher />
            
            <Divider style={{ borderColor: "rgba(151,151,151,0.2)", margin: "8px 0" }} />
            
            <LastSeen />
            <ReadReceipts />
            
            <Divider style={{ borderColor: "rgba(151,151,151,0.2)", margin: "8px 0" }} />
            
            {/* Ссылки на отдельные страницы */}
            <Flex 
              align="center" 
              justify="space-between"
              style={{ 
                padding: "12px 16px",
                backgroundColor: "#2C2C2C",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onClick={() => navigate("/settings/blacklist")}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#3C3C3C";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#2C2C2C";
              }}
            >
              <span style={{ color: "#ffffff" }}>Черный список</span>
              <span style={{ color: "#979797" }}>→</span>
            </Flex>
            
            <Flex 
              align="center" 
              justify="space-between"
              style={{ 
                padding: "12px 16px",
                backgroundColor: "#2C2C2C",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onClick={() => navigate("/settings/changepwd")}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#3C3C3C";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#2C2C2C";
              }}
            >
              <span style={{ color: "#ffffff" }}>Смена пароля</span>
              <span style={{ color: "#979797" }}>→</span>
            </Flex>
            
            <Divider style={{ borderColor: "rgba(151,151,151,0.2)", margin: "8px 0" }} />
            
            <Logout />
            <DeleteAcc />
          </Flex>
        </Flex>
      } />
      
      <Route path="/blacklist" element={
        <Flex vertical style={{ padding: "24px 20px" }}>
          <Flex align="center" gap="middle" style={{ marginBottom: "20px" }}>
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined style={{ color: "#979797" }} />}
              onClick={() => navigate("/settings")}
            />
            <Title level={3} style={{ color: "#ffffff", margin: 0 }}>
              Черный список
            </Title>
          </Flex>
          <BlackList />
        </Flex>
      } />
      
      <Route path="/changepwd" element={
        <Flex vertical style={{ padding: "24px 20px" }}>
          <Flex align="center" gap="middle" style={{ marginBottom: "20px" }}>
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined style={{ color: "#979797" }} />}
              onClick={() => navigate("/settings")}
            />
            <Title level={3} style={{ color: "#ffffff", margin: 0 }}>
              Смена пароля
            </Title>
          </Flex>
          <ChangePwd />
        </Flex>
      } />
    </Routes>
  );
};