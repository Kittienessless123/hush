import { CheckOutlined, DownOutlined, UserOutlined } from "@ant-design/icons";
import {
  Avatar,
  Dropdown,
  Flex,
  Space,
  Typography,
  type MenuProps,
} from "antd";
import Search from "antd/es/transfer/search";
import { useNavigate } from "react-router-dom";
import { DoubleCheck } from "../../assets/DoubleCheck";
const { Title } = Typography;

const items: MenuProps["items"] = [
  {
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.antgroup.com"
      >
        1st menu item
      </a>
    ),
    key: "0",
  },
  {
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.aliyun.com"
      >
        2nd menu item
      </a>
    ),
    key: "1",
  },
  {
    type: "divider",
  },
  {
    label: "3rd menu item（disabled）",
    key: "3",
    disabled: true,
  },
];

export const ChatHeader = () => {
  const navigate = useNavigate();
  const onAvatarClick = () => {
    navigate("/");
  };

  return (
    <Flex>
      <Avatar size="small" icon={<UserOutlined />} onClick={onAvatarClick} />
      <Flex vertical>
        <Title level={4}>Name name</Title>
        <Title level={5}>Last seen at 5:00 AM</Title>
      </Flex>
      <Search></Search>
      <Dropdown menu={{ items }}>
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            Hover me
            <DownOutlined />
          </Space>
        </a>
      </Dropdown>
      <CheckOutlined></CheckOutlined>
      <DoubleCheck></DoubleCheck>
    </Flex>
  );
};
