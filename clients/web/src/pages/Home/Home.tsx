// Home.tsx
import { Button, Flex, Typography } from "antd";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

export const Home = observer(() => {
  const navigate = useNavigate();

  const RegisterHelper = () => {
    navigate("/register");
  };

  const LoginHelper = () => {
    navigate("/login");
  };

  return (
    <Flex
      style={{
        minHeight: "calc(100vh - 70px)", // учитываем footer
        backgroundColor: "#1C1C1C",
      }}
      align="center"
      justify="center"
      vertical
    >
      <Title
        style={{
          fontFamily: "'Six Caps', sans-serif",
          fontWeight: 200,
          letterSpacing: "-10%",
          fontStretch: "20%",
          fontSize: "220px",
          color: "#979797",
          lineHeight: 0.9,
          marginBottom: 32,
          textTransform: "uppercase",
            transform: "scaleX(0.6)",
        }}
      >
        hush
      </Title>
      <Flex gap="middle">
        <Button
          onClick={RegisterHelper}
          style={{
            minWidth: 140,
            height: 44,
            fontSize: 16,
            background: "transparent",
            color: "#979797",
            boxShadow: "0 0 15px rgba(151,151,151,0.3)",
            border: "none",
            borderRadius: 4,
          
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 0 25px rgba(151,151,151,0.6)";
            e.currentTarget.style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "0 0 15px rgba(151,151,151,0.3)";
            e.currentTarget.style.color = "#979797";
          }}
        >
          Register
        </Button>
        <Button
          onClick={LoginHelper}
          style={{
            minWidth: 140,
            height: 44,
            fontSize: 16,
            background: "transparent",
            color: "#979797",
            boxShadow: "0 0 15px rgba(151,151,151,0.3)",
            border: "none",
            borderRadius: 4,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 0 25px rgba(151,151,151,0.6)";
            e.currentTarget.style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "0 0 15px rgba(151,151,151,0.3)";
            e.currentTarget.style.color = "#979797";
          }}
        >
          Login
        </Button>
      </Flex>
    </Flex>
  );
});
