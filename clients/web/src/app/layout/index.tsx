import React from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { Layout as BaseLayout } from "antd";
import { useTheme } from "../../hooks/useTheme";
import { StoreContext, rootStore } from "../../store/root.store";

const { Content, Footer } = BaseLayout;

export const Layout: React.FC = () => {
  const { theme } = useTheme();

  return (
    <StoreContext.Provider value={rootStore}>
      <BaseLayout
        style={{
          minHeight: "100vh",
          width: "100vw",
          background: theme.background,
        }}
      >
        <Content
          style={{
            minHeight: "calc(100vh - 70px)",
            background: theme.background,
            padding: 0,
            color: theme.text,
          }}
        >
          <Outlet />
          <ScrollRestoration />
        </Content>

        <Footer
          style={{
            textAlign: "center",
            background: theme.background,
            borderTop: `1px solid ${theme.divider}`,
            color: theme.textSecondary,
          }}
        >
          ©{new Date().getFullYear()} HUSH. All rights reserved.
        </Footer>
      </BaseLayout>
    </StoreContext.Provider>
  );
};
