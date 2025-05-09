"use client";
import { signIn } from "@/services/authentication";
import { Button, Form, Input, message, Modal, Spin, loading } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "./page.css";

export default function SignIn() {
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("refreshToken")) {
      router.push("/customer/");
    }
  }, []);

  const showModal = () => {
    setOpen(true);
  };

  const onSubmitLogin = async (values) => {
    const { username, password } = values;

    if (!username || !password) {
      return messageApi.error("Please enter both username and password.");
    }

    setLoading(true);
    try {
      const response = await signIn(username, password);

      if (response.status === 200) {
        const { user, data } = response.data;
        sessionStorage.setItem("username", user.username);
        sessionStorage.setItem("refreshToken", data.refreshToken);
        sessionStorage.setItem("accessToken", data.accessToken);

        if (!user.is_changed_password) {
          showModal();
        } else {
          messageApi.success("Sign-in successful.");
          await router.push("/admin/customer/");
        }
      } else {
        messageApi.error("Sign-in failed.");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        messageApi.error("Invalid credentials.");
      } else if (error.response?.data?.message === "Password has not been changed") {
        showModal();
      } else {
        messageApi.error("Error during sign-in.");
      }
      console.error("Error during sign-in:", error);
    } finally {
      setLoading(false);
    }
  };

  const okModal = () => {
    router.push("/auth/change-password");
  };
  const cancelModal = () => {
    setOpen(false);
    sessionStorage.clear();
    router.push("/auth/sign-in");
  };

  return (
    <>
      <div className="signin-container">
        <div className="signin-content">
          <h2>Sign In</h2>
          <Form onFinish={onSubmitLogin}>
            <Form.Item name="username">
              <Input className="signin-input" placeholder="Username" />
            </Form.Item>
            <Form.Item name="password">
              <Input.Password className="signin-input" placeholder="Password" />
            </Form.Item>
            {contextHolder}
            <Button className="signin-button" htmlType="submit" disabled={loading}>
              {loading ? <Spin size="small" /> : "Sign In"}
            </Button>
            <Link href="/auth/reset-password" className="forgot-password">
              Forgot Password?
            </Link>
            <Link href="/auth/sign-up" className="forgot-password">
              Create an Account
            </Link>
          </Form>
        </div>
        <Modal
          title="Error"
          open={open}
          onOk={okModal}
          onCancel={cancelModal}
          okText="Ok"
          cancelText="Sign out"
        >
          <p>Please change your password</p>
        </Modal>
      </div>
    </>
  );
}