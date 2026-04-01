import { Flex, Switch, Typography } from "antd";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { useSettingsStore } from "../../hooks/useStore";
import { useTheme } from "../../hooks/useTheme";

const { Text } = Typography;

export const ReadReceipts = observer(() => {
  const { t } = useTranslation("settings");
  const { theme } = useTheme();
  const { settings, updatePrivacy } = useSettingsStore();

  const handleToggle = (checked: boolean) => {
    updatePrivacy("readReceipts", checked);
  };

  return (
    <Flex align="center" justify="space-between" style={{ padding: "8px 0" }}>
      <Text style={{ color: theme.text }}>{t("readReceipts")}</Text>
      <Switch
        checked={settings.privacy.readReceipts}
        onChange={handleToggle}
        style={{
          backgroundColor: settings.privacy.readReceipts
            ? theme.textSecondary
            : theme.border,
        }}
      />
    </Flex>
  );
});
