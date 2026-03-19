import { Flex, Typography, message } from "antd";
import {  HeartFilled } from "@ant-design/icons";
import { useState } from "react";

const { Text } = Typography;

interface MessageItemProps {
  id: string;
  text: string;
  sender: string;
  senderName: string;
  time: string;
  isMe?: boolean;
}

export const MessageItem = ({ 
 
  text, 
  sender, 
  senderName,
  time, 
  isMe = sender === 'me' 
}: MessageItemProps) => {
  const [liked, setLiked] = useState(false);

  const handleDoubleClick = () => {
    setLiked(!liked);
    message.success(liked ? '❤️' : '❤️');
  };

  return (
    <Flex 
      style={{ 
        width: "100%",
        justifyContent: isMe ? "flex-end" : "flex-start",
        marginBottom: "12px",
      }}
    >
      <Flex 
        vertical 
        style={{ 
          maxWidth: "70%",
          minWidth: "200px",
        }}
        onDoubleClick={handleDoubleClick}
      >
        {!isMe && (
          <Text style={{ 
            color: "#979797", 
            fontSize: "13px",
            marginBottom: "4px",
            marginLeft: "12px",
          }}>
            {senderName}
          </Text>
        )}
        
        <Flex 
          style={{ 
            backgroundColor: isMe ? "#2C2C2C" : "#363636",
            borderRadius: "16px",
            borderTopRightRadius: isMe ? "4px" : "16px",
            borderTopLeftRadius: !isMe ? "4px" : "16px",
            padding: "8px 12px",
            position: "relative",
          }}
        >
          <Flex vertical style={{ flex: 1 }}>
            <Text style={{ 
              color: "#ffffff", 
              fontSize: "15px",
              lineHeight: 1.4,
              marginBottom: "4px",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}>
              {text}
            </Text>
            
            <Flex justify="flex-end" align="center" gap="small">
              <Text style={{ 
                color: "rgba(151,151,151,0.7)", 
                fontSize: "11px",
              }}>
                {time}
              </Text>
              {liked && (
                <HeartFilled style={{ 
                  color: "#ff4d4f", 
                  fontSize: "12px",
                }} />
              )}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};