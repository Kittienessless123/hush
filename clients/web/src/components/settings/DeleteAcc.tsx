import { DeleteOutlined } from "@ant-design/icons";
import { Button, Flex, Typography } from "antd";
const { Title } = Typography;

export const DeleteAcc = () => {
  const onDeleteAccount = () => {
    throw new Error("Function not implemented.");
  };

  return (
    <Flex gap={"middle"}>
      <Title>Delete acc</Title>
      <Button onClick={onDeleteAccount} icon={<DeleteOutlined />}></Button>
    </Flex>
  );
};
