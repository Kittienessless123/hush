import { ChatList } from "../../components/chat/ChatList";
import { observer } from "mobx-react-lite";
import { Flex, Typography, Divider, Dropdown, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { UserOutlined, SettingOutlined, MenuOutlined } from "@ant-design/icons";
import { useTheme } from "../../hooks/useTheme";
import { useTranslation } from "react-i18next";
import { getThreeColumnLayout, getCenterColumn } from "../../styles/containers";
import {
  getPageTitleStyle,
  getSecondaryTextStyle,
} from "../../styles/typography";

const { Title, Text } = Typography;

export const ChatListPage = observer(() => {
  const { theme } = useTheme();
  const { t } = useTranslation("chat");
  const navigate = useNavigate();
  const mockUnreadTotal = 7;

  const menuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: t("profile"),
      onClick: () => navigate("/me"),
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: t("settings"),
      onClick: () => navigate("/settings"),
    },
  ];

  const dropdownMenu = {
    items: menuItems,
  };

  return (
    <Flex style={getThreeColumnLayout(theme)}>
      <div style={{ flex: 1 }} />

      <Flex vertical style={getCenterColumn(theme)}>
        <Flex 
          justify="space-between" 
          align="center" 
          style={{ 
            padding: "12px 16px",
            borderBottom: `1px solid ${theme.divider}`,
          }}
        >
          <Title level={3} style={{ margin: 0, color: theme.text }}>
            Hush
          </Title>
          <Dropdown menu={dropdownMenu} placement="bottomRight" trigger={['click']}>
            <Button
              type="text"
              icon={<MenuOutlined style={{ color: theme.textSecondary, fontSize: "18px" }} />}
              style={{
                width: 32,
                height: 32,
              }}
            />
          </Dropdown>
        </Flex>

        <Flex vertical style={{ padding: "16px" }}>
          <Flex justify="space-between" align="center">
            <Title level={4} style={getPageTitleStyle(theme)}>
              {t("title")}
            </Title>
            <Text style={getSecondaryTextStyle(theme)}>
              {mockUnreadTotal} {t("unreadMessages")}
            </Text>
          </Flex>

          <Divider
            style={{
              margin: "16px 0",
              borderColor: theme.divider,
            }}
          />

          <ChatList />
        </Flex>
      </Flex>

      <div style={{ flex: 1 }} />
    </Flex>
  );
});