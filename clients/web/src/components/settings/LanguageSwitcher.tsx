import { CheckOutlined, GlobalOutlined } from "@ant-design/icons";
import { Button, Dropdown, Space, Typography, Flex } from "antd";
import { useTranslation } from "react-i18next";
const { Text } = Typography;

export const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation("settings");

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const items = [
    {
      key: "en",
      label: (
        <Space>
          <span>🇬🇧</span>
          <Text style={{ color: "#ffffff" }}>English</Text>
          {i18n.language === "en" && (
            <CheckOutlined style={{ color: "#979797", fontSize: "14px" }} />
          )}
        </Space>
      ),
      onClick: () => changeLanguage("en"),
    },
    {
      key: "ru",
      label: (
        <Space>
          <span>🇷🇺</span>
          <Text style={{ color: "#ffffff" }}>Русский</Text>
          {i18n.language === "ru" && (
            <CheckOutlined style={{ color: "#979797", fontSize: "14px" }} />
          )}
        </Space>
      ),
      onClick: () => changeLanguage("ru"),
    },
  ];

  return (
    <Flex align="center" justify="space-between" style={{ padding: "8px 0" }}>
      <Text style={{ color: "#ffffff" }}>{t("language")}</Text>
      <Dropdown 
        menu={{ 
          items,
          style: { 
            backgroundColor: "#2C2C2C", 
            border: "1px solid rgba(151,151,151,0.2)",
            borderRadius: "8px",
          }
        }} 
        placement="bottomRight" 
        trigger={["click"]}
      >
        <Button 
          icon={<GlobalOutlined style={{ color: "#979797" }} />}
          style={{
            backgroundColor: "#2C2C2C",
            border: "1px solid rgba(151,151,151,0.2)",
            color: "#ffffff",
          }}
        >
          {i18n.language === "ru" ? "Русский" : "English"}
        </Button>
      </Dropdown>
    </Flex>
  );
};