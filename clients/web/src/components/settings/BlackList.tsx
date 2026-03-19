import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Flex, Typography } from "antd";
import { useNavigate } from "react-router-dom";
const { Title } = Typography;

type BlackListItemProps = { id: string; name: string };

const BlackListItem = ({ id, name }: BlackListItemProps) => {
  const navigate = useNavigate();
  const onCardClick = () => {
    navigate(`/user/${id}`);
  };
  const onDeleteFromBlackList = () => {};
  return (
    <>
      <Card
        onClick={onCardClick}
        hoverable
        style={{ width: "100%", cursor: "pointer" }}
      >
        <Flex gap="middle" align="center">
          <Avatar size={48} icon={<UserOutlined />} />
          <Flex vertical flex={1}>
            <Flex justify="space-between" align="center">
              <Title level={4} style={{ margin: 0 }}>
                {name}
              </Title>
              <Button onClick={onDeleteFromBlackList}>
                Delete from black list
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Card>
    </>
  );
};
const blItems = [
  {
    id: "1",
    name: "Анна Петрова",
  },
  {
    id: "2",
    name: "Иван Сидоров",
  },
  {
    id: "3",
    name: "Мария Иванова",
  },
];
export const BlackList = () => {
  return (
    <Flex gap="small" vertical>
      {blItems.map((blacklist) => (
        <BlackListItem name={blacklist.name} id={blacklist.id} />
      ))}
    </Flex>
  );
};
