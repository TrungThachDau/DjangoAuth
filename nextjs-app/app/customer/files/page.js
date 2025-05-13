"use client";

// app/content/page.js
import { useState, useEffect, useRef } from "react";
import { Button, Input, Space, Table, Tag, Upload, notification, message, Dropdown } from "antd";
import { SearchOutlined, UploadOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import Highlighter from "react-highlight-words";
import axiosInstance from "@/axios";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import NavBar from "@/components/nav_bar";
import { MoreOutlined } from '@ant-design/icons';
import '@ant-design/v5-patch-for-react-19';
import {calculateSHA256} from "@/utils/checksum";
const CustomerFiles = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [fileList, setFileList] = useState([]);
  const [updatingRecord, setUpdatingRecord] = useState(null);
  const searchInput = useRef(null);
  const hiddenUploadRef = useRef();
  const router = useRouter();
  
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  
  const handleReset = clearFilters => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
    onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    render: text => (
      searchedColumn === dataIndex
        ? <Highlighter highlightStyle={{ backgroundColor: '#ffc069' }} searchWords={[searchText]} textToHighlight={text ? text.toString() : ''} />
        : text
    ),
  });
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("file/get/", {
        headers: { Authorization: "Bearer " + sessionStorage.getItem("accessToken") },
      });
      const files = response.data.data.map(item => ({
        ...item,
        key: item.id,
      }));
      setData(files);
    } catch (error) {
      notification.error({ message: "Error", description: "Failed to fetch data." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateFile = (record) => {
    setUpdatingRecord(record);
    hiddenUploadRef.current?.click();
  };

  const handleHiddenUploadChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !updatingRecord) return;
    const token = sessionStorage.getItem("accessToken");
    const formData = new FormData();
    // formData.append('checksum', checksum);
    formData.append('file', file);
    formData.append('object_id', updatingRecord.id);
    try {
      await axiosInstance.post("file/update/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });
      notification.success({ message: "Success", description: "File updated successfully." });
      fetchData();
    } catch (err) {
      notification.error({ message: "Error", description: "Failed to update file." });
    } finally {
      setUpdatingRecord(null);
      e.target.value = ""; // reset input
    }
  };

  const getActionItems = (record) => [
    {
      key: '1',
      label: (
        <a
          className="nav-link"
          style={{
            color: (record.status === 'pending' || record.status === 'rejected') ? undefined : '#ccc',
            pointerEvents: (record.status === 'pending' || record.status === 'rejected') ? 'auto' : 'none'
          }}
          onClick={() => handleUpdateFile(record)}
        >
          Update new file
        </a>
      ),
      disabled: record.status === 'pending' || record.status === 'rejected',
    },
    {
      key: '2',
      label: (
        <a
          className="nav-link"
          style={{
            color: record.status === 'rejected' ? undefined : '#ccc',
            pointerEvents: record.status === 'rejected' ? 'auto' : 'none'
          }}
          onClick={async (e) => {
            e.preventDefault();
            if (record.status === 'rejected') {
              try {
                await axiosInstance.post(
                  `file/delete/`,
                  {
                      object_id:record.id
                  },
                  {
                    headers: { Authorization: "Bearer " + sessionStorage.getItem("accessToken") },
                  }
                  
                );
                notification.success({ message: "Deleted", description: "File deleted successfully." });
                fetchData();
              } catch (error) {
                notification.error({ message: "Error", description: "Failed to delete file." });
              }
            }
          }}
        >
          Delete
        </a>
      ),
      disabled: record.status !== 'rejected',
    },
  ];

  const columns = [
    { 
      title: 'Name', 
      dataIndex: 'name', 
      key: 'name', 
      width: '30%', 
      ...getColumnSearchProps('name'),
      render: (_,{name,id}) => (
        <a 
          href={`/view/${name}`} 
          style={{ color: 'blue', textDecoration: 'underline' }}
          onClick={e => {
            e.preventDefault();
            router.push(`/view/${id}`);
          }}
        >
          {name}
        </a>
      )
    },
    { title: 'Extension', dataIndex: 'extension', key:'extension', render: (_, { extension }) => <Tag color="blue">{extension.toUpperCase()}</Tag> },
    { title: 'Owner', dataIndex: 'account', key: 'account', width: '20%', render: (account) => account.name || account.email },
    { title: 'Updated at', dataIndex: 'updated_at', key:'updated_at', render: (updated_at) =>  dayjs(updated_at).format('h:mm a DD/MM/YYYY') },
    { title: 'Status', dataIndex: 'status', key:'status', render: (_, { status }) => 
    <Tag color={
        status === 'accepted' ? 'green' :
        status === 'rejected' ? 'red' :
        status === 'pending' ? 'orange' :
        'default'
      }>
      {status}
    </Tag> 
    },
    {
      title: 'Actions',
      key: 'action',
      render: (_, record) => (
        <Dropdown menu={{ items: getActionItems(record) }}>
          <a onClick={e => e.preventDefault()} style={{ color: 'white' }}>
            <Space>
              {/* {record.status === 'accepted' ? 'Accepted' : record.status === 'rejected' ? 'Rejected' : 'Pending'} */}
              <MoreOutlined  style={{ color: 'black' }} />
            </Space>
          </a>
        </Dropdown>
      ),
    }
  ];
  const handleUploadChange = async (info) => {
    setFileList(info.fileList);
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
      setFileList([]); 
      try {
        await fetchData();
      } catch (err) {
        message.error("Failed to refresh data.");
      }
    } else if (info.file.status === 'error') {
      const errorMessage = info.file.error?.message || `${info.file.name} file upload failed.`;
      message.error(errorMessage);
    }
  };
  return (
    <div>
      <NavBar />
      <Space style={{ paddingTop: 20, paddingLeft: 20 }}>
      <Upload
        accept=".jpg,.png,.jpeg,.gif,.mp3,mp4,.json"
        multiple
        fileList={fileList}
        onChange={handleUploadChange}

        customRequest={async ({ file, onSuccess, onError, onProgress }) => {
          const token = sessionStorage.getItem("accessToken");
          if (!token) {
            onError({ message: "Missing access token. Please log in again." });
            return;
          }
          //Checksum sha-256
          // const checksum = await calculateSHA256(file);
          const formData = new FormData();
          // formData.append('checksum', checksum);

          formData.append('files', file);
          try {
            await axiosInstance.post("file/upload/", formData, {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
              },UploadProgress: (progressEvent) => {

                const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);(percent);
                onProgress(percent);
            }});
            onSuccess();
          } catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to upload file. Please try again.";
            onError({ message: errorMessage });
          }
        }}
      >
        <Button icon={<UploadOutlined />}>Upload</Button>
      </Upload>
      </Space>
      <Row>
        <Col span={24}>
          <Table
            columns={columns}
            dataSource={data}
            loading={loading}
            // onRow={(record) => ({
            //   onClick: () => router.push(`/view/${record.id}`)
            // })}
          />
        </Col>
      </Row>
      <input
        type="file"
        ref={hiddenUploadRef}
        style={{ display: 'none' }}
        accept=".jpg,.png,.jpeg,.gif,.mp3,mp4,.json"
        onChange={handleHiddenUploadChange}
      />
      {contextHolder}
    </div>
  );
};

export default CustomerFiles;
