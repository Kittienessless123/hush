import { useState } from "react";

import { Flex, Input } from "antd";
import { PlusCircleOutlined, SmileOutlined } from "@ant-design/icons";

const { TextArea } = Input;

export const MessageInput = () => {
  const [value, setValue] = useState("");

  return (
    <Flex>
      <PlusCircleOutlined />
      <TextArea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Autosize height with minimum and maximum number of lines"
        autoSize={{ minRows: 1, maxRows: 6 }}
      />
      <SmileOutlined />
    </Flex>
  );
};
