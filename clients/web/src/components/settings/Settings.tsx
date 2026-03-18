import { useTranslation } from "react-i18next";
import { Divider, Flex, Typography } from "antd";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Notification } from "./Notification";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { BlackList } from "./BlackList";
import { LastSeen } from "./LastSeen";
import { ReadReceipts } from "./ReadReceipts";
import { ChangePwd } from "./ChangePwd";
import { Logout } from "./Logout";
import { DeleteAcc } from "./DeleteAcc";
const { Title } = Typography;

export const Settings = () => {
  const { t } = useTranslation("settings");

  return (
    <Flex vertical gap={"small"}>
      <Title level={3}>{t("title")}</Title>
      <Divider></Divider>
      <LanguageSwitcher></LanguageSwitcher>
      <Notification />
      <ThemeSwitcher />
      <BlackList />
      <LastSeen />
      <ReadReceipts />
      <ChangePwd />
      <Logout />
      <DeleteAcc />
    </Flex>
  );
};
