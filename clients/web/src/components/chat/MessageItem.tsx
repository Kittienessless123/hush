// components/chat/MessageItem.tsx
import { Flex, Typography, Tooltip, message } from "antd";
import { HeartFilled } from "@ant-design/icons";
import { useState } from "react";
import { useTheme } from "../../hooks/useTheme";
import { getMessageBubbleStyle } from "../../styles/chat";

const { Text } = Typography;

interface MessageItemProps {
  id: string;
  text: string;
  sender: string;
  senderName: string;
  time: string;
  fullDate?: string;
  isMe?: boolean;
}

export const MessageItem = ({ 
  text, 
  sender, 
  senderName,
  time, 
  fullDate,
  isMe = sender === 'me' 
}: MessageItemProps) => {
  const { theme } = useTheme();
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
            color: theme.textSecondary, 
            fontSize: "13px",
            marginBottom: "4px",
            marginLeft: "12px",
          }}>
            {senderName}
          </Text>
        )}
        
        <Tooltip title={fullDate || time} placement="left">
          <Flex 
            style={getMessageBubbleStyle(isMe, theme)}
          >
            <Flex vertical style={{ flex: 1 }}>
              <Text style={{ 
                color: theme.text, 
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
        </Tooltip>
      </Flex>
    </Flex>
  );
};