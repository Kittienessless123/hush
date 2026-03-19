import { 
  UserOutlined, 
  CloseOutlined,
  BellOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { 
  Flex, 
  Avatar, 
  Typography, 
  Divider, 
  Button,
  Switch,
} from "antd";
import { useState } from "react";

const { Title, Text } = Typography;

interface ChatInfoProps {
  onClose: () => void;
}

export const ChatInfo = ({ onClose }: ChatInfoProps) => {
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

  return (
    <Flex 
      vertical 
      style={{ 
        width: "320px",
        height: "100%",
        backgroundColor: "#1C1C1C",
        borderLeft: "1px solid rgba(151,151,151,0.2)",
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
          borderBottom: "1px solid rgba(151,151,151,0.2)",
        }}
      >
        <Title level={5} style={{ margin: 0, color: "#ffffff" }}>
          Информация о чате
        </Title>
        <Button 
          type="text" 
          icon={<CloseOutlined style={{ color: "#979797" }} />}
          onClick={onClose}
        />
      </Flex>

      {/* Аватар и имя */}
      <Flex vertical align="center" style={{ padding: "24px 16px" }}>
        <Avatar 
          size={80} 
          icon={<UserOutlined />} 
          style={{ 
            backgroundColor: "#2C2C2C",
            color: "#979797",
            border: "2px solid rgba(151,151,151,0.3)",
            marginBottom: "16px",
          }}
        />
        <Title level={4} style={{ margin: 0, color: "#ffffff" }}>
          {mockChatInfo.name}
        </Title>
        <Text style={{ color: "#979797", fontSize: "13px", marginTop: "4px" }}>
          {mockChatInfo.status}
        </Text>
      </Flex>

      <Divider style={{ margin: "0", borderColor: "rgba(151,151,151,0.1)" }} />

      {/* Контактная информация */}
      <Flex vertical style={{ padding: "16px" }}>
        <Text style={{ color: "#979797", marginBottom: "12px" }}>
          Контактная информация
        </Text>
        <Flex vertical gap="small">
          <Flex align="center" gap="middle">
            <Text style={{ color: "#979797", width: "40px" }}>📱</Text>
            <Text style={{ color: "#ffffff" }}>{mockChatInfo.phone}</Text>
          </Flex>
          <Flex align="center" gap="middle">
            <Text style={{ color: "#979797", width: "40px" }}>📧</Text>
            <Text style={{ color: "#ffffff" }}>{mockChatInfo.email}</Text>
          </Flex>
        </Flex>
      </Flex>

      <Divider style={{ margin: "0", borderColor: "rgba(151,151,151,0.1)" }} />

      {/* Настройки */}
      <Flex vertical style={{ padding: "16px" }}>
        <Text style={{ color: "#979797", marginBottom: "12px" }}>
          Настройки
        </Text>
        <Flex vertical gap="middle">
          <Flex align="center" justify="space-between">
            <Flex align="center" gap="middle">
              <BellOutlined style={{ color: "#979797" }} />
              <Text style={{ color: "#ffffff" }}>Уведомления</Text>
            </Flex>
            <Switch 
              checked={notifications}
              onChange={setNotifications}
              style={{ 
                backgroundColor: notifications ? "#979797" : "rgba(151,151,151,0.2)",
              }}
            />
          </Flex>
          <Flex align="center" gap="middle">
            <SearchOutlined style={{ color: "#979797" }} />
            <Text style={{ color: "#ffffff" }}>Поиск в чате</Text>
          </Flex>
          <Flex align="center" gap="middle">
            <DeleteOutlined style={{ color: "#ff4d4f" }} />
            <Text style={{ color: "#ff4d4f" }}>Очистить историю</Text>
          </Flex>
        </Flex>
      </Flex>

      <Divider style={{ margin: "0", borderColor: "rgba(151,151,151,0.1)" }} />

      {/* Медиафайлы */}
      <Flex vertical style={{ padding: "16px" }}>
        <Flex justify="space-between" align="center" style={{ marginBottom: "12px" }}>
          <Text style={{ color: "#979797" }}>Медиафайлы</Text>
          <Text style={{ color: "#979797", fontSize: "12px" }}>3 шт.</Text>
        </Flex>
        <Flex gap="small" wrap="wrap">
          {sharedMedia.map((media) => (
            <div
              key={media.id}
              style={{
                width: "80px",
                height: "80px",
                backgroundColor: "#2C2C2C",
                borderRadius: "8px",
                border: "1px solid rgba(151,151,151,0.2)",
              }}
            />
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
};