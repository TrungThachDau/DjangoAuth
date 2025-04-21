import React, { useEffect, useState } from "react";
import NavBar from "@/components/nav_bar";
import { Button, Modal, Space, Table, message } from "antd";
import axiosInstance from "@/axios.js";
import Link  from "next/link";
import {refreshToken} from "@/services/authentication";

const Customer = () => {
  const [data, setData] = useState([]);
  const [customerId, setCustomerId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const showModal = (id) => {
    setCustomerId(id);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setLoading(true);
    deleteCustomer(customerId);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const deleteCustomer = async (id) => {
    try {
      setLoading(true);
      await axiosInstance.delete(`customer/${id}/`, {
        headers: { Authorization: "Bearer " + sessionStorage.getItem("accessToken") },
      });
      messageApi.success("Customer deleted successfully");
      setData(data.filter((item) => item.id !== id));
    } catch (error) {
      if (error.response?.status === 401) {
        try {
          
          const newToken = await refreshToken();
          sessionStorage.setItem("accessToken", newToken);
          await axiosInstance.delete(`customer/${id}/`, {
            headers: { Authorization: "Bearer " + newToken },
          });
          
          messageApi.success("Customer deleted successfully");
          setData(data.filter((item) => item.id !== id));
          setLoading(false);
        } catch (refreshError) {
          messageApi.error("Failed to refresh token. Please log in again.");
          console.error("Error refreshing token:", refreshError);
        }
        finally{
          setLoading(false);
        }
      } else {
        messageApi.error(error.response?.data?.message || "An error occurred");
        console.error("Error deleting customer:", error);
      }
    }
    finally{
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => <Link href={`/customer/${record.id}`}>{text}</Link>,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Date",
      key: "date",
      dataIndex: "date",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => showModal(record.id)}>
            Delete
          </Button>
          <Button type="primary">
            <Link href={`/customer/edit/${record.id}`}>Edit</Link>
          </Button>
        </Space>
      ),
    },
  ];
  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("customer/", {
          headers: { Authorization: "Bearer " + sessionStorage.getItem("accessToken") },
        });
        setData(response.data);
        localStorage.setItem("customerData", JSON.stringify(response.data));
      } catch (error) {
        if (error.response?.status === 401) {
          try {
            const newToken = await refreshToken();
            sessionStorage.setItem("accessToken", newToken);
            await fetchCustomerData();
          } catch (refreshError) {
            console.error("Error refreshing token:", refreshError);
          }
        } else {
            messageApi.error(error.response?.data?.message || "An error occurred");
            console.error("Error fetching customer data:", error);
        }

      }
      finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, []);


  return (
    <div>
      <NavBar />
      <div style={{ padding: "30px" }}>
        <Link href="/customer/add">
          <Button type="primary" style={{ marginBottom: "20px" }}>
            Add Customer
          </Button>
        </Link>
        <Table dataSource={data} columns={columns} rowKey="id" loading={loading} />
      </div>
      <Modal title="Delete" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>Are you sure you want to delete this customer?</p>
      </Modal>
      {contextHolder}
    </div>
  );
};

export default Customer;