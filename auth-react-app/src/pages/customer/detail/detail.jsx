import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../../axios.js";
import NavBar from "../../../components/nav_bar/nav_bar.jsx";
import "./detail.css";

const Detail = () => {
  const { customerId } = useParams();
  const [customer, setCustomer] = useState("");
  useEffect(() => {
    axiosInstance
      .get("customer/" + customerId + "/", {
        headers: { Authorization: "Bearer " + sessionStorage.getItem("accessToken") },
      })
      .then((response) => {
        setCustomer(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching customer data:", error);
      });
  }, []);

  return (
    <>
      <NavBar />
      <div className="detail-container">
        <div className="detail-card">
          <h1 className="detail-title">Customer Details</h1>
          <div className="detail-info">
            <p><span>ID:</span> {customer.id}</p>
            <p><span>Name:</span> {customer.name}</p>
            <p><span>Phone:</span> {customer.phone}</p>
            <p><span>Address:</span> {customer.address}</p>
            <p><span>Date:</span> {customer.date}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Detail;