import { Button, Space, Typography } from "antd";
import { Flex } from "antd";
import { observer } from "mobx-react-lite";
const { Title } = Typography;
import { useNavigate } from "react-router-dom";

export const Home = observer(() => {
  const navigate = useNavigate();

  const RegisterHelper = () => {
    navigate("/register");
  };

  const LoginHelper = () => {
    navigate("/login");
  };

  return (
    <Flex gap="medium" vertical>
      <Title>hush</Title>
      <Space></Space>
      <Flex gap="medium">
        <Button onClick={RegisterHelper}>Register</Button>
        <Button onClick={LoginHelper}>Login</Button>
      </Flex>
    </Flex>
  );
})
