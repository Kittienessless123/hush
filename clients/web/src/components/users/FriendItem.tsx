import { UserOutlined, WechatFilled } from "@ant-design/icons";
import { Avatar, Button, Flex, Typography } from "antd";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

interface FriendsProps {
  id: string;
  name: string;
  status?: string;
}

export const FriendItem = ({ id, name, status = "online" }: FriendsProps) => {
  const navigate = useNavigate();

  const handleWrite = () => {
    navigate(`/chat/${id}`);
  };

  return (
    <Flex 
      align="center" 
      justify="space-between"
      style={{ 
        padding: "12px 20px",
        borderBottom: "1px solid rgba(151,151,151,0.1)",
        transition: "all 0.3s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "rgba(151,151,151,0.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      <Flex align="center" gap="middle">
        <div style={{ position: "relative" }}>
          <Avatar 
            size={48} 
            icon={<UserOutlined />} 
            style={{ 
              backgroundColor: "#2C2C2C",
              color: "#979797",
              border: "2px solid rgba(151,151,151,0.3)",
            }}
          />
          <span 
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: status === "online" ? "#4CAF50" : "#979797",
              border: "2px solid #1C1C1C",
            }}
          />
        </div>
        
        <Flex vertical>
          <Title level={5} style={{ margin: 0, color: "#ffffff" }}>
            {name}
          </Title>
          <Text style={{ color: "#979797", fontSize: "12px" }}>
            {status === "online" ? "в сети" : "был недавно"}
          </Text>
        </Flex>
      </Flex>

      <Button
        type="text"
        icon={<WechatFilled style={{ color: "#979797", fontSize: "20px" }} />}
        onClick={handleWrite}
        style={{
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(151,151,151,0.1)";
          e.currentTarget.style.color = "#ffffff";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.color = "#979797";
        }}
      />
    </Flex>
  );
};