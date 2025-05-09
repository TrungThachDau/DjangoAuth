"use client";
import '@ant-design/v5-patch-for-react-19';
// app/content/page.js
import { useState, useEffect, useRef } from "react";
import { Button, Input, Space, Table, Tag, Upload, notification, message } from "antd";
import { SearchOutlined, UploadOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import Highlighter from "react-highlight-words";
import axiosInstance from "@/axios";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import NavBar from "@/components/nav_bar";

const Content = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [fileList, setFileList] = useState([]);
  const searchInput = useRef(null);
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("auth/get_all_files/", {
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
    
    fetchData();
  }, []);

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name', width: '30%', ...getColumnSearchProps('name') },
    { title: 'Extension', dataIndex: 'extension', key:'extension', render: (_, { extension }) => <Tag color="blue">{extension.toUpperCase()}</Tag> },
    { title: 'Owner', dataIndex: 'account', key: 'account', width: '20%', render: (account) => account.name || account.email },
    { title: 'Updated at', dataIndex: 'updated_at', key:'updated_at', render: text => dayjs(text).format('YYYY-MM-DD HH:mm:ss') },
    { title: 'Status', dataIndex: 'status', key:'status', render: (_, { status }) => <Tag color={status === 'active' ? 'green' : 'red'}>{status}</Tag> },
  ];

  return (
    <div>
      <NavBar />
      <Space style={{ paddingTop: 20, paddingLeft: 20 }}>
        <Upload
          listType="picture"
          multiple
          fileList={fileList}
          onChange={(info) => setFileList(info.fileList)}
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
            onRow={(record) => ({
              onClick: () => router.push(`/view/${record.id}`)
            })}
          />
        </Col>
      </Row>
      {contextHolder}
    </div>
  );
};

export default Content;
