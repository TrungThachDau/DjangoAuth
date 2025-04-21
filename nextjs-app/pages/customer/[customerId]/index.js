import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axiosInstance from "@/axios";
import NavBar from "@/components/nav_bar";
import { message, Spin } from "antd";
import "./styles.css";
import { refreshToken } from "@/services/authentication";
import { useParams } from "next/navigation";

const Detail = () => {
  const { customerId } = useRouter().query;
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!customerId) return;

    const fetchCustomer = async () => {
      try {
        const response = await axiosInstance.get(`customer/${customerId}/`, {
          headers: { Authorization: "Bearer " + sessionStorage.getItem("accessToken") },
        });
        setCustomer(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          try {
            const newToken = await refreshToken();
            sessionStorage.setItem("accessToken", newToken);
            const retryResponse = await axiosInstance.get(`customer/${customerId}/`, {
              headers: { Authorization: "Bearer " + newToken },
            });
            setCustomer(retryResponse.data);
          } catch (refreshError) {
            message.error("Failed to refresh token. Please log in again.");
            console.error("Error refreshing token:", refreshError);
            router.push("/auth/sign-in");
          }
        } else {
          message.error("Failed to fetch customer details.");
          console.error("Error fetching customer data:", error);
        }
      } finally {
        setLoading(false);
      }
    };

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