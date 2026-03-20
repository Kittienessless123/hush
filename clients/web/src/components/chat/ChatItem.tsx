import { UserOutlined } from "@ant-design/icons";
import { Avatar, Flex, Typography, Badge } from "antd";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";

const { Title, Text } = Typography;

interface ChatItemProps {
  id: string;
  name: string;
  lastSeen: string;
  lastMessage: string;
  unreadCount: number;
}

export const ChatItem = ({ 
  id, 
  name, 
  lastSeen, 
  lastMessage, 
  unreadCount 
}: ChatItemProps) => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const onCardClick = () => {
    navigate(`/chat/${id}`);
  };

  const getBackgroundColor = (isHovered: boolean) => {
    if (isHovered) return theme.surfaceHover;
    if (unreadCount > 0) return theme.surface;
    return "transparent";
  };

  return (
    <div 
      onClick={onCardClick}
      style={{ 
        padding: "12px 16px",
        cursor: "pointer",
        transition: "background-color 0.2s ease",
        backgroundColor: getBackgroundColor(false),
        borderBottom: `1px solid ${theme.divider}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = getBackgroundColor(true);
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = getBackgroundColor(false);
      }}
    >
      <Flex gap="middle" align="center">
        <Badge 
          count={unreadCount} 
          size="small" 
          offset={[-5, 5]}
          style={{
            backgroundColor: unreadCount > 0 ? theme.textSecondary : theme.border,
          }}
        >
          <Avatar 
            size={48} 
            icon={<UserOutlined />} 
            style={{ 
              backgroundColor: theme.surface,
              color: theme.textSecondary,
              border: `1px solid ${theme.border}`,
            }}
          />
        </Badge>
        <Flex vertical flex={1}>
          <Flex justify="space-between" align="center">
            <Title 
              level={5} 
              style={{ 
                margin: 0, 
                color: theme.text,
                fontWeight: unreadCount > 0 ? 600 : 400,
              }}
            >
              {name}
            </Title>
            <Text style={{ color: theme.textSecondary, fontSize: "12px" }}>
              {lastSeen}
            </Text>
          </Flex>
          <Text 
            style={{ 
              color: theme.textSecondary, 
              fontSize: "14px",
              fontWeight: unreadCount > 0 ? 500 : 400,
            }}
          >
            {lastMessage}
          </Text>
        </Flex>
      </Flex>
    </div>
  );
};