import { Flex } from "antd";
import { MessageItem } from "./MessageItem";


const mockMessages = [
  {
    id: "1",
    text: "Привет! Как дела?",
    sender: 'me',
    time: "14:30",
  },
  {
    id: "2",
    text: "Отлично! А у тебя?",
    sender: "other",
    time: "14:31",
  },
  {
    id: "3",
    text: "Тоже хорошо. Чем занимаешься?",
    sender: "me",
    time: "14:32",
  },
];

export const MessageList = () => {
  return (
    <Flex vertical gap="small" style={{ padding: "16px" }}>
      {mockMessages.map((message) => (
        <MessageItem
          key={message.id}
          id={message.id}
          text={message.text}
          sender={message.sender}
          time={message.time}
        />
      ))}
    </Flex>
  );
};