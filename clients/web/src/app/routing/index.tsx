import {
  RouterProvider,
  Navigate,
  createBrowserRouter,
} from "react-router-dom";
import { Layout } from "../layout";
import { Fallback } from "../../components/common/Fallback";

import { SettingsPage } from "../../pages/Settings/SettingsPage";
import { LoginPage } from "../../pages/Auth/LoginPage";
import { RegisterPage } from "../../pages/Auth/RegisterPage";
import { Home } from "../../pages/Home/Home.tsx";
import { ChatPage } from "../../pages/Chat/ChatPage";
import { MePage } from "../../pages/Me/MePage.tsx";

import { ChatListPage } from "../../pages/ChatList/ChatListPage";

import { BlackList } from "../../components/settings/BlackList";
import { ChangePwd } from "../../components/settings/ChangePwd";
export const AppRouter = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <Fallback />,
      children: [
        {
          index: true,
          element: <Navigate to="/home" replace />,
        },
        // Публичные роуты
        {
          path: "login",
          element: <LoginPage />,
        },
        {
          path: "register",
          element: <RegisterPage />,
        },
        {
          path: "home",
          element: <Home />,
        },
        {
          path: "chats",
          element: <ChatListPage />,
        },
        {
          path: "chat/:id",
          element: <ChatPage />,
        },
        {
          path: "me",
          element: <MePage />,
        },
        {
          path: "settings",
          element: <SettingsPage />,
          children: [
            {
              path: "blacklist",
              element: <BlackList/>,
            },
            {
              path: "changepwd",
              element: <ChangePwd />,
            },
          ],
        },
        /*  {
          index: true,
          element: <Navigate to="/chats" replace />,
        },
         */
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};
