import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Flex, Typography, message } from "antd";
import { useState } from "react";
const { Title } = Typography;

type BlackListItemProps = { id: string; name: string };

const BlackListItem = ({ name }: BlackListItemProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const onDeleteFromBlackList = () => {
    message.success(`${name} удален из черного списка`);
  };

  return (
    <Flex 
      align="center" 
      justify="space-between"
      style={{ 
        padding: "12px 16px",
        backgroundColor: isHovered ? "rgba(151,151,151,0.05)" : "transparent",
        borderRadius: "8px",
        transition: "all 0.3s ease",
        cursor: "pointer",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Flex align="center" gap="middle">
        <Avatar 
          size={48} 
          icon={<UserOutlined />} 
          style={{ 
            backgroundColor: "#2C2C2C",
            color: "#979797",
            border: "2px solid rgba(151,151,151,0.3)",
          }}
        />
        <Title level={5} style={{ margin: 0, color: "#ffffff" }}>
          {name}
        </Title>
      </Flex>
      
      <Button 
        onClick={onDeleteFromBlackList}
        style={{
          backgroundColor: "transparent",
          border: "1px solid rgba(151,151,151,0.2)",
          color: "#979797",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(255,77,79,0.1)";
          e.currentTarget.style.borderColor = "#ff4d4f";
          e.currentTarget.style.color = "#ff4d4f";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.borderColor = "rgba(151,151,151,0.2)";
          e.currentTarget.style.color = "#979797";
        }}
      >
        Удалить
      </Button>
    </Flex>
  );
};

const blItems = [
  { id: "1", name: "Анна Петрова" },
  { id: "2", name: "Иван Сидоров" },
  { id: "3", name: "Мария Иванова" },
];

export const BlackList = () => {
  return (
    <Flex vertical gap="small">
      {blItems.map((item) => (
        <BlackListItem key={item.id} id={item.id} name={item.name} />
      ))}
    </Flex>
  );
};