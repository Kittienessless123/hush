import { Flex, Select, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { useState } from "react";
const { Text } = Typography;

export const ThemeSwitcher = () => {
  const { t } = useTranslation("settings");
  const [theme, setTheme] = useState("dark");

  const options = [
    { value: "dark", label: "Темная" },
    { value: "light", label: "Светлая" },
    { value: "system", label: "Системная" },
  ];

  return (
    <Flex align="center" justify="space-between" style={{ padding: "8px 0" }}>
      <Text style={{ color: "#ffffff" }}>{t("theme")}</Text>
      <Select
        value={theme}
        onChange={setTheme}
        options={options}
        style={{ width: 120 }}
        popupClassName="custom-select-dropdown"
        dropdownStyle={{ 
          backgroundColor: "#2C2C2C",
          border: "1px solid rgba(151,151,151,0.2)",
        }}
      />
    </Flex>
  );
};