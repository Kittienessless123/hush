// components/chat/MessageList.tsx
import { Flex, DatePicker, Input, Empty } from "antd";
import { MessageItem } from "./MessageItem";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../hooks/useTheme";
import { SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

interface Message {
  id: string;
  text: string;
  sender: string;
  senderName: string;
  time: string;
  fullDate: string;
  timestamp: number;
}

const mockMessages: Message[] = [
  {
    id: "1",
    text: "Привет! Как дела?",
    sender: "me",
    senderName: "Вы",
    time: "14:30",
    fullDate: "2024-01-15 14:30",
    timestamp: 1705325400000,
  },
  {
    id: "2",
    text: "Отлично! А у тебя?",
    sender: "other",
    senderName: "Анна Петрова",
    time: "14:31",
    fullDate: "2024-01-15 14:31",
    timestamp: 1705325460000,
  },
  {
    id: "3",
    text: "Тоже хорошо. Чем занимаешься? Сегодня отличная погода, я думаю пойти гулять вечером. А ты как планируешь провести день?",
    sender: "me",
    senderName: "Вы",
    time: "14:32",
    fullDate: "2024-01-15 14:32",
    timestamp: 1705325520000,
  },
  {
    id: "4",
    text: "Собираюсь в парк, если хочешь присоединяйся!",
    sender: "other",
    senderName: "Анна Петрова",
    time: "14:33",
    fullDate: "2024-01-15 14:33",
    timestamp: 1705325580000,
  },
  {
    id: "5",
    text: "Круто, с удовольствием! Во сколько?",
    sender: "me",
    senderName: "Вы",
    time: "14:34",
    fullDate: "2024-01-15 14:34",
    timestamp: 1705325640000,
  },
  {
    id: "6",
    text: "В 18:00, у главного входа",
    sender: "other",
    senderName: "Анна Петрова",
    time: "14:35",
    fullDate: "2024-01-15 14:35",
    timestamp: 1705325700000,
  },
];

export const MessageList = () => {
  const { t } = useTranslation("chat");
  const { theme } = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [filteredMessages, setFilteredMessages] = useState<Message[]>(mockMessages);

  useEffect(() => {
    let filtered = [...mockMessages];
    
    // Фильтр по поиску
    if (searchTerm) {
      filtered = filtered.filter(msg => 
        msg.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Фильтр по дате
    if (dateRange && dateRange[0] && dateRange[1]) {
      const start = dateRange[0].startOf('day').valueOf();
      const end = dateRange[1].endOf('day').valueOf();
      filtered = filtered.filter(msg => 
        msg.timestamp >= start && msg.timestamp <= end
      );
    }
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFilteredMessages(filtered);
    
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [searchTerm, dateRange]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [filteredMessages]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <Flex vertical style={{ height: "100%" }}>
      <Flex gap="middle" style={{ padding: "12px 20px", borderBottom: `1px solid ${theme.divider}` }}>
        <Input
          placeholder={t("searchMessages")}
          prefix={<SearchOutlined style={{ color: theme.textSecondary }} />}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ 
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
            color: theme.text,
          }}
          allowClear
        />
        <RangePicker
          onChange={(dates) => setDateRange(dates as never)}
          style={{
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
          }}
          placeholder={[t("startDate"), t("endDate")]}
        />
      </Flex>
      
      <Flex 
        vertical 
        style={{ 
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          backgroundColor: theme.background,
        }}
      >
        {filteredMessages.length === 0 ? (
          <Empty 
            description={t("noMessages")} 
            style={{ color: theme.textSecondary, marginTop: "50px" }}
          />
        ) : (
          <>
            {filteredMessages.map((message) => (
              <MessageItem
                key={message.id}
                id={message.id}
                text={message.text}
                sender={message.sender}
                senderName={message.senderName}
                time={message.time}
                fullDate={message.fullDate}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </Flex>
    </Flex>
  );
};