"use client"
import { Button, Input, Space, Table, Tag } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import '@ant-design/v5-patch-for-react-19';
import dayjs from 'dayjs';
import { useRouter } from "next/navigation";
import {SearchOutlined} from "@ant-design/icons";
export default function TableComponent({ data }) {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const router = useRouter();
    const [tableData, setTableData] = useState(Array.isArray(data) ? data : []);

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
      { title: '', dataIndex: 'thumbnail_url', width: '5%', key: 'thumbnail_url', render: (thumbnail_url) => (
        thumbnail_url !== null && thumbnail_url !== undefined ? (
          <img src={thumbnail_url} alt="No review" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
        ) : (
          <a></a>
        )
      ) },
      //getColumnSearchProps('name'),
      ),
      Object.assign(
      { title: 'Name', dataIndex: 'name', key: 'name', width: '30%',render:(name)=>(
        name
      ) },
      getColumnSearchProps('name'),
      ),
      Object.assign(
      {
        title: 'Extension',
        dataIndex: 'extension',
        width: '5%',
        render: (_, { extension }) => (
        extension.toUpperCase()
        ),
      },
      ),
      Object.assign(
      { 
        title: 'Owner', 
        dataIndex: 'account', 
        key: 'account', 
        width: '10%',
        render: (account) => (
        account.name
        ),
      }
      ),
      Object.assign(
      Object.assign(
        { title: 'Updated at', dataIndex: 'updated_at', key: 'updated_at', width: '20%',render: (_, { updated_at }) => (
        
          dayjs(updated_at).format('h:mm a DD/MM/YYYY')
        
          )
        },
      ),
      {
        sorter: (a, b) => a.address.length - b.address.length,
      },
      ),
    ];
    return(
        <>
            <div>
                <Table
                    columns={columns}
                    dataSource={Array.isArray(tableData) ? tableData.map((item, index) => ({ ...item, key: index })) : []}
                    onRow={(record => {
                      return {
                        onClick: event => {
                          router.push(`/view/${record.id}`);
                        },
                      };
                    })}
                />
            </div>
        </>
    )
}