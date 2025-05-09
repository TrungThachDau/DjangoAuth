"use server"
import { Button, Input, Space, Table, Tag } from 'antd';
import '@ant-design/v5-patch-for-react-19';
// import styles from "./page.module.css";
import dayjs from 'dayjs';
import axiosInstance from "@/axios.js";
async function getData(){
    const response = await axiosInstance.get("get_all_files/",{
        headers: {
        'Content-Type': 'application/json',
        },
    });
    return response.data;
}
export default async function Customer2() {

    //const [datax, setData] = useState([]);
    const data = await getData();
    

    const columns = [
      
        { title: 'Name', dataIndex: 'name', key: 'name', width: '30%' },
        
      
        { 
          title: 'Extension', 
          dataIndex: 'extension',  
          width: '5%',
         render: (_, { extension }) => (
            <Tag color="blue" key={extension}>
            {extension?.toUpperCase()}
            </Tag>
        ),
        },
      
        { title: 'Size', dataIndex: 'size', key: 'size', width: '10%' },
        
      
        { 
          title: 'Created at', 
          dataIndex: 'created_at', 
          key: 'created_at', 
          width: '20%',
          render: (_, { created_at }) => (
            <span>{dayjs(created_at).format('YYYY-MM-DD HH:mm:ss')}</span>
          ),
        },
      
      
        { title: 'Owner', dataIndex: 'account', key: 'account', width: '20%' },
        
      
      
          { title: 'Updated at', dataIndex: 'updated_at', key: 'updated_at', width: '20%' },
 
    ];
    
  return (
    <div>
            <div>
            <Table 
            columns={columns} 
            dataSource={data}
            />
            </div>
    </div>
  )
}
