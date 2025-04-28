import { getTranslations } from '@/lib/i18n';
import { signIn } from "@/services/authentication";
import { Button, Form, Input, message, Modal, Spin } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import "./sign_in.css";
export default function SignIn() {
  const {locale} = useRouter();
  const t = getTranslations(locale);
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [open, setOpen] = useState(false);
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
      return messageApi.error(t.sign_in_validate_error);
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
          messageApi.success(t.sign_in_success);
          await router.push("/customer/");
        }
      } else {
        messageApi.error(t.sign_in_failed);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        messageApi.error(t.invalid_credentials);
      } else if (error.response?.data?.message === "Password has not been changed") {
        showModal();
      } else {
        messageApi.error("Error during sign-in" || t.sign_in_error);
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
          <h2>{t.sign_in_title}</h2>
          <Form onFinish={onSubmitLogin}>
            <Form.Item name="username">
              <Input className="signin-input" placeholder={`${t["username_placeholder"]}`} />
            </Form.Item>
            <Form.Item name="password">
              <Input.Password className="signin-input" placeholder={`${t["password_placeholder"]}`} />
            </Form.Item>
            {contextHolder}
            <Button className="signin-button" htmlType="submit" disabled={loading}>
              {loading ? <Spin size="small" /> : t.sign_in_button}
            </Button>
            <Link href="/auth/reset-password" className="forgot-password">
              {t.rspw}
            </Link>
            <Link href="/auth/sign-up" className="forgot-password">
                {t.create_account}
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

