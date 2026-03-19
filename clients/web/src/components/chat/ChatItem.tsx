import { UserOutlined } from "@ant-design/icons";
import { Avatar, Flex, Typography, Badge } from "antd";
import { useNavigate } from "react-router-dom";

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

  const onCardClick = () => {
    navigate(`/chat/${id}`);
  };

  return (
    <div 
      onClick={onCardClick}
      style={{ 
        padding: "12px 16px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        backgroundColor: unreadCount > 0 ? "rgba(151,151,151,0.05)" : "transparent",
        borderBottom: "1px solid rgba(151,151,151,0.1)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "rgba(151,151,151,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = unreadCount > 0 ? "rgba(151,151,151,0.05)" : "transparent";
      }}
    >
      <Flex gap="middle" align="center">
        <Badge count={unreadCount} size="small" offset={[-5, 5]}>
          <Avatar 
            size={48} 
            icon={<UserOutlined />} 
            style={{ 
              backgroundColor: "#2C2C2C",
              color: "#979797",
              border: "1px solid rgba(151,151,151,0.3)",
            }}
          />
        </Badge>
        <Flex vertical flex={1}>
          <Flex justify="space-between" align="center">
            <Title level={5} style={{ 
              margin: 0, 
              color: "#ffffff",
              fontWeight: unreadCount > 0 ? 600 : 400,
            }}>
              {name}
            </Title>
            <Text style={{ color: "#979797", fontSize: "12px" }}>{lastSeen}</Text>
          </Flex>
          <Text 
            style={{ 
              color: "#979797", 
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