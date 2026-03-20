// pages/Home.tsx
import { Button, Flex } from "antd";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import { getHushLogoStyle } from "../../styles/typography";
import { buttonHoverStyles } from "../../styles/forms";

export const Home = observer(() => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const buttonStyle = {
    minWidth: 140,
    height: 44,
    fontSize: 16,
    background: "transparent",
    color: theme.textSecondary,
    boxShadow: `0 0 15px ${theme.glow}`,
    border: "none",
    borderRadius: 4,
    transition: "all 0.3s ease",
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    const styles = buttonHoverStyles(theme);
    e.currentTarget.style.boxShadow = styles.boxShadow;
    e.currentTarget.style.color = theme.text;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.boxShadow = `0 0 15px ${theme.glow}`;
    e.currentTarget.style.color = theme.textSecondary;
  };

  return (
    <Flex
      style={{
        minHeight: "calc(100vh - 70px)",
        backgroundColor: theme.background,
      }}
      align="center"
      justify="center"
      vertical
    >
      <h1 style={getHushLogoStyle(theme)}>
        hush
      </h1>
      <Flex gap="middle">
        <Button
          onClick={() => navigate("/register")}
          style={buttonStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Register
        </Button>
        <Button
          onClick={() => navigate("/login")}
          style={buttonStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Login
        </Button>
      </Flex>
    </Flex>
  );
});