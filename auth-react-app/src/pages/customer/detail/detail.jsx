import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axiosInstance from "../../../axios.js";
import NavBar from "../../../components/nav_bar/nav_bar.jsx";


const Detail = ()=>{

    const {customerId} = useParams();
    const [customer, setCustomer] = useState("");
      useEffect(() => {
        // Fetch data from the customer/ endpoint
        axiosInstance
          .get("customer/"+customerId+"/",{
            headers: {Authorization: "Bearer " + sessionStorage.getItem("accessToken")}
          })
          .then((response) => {
            // Update the table data
            setCustomer(response.data);

          })
          .catch((error) => {
            console.error("Error fetching customer data:", error);
          });
      }, []);
    return(
        <>
            <NavBar></NavBar>

            <h1>Detail</h1>
            <h2>Customer ID: {customer.id}</h2>
            <h2>Name: {customer.name}</h2>
            <h2>Phone: {customer.phone}</h2>
            <h2>Address: {customer.address}</h2>
            <h2>Date: {customer.date}</h2>

        </>
    )
}

export default Detail;