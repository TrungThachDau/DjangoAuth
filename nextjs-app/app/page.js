"use server"
// import styles from "./page.module.css";
import axiosInstance from "@/axios.js";
import TableComponent from "@/components/table_component.js";
import MasoryLayout from "@/components/mansory_layout.js";
async function getData() {
    try {
        console.log('Ok')
        const response = await axiosInstance.get("public/get_all_files/");
        return response.data.data;
    } catch (error) {
        console.log(error);
        return []; 
    }
}

export default async function Home() {

    const data = await getData();    
    return (
      <div>
              <div>
              {/* <MasoryLayout data={data}/> */}
              <TableComponent data={data}/>
              </div>
      </div>
    )
}
