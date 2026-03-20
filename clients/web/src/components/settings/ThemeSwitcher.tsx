// components/settings/ThemeSwitcher.tsx
import { Flex, Select, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useTheme } from "../../hooks/useTheme";
import { getLabelStyle } from "../../styles/forms";

const { Text } = Typography;

export const ThemeSwitcher = () => {
  const { t } = useTranslation("settings");
  const { theme, toggleTheme, isDark } = useTheme();

  const getCurrentThemeMode = (): string => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'system') return 'system';
    if (savedTheme === 'light') return 'light';
    return 'dark';
  };

  const [themeMode, setThemeMode] = useState<string>(getCurrentThemeMode());

  const options = [
    { value: "dark", label: t("darkTheme") || "Темная" },
    { value: "light", label: t("lightTheme") || "Светлая" },
    { value: "system", label: t("systemTheme") || "Системная" },
  ];

  const handleThemeChange = (value: string) => {
    setThemeMode(value);
    localStorage.setItem('theme', value);
    
    if (value === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemPrefersDark !== isDark) {
        toggleTheme();
      }
    } else {
      const shouldBeDark = value === 'dark';
      if (shouldBeDark !== isDark) {
        toggleTheme();
      }
    }
  };

  // Слушаем изменения системной темы
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'system') {
        const shouldBeDark = e.matches;
        if (shouldBeDark !== isDark) {
          toggleTheme();
        }
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, [isDark, toggleTheme]);

  return (
    <Flex align="center" justify="space-between" style={{ padding: "8px 0" }}>
      <Text style={getLabelStyle(theme)}>{t("theme") || "Тема"}</Text>
      <Select
        value={themeMode}
        onChange={handleThemeChange}
        options={options}
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