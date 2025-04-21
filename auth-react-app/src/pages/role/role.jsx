import NavBar from "../../components/nav_bar/nav_bar.jsx";
import {Link} from "react-router-dom";
import {Button, message, Modal, Space, Table} from "antd";
import React, {useEffect, useState} from "react";
import axiosInstance from "../../axios.js";
import {refreshToken} from "../../services/authencation.js";


const RoleEmployee = () => {
      const [data, setData] = useState([]);
      const [customerId, setCustomerId] = useState(null);
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [messageApi, contextHolder] = message.useMessage();
     const showModal = (id) => {
    setCustomerId(id);
    setIsModalOpen(true);
    };

    const handleOk = () => {
    //deleteCustomer(customerId);
    setIsModalOpen(false);
    };

    const handleCancel = () => {
    setIsModalOpen(false);
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
    // {
    //   title: "Action",
    //   key: "action",
    //   render: (_, record) => (
    //     <Space size="middle">
    //       <Button type="primary" onClick={() => showModal(record.id)}>
    //         Delete
    //       </Button>
    //       <Button type="primary">
    //         <Link to={`/customer/update/${record.id}`}>Edit</Link>
    //       </Button>
    //     </Space>
    //   ),
    // },
  ];
    useEffect(() => {
    const fetchRoleData = async () => {
      try {
        const response = await axiosInstance.get("employee_role/", {
          headers: { Authorization: "Bearer " + sessionStorage.getItem("accessToken") },
        });
        setData(response.data);
        localStorage.setItem("customerData", JSON.stringify(response.data));
      } catch (error) {
        if (error.response?.status === 401) {
          try {
            const newToken = await refreshToken();
            sessionStorage.setItem("accessToken", newToken);
            await fetchRoleData();
          } catch (refreshError) {
            console.error("Error refreshing token:", refreshError);
          }
        } else {
          console.error("Error fetching customer data:", error);
        }
      }
    };

    fetchRoleData();
  }, []);
    return (
    <div>
      <NavBar />
      <div style={{ padding: "30px" }}>
        {/*<Link to="/customer/add">*/}
        {/*  <Button type="primary" style={{ marginBottom: "20px" }}>*/}
        {/*    Add Role Employee*/}
        {/*  </Button>*/}
        {/*</Link>*/}
        <Table dataSource={data} columns={columns} rowKey="id" />
      </div>
      <Modal title="Delete" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>Are you sure you want to delete this customer?</p>
      </Modal>
      {contextHolder}
    </div>
  );

}


export default RoleEmployee;