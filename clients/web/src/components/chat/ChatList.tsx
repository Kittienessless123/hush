import { Flex, Empty } from "antd";
import { ChatItem } from "./ChatItem";
import { useTheme } from "../../hooks/useTheme";
import { useTranslation } from "react-i18next";

interface Chat {
  id: string;
  name: string;
  lastSeen: string;
  lastMessage: string;
  unreadCount: number;
}

const mockChats: Chat[] = [
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

interface ChatListProps {
  chats?: Chat[];

}

export const ChatList = ({ chats = mockChats }: ChatListProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation("chat");

  if (chats.length === 0) {
    return (
      <Empty 
        description={t("noChats") || "Нет чатов"}
        style={{ 
          color: theme.textSecondary, 
          marginTop: "50px" 
        }}
      />
    );
  }

  return (
    <Flex vertical>
      {chats.map((chat) => (
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