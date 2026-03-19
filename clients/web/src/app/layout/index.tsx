import React from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";

import { Layout as BaseLayout } from "antd";


const { Content, Footer } = BaseLayout;

const footerStyle: React.CSSProperties = {
  textAlign: 'center',
  background: '#1c1c1c',
  borderTop: '1px solid #f0f0f0',
  color: '#979797',
};

const contentStyle: React.CSSProperties = {
  minHeight: 'calc(100vh - 64px - 70px)', // header (64px) + footer (70px)
  background: '#1c1c1c',
  padding: 0, // убираем паддинги, так как они будут в конкретных страницах
  width: '100vw',
    color: '#ebebeb',

};

export const Layout: React.FC = () => {

  return (
    <BaseLayout style={{ minHeight: '100vh' }}>
   
      <Content style={contentStyle}>
        <Outlet />
        <ScrollRestoration />
      </Content>
      
      {/* Показываем Footer всегда */}
      <Footer style={footerStyle}>
        ©{new Date().getFullYear()} HUSH. All rights reserved.
      </Footer>
    </BaseLayout>
  );
};