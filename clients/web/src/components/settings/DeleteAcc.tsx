import { DeleteOutlined } from "@ant-design/icons";
import { Button, Flex, Typography, message, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
const { Text } = Typography;

export const DeleteAcc = () => {
  const { t } = useTranslation("settings");
  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false);

  const onDeleteAccount = () => {
    // Здесь логика удаления аккаунта
    message.error("Аккаунт удален");
    setModalVisible(false);
    navigate("/");
  };

  return (
    <>
      <Flex align="center" justify="space-between" style={{ padding: "8px 0" }}>
        <Text style={{ color: "#ff4d4f" }}>{t("deleteAccount")}</Text>
        <Button 
          onClick={() => setModalVisible(true)} 
          icon={<DeleteOutlined />}
          danger
          style={{
            backgroundColor: "transparent",
            border: "1px solid #ff4d4f",
            color: "#ff4d4f",
          }}
        />
      </Flex>

      <Modal
        title="Подтверждение удаления"
        open={modalVisible}
        onOk={onDeleteAccount}
        onCancel={() => setModalVisible(false)}
        okText="Удалить"
        cancelText="Отмена"
        okButtonProps={{ danger: true }}
      >
        <Text>Вы уверены, что хотите удалить аккаунт? Это действие необратимо.</Text>
      </Modal>
    </>
  );
};