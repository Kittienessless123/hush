import { ChatHeader } from "../../components/chat/ChatHeader";
import { MessageList } from "../../components/chat/MessageList";
import { MessageInput } from "../../components/chat/MessageInput";
import { observer } from "mobx-react-lite";


export const ChatPage = observer(() => {
  return (
    <>
      <ChatHeader />
      <MessageList />
      <MessageInput />
    </>
  );
})
