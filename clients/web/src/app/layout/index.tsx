import React from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { Header } from "../../components/common/Header";
import { Footer } from "antd/es/layout/layout";
import { Layout as BaseLayout } from "antd";

const { Content, Sider } = BaseLayout;

export const Layout: React.FC = () => {
  return (
    <>
      <Header></Header>
      <Content>
        <Sider></Sider>
        <Outlet />

        <ScrollRestoration />
      </Content>

      <Footer></Footer>
    </>
  );
};
