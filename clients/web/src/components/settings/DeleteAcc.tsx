import { DeleteOutlined } from "@ant-design/icons";
import { Button, Flex, Typography, message, Popconfirm } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const { Text } = Typography;

export const DeleteAcc = () => {
  const { t } = useTranslation("settings");
  const navigate = useNavigate();

  const onDeleteAccount = () => {
    message.error(t("accountDeleted"));
    navigate("/");
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
        okButtonProps={{ danger: true }}
      >
        <Button 
          icon={<DeleteOutlined />}
          danger
          style={{
            backgroundColor: "transparent",
            border: "1px solid #ff4d4f",
            color: "#ff4d4f",
          }}
        />
      </Popconfirm>
    </Flex>
  );
};