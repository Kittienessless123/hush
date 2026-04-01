import { DeleteOutlined } from "@ant-design/icons";
import { Button, Flex, Typography,  Popconfirm, App } from "antd";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthStore, useUserStore } from "../../hooks/useStore";

const { Text } = Typography;

export const DeleteAcc = observer(() => {
  const { t } = useTranslation("settings");
  const { message: appMessage } = App.useApp();
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { deleteAccount, isLoading } = useUserStore();

  const onDeleteAccount = async () => {
    try {
      await deleteAccount();
      await logout();
      appMessage.success(t("accountDeleted"));
      navigate("/login");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      appMessage.error(t("deleteAccountError"));
    }
  };

  return (
    <Flex align="center" justify="space-between" style={{ padding: "8px 0" }}>
      <Text style={{ color: "#ff4d4f" }}>{t("deleteAccount")}</Text>
      <Popconfirm
        title={t("deleteAccountConfirm")}
        description={t("deleteAccountConfirmMessage")}
        onConfirm={onDeleteAccount}
        okText={t("delete")}
        cancelText={t("cancel")}
        okButtonProps={{ danger: true, loading: isLoading }}
      >
        <Button 
          icon={<DeleteOutlined />}
          danger
          loading={isLoading}
          style={{
            backgroundColor: "transparent",
            border: "1px solid #ff4d4f",
            color: "#ff4d4f",
          }}
        />
      </Popconfirm>
    </Flex>
  );
});