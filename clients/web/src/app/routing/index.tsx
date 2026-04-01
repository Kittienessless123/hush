import {
  RouterProvider,
  Navigate,
  createBrowserRouter,
} from "react-router-dom";
import { Layout } from "../layout";
import { Fallback } from "../../components/common/Fallback";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";

import { SettingsPage } from "../../pages/Settings/SettingsPage";
import { LoginPage } from "../../pages/Auth/LoginPage";
import { RegisterPage } from "../../pages/Auth/RegisterPage";
import { Home } from "../../pages/Home/Home";
import { ChatPage } from "../../pages/Chat/ChatPage";
import { MePage } from "../../pages/Me/MePage";
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

        {
          element: <PublicRoute />,
          children: [
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
          ],
        },

        {
          element: <ProtectedRoute />,
          children: [
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
                  element: <BlackList />,
                },
                {
                  path: "changepwd",
                  element: <ChangePwd />,
                },
              ],
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};
