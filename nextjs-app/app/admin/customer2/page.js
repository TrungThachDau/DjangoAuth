"use server"
import '@ant-design/v5-patch-for-react-19';
// import styles from "./page.module.css";

import axiosInstance from "@/axios.js";
import TableComponent from "@/app/table_component.js";
async function getData() {
    try {
        console.log('Ok')
        const response = await axiosInstance.get("get_all_files/");
        return response.data.data;
    } catch (error) {
        console.log(error);
        return []; // Trả về mảng rỗng nếu lỗi
    }
}

export default async function Customer2() {

    const data = await getData();    
  return (
    <div>
            <div>
            <TableComponent data={data}/>
            </div>
    </div>
  )
}
