import { SearchOutlined } from "@ant-design/icons";
import { Input, Flex } from "antd";
import { useState } from "react";

export const SearchFriend = () => {
  const [searchValue, setSearchValue] = useState("");

  return (
    <Flex style={{ padding: "12px 20px" }}>
      <Input
        placeholder="Поиск друзей..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        prefix={<SearchOutlined style={{ color: "#979797" }} />}
        style={{
          backgroundColor: "#2C2C2C",
          border: "1px solid rgba(151,151,151,0.2)",
          borderRadius: "24px",
          color: "#ffffff",
          padding: "8px 16px",
          fontSize: "14px",
        }}
        onFocus={(e) => {
          e.currentTarget.style.boxShadow = '0 0 15px rgba(151,151,151,0.2)';
          e.currentTarget.style.borderColor = '#979797';
        }}
        onBlur={(e) => {
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.borderColor = 'rgba(151,151,151,0.2)';
        }}
      />
    </Flex>
  );
};