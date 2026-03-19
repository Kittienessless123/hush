import { UserOutlined, WechatFilled } from "@ant-design/icons";
import { Avatar, Button, Flex, Typography } from "antd";
const { Title, Text } = Typography;

interface FriendsProps {
  id: string;
  name: string;
}

export const FriendItem = ({  name }: FriendsProps) => {
  return (
    <Flex>
      <Avatar size="medium" icon={<UserOutlined />} />
      <Flex vertical justify="space-between" align="center">
        <Title level={4} style={{ margin: 0 }}>
          {name}
        </Title>
        <Text>
          <Button icon={<WechatFilled />}>Написать</Button>
        </Text>
      </Flex>
    </Flex>
  );
};
