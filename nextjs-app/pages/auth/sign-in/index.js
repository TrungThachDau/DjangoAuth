import "./sign_in.css";
import { Button, Input, Form, message, Spin } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "@/services/authentication";

export default function SignIn() {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("refreshToken")) {
      router.push("/customer/");
    }
  }, []);

  const onSubmitLogin = async (values) => {
    const { username, password } = values;

    if (!username || !password) {
      return messageApi.error("Please fill in both username and password");
    }

    // if (password.length < 6) {
    //   return messageApi.error("Password must be at least 6 characters long");
    // }

    setLoading(true);
    try {
      const response= await signIn(username, password);
      if (response.status===200){
        sessionStorage.setItem("username", response.data.user.username);
        sessionStorage.setItem("refreshToken", response.data.data.refreshToken);
        sessionStorage.setItem("accessToken", response.data.data.accessToken);
        messageApi.success("Sign in successful");
        router.push("/customer/");
      }
      
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      console.error(error);
      messageApi.error(errorMessage);
    } finally {
      setLoading(false);
    }
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
            <Link href="/reset-password" className="forgot-password">
              Reset password?
            </Link>
            <Link href="/auth/sign-up" className="forgot-password">
              Create a new account
            </Link>
          </Form>
        </div>
      </div>
    </>
  );
}

