import { UserOutlined, SettingOutlined, SearchOutlined } from "@ant-design/icons";
import { Typography, Avatar, Flex, Button, Divider } from "antd";
import { FriendsList } from "../../components/users/FriendsList";
import { SearchFriend } from "../../components/users/SearchFriend";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const { Title, Text } = Typography;

export const MePage = observer(() => {
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);

  // Заглушка для данных пользователя
  const mockUser = {
    name: "John Doe",
    description: "Online",
    status: "Живу в моменте ✨",
    friends: 128,
  };

  return (
    <Flex style={{ minHeight: "calc(100vh - 70px)" }}>
      {/* Левая пустая треть */}
      <div style={{ flex: 1 }} />
      
      {/* Центральная треть с профилем */}
      <Flex 
        vertical 
        style={{ 
          flex: "0 0 33.333%",
          maxWidth: "500px",
          width: "100%",
          backgroundColor: "#1C1C1C",
        }}
      >
        {/* Шапка профиля */}
        <Flex 
          align="center" 
          justify="space-between" 
          style={{ 
            padding: "16px 20px",
            borderBottom: "1px solid rgba(151,151,151,0.2)",
          }}
        >
          <Title level={3} style={{ margin: 0, color: "#ffffff" }}>
            Профиль
          </Title>
          <Flex gap="small">
            <Button
              type="text"
              icon={<SearchOutlined style={{ color: "#979797", fontSize: "20px" }} />}
              onClick={() => setShowSearch(!showSearch)}
            />
            <Button
              type="text"
              icon={<SettingOutlined style={{ color: "#979797", fontSize: "20px" }} />}
              onClick={() => navigate("/settings")}
            />
          </Flex>
        </Flex>

        {/* Информация о пользователе */}
        <Flex vertical style={{ padding: "24px 20px" }}>
          <Flex align="center" gap="large">
            <Avatar 
              size={80} 
              icon={<UserOutlined />} 
              style={{ 
                backgroundColor: "#2C2C2C",
                color: "#979797",
                border: "2px solid rgba(151,151,151,0.3)",
              }}
            />
            <Flex vertical>
              <Title level={3} style={{ margin: 0, color: "#ffffff" }}>
                {mockUser.name}
              </Title>
              <Text style={{ color: "#979797", fontSize: "14px" }}>
                {mockUser.description}
              </Text>
              <Text style={{ color: "#979797", fontSize: "13px", marginTop: "4px" }}>
                {mockUser.friends} друзей
              </Text>
            </Flex>
          </Flex>

          {/* Статус */}
          <Flex 
            style={{ 
              marginTop: "20px",
              padding: "12px 16px",
              backgroundColor: "#2C2C2C",
              borderRadius: "12px",
              border: "1px solid rgba(151,151,151,0.1)",
            }}
          >
            <Text style={{ color: "#ffffff", fontSize: "15px" }}>
              {mockUser.status}
            </Text>
          </Flex>
        </Flex>

        <Divider style={{ margin: "0", borderColor: "rgba(151,151,151,0.1)" }} />

        {/* Поиск друзей (условно) */}
        {showSearch && <SearchFriend />}

        {/* Заголовок списка друзей */}
        <Flex 
          justify="space-between" 
          align="center" 
          style={{ padding: "16px 20px" }}
        >
          <Title level={4} style={{ margin: 0, color: "#ffffff" }}>
            Друзья
          </Title>
          <Text style={{ color: "#979797" }}>
            {mockUser.friends}
          </Text>
        </Flex>

        {/* Список друзей */}
        <FriendsList />
      </Flex>
      
      {/* Правая пустая треть */}
      <div style={{ flex: 1 }} />
    </Flex>
  );
});