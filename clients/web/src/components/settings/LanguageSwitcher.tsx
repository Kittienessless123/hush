import { Flex, Select, Typography } from "antd";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useSettingsStore } from "../../hooks/useStore";
import { useTheme } from "../../hooks/useTheme";
import { getLabelStyle } from "../../styles/forms";

const { Text } = Typography;

export const LanguageSwitcher = observer(() => {
  const { t, i18n } = useTranslation("settings");
  const { theme } = useTheme();
  const { settings, updateLanguage, loadSettings } = useSettingsStore();

  useEffect(() => {
    loadSettings();
  }, []);

  const languages = [
    { value: "ru", label: "Русский" },
    { value: "en", label: "English" },
  ];

  const handleLanguageChange = (value: string) => {
    updateLanguage(value);
    i18n.changeLanguage(value);
  };

  return (
    <Flex align="center" justify="space-between" style={{ padding: "8px 0" }}>
      <Text style={getLabelStyle(theme)}>{t("language") || "Язык"}</Text>
      <Select
        value={settings.language}
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
});
