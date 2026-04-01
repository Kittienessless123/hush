import { useTranslation } from "react-i18next";
import { Divider, Flex, Typography } from "antd";
import { observer } from "mobx-react-lite";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useTheme } from "../../hooks/useTheme";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Notification } from "./Notification";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { LastSeen } from "./LastSeen";
import { ReadReceipts } from "./ReadReceipts";
import { Logout } from "./Logout";
import { DeleteAcc } from "./DeleteAcc";

const { Title } = Typography;

export const Settings = observer(() => {
  const { t } = useTranslation("settings");
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();

  const isRootSettings = location.pathname === "/settings";

  const getPageTitle = () => {
    if (location.pathname === "/settings/blacklist") {
      return t("blockedUsers");
    }
    if (location.pathname === "/settings/changepwd") {
      return t("changePassword");
    }
    return t("title");
  };

  const handleBack = () => {
    if (isRootSettings) {
      navigate("/me");
    } else {
      navigate("/settings");
    }
  };

  if (!isRootSettings) {
    return (
      <Flex vertical style={{ padding: "24px 20px" }}>
        <Flex align="center" gap="middle" style={{ marginBottom: "20px" }}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined style={{ color: theme.textSecondary }} />}
            onClick={handleBack}
          />
          <Title level={3} style={{ color: theme.text, margin: 0 }}>
            {getPageTitle()}
          </Title>
        </Flex>
        <Outlet />
      </Flex>
    );
  }

  return (
    <Flex vertical style={{ padding: "24px 20px" }}>
      <Flex align="center" gap="middle" style={{ marginBottom: "16px" }}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined style={{ color: theme.textSecondary }} />}
          onClick={handleBack}
        />
        <Title level={3} style={{ color: theme.text, margin: 0 }}>
          {t("title")}
        </Title>
      </Flex>

      <Divider style={{ borderColor: theme.divider, margin: "0 0 20px 0" }} />

      <Flex vertical gap="middle">
        <LanguageSwitcher />
        <ThemeSwitcher />

        <Notification />
        <Divider style={{ borderColor: theme.divider, margin: "8px 0" }} />

        <LastSeen />
        <ReadReceipts />

        <Divider style={{ borderColor: theme.divider, margin: "8px 0" }} />

        <Flex
          align="center"
          justify="space-between"
          style={{
            padding: "12px 16px",
            backgroundColor: theme.surface,
            borderRadius: "8px",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onClick={() => navigate("/settings/blacklist")}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme.surfaceHover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = theme.surface;
          }}
        >
          <span style={{ color: theme.text }}>{t("blockedUsers")}</span>
          <span style={{ color: theme.textSecondary }}>→</span>
        </Flex>

        <Flex
          align="center"
          justify="space-between"
          style={{
            padding: "12px 16px",
            backgroundColor: theme.surface,
            borderRadius: "8px",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onClick={() => navigate("/settings/changepwd")}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme.surfaceHover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = theme.surface;
          }}
        >
          <span style={{ color: theme.text }}>{t("changePassword")}</span>
          <span style={{ color: theme.textSecondary }}>→</span>
        </Flex>

        <Divider style={{ borderColor: theme.divider, margin: "8px 0" }} />

        <Logout />
        <DeleteAcc />
      </Flex>
    </Flex>
  );
});
