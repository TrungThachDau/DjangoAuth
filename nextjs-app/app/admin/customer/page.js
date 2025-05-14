"use client";
import React, { useEffect, useState } from "react";
import NavBar from "@/components/nav_bar.js";
import { Button, Modal, Space, Table, message } from "antd";
import axiosInstance from "@/axios.js";
import Link  from "next/link";
import {refreshToken} from "@/services/authentication.js";
import { getAllCustomers } from "@/services/customer_management.js";
import { useRouter } from "next/navigation";
import '@ant-design/v5-patch-for-react-19';
const Customer = () => {
  const [data, setData] = useState([]);
  const [customerId, setCustomerId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
    const router = useRouter();
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
      const response = await fetch(`/api/customers/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete customer');
      }
      
      messageApi.success("Customer deleted successfully");
      setData(data.filter((item) => item.id !== id));
    } catch (error) {
      messageApi.error(error.message || 'An error occurred while deleting the customer');
    } finally {
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
      render: (_, record) => (
        <Link
          href={`customer/${record.id}`}
          style={{ color: "blue", textDecoration: "underline" }}
        >
          {record.account?.name}
        </Link>
      ),
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
            <Link href={`customer/edit/${record.id}`}>Edit</Link>
          </Button>
        </Space>
      ),
    },
  ];
  const fetchCustomerData = async () => {
    try {
      setLoading(true);
      const response = await getAllCustomers();
      if(response){
        setData(response.data);
      }
      return response.data; 
    } catch (error) {
      messageApi.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerData();
  }, []);

  return (
    <div>
      <NavBar />
      <div style={{ padding: "30px" }}>
        <Link href="customer/add/">
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