import { useState } from "react";
import { Flex, Input, Popover, Button } from "antd";
import { 
  PlusCircleOutlined, 
  SmileOutlined,
  SendOutlined,
} from "@ant-design/icons";
//import EmojiPicker from 'emoji-picker-react';

const { TextArea } = Input;

const emojis = ['😊', '😂', '❤️', '👍', '😢', '😡', '🎉', '🔥', '✨', '⭐'];

export const MessageInput = () => {
  const [value, setValue] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSend = () => {
    if (value.trim()) {
      console.log("Sending message:", value);
      setValue("");
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setValue(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const emojiContent = (
    <Flex wrap="wrap" style={{ width: "200px" }}>
      {emojis.map((emoji, index) => (
        <Button
          key={index}
          type="text"
          onClick={() => handleEmojiClick(emoji)}
          style={{ 
            fontSize: "24px", 
            padding: "4px",
            color: "#ffffff",
          }}
        >
          {emoji}
        </Button>
      ))}
    </Flex>
  );

  return (
    <Flex 
      align="flex-end" 
      gap="small" 
      style={{ 
        padding: "12px 20px",
        backgroundColor: "#1C1C1C",
        borderTop: "1px solid rgba(151,151,151,0.2)",
      }}
    >
      <Button
        type="text"
        icon={<PlusCircleOutlined style={{ fontSize: "24px", color: "#979797" }} />}
        style={{ marginBottom: "8px" }}
      />
      
      <Flex vertical style={{ flex: 1 }}>
        <TextArea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onPressEnter={(e) => {
            if (!e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Напишите сообщение..."
          autoSize={{ minRows: 1, maxRows: 6 }}
          style={{
            backgroundColor: "#2C2C2C",
            border: "1px solid rgba(151,151,151,0.2)",
            borderRadius: "24px",
            color: "#ffffff",
            padding: "8px 16px",
            fontSize: "15px",
            resize: "none",
          }}
        />
      </Flex>

      <Popover
        content={emojiContent}
        trigger="click"
        open={showEmojiPicker}
        onOpenChange={setShowEmojiPicker}
        placement="topRight"
        overlayStyle={{ 
          backgroundColor: "#2C2C2C",
          borderRadius: "12px",
        }}
      >
        <Button
          type="text"
          icon={<SmileOutlined style={{ fontSize: "24px", color: "#979797" }} />}
          style={{ marginBottom: "8px" }}
        />
      </Popover>

      <Button
        type="text"
        icon={<SendOutlined style={{ fontSize: "24px", color: "#979797" }} />}
        onClick={handleSend}
        style={{ marginBottom: "8px" }}
      />
    </Flex>
  );
};