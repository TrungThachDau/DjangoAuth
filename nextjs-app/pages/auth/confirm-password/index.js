import "./styles.css";
import { Button, Input, Form, message } from "antd";
import { useEffect, useState } from "react";
import Link from "next/link";
import axiosInstance from "@/axios";
import NavBar from "@/components/nav_bar";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";

export default function ConfirmPassword() {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const username = searchParams.get("username");

  useEffect(() => {
    if (!token) {
      messageApi.error("Invalid or missing token. Redirecting to sign-in page.");
      router.push("/auth/sign-in");
    }
  }, [token, router]);

  const onSubmitLogin = (values) => {
    if (!values.password || values.password.length < 8) {
      return messageApi.error("Password must be at least 8 characters long").then(r => console.log(r));
    }

    setLoading(true); 
    const url = `/confirm-new-password/${token}/`;
    axiosInstance
      .post(url, {
        username: username,
        new_password: values.password,
      })
      .then(response => {
        console.log(response.data);
        messageApi.success("Password reset successful").then(r => console.log(r));
        router.push("/auth/sign-in");
      })
      .catch(error => {
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
      <NavBar />
      <div className="signin-container">
        <div className="signin-content">
          <h2>Confirm password</h2>
          <Form onFinish={onSubmitLogin}>
            <Form.Item name="password">
              <Input.Password className="signin-input" placeholder="New password" />
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
            <Link href="/sign-up" className="forgot-password">
              Create a new account
            </Link>
          </Form>
        </div>
      </div>
    </>
  );
}