"use client"
import React, { useEffect, useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Tag } from 'antd';
import Highlighter from 'react-highlight-words';
import '@ant-design/v5-patch-for-react-19';
import styles from "./page.module.css";
import dayjs from 'dayjs';
import axiosInstance from "@/axios.js";
export default function Home() {
  

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [datax, setData] = useState([]);
    const data = [
      {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        extension:'JPG',
      },
      {
        key: '2',
        name: 'Joe Black',
        age: 42,
        address: 'London No. 1 Lake Park',
        extension:'JPG',
      },
      {
        key: '3',
        name: 'Jim Green',
        age: 32,
        address: 'Sydney No. 1 Lake Park',
        extension:'JPG',
      },
      {
        key: '4',
        name: 'Jim Red',
        age: 32,
        address: 'London No. 2 Lake Park',
        extension:'JPG',
      },
    ];
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
        Object.assign(
          { title: 'Updated at', dataIndex: 'updated_at', key: 'updated_at', width: '20%' },
        ),
        {
          sorter: (a, b) => a.address.length - b.address.length,
        },
      ),
    ];
    useEffect(() => {
      const fetchCustomerData = async () => {
        try {
          //setLoading(true);
          const response = await axiosInstance.get("get_all_files/",{
              
          });
          setData(response.data.data);
        } catch (error) {
          //await handleApiError(error, fetchCustomerData);
        } finally {
          //setLoading(false);
        }
      };
      fetchCustomerData();
    }, []);
  return (
    <div>
            <div>
            <Table 
            columns={columns} 
            dataSource={datax.map((item, index) => ({ ...item, key: index }))} 
            onRow={(record => {
              return {
                onClick: event => {
                  console.log(record);
                },
              };

            }
            )}
            />
            </div>
    </div>
  )
}
