import React, { useEffect, useState } from "react";
import NavBar from "../../components/nav_bar/nav_bar.jsx";
import { Button, Modal, Space, Table, message } from "antd";
import axiosInstance from "../../axios.js";
import { Link } from "react-router-dom";

const Customer = () => {
  const [data, setData] = useState([]);
  const [customerId, setCustomerId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const showModal = (id) => {
    setCustomerId(id);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    deleteCustomer(customerId);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const deleteCustomer = (id) => {
    axiosInstance
      .delete(`customer/${id}/`, {
        headers: { Authorization: "Bearer " + sessionStorage.getItem("accessToken") },
      })
      .then(() => {
        messageApi.success("Customer deleted successfully").then(r => (console.log(r)));
        setData(data.filter((item) => item.id !== id));
      })
      .catch((error) => {
        messageApi.error(error.response?.data?.message || "An error occurred");
      });
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
      render: (text, record) => <Link to={`/customer/${record.id}`}>{text}</Link>,
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
            <Link to={`/customer/update/${record.id}`}>Edit</Link>
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    axiosInstance
      .get("customer/", {
        headers: { Authorization: "Bearer " + sessionStorage.getItem("accessToken") },
      })
      .then((response) => {
        setData(response.data);
        localStorage.setItem("customerData", JSON.stringify(response.data));
      })
      .catch((error) => {
        console.error("Error fetching customer data:", error);
      });
  }, []);

  return (
    <div>
      <NavBar />
      <div style={{ padding: "30px" }}>
        <Link to="/customer/add">
          <Button type="primary" style={{ marginBottom: "20px" }}>
            Add Customer
          </Button>
        </Link>
        <Table dataSource={data} columns={columns} rowKey="id" />
      </div>
      <Modal title="Delete" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>Are you sure you want to delete this customer?</p>
      </Modal>
      {contextHolder}
    </div>
  );
};

export default Customer;