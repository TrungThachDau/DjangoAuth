import { Button, Form, Input, message } from "antd";
import Link from "next/link";
import axiosInstance from "../../../axios.js";
import "./sign_up.css";

export default async function SignUp() {
  const [messageApi, contextHolder] = message.useMessage();

  const onSubmitLogin = async (values) => {
    if (!values.name || !values.username || !values.email || !values.password || !values.retypePassword) {
      return messageApi.error("Please fill in all fields").then(r => console.log(r));
    }

    if (values.password !== values.retypePassword) {
      return messageApi.error("Passwords do not match").then(r => console.log(r));
    }
    await axiosInstance
      .post("/auth/signup/", {
        username: values.username,
        hashed_password: values.password,
        email: values.email,
        name: values.name,
      })
      .then(async (response) => {
        return messageApi.error("Sign up successful.").then(r => console.log(r));
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.message || "Network error. Please try again.";
        messageApi.error(errorMessage).then(r => console.log(r));
      });
  };

  return (
    <div className="signin-container">
      <div className="signin-content">
        <h2>Sign up</h2>
        <Form onFinish={onSubmitLogin}>
          <Form.Item name="name">
            <Input className="signin-input" placeholder="Name" />
          </Form.Item>
          <Form.Item name="username">
            <Input className="signin-input" placeholder="Username" />
          </Form.Item>
          <Form.Item name="email">
            <Input className="signin-input" placeholder="Email" />
          </Form.Item>
          <Form.Item name="password">
            <Input.Password className="signin-input" placeholder="Password" />
          </Form.Item>
          <Form.Item name="retypePassword">
            <Input.Password className="signin-input" placeholder="Retype Password" />
          </Form.Item>
          {contextHolder}
          <Button className="signin-button" htmlType="submit">
            Sign Up
          </Button>
          <Link href="/sign-in" className="forgot-password">
            Back to Sign In
          </Link>
        </Form>
      </div>
    </div>
  );
}
