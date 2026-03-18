import React from "react";
import { ChatHeader } from "../../components/chat/ChatHeader";
import { MessageList } from "../../components/chat/MessageList";
import { MessageInput } from "../../components/chat/MessageInput";


export const ChatPage = () => {
  return (
    <>
      <ChatHeader />
      <MessageList />
      <MessageInput />
    </>
  );
};
