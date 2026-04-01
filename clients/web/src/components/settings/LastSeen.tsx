import { Flex, Switch, Typography } from "antd";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { useSettingsStore } from "../../hooks/useStore";
import { useTheme } from "../../hooks/useTheme";

const { Text } = Typography;

export const LastSeen = observer(() => {
  const { t } = useTranslation("settings");
  const { theme } = useTheme();
  const { settings, updatePrivacy } = useSettingsStore();

  const handleToggle = (checked: boolean) => {
    updatePrivacy("lastSeen", checked ? "everyone" : "nobody");
  };

  return (
    <Flex align="center" justify="space-between" style={{ padding: "8px 0" }}>
      <Text style={{ color: theme.text }}>{t("lastSeen")}</Text>
      <Switch
        checked={settings.privacy.lastSeen === "everyone"}
        onChange={handleToggle}
        style={{
          backgroundColor:
            settings.privacy.lastSeen === "everyone"
              ? theme.textSecondary
              : theme.border,
        }}
      />
    </Flex>
  );
});
