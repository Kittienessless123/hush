// pages/MePage.tsx
import {
  UserOutlined,
  SettingOutlined,
  EditOutlined,
  CameraOutlined,
  SearchOutlined,
  ArrowLeftOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import {
  Typography,
  Avatar,
  Flex,
  Button,
  Divider,
  Input,
  Modal,
  DatePicker,
  message,
  Select,
  Empty,
} from "antd";
import { FriendsList } from "../../components/users/FriendsList";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useMemo } from "react";
import { useTheme } from "../../hooks/useTheme";
import { useTranslation } from "react-i18next";
import { getThreeColumnLayout, getCenterColumn } from "../../styles/containers";
import {
  getPageTitleStyle,
  getSecondaryTextStyle,
} from "../../styles/typography";
import {
  getProfileHeaderStyle,
} from "../../styles/profile";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { TextArea } = Input;

interface Friend {
  id: string;
  name: string;
  addedAt: string;
  avatar?: string;
}

const mockFriends: Friend[] = [
  { id: "1", name: "Анна Петрова", addedAt: "2024-01-15", avatar: undefined },
  { id: "2", name: "Иван Сидоров", addedAt: "2024-02-20", avatar: undefined },
  { id: "3", name: "Мария Иванова", addedAt: "2024-01-10", avatar: undefined },
  { id: "4", name: "Дмитрий Смирнов", addedAt: "2024-03-01", avatar: undefined },
  { id: "5", name: "Елена Козлова", addedAt: "2024-02-05", avatar: undefined },
];

export const MePage = observer(() => {
  const { t } = useTranslation("profile");
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortValue, setSortValue] = useState<"name_asc" | "name_desc" | "date_asc" | "date_desc">("date_desc");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState({
    name: "Анна Петрова",
    description: "Online",
    status: "Живу в моменте ✨",
    birthday: "1995-05-15",
    friends: 128,
    avatar: null as string | null,
  });

  const [editForm, setEditForm] = useState({
    name: profile.name,
    status: profile.status,
    birthday: profile.birthday ? dayjs(profile.birthday) : null,
  });

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, avatar: reader.result as string }));
        message.success(t("avatarChanged"));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    setProfile((prev) => ({
      ...prev,
      name: editForm.name,
      status: editForm.status,
      birthday: editForm.birthday
        ? editForm.birthday.format("YYYY-MM-DD")
        : prev.birthday,
    }));
    setIsEditing(false);
    message.success(t("profileUpdated"));
  };

  // Фильтрация и сортировка друзей
  const filteredAndSortedFriends = useMemo(() => {
    let filtered = [...mockFriends];
    
    // Фильтрация по поиску
    if (searchTerm) {
      filtered = filtered.filter(friend =>
        friend.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Сортировка
    filtered.sort((a, b) => {
      switch (sortValue) {
        case "name_asc":
          return a.name.localeCompare(b.name);
        case "name_desc":
          return b.name.localeCompare(a.name);
        case "date_asc":
          return new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime();
        case "date_desc":
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
        default:
          return 0;
      }
    });
    
    return filtered;
  }, [searchTerm, sortValue]);

  const iconButtonStyle = {
    color: theme.textSecondary,
    fontSize: "20px",
  };

  const sortOptions = [
    { value: "name_asc", label: t("nameAsc") },
    { value: "name_desc", label: t("nameDesc") },
    { value: "date_asc", label: t("dateAsc") },
    { value: "date_desc", label: t("dateDesc") },
  ];

  const EditModal = () => (
    <Modal
      title={t("editProfile")}
      open={isEditing}
      onCancel={() => setIsEditing(false)}
      onOk={handleSaveProfile}
      okText={t("save")}
      cancelText={t("cancel")}
      styles={{
        body: { backgroundColor: theme.background, padding: "20px" },
        header: {
          backgroundColor: theme.background,
          borderBottom: `1px solid ${theme.divider}`,
        },
        footer: {
          backgroundColor: theme.background,
          borderTop: `1px solid ${theme.divider}`,
        },
      }}
    >
      <Flex vertical gap="middle">
        <div>
          <Text style={{ color: theme.text }}>{t("name")}</Text>
          <Input
            value={editForm.name}
            onChange={(e) =>
              setEditForm((prev) => ({ ...prev, name: e.target.value }))
            }
            style={{
              marginTop: "8px",
              backgroundColor: theme.surface,
              borderColor: theme.border,
              color: theme.text,
            }}
          />
        </div>
        <div>
          <Text style={{ color: theme.text }}>{t("status")}</Text>
          <TextArea
            value={editForm.status}
            onChange={(e) =>
              setEditForm((prev) => ({ ...prev, status: e.target.value }))
            }
            rows={3}
            style={{
              marginTop: "8px",
              backgroundColor: theme.surface,
              borderColor: theme.border,
              color: theme.text,
            }}
          />
        </div>
        <div>
          <Text style={{ color: theme.text }}>{t("birthday")}</Text>
          <DatePicker
            value={editForm.birthday}
            onChange={(date) =>
              setEditForm((prev) => ({ ...prev, birthday: date }))
            }
            style={{
              marginTop: "8px",
              width: "100%",
              backgroundColor: theme.surface,
              borderColor: theme.border,
            }}
          />
        </div>
      </Flex>
    </Modal>
  );

  return (
    <Flex style={getThreeColumnLayout(theme)}>
      <div style={{ flex: 1 }} />

      <Flex vertical style={getCenterColumn(theme)}>
        <Flex
          align="center"
          justify="space-between"
          style={getProfileHeaderStyle(theme)}
        >
          <Flex align="center" gap="middle">
            <Button
              type="text"
              icon={<ArrowLeftOutlined style={iconButtonStyle} />}
              onClick={() => navigate("/chats")}
            />
            <Title level={3} style={getPageTitleStyle(theme)}>
              {t("profile")}
            </Title>
          </Flex>
          <Flex gap="small">
            <Button
              type="text"
              icon={<MessageOutlined style={iconButtonStyle} />}
              onClick={() => navigate("/chats")}
            />
            <Button
              type="text"
              icon={<SettingOutlined style={iconButtonStyle} />}
              onClick={() => navigate("/settings")}
            />
          </Flex>
        </Flex>

        {/* Профиль - улучшенный дизайн */}
        <Flex vertical style={{ padding: "32px 24px" }}>
          <Flex vertical align="center" gap="large">
            {/* Аватар */}
            <div style={{ position: "relative" }}>
              <Avatar
                size={120}
                icon={<UserOutlined />}
                src={profile.avatar}
                style={{
                  backgroundColor: theme.surface,
                  color: theme.textSecondary,
                  border: `2px solid ${theme.border}`,
                  width: 120,
                  height: 120,
                  fontSize: 48,
                }}
              />
              <Button
                type="text"
                icon={<CameraOutlined />}
                onClick={handleAvatarClick}
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  backgroundColor: theme.surface,
                  borderRadius: "50%",
                  width: 32,
                  height: 32,
                  padding: 0,
                  border: `1px solid ${theme.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </div>

            {/* Информация */}
            <Flex vertical align="center" gap="small" style={{ width: "100%" }}>
              <Flex align="center" gap="small">
                <Title level={2} style={{ margin: 0, color: theme.text }}>
                  {profile.name}
                </Title>
                <Button
                  type="text"
                  icon={<EditOutlined style={{ color: theme.textSecondary }} />}
                  onClick={() => setIsEditing(true)}
                />
              </Flex>
              <Text style={getSecondaryTextStyle(theme)}>
                {profile.description}
              </Text>
            </Flex>
          </Flex>

          {/* Статус - без рамки, просто цветом */}
          <Flex
            style={{
              marginTop: 24,
              padding: "12px 16px",
              backgroundColor: theme.surfaceHover,
              borderRadius: "12px",
            }}
          >
            <Text style={{ color: theme.text, fontSize: "14px", width: "100%", textAlign: "center" }}>
              {profile.status}
            </Text>
          </Flex>

          {/* Дополнительная информация */}
          <Flex vertical gap="small" style={{ marginTop: 24 }}>
            {profile.birthday && (
              <Flex align="center" justify="space-between">
                <Text style={{ color: theme.textSecondary }}>
                  🎂 {t("birthday")}
                </Text>
                <Text style={{ color: theme.text }}>
                  {dayjs(profile.birthday).format("DD MMMM YYYY")}
                </Text>
              </Flex>
            )}
            <Flex align="center" justify="space-between">
              <Text style={{ color: theme.textSecondary }}>
                👥 {t("friends")}
              </Text>
              <Text style={{ color: theme.text }}>{profile.friends}</Text>
            </Flex>
          </Flex>
        </Flex>

        <Divider style={{ margin: "0", borderColor: theme.divider }} />

        {/* Поиск и сортировка друзей */}
        <Flex vertical style={{ padding: "20px" }}>
          <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
            <Title level={4} style={getPageTitleStyle(theme)}>
              {t("friends")}
            </Title>
            <Text style={getSecondaryTextStyle(theme)}>
              {filteredAndSortedFriends.length} {t("of")} {mockFriends.length}
            </Text>
          </Flex>

          <Flex gap="small" wrap="wrap" style={{ marginBottom: 20 }}>
            <Input
              placeholder={t("searchFriends")}
              prefix={<SearchOutlined style={{ color: theme.textSecondary }} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                minWidth: 200,
                backgroundColor: theme.surface,
                borderColor: theme.border,
                color: theme.text,
              }}
              allowClear
            />
            <Select
              value={sortValue}
              onChange={setSortValue}
              style={{ width: 180 }}
              options={sortOptions}
              dropdownStyle={{
                backgroundColor: theme.surface,
                borderColor: theme.border,
              }}
            />
          </Flex>

          {/* Список друзей */}
          {filteredAndSortedFriends.length === 0 ? (
            <Empty
              description={t("noFriendsFound")}
              style={{ color: theme.textSecondary, marginTop: 40 }}
            />
          ) : (
            <FriendsList friends={filteredAndSortedFriends} />
          )}
        </Flex>
      </Flex>

      <div style={{ flex: 1 }} />

      <EditModal />
    </Flex>
  );
});