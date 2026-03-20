// components/settings/LanguageSwitcher.tsx
import { Flex, Select, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../hooks/useTheme";
import { getLabelStyle } from "../../styles/forms";

const { Text } = Typography;

export const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation("settings");
  const { theme } = useTheme();

  const languages = [
    { value: "ru", label: "Русский" },
    { value: "en", label: "English" },
  ];

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
    localStorage.setItem('language', value);
  };

  return (
    <Flex align="center" justify="space-between" style={{ padding: "8px 0" }}>
      <Text style={getLabelStyle(theme)}>{t("language") || "Язык"}</Text>
      <Select
        value={i18n.language}
        onChange={handleLanguageChange}
        options={languages}
        style={{ width: 120 }}
        popupClassName="custom-select-dropdown"
        dropdownStyle={{ 
          backgroundColor: theme.surface,
          border: `1px solid ${theme.border}`,
        }}
      />
    </Flex>
  );
};