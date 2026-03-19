import { Settings } from "../../components/settings/Settings";
import { observer } from "mobx-react-lite";
import { Flex } from "antd";

export const SettingsPage = observer(() => {
  return (
    <Flex style={{ minHeight: "calc(100vh - 70px)" }}>
      {/* Левая пустая треть */}
      <div style={{ flex: 1 }} />
      
      {/* Центральная треть с настройками */}
      <Flex 
        vertical 
        style={{ 
          flex: "0 0 33.333%",
          maxWidth: "500px",
          width: "100%",
          backgroundColor: "#1C1C1C",
        }}
      >
        <Settings />
      </Flex>
      
      {/* Правая пустая треть */}
      <div style={{ flex: 1 }} />
    </Flex>
  );
});