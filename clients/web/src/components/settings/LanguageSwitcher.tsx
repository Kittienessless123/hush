import { CheckOutlined, GlobalOutlined } from "@ant-design/icons";
import { Button, Dropdown, Space, Typography } from "antd";
import { useTranslation } from "react-i18next";
const { Text  } = Typography;

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const items = [
    {
      key: "en",
      label: (
        <Space>
          <span>🇬🇧</span>
          <Text>English</Text>
          {i18n.language === "en" && (
            <span>
              <CheckOutlined />
            </span>
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
          <Text>Русский</Text>
          {i18n.language === "ru" && (
            <span>
              <CheckOutlined />
            </span>
          )}
        </Space>
      ),
      onClick: () => changeLanguage("ru"),
    },
  ];

  return (
    <Dropdown menu={{ items }} placement="bottomRight" trigger={["click"]}>
      <Button icon={<GlobalOutlined />}>
        {i18n.language === "ru" ? "Русский" : "English"}
      </Button>
    </Dropdown>
  );
};