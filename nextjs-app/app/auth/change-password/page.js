"use client";
import NavBar from "@/components/nav_bar.js";
import { Button, Form, Input, message } from 'antd';
import { useState } from 'react';
import './page.css';
import { changePassword } from "@/services/authentication";
import '@ant-design/v5-patch-for-react-19';
export default function ChangePassword() {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);

  const onSubmitChange = async (values) => {
    if (!values.old_password || !values.new_password) {
      messageApi.error('Please fill in both old and new passwords');
      return;
    }

    setLoading(true);
    try{
      const response = await changePassword(values.old_password, values.new_password);
      if(response.status === 201){
        messageApi.success('Change successful');
      }
      else{
        messageApi.error('An error occurred. Please try again.');
      }
    }
    catch(error){
      messageApi.error('An error occurred. Please try again.');
    }
    finally{
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

