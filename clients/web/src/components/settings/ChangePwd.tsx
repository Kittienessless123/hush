import { Button, Flex, Form, Input,  message } from "antd";
import { useState } from "react";

export const ChangePwd = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = () => {
    setLoading(true);
    setTimeout(() => {
      message.success("Пароль успешно изменен");
      form.resetFields();
      setLoading(false);
    }, 1000);
  };

  return (
    <Flex vertical style={{ padding: "24px 20px" }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label={<span style={{ color: "#ffffff" }}>Старый пароль</span>}
          name="oldPassword"
          rules={[{ required: true, message: "Введите старый пароль" }]}
        >
          <Input.Password 
            style={{
              backgroundColor: "#2C2C2C",
              border: "1px solid rgba(151,151,151,0.2)",
              color: "#ffffff",
              padding: "8px 12px",
            }}
          />
        </Form.Item>

        <Form.Item
          label={<span style={{ color: "#ffffff" }}>Новый пароль</span>}
          name="newPassword"
          rules={[
            { required: true, message: "Введите новый пароль" },
            { min: 6, message: "Минимум 6 символов" }
          ]}
        >
          <Input.Password 
            style={{
              backgroundColor: "#2C2C2C",
              border: "1px solid rgba(151,151,151,0.2)",
              color: "#ffffff",
              padding: "8px 12px",
            }}
          />
        </Form.Item>

        <Form.Item
          label={<span style={{ color: "#ffffff" }}>Подтвердите пароль</span>}
          name="confirmPassword"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: "Подтвердите пароль" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Пароли не совпадают"));
              },
            }),
          ]}
        >
          <Input.Password 
            style={{
              backgroundColor: "#2C2C2C",
              border: "1px solid rgba(151,151,151,0.2)",
              color: "#ffffff",
              padding: "8px 12px",
            }}
          />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit"
            loading={loading}
            style={{
              width: "100%",
              height: "44px",
              backgroundColor: "#2C2C2C",
              border: "1px solid rgba(151,151,151,0.3)",
              color: "#ffffff",
              boxShadow: "0 0 15px rgba(151,151,151,0.2)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#3C3C3C";
              e.currentTarget.style.boxShadow = "0 0 25px rgba(151,151,151,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#2C2C2C";
              e.currentTarget.style.boxShadow = "0 0 15px rgba(151,151,151,0.2)";
            }}
          >
            Изменить пароль
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
};