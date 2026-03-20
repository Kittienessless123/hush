import { Flex, Result } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useTheme } from "../../hooks/useTheme";
import { useTranslation } from "react-i18next";

export const Fallback = () => {
  const { theme } = useTheme();
  const { t } = useTranslation("settings");
  return (
    <Flex
      align="center"
      justify="center"
      style={{
        minHeight: "100vh",
        width: "100vw",
        backgroundColor: theme.background,
      }}
    >
      <Result
        icon={
          <LoadingOutlined
            style={{ fontSize: 48, color: theme.textSecondary }}
            spin
          />
        }
        title={<span style={{ color: theme.text }}>{t("appLoading")}</span>}
        subTitle={
          <span style={{ color: theme.textSecondary }}>
            {t("pleaseWaiting")}
          </span>
        }
      />
    </Flex>
  );
};
