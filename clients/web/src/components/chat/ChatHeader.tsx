// components/chat/ChatHeader.tsx
import { DownOutlined, UserOutlined, SearchOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import {
  Avatar,
  Dropdown,
  Flex,
  Space,
  Typography,
  Input,
  Modal,
  type MenuProps,
} from "antd";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";

const { Title, Text } = Typography;
const { Search } = Input;

interface ChatHeaderProps {
  onAvatarClick?: () => void;
  onSearch?: (value: string) => void;
  onClearChat?: () => void;
  onBlockChat?: () => void;
  onDeleteChat?: () => void;
  chatName?: string;
  chatStatus?: string;
  showBackButton?: boolean;
}

export const ChatHeader = ({ 
  onAvatarClick, 
  onSearch,
  onClearChat,
  onBlockChat,
  onDeleteChat,
  chatName = "Анна Петрова",
  chatStatus = "был(а) 5 минут назад",
  showBackButton = false,
}: ChatHeaderProps) => {
  const { t } = useTranslation("chat");
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchMode, setSearchMode] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (value: string) => {
    onSearch?.(value);
  };

  const items: MenuProps["items"] = [
    {
      label: t("chatInfo"),
      key: "info",
      onClick: onAvatarClick,
    },
    {
      label: t("search"),
      key: "search",
      icon: <SearchOutlined />,
      onClick: () => setSearchMode(!searchMode),
    },
    {
      type: "divider" as const,
    },
    {
      label: t("clearHistory"),
      key: "clear",
      danger: true,
      onClick: () => {
        Modal.confirm({
          title: t("clearHistoryConfirm"),
          content: t("clearHistoryConfirmMessage"),
          onOk: onClearChat,
        });
      },
    },
    {
      label: t("blockUser"),
      key: "block",
      danger: true,
      onClick: () => {
        Modal.confirm({
          title: t("blockUserConfirm"),
          content: t("blockUserConfirmMessage"),
          onOk: onBlockChat,
        });
      },
    },
    {
      label: t("deleteChat"),
      key: "delete",
      danger: true,
      onClick: () => {
        Modal.confirm({
          title: t("deleteChatConfirm"),
          content: t("deleteChatConfirmMessage"),
          onOk: onDeleteChat,
        });
      },
    },
  ];

  return (
    <Flex 
      align="center" 
      justify="space-between" 
      style={{ 
        padding: "12px 20px",
        borderBottom: `1px solid ${theme.divider}`,
        backgroundColor: theme.background,
      }}
    >
      <Flex align="center" gap="middle">
        {showBackButton && (
          <ArrowLeftOutlined 
            style={{ 
              color: theme.textSecondary, 
              fontSize: "20px", 
              cursor: "pointer" 
            }} 
            onClick={() => navigate("/chats")}
          />
        )}
        <Avatar 
          size={44} 
          icon={<UserOutlined />} 
          onClick={onAvatarClick}
          style={{ 
            cursor: "pointer",
            backgroundColor: theme.surface,
            color: theme.textSecondary,
            border: `2px solid ${theme.border}`,
          }}
        />
        <Flex vertical>
          <Title level={4} style={{ margin: 0, color: theme.text }}>
            {chatName}
          </Title>
          <Text style={{ color: theme.textSecondary, fontSize: "13px" }}>
            {chatStatus}
          </Text>
        </Flex>
      </Flex>

      <Flex align="center" gap="small">
        {searchMode && (
          <Search
            placeholder={t("searchInChat")}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onSearch={handleSearch}
            style={{ 
              width: 200,
              backgroundColor: theme.surface,
              borderColor: theme.border,
            }}
            autoFocus
          />
        )}
        <Dropdown 
          menu={{ items }} 
          trigger={['click']}
        >
          <a onClick={(e) => e.preventDefault()} style={{ color: theme.textSecondary }}>
            <Space>
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </Flex>
    </Flex>
  );
};