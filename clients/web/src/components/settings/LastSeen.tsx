import { Flex, Typography, Switch } from "antd";
const { Title } = Typography;

export const LastSeen = () => {
  const onChange = (checked: boolean) => {
    console.log(`switch to ${checked}`);
  };

  return (
    <Flex gap={"middle"}>
      <Title>Show last seen</Title>
      <Switch  size="small"  onChange={onChange} />;
    </Flex>
  );
};
