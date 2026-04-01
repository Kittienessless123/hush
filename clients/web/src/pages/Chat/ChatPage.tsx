import { ChatHeader } from "../../components/chat/ChatHeader";
import { MessageList } from "../../components/chat/MessageList";
import { MessageInput } from "../../components/chat/MessageInput";
import { ChatInfo } from "../../components/chat/ChatInfo";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Flex } from "antd";
import { useTheme } from "../../hooks/useTheme";
import { getThreeColumnLayout, getCenterColumn } from "../../styles/containers";

export const ChatPage = observer(() => {
  const [showChatInfo, setShowChatInfo] = useState(false);
  const { theme } = useTheme();

  return (
    <Flex style={getThreeColumnLayout(theme)}>
      <div style={{ flex: 1 }} />

      <Flex
        style={{
          ...getCenterColumn(theme),
          position: "relative",
          borderLeft: "none",
          borderRight: "none",
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
          <ChatHeader
            showBackButton={true}
            onAvatarClick={() => setShowChatInfo(!showChatInfo)}
          />
          <MessageList />
          <MessageInput />
        </Flex>

        {showChatInfo && <ChatInfo onClose={() => setShowChatInfo(false)} />}
      </Flex>

      <div style={{ flex: 1 }} />
    </Flex>
  );
});
