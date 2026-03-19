import { LogoutOutlined } from "@ant-design/icons";
import { Button, Flex, Typography } from "antd";
const { Title } = Typography;

export const Logout = () => {
  const onLogout = () => {};
  return (
    <Flex gap={"middle"}>
      <Title>Logout</Title>
      <Button onClick={onLogout} icon={<LogoutOutlined />}></Button>;
    </Flex>
  );
};
