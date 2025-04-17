import React, { useEffect, useState } from "react";
import NavBar from "../../components/nav_bar/nav_bar.jsx";
import { Row, Space, Table, Tag } from "antd";
import axiosInstance from "../../axios.js";

const Customer = () => {
  const [data, setData] = useState([]);

  const columns = [
    {
      title: "Id",
      dataIndex:"id",
      key: "id",

    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
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
          <a>Detail</a>
          <a>Delete</a>
          <a>Edit</a>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    axiosInstance
      .get("customer/",{
        headers: {Authorization: "Bearer " + sessionStorage.getItem("accessToken")}
      })
      .then((response) => {
        if(response.status===401){
            console.log("refresh token");
            axiosInstance.post('token/refresh/',{
                refresh: sessionStorage.getItem("refreshToken")
            }).then((response) => {
                sessionStorage.setItem("accessToken", response.data.access);
                console.log("new access token: ",response.data.access);
            }).catch((error) => {
                console.error("Error refreshing token:", error);
            }
            );
        }
        // Update the table data
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching customer data:", error);
      });
  }, []);

  return (
    <div>
      <NavBar />
      <div style={{ padding: "30px" }}>
        <Table dataSource={data} columns={columns} rowKey="id" />
      </div>
    </div>
  );
};

export default Customer;