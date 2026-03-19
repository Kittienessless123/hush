import { FriendItem } from "./FriendItem";
import { Flex, Empty } from "antd";

const mockFriends = [
  {
    id: "1",
    name: "John Doe",
    status: "online",
  },
  {
    id: "2",
    name: "Alan Turing",
    status: "offline",
  },
  {
    id: "3",
    name: "Arsiny",
    status: "online",
  },
  {
    id: "4",
    name: "Екатерина Смирнова",
    status: "online",
  },
  {
    id: "5",
    name: "Михаил Иванов",
    status: "offline",
  },
];

export const FriendsList = () => {
  if (!mockFriends.length) {
    return (
      <Flex 
        align="center" 
        justify="center" 
        style={{ padding: "40px 20px" }}
      >
        <Empty 
          description={
            <span style={{ color: "#979797" }}>
              Нет друзей
            </span>
          }
        />
      </Flex>
    );
  }

  return (
    <Flex vertical style={{ flex: 1 }}>
      {mockFriends.map((friend) => (
        <FriendItem 
          key={friend.id}
          id={friend.id}
          name={friend.name}
          status={friend.status}
        />
      ))}
    </Flex>
  );
};