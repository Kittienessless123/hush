// components/settings/ThemeSwitcher.tsx
import { Flex, Select, Typography } from "antd";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useSettingsStore } from "../../hooks/useStore";
import { useTheme } from "../../hooks/useTheme";
import { getLabelStyle } from "../../styles/forms";

const { Text } = Typography;

export const ThemeSwitcher = observer(() => {
  const { t } = useTranslation("settings");
  const { theme: currentTheme } = useTheme();
  const { settings, updateTheme, loadSettings } = useSettingsStore();

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const options = [
    { value: "dark", label: t("darkTheme") || "Темная" },
    { value: "light", label: t("lightTheme") || "Светлая" },
    { value: "system", label: t("systemTheme") || "Системная" },
  ];

  const handleThemeChange = (value: "light" | "dark" | "system") => {
    updateTheme(value);
  };

  return (
    <Flex align="center" justify="space-between" style={{ padding: "8px 0" }}>
      <Text style={getLabelStyle(currentTheme)}>{t("theme") || "Тема"}</Text>
      <Select
        value={settings.theme}
        onChange={handleThemeChange}
        options={options}
        style={{ width: 120 }}
        popupClassName="custom-select-dropdown"
        dropdownStyle={{
          backgroundColor: currentTheme.surface,
          border: `1px solid ${currentTheme.border}`,
        }}
      />
    </Flex>
  );
});
