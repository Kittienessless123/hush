import { ChatList } from "../../components/chat/ChatList";
import { ChatHeader } from "../../components/chat/ChatHeader";
import { observer } from "mobx-react-lite";
import { Flex, Typography, Divider } from "antd";

const { Title, Text } = Typography;

export const ChatListPage = observer(() => {
 
  
  const mockUnreadTotal = 7;

  return (
    <Flex style={{ minHeight: "calc(100vh - 70px)" }}>
      {/* Левая пустая треть */}
      <div style={{ flex: 1 }} />
      
      {/* Центральная треть с чатами */}
      <Flex 
        vertical 
        style={{ 
          flex: "0 0 33.333%",
          maxWidth: "500px",
          backgroundColor: "#1C1C1C",
          borderLeft: "1px solid rgba(151,151,151,0.2)",
          borderRight: "1px solid rgba(151,151,151,0.2)",
        }}
      >
        <ChatHeader />
        
        <Flex vertical style={{ padding: "16px" }}>
          <Flex justify="space-between" align="center">
            <Title level={3} style={{ margin: 0, color: "#ffffff" }}>
              Чаты
            </Title>
            <Text style={{ color: "#979797" }}>
              {mockUnreadTotal} непрочитано
            </Text>
          </Flex>
          
          <Divider style={{ 
            margin: "16px 0", 
            borderColor: "rgba(151,151,151,0.2)",
          }} />
          
          <ChatList />
        </Flex>
      </Flex>
      
      {/* Правая пустая треть */}
      <div style={{ flex: 1 }} />
    </Flex>
  );
});