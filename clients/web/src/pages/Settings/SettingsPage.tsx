// pages/Settings/SettingsPage.tsx
import { Settings } from "../../components/settings/Settings";
import { observer } from "mobx-react-lite";
import { Flex } from "antd";
import { useTheme } from "../../hooks/useTheme";

export const SettingsPage = observer(() => {
  const { theme } = useTheme();

  return (
    <Flex style={{ minHeight: "calc(100vh - 70px)", backgroundColor: theme.background }}>
      {/* Левая пустая треть */}
      <div style={{ flex: 1 }} />
      
      {/* Центральная треть с настройками */}
      <Flex 
        vertical 
        style={{ 
          flex: "0 0 33.333%",
          maxWidth: "500px",
          width: "100%",
          backgroundColor: theme.background,
        }}
      >
        <Settings />
      </Flex>
      
      {/* Правая пустая треть */}
      <div style={{ flex: 1 }} />
    </Flex>
  );
});