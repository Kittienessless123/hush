import { ChatList } from "../../components/chat/ChatList";
import { observer } from "mobx-react-lite";
import { useStore } from "../../hooks/useStore"; // используем новый хук

export const ChatListPage = observer(() => {
  const { chatStore, authStore } = useStore();

  return (
    <>
      <h1>Привет, {authStore.user?.username}</h1>
      <p>Непрочитано: {chatStore.unreadCount}</p>
      <ChatList />
    </>
  );
});
