import { UserOutlined } from "@ant-design/icons";
import { Avatar, Card, Flex, Typography, Badge } from "antd";
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
    <Badge.Ribbon 
      text={unreadCount} 
      color="blue" 
      placement="start"
      style={{ display: unreadCount > 0 ? "block" : "none" }}
    >
      <Card 
        onClick={onCardClick} 
        hoverable 
        style={{ width: "100%", cursor: "pointer" }}
      >
        <Flex gap="middle" align="center">
          <Avatar size={48} icon={<UserOutlined />} />
          <Flex vertical flex={1}>
            <Flex justify="space-between" align="center">
              <Title level={4} style={{ margin: 0 }}>{name}</Title>
              <Text type="secondary">{lastSeen}</Text>
            </Flex>
            <Text type="secondary">{lastMessage}</Text>
          </Flex>
        </Flex>
      </Card>
    </Badge.Ribbon>
  );
};