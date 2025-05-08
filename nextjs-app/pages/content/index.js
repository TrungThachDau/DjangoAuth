import NavBar from "@/components/nav_bar";
import {SearchOutlined, UploadOutlined} from '@ant-design/icons';
import {Button, Input, Space, Table, Tag, Upload, notification, message} from "antd";
import { Col, Row } from 'antd';
import React, {useEffect, useState, useRef} from "react";
import Highlighter from "react-highlight-words";
import axiosInstance from "@/axios";
import dayjs from "dayjs";
import { useRouter } from "next/router";
const Content = () => {
    const Context = React.createContext({ name: 'Default' });
    const [data, setData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [loading, setLoading] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const [fileList, setFileList] = useState([]);
    const [uploadList, setUploadList] = useState(true);
    const searchInput = useRef(null);
    const router = useRouter();
    const [message, setMessage] = useState('');
    const openNotification = (message,description) => {
        api.info({
          message: <Context.Consumer>{message}</Context.Consumer>,
          description: <Context.Consumer>{description}</Context.Consumer>,
          placement:"bottomRight"
        });
      };
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
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
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
            <Button
              onClick={() => clearFilters && handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                confirm({ closeDropdown: false });
                setSearchText(selectedKeys[0]);
                setSearchedColumn(dataIndex);
              }}
            >
              Filter
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                close();
              }}
            >
              close
            </Button>
          </Space>
        </div>
      ),
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
      onFilter: (value, record) =>
        record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
      filterDropdownProps: {
        onOpenChange(open) {
          if (open) {
            setTimeout(() => {
              var _a;
              return (_a = searchInput.current) === null || _a === void 0 ? void 0 : _a.select();
            }, 100);
          }
        },
      },
      render: text =>
        searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ''}
          />
        ) : (
          text
        ),
    });
    const props = {
        onChange: async (info) => {
          try {
            setUploadList(true);
            const { fileList } = info;
      
            // Ensure fileList is valid
            if (!fileList || !fileList.length) {
              message.error("No files selected for upload.");
              return;
            }
      
            setFileList(fileList);
      
            const formData = new FormData();
            fileList.forEach((file) => {
              if (file.originFileObj) {
                formData.append("files", file.originFileObj);
              }
            });
            formData.append("bucket_name", "images");
      
            const accessToken = sessionStorage.getItem("accessToken");
            if (!accessToken) {
              message.error("Authentication token is missing.");
              return;
            }
      
            const response = await axiosInstance.post("auth/upload_multi_file/", formData, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "multipart/form-data",
              },
            });
      
            console.log(response.data);
            
            message.success(`${fileList.length} file(s) uploaded successfully`);
      
            // Optionally fetch updated data
            // await fetchData();
          } catch (error) {
            
            setMessage(error.message);
        
          } finally {
            setUploadList(false);
          }
        },
      };
    const handleUploadChange = async (info) => {
        setUploadList(true);
        const { fileList } = info;
        setFileList(fileList);
        const formData = new FormData();
        fileList.forEach((file) => {
            formData.append("files", file.originFileObj);
        });
        formData.append("bucket_name", "images");
    };

    useEffect(() => {
        let isMounted = true;
        const fetchCustomerData = async () => {
          try {
            setLoading(true);
            const response = await axiosInstance.get("auth/get_all_files/", {
              headers: { Authorization: "Bearer " + sessionStorage.getItem("accessToken") },
            });
            if (isMounted) {
              setData(response.data.data);
            }
          } catch (error) {
            console.error("Error fetching customer data:", error); // Ghi log lỗi
            notification.error({
              message: "Error",
              description: "Failed to fetch customer data. Please try again later.",
            });
          } finally {
            if (isMounted) {
              setLoading(false)
            }
          }
        };
      
        fetchCustomerData();
        return () => {
          isMounted = false;
        };
      }, []);
    const columns = [
        Object.assign(
          { title: 'Name', dataIndex: 'name', key: 'name', width: '30%' },
          getColumnSearchProps('name'),
        ),
        Object.assign(
          {
            title: 'Extension',
            dataIndex: 'extension',
            width: '5%',
            render: (_, { extension }) => (
              <Tag color="blue" key={extension}>
                {extension.toUpperCase()}
              </Tag>
            ),
          },
        ),
        Object.assign(
          { title: 'Owner', dataIndex: 'account', key: 'account', width: '20%' },
  
        ),
        Object.assign(
          {
            title: 'Updated at',
            dataIndex: 'updated_at',
            key: 'updated_at',
            width: '20%',
            render: (text) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
          },
          {
            sorter: (a, b) => new Date(a.updated_at) - new Date(b.updated_at), 
          },
        ),
      ];
    return(
        <div >
                
                <NavBar/>

                    <Space style={{ paddingTop: 20, paddingLeft: 20 }}>
                    <Upload
                        {...props}
                        onRemove={(file) => {
                            setFileList((prev) => prev.filter((item) => item.uid !== file.uid)); 
                        }}
                        listType="picture"
                        maxCount={3}
                        multiple
                        fileList={fileList}
                        
                    >
                        <Button icon={<UploadOutlined />}>Upload</Button>
                    </Upload>
                    </Space>
                    <Row style={{  }} wrap={false}>
                        <Col span={24}>
                            <Table
                            style={{ padding: 20, paddingTop: 30 }}
                            columns={columns}
                            dataSource={data.map((item, index) => ({ ...item, key: index }))}
                            loading={loading}
                            onRow={(record => {
                            
                            return {
                                onClick: event => {
                                openNotification('topRight');
                                //Route to view
                                router.push(`/view/${record.id}`);
                                },
                            };
                            }
                            )}
                            />
                        </Col>
                        
                    </Row>
                    
                    
                        
                    
                
            
                    {contextHolder}
        </div>
    );
}



export default Content;