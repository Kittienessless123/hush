import { FriendItem } from "./FriendItem";
import { Flex } from "antd";

const mockFriends = [
  {
    id: "1",
    name: "John Doe",
  },
  {
    id: "2",
    name: "Alan Turing",
  },
  {
    id: "3",
    name: "Arsiny",
  },
];

export const FriendsList = () => {
  return (
    <Flex vertical gap="small" style={{ padding: "16px" }}>
      {mockFriends.map((friend) => (
        <FriendItem id={friend.id} name={friend.name} />
      ))}
    </Flex>
  );
};
