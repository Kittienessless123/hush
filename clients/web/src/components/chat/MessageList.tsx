import { Flex } from "antd";
import { MessageItem } from "./MessageItem";
import { useEffect, useRef } from "react";

const mockMessages = [
  {
    id: "1",
    text: "Привет! Как дела?",
    sender: "me",
    senderName: "Вы",
    time: "14:30",
  },
  {
    id: "2",
    text: "Отлично! А у тебя?",
    sender: "other",
    senderName: "Анна Петрова",
    time: "14:31",
  },
  {
    id: "3",
    text: "Тоже хорошо. Чем занимаешься? Сегодня отличная погода, я думаю пойти гулять вечером. А ты как планируешь провести день?",
    sender: "me",
    senderName: "Вы",
    time: "14:32",
  },
  {
    id: "4",
    text: "Собираюсь в парк, если хочешь присоединяйся!",
    sender: "other",
    senderName: "Анна Петрова",
    time: "14:33",
  },
  {
    id: "5",
    text: "Круто, с удовольствием! Во сколько?",
    sender: "me",
    senderName: "Вы",
    time: "14:34",
  },
];

export const MessageList = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mockMessages]);

  return (
    <Flex 
      vertical 
      style={{ 
        flex: 1,
        overflowY: "auto",
        padding: "20px",
        backgroundColor: "#1C1C1C",
      }}
    >
      <Flex vertical style={{ flex: 1 }}>
        {mockMessages.map((message) => (
          <MessageItem
            key={message.id}
            id={message.id}
            text={message.text}
            sender={message.sender}
            senderName={message.senderName}
            time={message.time}
          />
        ))}
        <div ref={messagesEndRef} />
      </Flex>
    </Flex>
  );
};