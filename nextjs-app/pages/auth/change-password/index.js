import axiosInstance from '@/axios';
import NavBar from "@/components/nav_bar";
import { Button, Form, Input, message } from 'antd';
import { useRouter } from 'next/router';
import { useState } from 'react';
import './styles.css';

export default function ChangePassword() {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmitChange = async (values) => {
    if (!values.old_password || !values.new_password) {
      messageApi.error('Please fill in both old and new passwords');
      return;
    }

    const username = sessionStorage.getItem('username');
    const accessToken = sessionStorage.getItem('accessToken');

    if (!username || !accessToken) {
      messageApi.error('You are not logged in. Please log in first.');
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post('/auth/change-password/', {
        accessToken:accessToken,
        old_password: values.old_password,
        new_password: values.new_password,
      }, {
        headers: { Authorization: "Bearer " + accessToken }
      });
      messageApi.success('Change successful');
      await router.push("/customer/");
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
      messageApi.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className='signin-container'>
        <div className='signin-content'>
          <h2>Change password</h2>
          <Form onFinish={onSubmitChange}>
            <Form.Item name="old_password">
              <Input.Password className='signin-input' placeholder='Old password' />
            </Form.Item>
            <Form.Item name="new_password">
              <Input.Password className='signin-input' placeholder='New password' />
            </Form.Item>
            {contextHolder}
            <Button
              className='signin-button'
              htmlType="submit"
              loading={loading}
              disabled={loading}
            >
              Submit
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
}

