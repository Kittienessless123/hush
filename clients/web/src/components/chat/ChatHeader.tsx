import { DownOutlined, UserOutlined } from "@ant-design/icons";
import {
  Avatar,
  Dropdown,
  Flex,
  Space,
  Typography,
  Input,
  type MenuProps,
} from "antd";
//import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { Search } = Input;

interface ChatHeaderProps {
  onAvatarClick?: () => void;
}

export const ChatHeader = ({ onAvatarClick }: ChatHeaderProps) => {
 // const navigate = useNavigate();

  const items: MenuProps["items"] = [
    {
      label: "Информация о чате",
      key: "0",
      onClick: onAvatarClick,
    },
    {
      label: "Поиск",
      key: "1",
    },
    {
      type: "divider",
    },
    {
      label: "Очистить историю",
      key: "3",
      danger: true,
    },
  ];

  return (
    <Flex 
      align="center" 
      justify="space-between" 
      style={{ 
        padding: "12px 20px",
        borderBottom: "1px solid rgba(151,151,151,0.2)",
        backgroundColor: "#1C1C1C",
      }}
    >
      <Flex align="center" gap="middle">
        <Avatar 
          size={44} 
          icon={<UserOutlined />} 
          onClick={onAvatarClick}
          style={{ 
            cursor: "pointer",
            backgroundColor: "#2C2C2C",
            color: "#979797",
            border: "2px solid rgba(151,151,151,0.3)",
          }}
        />
        <Flex vertical>
          <Title level={4} style={{ margin: 0, color: "#ffffff" }}>
            Анна Петрова
          </Title>
          <Text style={{ color: "#979797", fontSize: "13px" }}>
            был(а) 5 минут назад
          </Text>
        </Flex>
      </Flex>

      <Flex align="center" gap="small">
        <Search
          placeholder="Поиск"
          style={{ width: 200 }}
          onSearch={(value) => console.log(value)}
        />
        <Dropdown 
          menu={{ items }} 
          trigger={['click']}
        >
          <a onClick={(e) => e.preventDefault()} style={{ color: "#979797" }}>
            <Space>
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </Flex>
    </Flex>
  );
};