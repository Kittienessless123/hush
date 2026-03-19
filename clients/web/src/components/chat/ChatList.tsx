import { Flex } from "antd";
import { ChatItem } from "./ChatItem";

// Массив-заглушка с тремя элементами
const mockChats = [
  {
    id: "1",
    name: "Анна Петрова",
    lastSeen: "5:00 PM",
    lastMessage: "Привет! Как дела?",
    unreadCount: 2,
  },
  {
    id: "2",
    name: "Иван Сидоров",
    lastSeen: "вчера",
    lastMessage: "Скинь фото",
    unreadCount: 0,
  },
  {
    id: "3",
    name: "Мария Иванова",
    lastSeen: "3:30 PM",
    lastMessage: "Документы готовы",
    unreadCount: 5,
  },
];

export const ChatList = () => {
  return (
    <Flex vertical>
      {mockChats.map((chat) => (
        <ChatItem
          key={chat.id}
          id={chat.id}
          name={chat.name}
          lastSeen={chat.lastSeen}
          lastMessage={chat.lastMessage}
          unreadCount={chat.unreadCount}
        />
      ))}
    </Flex>
  );
};