import {React, useEffect, useState} from 'react';
import NavBar from "@/components/nav_bar";
import Link  from "next/link";
import {Button, Modal, Space, Table, Upload, message} from "antd";
import { UploadOutlined } from '@ant-design/icons';
import axiosInstance from "@/axios.js";
const ContentPage = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
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
    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get("auth/get_all_files/", {
                headers: { Authorization: "Bearer " + sessionStorage.getItem("accessToken") },
            });
            setData(response.data.data);
            console.log(response.data.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(()=>{
        fetchData().then(r =>
        console.log("Data fetched successfully")
        ).catch(e => {
            console.log("Error fetching data", e)
        });
    },[]);
    const handleUploadChange = async ({ file, fileList }) => {
        const formData = new FormData();
        fileList.forEach((file) => {
            formData.append("files", file.originFileObj);
        });
        formData.append("bucket_name", "images");

        try {
            const response = await axiosInstance.post("auth/upload_multi_file/", formData, {
                headers: {
                    Authorization: "Bearer " + sessionStorage.getItem("accessToken"),
                    "Content-Type": "multipart/form-data",
                },
            });
            message.success(`$file uploaded successfully`);
            fetchData();

        } catch (error) {
            
            message.error(`${info.file.name} file upload failed.`);
        }
    };
    return (
        <div>
            <NavBar />
            <div style={{ padding: "30px" }}>
            <Upload 
                onChange={handleUploadChange} // Use onChange instead of customRequest
                listType="picture"
                maxCount={3}
                multiple
            >
                <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
                <Table dataSource={data} columns={columns} rowKey="id" loading={loading} />
            </div>
        </div>
  );
}

export default ContentPage;