import "./sign_in.css";
import { Button, Input, Form, message, Spin } from "antd";
import Link from "next/link";
import axiosInstance from "../../../axios.js";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function SignIn() {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (sessionStorage.getItem("refreshToken")) {
      router.push("/customer/");
    }
  }, []);

  const onSubmitLogin = (values) => {
    const { username, password } = values;

    if (!username || !password) {
      return messageApi.error("Please fill in both username and password");
    }

    setLoading(true);
    axiosInstance
      .post("/auth/signin/", { username, password })
      .then((response) => {
        const { user, data } = response.data;

        sessionStorage.setItem("username", user.username);
        sessionStorage.setItem("refreshToken", data.refreshToken);
        sessionStorage.setItem("accessToken", data.accessToken);

        messageApi.success("Sign in successful");
        router.push("/customer/");
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.message || "An error occurred. Please try again.";
        console.error("There was an error!", error);
        messageApi.error(errorMessage);
      })
      .finally(() => {
        setLoading(false); // Ẩn Spin sau khi xử lý xong
      });
  };

  return (
    <>
      <div className="signin-container">
        <div className="signin-content">
          <h2>Sign in</h2>
          <Form onFinish={onSubmitLogin}>
            <Form.Item name="username">
              <Input className="signin-input" placeholder="Email or phone number" />
            </Form.Item>
            <Form.Item name="password">
              <Input.Password className="signin-input" placeholder="Password" />
            </Form.Item>
            {contextHolder}
            <Button className="signin-button" htmlType="submit" disabled={loading}>
              {loading ? <Spin size="small" /> : "Sign In"}
            </Button>
            <a href="/reset-password" className="forgot-password">
              Reset password?
            </a>
            <Link href="/auth/sign-up" className="forgot-password">
              Create a new account
            </Link>
          </Form>
        </div>
      </div>
    </>
  );
}

