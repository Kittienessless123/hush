// components/users/FriendsList.tsx
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Flex, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

const { Title, Text } = Typography;

interface Friend {
  id: string;
  name: string;
  addedAt: string;
  avatar?: string;
}

interface FriendsListProps {
  friends: Friend[];
  onFriendClick?: (id: string) => void;
}

export const FriendsList = ({ friends, onFriendClick }: FriendsListProps) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { t } = useTranslation("profile");

  const handleClick = (id: string) => {
    if (onFriendClick) {
      onFriendClick(id);
    } else {
      navigate(`/chat/${id}`);
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
          onClick={() => handleClick(friend.id)}
        >
          <Flex align="center" gap="middle">
            <Avatar
              size={48}
              icon={<UserOutlined />}
              src={friend.avatar}
              style={{
                backgroundColor: theme.surface,
                color: theme.textSecondary,
                border: `2px solid ${theme.border}`,
              }}
            />
            <Flex vertical>
              <Title level={5} style={{ margin: 0, color: theme.text }}>
                {friend.name}
              </Title>
              <Text style={{ color: theme.textSecondary, fontSize: "12px" }}>
                {t("added")} {dayjs(friend.addedAt).format("DD.MM.YYYY")}
              </Text>
            </Flex>
          </Flex>
          <Text style={{ color: theme.textSecondary, fontSize: "12px" }}>
            {t("online")}
          </Text>
        </Flex>
      ))}
    </Flex>
  );
};