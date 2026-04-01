import { type FC, type ReactNode, useState, useEffect } from "react";
import { ConfigProvider, theme as antTheme } from "antd";
import { StoreContext, rootStore } from "../../store/root.store";
import { themes } from "../../styles/theme";
import { ThemeContext } from "../../hooks/useTheme";

interface IProviders {
  readonly children: ReactNode;
}

export const Providers: FC<IProviders> = ({ children }) => {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
    localStorage.setItem("theme", !isDark ? "dark" : "light");
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    if (savedTheme === "system") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsDark(systemPrefersDark);
    } else {
      setIsDark(savedTheme !== "light");
    }
  }, []);

  const currentTheme = isDark ? themes.dark : themes.light;

  const antdThemeConfig = {
    algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
    token: {
      colorPrimary: currentTheme.textSecondary,
      colorBgContainer: currentTheme.surface,
      colorText: currentTheme.text,
      colorTextSecondary: currentTheme.textSecondary,
      colorBorder: currentTheme.border,
      borderRadius: 8,
    },
    components: {
      Button: {
        colorPrimary: currentTheme.surface,
        colorPrimaryHover: currentTheme.surfaceHover,
        colorTextLightSolid: currentTheme.text,
      },
      Input: {
        colorBgContainer: "transparent",
        colorText: currentTheme.text,
        colorBorder: currentTheme.border,
      },
      Select: {
        colorBgContainer: currentTheme.surface,
        colorText: currentTheme.text,
        colorBorder: currentTheme.border,
      },
    },
  };

  return (
    <StoreContext.Provider value={rootStore}>
      <ThemeContext.Provider
        value={{ theme: currentTheme, toggleTheme, isDark }}
      >
        <ConfigProvider theme={antdThemeConfig}>{children}</ConfigProvider>
      </ThemeContext.Provider>
    </StoreContext.Provider>
  );
};
