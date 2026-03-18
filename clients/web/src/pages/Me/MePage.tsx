import { UserOutlined } from "@ant-design/icons";
import { Typography, Avatar, Flex } from "antd";
import { FriendsList } from "../../components/users/FriendsList";
const { Title, Text } = Typography;

interface UserProps {
  id: string;
  name: string;
  description?: string;
}
export const MePage = ({ id, name, description }: UserProps) => {
  return (
    <>
      <Avatar size="large" icon={<UserOutlined />} />
      <Flex vertical flex={1}>
        <Flex justify="space-between" align="center">
          <Title level={4} style={{ margin: 0 }}>
            {name}
          </Title>
          <Text>{description}</Text>
        </Flex>
        <FriendsList />
      </Flex>
    </>
  );
};
