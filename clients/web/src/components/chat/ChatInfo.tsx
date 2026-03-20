// components/chat/ChatInfo.tsx
import { 
  UserOutlined, 
  CloseOutlined,
  BellOutlined,
  DeleteOutlined,
  SearchOutlined,
  UserAddOutlined,
  StopOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { 
  Flex, 
  Avatar, 
  Typography, 
  Divider, 
  Button,
  Switch,
  message,
  Modal,
} from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../hooks/useTheme";

const { Title, Text } = Typography;

interface ChatInfoProps {
  onClose: () => void;
  onAddToFriends?: () => void;
  onBlock?: () => void;
  isFriend?: boolean;
}

export const ChatInfo = ({ 
  onClose, 
  onAddToFriends, 
  onBlock,
  isFriend = false 
}: ChatInfoProps) => {
  const { t } = useTranslation("chat");
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState(true);

  const mockChatInfo = {
    name: "Анна Петрова",
    status: "Был(а) 5 минут назад",
    phone: "+7 (999) 123-45-67",
    email: "anna@example.com",
  };

  const sharedMedia = [
    { id: 1, type: "photo", url: "photo1.jpg" },
    { id: 2, type: "photo", url: "photo2.jpg" },
    { id: 3, type: "photo", url: "photo3.jpg" },
  ];

  const handleBlock = () => {
    Modal.confirm({
      title: t("blockUserConfirm"),
      content: t("blockUserConfirmMessage"),
      onOk: () => {
        onBlock?.();
        message.success(t("userBlocked"));
      },
    });
  };

  const handleAddToFriends = () => {
    onAddToFriends?.();
    message.success(t("friendRequestSent"));
  };

  return (
    <Flex 
      vertical 
      style={{ 
        width: "320px",
        height: "100%",
        backgroundColor: theme.background,
        borderLeft: `1px solid ${theme.divider}`,
        position: "absolute",
        right: 0,
        top: 0,
        bottom: 0,
        overflowY: "auto",
        zIndex: 10,
      }}
    >
      {/* Заголовок */}
      <Flex 
        align="center" 
        justify="space-between" 
        style={{ 
          padding: "16px",
          borderBottom: `1px solid ${theme.divider}`,
        }}
      >
        <Title level={5} style={{ margin: 0, color: theme.text }}>
          {t("chatInfo")}
        </Title>
        <Button 
          type="text" 
          icon={<CloseOutlined style={{ color: theme.textSecondary }} />}
          onClick={onClose}
        />
      </Flex>

      {/* Аватар и имя */}
      <Flex vertical align="center" style={{ padding: "24px 16px" }}>
        <Avatar 
          size={80} 
          icon={<UserOutlined />} 
          style={{ 
            backgroundColor: theme.surface,
            color: theme.textSecondary,
            border: `2px solid ${theme.border}`,
            marginBottom: "16px",
          }}
        />
        <Title level={4} style={{ margin: 0, color: theme.text }}>
          {mockChatInfo.name}
        </Title>
        <Text style={{ color: theme.textSecondary, fontSize: "13px", marginTop: "4px" }}>
          {mockChatInfo.status}
        </Text>
        
        {/* Кнопки действий */}
        <Flex gap="small" style={{ marginTop: "16px" }}>
          {!isFriend ? (
            <Button 
              icon={<UserAddOutlined />}
              onClick={handleAddToFriends}
              style={{
                backgroundColor: theme.surface,
                borderColor: theme.border,
                color: theme.text,
              }}
            >
              {t("addToFriends")}
            </Button>
          ) : (
            <Button 
              icon={<CheckOutlined />}
              disabled
              style={{
                backgroundColor: theme.surface,
                borderColor: theme.border,
                color: theme.textSecondary,
              }}
            >
              {t("inFriends")}
            </Button>
          )}
          <Button 
            icon={<StopOutlined />}
            danger
            onClick={handleBlock}
          >
            {t("block")}
          </Button>
        </Flex>
      </Flex>

      <Divider style={{ margin: "0", borderColor: theme.divider }} />

      {/* Контактная информация */}
      <Flex vertical style={{ padding: "16px" }}>
        <Text style={{ color: theme.textSecondary, marginBottom: "12px" }}>
          {t("contactInfo")}
        </Text>
        <Flex vertical gap="small">
          <Flex align="center" gap="middle">
            <Text style={{ color: theme.textSecondary, width: "40px" }}>📱</Text>
            <Text style={{ color: theme.text }}>{mockChatInfo.phone}</Text>
          </Flex>
          <Flex align="center" gap="middle">
            <Text style={{ color: theme.textSecondary, width: "40px" }}>📧</Text>
            <Text style={{ color: theme.text }}>{mockChatInfo.email}</Text>
          </Flex>
        </Flex>
      </Flex>

      <Divider style={{ margin: "0", borderColor: theme.divider }} />

      {/* Настройки */}
      <Flex vertical style={{ padding: "16px" }}>
        <Text style={{ color: theme.textSecondary, marginBottom: "12px" }}>
          {t("settings")}
        </Text>
        <Flex vertical gap="middle">
          <Flex align="center" justify="space-between">
            <Flex align="center" gap="middle">
              <BellOutlined style={{ color: theme.textSecondary }} />
              <Text style={{ color: theme.text }}>{t("notifications")}</Text>
            </Flex>
            <Switch 
              checked={notifications}
              onChange={setNotifications}
              style={{ 
                backgroundColor: notifications ? theme.textSecondary : theme.border,
              }}
            />
          </Flex>
          <Flex align="center" gap="middle">
            <SearchOutlined style={{ color: theme.textSecondary }} />
            <Text style={{ color: theme.text }}>{t("searchInChat")}</Text>
          </Flex>
          <Flex align="center" gap="middle">
            <DeleteOutlined style={{ color: theme.textSecondary }} />
            <Text style={{ color: theme.text }}>{t("clearHistory")}</Text>
          </Flex>
        </Flex>
      </Flex>

      <Divider style={{ margin: "0", borderColor: theme.divider }} />

      {/* Медиафайлы */}
      <Flex vertical style={{ padding: "16px" }}>
        <Flex justify="space-between" align="center" style={{ marginBottom: "12px" }}>
          <Text style={{ color: theme.textSecondary }}>{t("media")}</Text>
          <Text style={{ color: theme.textSecondary, fontSize: "12px" }}>3 {t("items")}</Text>
        </Flex>
        <Flex gap="small" wrap="wrap">
          {sharedMedia.map((media) => (
            <div
              key={media.id}
              style={{
                width: "80px",
                height: "80px",
                backgroundColor: theme.surface,
                borderRadius: "8px",
                border: `1px solid ${theme.divider}`,
              }}
            />
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
};