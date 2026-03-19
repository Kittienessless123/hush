import { Flex, Switch, Typography } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
const { Text } = Typography;

export const LastSeen = () => {
  const { t } = useTranslation("settings");
  const [enabled, setEnabled] = useState(true);

  return (
    <Flex align="center" justify="space-between" style={{ padding: "8px 0" }}>
      <Text style={{ color: "#ffffff" }}>{t("lastSeen")}</Text>
      <Switch 
        checked={enabled}
        onChange={setEnabled}
        style={{ 
          backgroundColor: enabled ? "#979797" : "rgba(151,151,151,0.2)",
        }}
      />
    </Flex>
  );
};