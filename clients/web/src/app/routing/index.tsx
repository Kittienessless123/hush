import {
  RouterProvider,
  Navigate,
  createBrowserRouter,
} from "react-router-dom";
import { Layout } from "../layout";
import { Fallback } from "../../components/common/Fallback";
/* 
import { MePage } from "../../pages/Me/MePage.tsx";
import { ChatListPage } from "../../pages/ChatList/ChatListPage";
import { ChatPage } from "../../pages/Chat/ChatPage";
import { SettingsPage } from "../../pages/Settings/SettingsPage"; */
import { LoginPage } from "../../pages/Auth/LoginPage";
import { RegisterPage } from "../../pages/Auth/RegisterPage";
import { Home } from "../../pages/Home/Home.tsx";/* 
import { ChatPage } from "../../pages/Chat/ChatPage.tsx";
import { ChatListPage } from "../../pages/ChatList/ChatListPage.tsx";
import { MePage } from "../../pages/Me/MePage.tsx";
import { SettingsPage } from "../../pages/Settings/SettingsPage.tsx"; */

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

       /*  {
          index: true,
          element: <Navigate to="/chats" replace />,
        },
        {
          path: "me",
          element: <MePage />,
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
          path: "settings",
          element: <SettingsPage />,
        }, */
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};
