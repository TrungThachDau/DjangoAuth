import {React, useEffect, useState} from 'react';
import NavBar from "@/components/nav_bar";
import Link  from "next/link";
import {Button, Modal, Space, Table, message, Form, Upload} from "antd";
import { UploadOutlined } from '@ant-design/icons';
import Image from 'next/image';
import axiosInstance from "@/axios.js";

const ContentPage = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [fileList, setFileList] = useState([
      {
        uid: '-1',
        name: 'xxx.png',
        status: 'done',
        url: 'http://www.baidu.com/xxx.png',
      },
    ]);

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Owner",
            dataIndex: "account",
            key: "account",
            render: (text, record) => <Link href={`/customer/${record.id}`}>{text}</Link>,
        },
        {
            title: "Updated At",
            dataIndex: "updated_at",
            key: "updated_at",
        },
        {
            title: "Address",
            dataIndex: "address",
            key: "address",
        },
        {
            title: "Status",
            key: "status",
            dataIndex: "status",
            render: (status) => <span>{status.status || status}</span>,
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
    useEffect(()=>{
        const fetchData = async () => {
          try {
            setLoading(true);
            const response = await axiosInstance.get("auth/get_all_files/", {
              headers: { Authorization: "Bearer " + sessionStorage.getItem("accessToken") },
            });
            setData(response.data.data);
            console.log(response.data.data);
            //localStorage.setItem("customerData", JSON.stringify(response.data));
          } catch (error) {
            console.log(error);
          } finally {
            setLoading(false);
          }
        };
        fetchData();
    },[]);
    const handleUploadChange = async (info) => {
        if (info.file.status === "done") {
          message.success(`${info.file.name} file uploaded successfully`);
          setFileList(info.fileList);
        } else if (info.file.status === "error") {
          message.error(`${info.file.name} file upload failed.`);
        }
      };
    return (
        <div>
            <NavBar />
            <div style={{ padding: "30px" }}>
            <Upload
              action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
              listType="picture"
              maxCount={3}
              multiple
              onChange={handleUploadChange}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
                <Table dataSource={data} columns={columns} rowKey="id" loading={loading} />
            </div>
        </div>
  );
}

export default ContentPage;