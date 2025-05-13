"use client";
import "./page.css";
import { Button, Input, Form, message } from "antd";
import NavBar from "../../../components/nav_bar.js";
import { useState } from "react";
import Link from "next/link";
import { resetPassword } from "@/services/authentication";
import '@ant-design/v5-patch-for-react-19';

export default function ResetPassword() {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);

  const onSubmitLogin = async (values) => {
    if (!values.username) {
      return messageApi.error("Please fill in the username").then(r => console.log(r));
    }

    setLoading(true);
    try{
      const response = await resetPassword(values.username, values.email);
      if(response){
        messageApi.success("Email sent successfully").then(r => console.log(r));
      }
    } 
    catch(error){
      messageApi.error("An error occurred. Please try again.").then(r => console.log(r));
    }
    finally{
      setLoading(false);
    }
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
