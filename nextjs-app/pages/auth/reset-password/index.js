import "./styles.css";
import { Button, Input, Form, message } from "antd";
import axiosInstance from "../../../axios";
import NavBar from "../../../components/nav_bar";
import { useState } from "react";
import Link from "next/link";

export default function ResetPassword() {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);

  const onSubmitLogin = (values) => {
    if (!values.username) {
      return messageApi.error("Please fill in the username").then(r => console.log(r));
    }

    setLoading(true); 
    axiosInstance
      .post("/auth/reset-password/", {
        username: values.username,
        email: values.email,
      })
      .then((response) => {
        console.log(response.data);
        messageApi.success("Email sent successfully").then(r => console.log(r));
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.message || "An error occurred. Please try again.";
        console.error("There was an error!", error);
        messageApi.error(errorMessage).then(r => console.log(r));
      })
      .finally(() => {
        setLoading(false); 
      });
  };

  return (
    <>

      <div className="signin-container">
        <div className="signin-content">
          <h2>Reset password</h2>
          <Form onFinish={onSubmitLogin}>
            <Form.Item name="username">
              <Input className="signin-input" placeholder="Username" />
            </Form.Item>
            <Form.Item name="email">
              <Input className="signin-input" placeholder="Email" />
            </Form.Item>
            {contextHolder}
            <Button
              className="signin-button"
              htmlType="submit"
              loading={loading}
              disabled={loading}
            >
              Submit
            </Button>
          </Form>
          <Link href="/auth/sign-in" className="forgot-password"> Back to Sign in</Link>
        </div>
      </div>
    </>
  );
}
