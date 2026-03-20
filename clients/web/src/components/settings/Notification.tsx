import { Flex, Switch, Typography } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../hooks/useTheme";

const { Text } = Typography;

export const Notification = () => {
  const { t } = useTranslation("settings");
  const { theme } = useTheme();
  const [enabled, setEnabled] = useState(true);

  return (
    <Flex align="center" justify="space-between" style={{ padding: "8px 0" }}>
      <Text style={{ color: theme.text }}>{t("notifications")}</Text>
      <Switch 
        checked={enabled}
        onChange={setEnabled}
        style={{ 
          backgroundColor: enabled ? theme.textSecondary : theme.border,
        }}
      />
    </Flex>
  );
};