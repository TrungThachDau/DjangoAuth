import './styles.css';
import { Button, Input, Form, message } from 'antd';
import axiosInstance from '@/axios';
import NavBar from "@/components/nav_bar";
import { useState } from 'react';

export default function ChangePassword() {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);

  const onSubmitChange = async (values) => {
    if (!values.old_password || !values.new_password) {
      messageApi.error('Please fill in both old and new passwords').then(r => console.log(r));
      return;
    }

    const username = sessionStorage.getItem('username');
    const accessToken = sessionStorage.getItem('accessToken');

    if (!username || !accessToken) {
      messageApi.error('You are not logged in. Please log in first.').then(r => console.log(r));
      return;
    }

    setLoading(true); 
    try {
      await axiosInstance.post('/auth/change-password/', {
        username: username,
        old_password: values.old_password,
        new_password: values.new_password,
      }, {
        headers: { Authorization: "Bearer " + accessToken }
      });
      messageApi.success('Change successful').then(r => console.log(r));
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
      messageApi.error(errorMessage).then(r => console.log(r));
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

