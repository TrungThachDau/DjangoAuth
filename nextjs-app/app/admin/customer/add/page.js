"use client";
import NavBar from "@/components/nav_bar.js";
import { Button, DatePicker, Form, Input, message } from "antd";
import axiosInstance from "@/axios.js";
import dayjs from "dayjs";
import { refreshToken } from "@/services/authentication.js";
import { useState } from "react";
import { useRouter } from "next/navigation";
import '@ant-design/v5-patch-for-react-19';
import './page.css';

const AddCustomer = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmitCustomer = async (values) => {
    if (!values.name || !values.phone || !values.address || !values.date) {
      messageApi.error("Please fill in all fields");
      return;
    }

    if (values.phone.length < 10 || values.phone.length >10) {
      messageApi.error("Phone number must be 10 digits");
      return;
    }

    const submitData = async (token) => {
      await axiosInstance.post(
        "customer/",
        {
          name: values.name,
          phone: values.phone,
          address: values.address,
          date: dayjs(values.date).format("YYYY-MM-DD"),
          email: values.email,
          username: values.username,
        },
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
    };

    setLoading(true); 
    try {
      
      await submitData(requestAnimationFrame.get("accessToken"));
      messageApi.success("Customer added successfully. Default password is 123456. Please change it.");
    } catch (error) {
      if (error.response?.status === 401) {
        try {
          const newToken = await refreshToken();
          sessionStorage.setItem("accessToken", newToken);
          await submitData(newToken);

          messageApi.success("Customer added successfully. Default password is 123456. Please change it.");
          
        } catch (refreshError) {
          messageApi.error("Failed to refresh token. Please log in again.");
          console.error("Error refreshing token:", refreshError);
          router.push("/auth/sign-in"); 
        }
      } else {
        messageApi.error(error.response?.data?.message || "An error occurred");
        console.error("Error adding customer:", error);
      }
    } finally {
      setLoading(false); 
    }
  };
  return (
    <>
      <NavBar />
      <div className="signin-container">
        <div className="signin-content">
          <Form onFinish={onSubmitCustomer}>
            <h3>Add new customer</h3>
            <Form.Item name="name">
              <Input className="signin-input" placeholder="Name" />
            </Form.Item>
            <Form.Item name="username">
              <Input className="signin-input" placeholder="Username" />
            </Form.Item>
            <Form.Item name="address">
              <Input className="signin-input" placeholder="Address" />
            </Form.Item>
            <Form.Item name="email">
              <Input className="signin-input" placeholder="Email" />
            </Form.Item>
            <Form.Item name="phone">
              <Input className="signin-input" placeholder="Phone" />
            </Form.Item>
            <Form.Item name="date">
              <DatePicker className="signin-input" />
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
        </div>
      </div>
    </>
  );
};

export default AddCustomer;