/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  UserOutlined,
  DeleteOutlined,
  UserAddOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Flex,
  Typography,
  message,
  Input,
  Empty,
  Tooltip,
} from "antd";
import { useState, useEffect, useMemo } from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../hooks/useTheme";
import { useUserStore } from "../../hooks/useStore";

const { Title } = Typography;
const { Search } = Input;

interface BlackListItemProps {
  id: string;
  name: string;
  avatar?: string | null;
  onUnblock: (id: string, name: string) => void;
  onAddToFriends: (id: string, name: string) => void;
}

const BlackListItem = observer(
  ({ id, name, avatar, onUnblock, onAddToFriends }: BlackListItemProps) => {
    const { t } = useTranslation("settings");
    const { theme } = useTheme();
    const [isHovered, setIsHovered] = useState(false);

    return (
      <Flex
        align="center"
        justify="space-between"
        style={{
          padding: "12px 16px",
          backgroundColor: isHovered ? theme.surfaceHover : "transparent",
          borderRadius: "8px",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Flex align="center" gap="middle" style={{ flex: 1, minWidth: 0 }}>
          <Avatar
            size={48}
            icon={<UserOutlined />}
            src={avatar}
            style={{
              backgroundColor: theme.surface,
              color: theme.textSecondary,
              border: `2px solid ${theme.border}`,
              flexShrink: 0,
            }}
          />
          <Title
            level={5}
            style={{
              margin: 0,
              color: theme.text,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {name}
          </Title>
        </Flex>

        <Flex gap="small" style={{ flexShrink: 0 }}>
          <Tooltip title={t("addToFriendsTooltip")} placement="top">
            <Button
              icon={<UserAddOutlined />}
              onClick={() => onAddToFriends(id, name)}
              style={{
                backgroundColor: "transparent",
                border: `1px solid ${theme.border}`,
                color: theme.textSecondary,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.surfaceHover;
                e.currentTarget.style.borderColor = "#52c41a";
                e.currentTarget.style.color = "#52c41a";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.borderColor = theme.border;
                e.currentTarget.style.color = theme.textSecondary;
              }}
            />
          </Tooltip>

          <Tooltip title={t("unblockTooltip")} placement="top">
            <Button
              icon={<DeleteOutlined />}
              onClick={() => onUnblock(id, name)}
              style={{
                backgroundColor: "transparent",
                border: `1px solid ${theme.border}`,
                color: theme.textSecondary,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255,77,79,0.1)";
                e.currentTarget.style.borderColor = "#ff4d4f";
                e.currentTarget.style.color = "#ff4d4f";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.borderColor = theme.border;
                e.currentTarget.style.color = theme.textSecondary;
              }}
            />
          </Tooltip>
        </Flex>
      </Flex>
    );
  },
);

export const BlackList = observer(() => {
  const { t } = useTranslation("settings");
  const { theme } = useTheme();
  const {
    blacklist,
    loadBlacklist,
    unblockUser,
    sendFriendRequest,
    isLoadingBlacklist,
  } = useUserStore();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadBlacklist();
  }, []);

  const handleUnblock = async (id: string, name: string) => {
    try {
      await unblockUser(id);
      message.success(t("userUnblocked", { name }));
    } catch (error) {
      message.error(t("unblockError"));
    }
  };

  const handleAddToFriends = async (id: string, name: string) => {
    try {
      await sendFriendRequest(id);
      message.success(t("friendRequestSent", { name }));
    } catch (error) {
      message.error(t("friendRequestError"));
    }
  };

  const filteredList = useMemo(() => {
    return blacklist.filter((item) =>
      item.blockedUser.username
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    );
  }, [blacklist, searchTerm]);

  if (isLoadingBlacklist) {
    return (
      <Flex justify="center" style={{ padding: "50px" }}>
        <span>Loading...</span>
      </Flex>
    );
  }

  return (
    <Flex vertical style={{ padding: "24px 20px" }}>
      <Search
        placeholder={t("searchBlockedUsers")}
        prefix={<SearchOutlined style={{ color: theme.textSecondary }} />}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          marginBottom: "20px",
          backgroundColor: theme.surface,
          border: `1px solid ${theme.border}`,
          color: theme.text,
        }}
        allowClear
      />

      {filteredList.length === 0 ? (
        <Empty
          description={t("noBlockedUsers")}
          style={{ color: theme.textSecondary, marginTop: "50px" }}
        />
      ) : (
        <Flex vertical gap="small">
          {filteredList.map((item) => (
            <BlackListItem
              key={item.id}
              id={item.blockedUser.id}
              name={item.blockedUser.username}
              avatar={item.blockedUser.avatar}
              onUnblock={handleUnblock}
              onAddToFriends={handleAddToFriends}
            />
          ))}
        </Flex>
      )}
    </Flex>
  );
});
