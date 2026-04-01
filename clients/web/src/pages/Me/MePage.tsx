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
  message,
  Select,
  Empty,
} from "antd";
import { FriendsList } from "../../components/users/FriendsList";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useMemo, useEffect } from "react";
import { useTheme } from "../../hooks/useTheme";
import { useTranslation } from "react-i18next";
import { getThreeColumnLayout, getCenterColumn } from "../../styles/containers";
import {
  getPageTitleStyle,
  getSecondaryTextStyle,
} from "../../styles/typography";
import { getProfileHeaderStyle } from "../../styles/profile";
import dayjs from "dayjs";
import { useAuthStore, useUserStore } from "../../hooks/useStore";
import { Fallback } from "../../components/common/Fallback";

const { Title, Text } = Typography;
const { TextArea } = Input;

export const MePage = observer(() => {
  const { t } = useTranslation("profile");
  const navigate = useNavigate();
  const { theme } = useTheme();

  const { user } = useAuthStore();
  const {
    profile,
    isLoading,
    loadProfile,
    updateProfile,
    friends,
    loadFriends,
    isLoadingFriends,
  } = useUserStore();

  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortValue, setSortValue] = useState<
    "name_asc" | "name_desc" | "date_asc" | "date_desc"
  >("date_desc");
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user?.id) {
      loadProfile(user.id);
      loadFriends();
    }
  }, [loadFriends, loadProfile, user?.id]);

  useEffect(() => {
    if (profile) {
      setEditForm({
        name: profile.username || profile.username || "",
        description: profile.description || "",
      });
    }
  }, [profile]);

  if (isLoading || !profile) {
    return <Fallback />;
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Здесь будет загрузка аватара на сервер
      // Пока только локальное отображение
      const reader = new FileReader();
      reader.onloadend = () => {
        // TODO: Отправить файл на сервер
        // await uploadAvatar(file);
        message.success(t("avatarChanged"));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        username: editForm.name,
        description: editForm.description,
      });
      setIsEditing(false);
      message.success(t("profileUpdated"));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      message.error(t("profileUpdateError"));
    }
  };

  const filteredAndSortedFriends = useMemo(() => {
    const acceptedFriends = friends.filter((f) => f.status === "accepted");

    let filtered = [...acceptedFriends];

    if (searchTerm) {
      filtered = filtered.filter((friend) =>
        friend.friend.username.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    filtered.sort((a, b) => {
      switch (sortValue) {
        case "name_asc":
          return a.friend.username.localeCompare(b.friend.username);
        case "name_desc":
          return b.friend.username.localeCompare(a.friend.username);
        case "date_asc":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "date_desc":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        default:
          return 0;
      }
    });

    return filtered;
  }, [friends, searchTerm, sortValue]);

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
          <Text style={{ color: theme.text }}>{t("description")}</Text>
          <TextArea
            value={editForm.description}
            onChange={(e) =>
              setEditForm((prev) => ({ ...prev, description: e.target.value }))
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

        <Flex vertical style={{ padding: "32px 24px" }}>
          <Flex vertical align="center" gap="large">
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

            <Flex vertical align="center" gap="small" style={{ width: "100%" }}>
              <Flex align="center" gap="small">
                <Title level={2} style={{ margin: 0, color: theme.text }}>
                  {profile.username || profile.username}
                </Title>
                <Button
                  type="text"
                  icon={<EditOutlined style={{ color: theme.textSecondary }} />}
                  onClick={() => setIsEditing(true)}
                />
              </Flex>
              <Text style={getSecondaryTextStyle(theme)}>{profile.login}</Text>
              <Text style={getSecondaryTextStyle(theme)}>{profile.email}</Text>
            </Flex>
          </Flex>

          {profile.description && (
            <Flex
              style={{
                marginTop: 24,
                padding: "12px 16px",
                backgroundColor: theme.surfaceHover,
                borderRadius: "12px",
              }}
            >
              <Text
                style={{
                  color: theme.text,
                  fontSize: "14px",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                {profile.description}
              </Text>
            </Flex>
          )}

          <Flex vertical gap="small" style={{ marginTop: 24 }}>
            <Flex align="center" justify="space-between">
              <Text style={{ color: theme.textSecondary }}>
                📅 {t("joined")}
              </Text>
              <Text style={{ color: theme.text }}>
                {dayjs(profile.createdAt).format("DD MMMM YYYY")}
              </Text>
            </Flex>
            <Flex align="center" justify="space-between">
              <Text style={{ color: theme.textSecondary }}>
                👥 {t("friends")}
              </Text>
              <Text style={{ color: theme.text }}>
                {friends.filter((f) => f.status === "accepted").length}
              </Text>
            </Flex>
          </Flex>
        </Flex>

        <Divider style={{ margin: "0", borderColor: theme.divider }} />

        <Flex vertical style={{ padding: "20px" }}>
          <Flex
            justify="space-between"
            align="center"
            style={{ marginBottom: 16 }}
          >
            <Title level={4} style={getPageTitleStyle(theme)}>
              {t("friends")}
            </Title>
            <Text style={getSecondaryTextStyle(theme)}>
              {filteredAndSortedFriends.length} {t("friends")}
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

          {isLoadingFriends ? (
            <Flex justify="center" style={{ padding: "40px" }}>
              <span>Loading...</span>
            </Flex>
          ) : filteredAndSortedFriends.length === 0 ? (
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
