import React from "react";
import { Menu  } from "antd";

import {
GithubOutlined, 
} from "@ant-design/icons";
import type { MenuProps } from "antd";
type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    label: (
      <a
        href="https://t.me/Kittienessless"
        target="_blank"
        rel="noopener noreferrer"
      ></a>
    ),
    key: "Telegram",
    icon: <Telegram />,
  },
  {
    label: (
      <a
        href="https://github.com/Kittienessless123/hush/dev"
        target="_blank"
        rel="noopener noreferrer"
      ></a>
    ),
    key: "GitHub",
    icon: <GithubOutlined />,
  },
];


const footerStyle: React.CSSProperties = {
  textAlign: "center",
  justifyContent: "center",
  minHeight: 50,
  backgroundColor: "transparent",
  alignContent: "center",
};

export const FooterWidget: React.FC = () => {

  return (
    <>
      <div style={footerStyle}>
        <Menu
          style={footerStyle}
          onClick={({ key }) => {
            if (key === "GitHub") {
              window.open(
                "https://github.com/Kittienessless/D_Lingify",
                "_blank"
              );
            }
            if (key === "VK") {
              window.open("https://vk.com/id143051280", "_blank");
            }
            if (key === "Telegram") {
              window.open("https://t.me/Kittienessless123/hush/dev", "_blank");
            }
          }}
          mode="horizontal"
          items={items}
        />
      </div>
    </>
  );
};