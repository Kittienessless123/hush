import { ChatHeader } from "../../components/chat/ChatHeader";
import { MessageList } from "../../components/chat/MessageList";
import { MessageInput } from "../../components/chat/MessageInput";
import { ChatInfo } from "../../components/chat/ChatInfo";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Flex } from "antd";

export const ChatPage = observer(() => {
  const [showChatInfo, setShowChatInfo] = useState(false);

  return (
    <Flex style={{ minHeight: "calc(100vh - 70px)" }}>
      {/* Левая пустая треть */}
      <div style={{ flex: 1 }} />
      
      {/* Центральная треть с чатом */}
      <Flex 
        style={{ 
          flex: "0 0 33.333%",
          maxWidth: "500px",
          width: "100%",
          backgroundColor: "#1C1C1C",
          position: "relative",
        }}
      >
        <Flex 
          vertical 
          style={{ 
            flex: 1,
            width: showChatInfo ? "calc(100% - 320px)" : "100%",
            transition: "width 0.3s ease",
          }}
        >
          <ChatHeader onAvatarClick={() => setShowChatInfo(!showChatInfo)} />
          <MessageList />
          <MessageInput />
        </Flex>
        
        {showChatInfo && (
          <ChatInfo onClose={() => setShowChatInfo(false)} />
        )}
      </Flex>
      
      {/* Правая пустая треть */}
      <div style={{ flex: 1 }} />
    </Flex>
  );
});