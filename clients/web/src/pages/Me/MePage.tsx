import { UserOutlined } from "@ant-design/icons";
import { Typography, Avatar, Flex } from "antd";
import { FriendsList } from "../../components/users/FriendsList";
import { observer } from "mobx-react-lite";
const { Title, Text } = Typography;


export const MePage = observer(() => {
  return (
    <>
      <Avatar size="large" icon={<UserOutlined />} />
      <Flex vertical flex={1}>
        <Flex justify="space-between" align="center">
          <Title level={4} style={{ margin: 0 }}>
            {'name'}
          </Title>
          <Text>{'description'}</Text>
        </Flex>
        <FriendsList />
      </Flex>
    </>
  );
})
