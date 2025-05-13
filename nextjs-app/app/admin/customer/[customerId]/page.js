"use client";
import { useEffect, useState } from "react";
import {useParams, useRouter} from "next/navigation";
import axiosInstance from "@/axios.js";
import NavBar from "@/components/nav_bar.js";
import { message, Spin } from "antd";
import "./page.css";
import { getCustomer } from "@/services/customer_management.js";

const Detail = () => {
  const params = useParams();
  const { customerId } = params;
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const fetchCustomer = async () => {
    try{
      setLoading(true);
      const response = await getCustomer(customerId);
      if(response){
        setCustomer(response);
      }
    }
    catch(error){
      message.error(error.message);
    }
    finally{
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!customerId) return;
    fetchCustomer();
  }, [customerId]);
        
  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="error-container">
        <h1>Customer not found</h1>
      </div>
    );
  }

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