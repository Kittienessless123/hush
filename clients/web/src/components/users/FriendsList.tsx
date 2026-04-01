// components/users/FriendsList.tsx
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Flex, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import type { Friend } from "../../types/api.types";

const { Title, Text } = Typography;

interface FriendsListProps {
  friends: Friend[];
  onFriendClick?: (id: string) => void;
}

export const FriendsList = ({ friends, onFriendClick }: FriendsListProps) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { t } = useTranslation("profile");

  const handleClick = (friendId: string) => {
    if (onFriendClick) {
      onFriendClick(friendId);
    } else {
      navigate(`/chat/${friendId}`);
    }
  };

  return (
    <Flex vertical gap="small">
      {friends.map((friend) => (
        <Flex
          key={friend.id}
          align="center"
          justify="space-between"
          style={{
            padding: "12px 16px",
            borderRadius: "12px",
            cursor: "pointer",
            transition: "background-color 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme.surfaceHover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
          onClick={() => handleClick(friend.friend.id)}
        >
          <Flex align="center" gap="middle">
            <Avatar
              size={48}
              icon={<UserOutlined />}
              src={friend.friend.avatar}
              style={{
                backgroundColor: theme.surface,
                color: theme.textSecondary,
                border: `2px solid ${theme.border}`,
              }}
            />
            <Flex vertical>
              <Title level={5} style={{ margin: 0, color: theme.text }}>
                {friend.friend.username}
              </Title>
              <Text style={{ color: theme.textSecondary, fontSize: "12px" }}>
                {t("added")} {dayjs(friend.createdAt).format("DD.MM.YYYY")}
              </Text>
            </Flex>
          </Flex>
          <Text style={{ color: theme.textSecondary, fontSize: "12px" }}>
            {friend.friend.onlineStatus ? t("online") : t("offline")}
          </Text>
        </Flex>
      ))}
    </Flex>
  );
};
