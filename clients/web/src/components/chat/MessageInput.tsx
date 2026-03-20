/* eslint-disable react-hooks/refs */
// components/chat/MessageInput.tsx
import { useState, useRef } from "react";
import { Flex, Input, Popover, Button, Image, message, Typography } from "antd";
import {
  PlusCircleOutlined,
  SmileOutlined,
  SendOutlined,
  PictureOutlined,
  VideoCameraOutlined,
  FileOutlined,
  AudioOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../hooks/useTheme";

const { TextArea } = Input;
const { Text } = Typography;

interface Attachment {
  id: string;
  type: "image" | "video" | "file" | "audio";
  file: File;
  preview?: string;
  name: string;
  size: number;
}

export const MessageInput = () => {
  const { t } = useTranslation("chat");
  const { theme } = useTheme();
  const [value, setValue] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentFileType, setCurrentFileType] = useState<
    "image" | "video" | "file" | "audio" | null
  >(null);

  const handleSend = () => {
    if (value.trim() || attachments.length > 0) {
      console.log("Sending message:", { text: value, attachments });
      setValue("");
      setAttachments([]);
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setValue((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleFileSelect = (type: "image" | "video" | "file" | "audio") => {
    setCurrentFileType(type);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newAttachments: Attachment[] = Array.from(files).map((file) => {
        const id = Date.now() + Math.random().toString();
        let preview: string | undefined;

        if (currentFileType === "image" && file.type.startsWith("image/")) {
          preview = URL.createObjectURL(file);
        }

        return {
          id,
          type: currentFileType!,
          file,
          preview,
          name: file.name,
          size: file.size,
        };
      });

      setAttachments((prev) => [...prev, ...newAttachments]);
      message.success(t("filesAdded", { count: newAttachments.length }));
    }
    e.target.value = "";
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => {
      const attachment = prev.find((a) => a.id === id);
      if (attachment?.preview) {
        URL.revokeObjectURL(attachment.preview);
      }
      return prev.filter((a) => a.id !== id);
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const attachmentsMenu = [
    {
      key: "image",
      icon: <PictureOutlined />,
      label: t("image"),
      onClick: () => handleFileSelect("image"),
    },
    {
      key: "video",
      icon: <VideoCameraOutlined />,
      label: t("video"),
      onClick: () => handleFileSelect("video"),
    },
    {
      key: "file",
      icon: <FileOutlined />,
      label: t("file"),
      onClick: () => handleFileSelect("file"),
    },
    {
      key: "audio",
      icon: <AudioOutlined />,
      label: t("audio"),
      onClick: () => handleFileSelect("audio"),
    },
  ];

  return (
    <>
      <Flex
        align="flex-end"
        gap="small"
        style={{
          padding: "12px 20px",
          backgroundColor: theme.background,
          borderTop: `1px solid ${theme.divider}`,
        }}
      >
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
          accept={
            currentFileType === "image"
              ? "image/*"
              : currentFileType === "video"
                ? "video/*"
                : currentFileType === "audio"
                  ? "audio/*"
                  : "*/*"
          }
          multiple
        />

        <Popover
          content={
            <Flex vertical gap="small">
              {attachmentsMenu.map((item) => (
                <Button
                  key={item.key}
                  type="text"
                  icon={item.icon}
                  onClick={item.onClick}
                  style={{ justifyContent: "flex-start" }}
                >
                  {item.label}
                </Button>
              ))}
            </Flex>
          }
          trigger="click"
          placement="top"
        >
          <Button
            type="text"
            icon={
              <PlusCircleOutlined
                style={{ fontSize: "24px", color: theme.textSecondary }}
              />
            }
            style={{ marginBottom: "8px" }}
          />
        </Popover>

        <Flex vertical style={{ flex: 1 }}>
          {attachments.length > 0 && (
            <Flex wrap="wrap" gap="small">
              {attachments.map((attachment) => (
                <Flex
                  key={attachment.id}
                  align="center"
                  gap="small"
                  style={{
                    padding: "4px 8px",
                    backgroundColor: theme.surfaceHover,
                    borderRadius: "8px",
                  }}
                >
                  {attachment.type === "image" && attachment.preview && (
                    <Image
                      src={attachment.preview}
                      width={32}
                      height={32}
                      style={{ borderRadius: "4px", objectFit: "cover" }}
                      preview={false}
                    />
                  )}
                  <Flex vertical>
                    <Text style={{ color: theme.text, fontSize: "12px" }}>
                      {attachment.name}
                    </Text>
                    <Text
                      style={{ color: theme.textSecondary, fontSize: "10px" }}
                    >
                      {formatFileSize(attachment.size)}
                    </Text>
                  </Flex>
                  <Button
                    type="text"
                    size="small"
                    icon={<CloseOutlined style={{ fontSize: "12px" }} />}
                    onClick={() => removeAttachment(attachment.id)}
                  />
                </Flex>
              ))}
            </Flex>
          )}

          <TextArea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onPressEnter={(e) => {
              if (!e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={t("messagePlaceholder")}
            autoSize={{ minRows: 1, maxRows: 6 }}
            style={{
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
              borderRadius: "24px",
              color: theme.text,
              padding: "8px 16px",
              fontSize: "15px",
              resize: "none",
            }}
          />
        </Flex>

        <Popover
          content={<EmojiPicker onEmojiClick={handleEmojiClick} />}
          trigger="click"
          open={showEmojiPicker}
          onOpenChange={setShowEmojiPicker}
          placement="topRight"
        >
          <Button
            type="text"
            icon={
              <SmileOutlined
                style={{ fontSize: "24px", color: theme.textSecondary }}
              />
            }
            style={{ marginBottom: "8px" }}
          />
        </Popover>

        <Button
          type="text"
          icon={
            <SendOutlined
              style={{ fontSize: "24px", color: theme.textSecondary }}
            />
          }
          onClick={handleSend}
          style={{ marginBottom: "8px" }}
        />
      </Flex>
    </>
  );
};
