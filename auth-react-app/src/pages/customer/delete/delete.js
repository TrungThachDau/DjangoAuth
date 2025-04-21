import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import axiosInstance from "../../../axios.js";

const DeleteCustomer = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const refreshToken = sessionStorage.getItem("refreshToken");

    if (!refreshToken) {
      message.error("No refresh token found. Please log in again.");
      navigate("/sign-in");
      return;
    }

    const signOut = async () => {
      try {
        const response = await axiosInstance.post("/auth/sign-out/", {
          refreshToken: refreshToken,
        });

        if (response.status === 200) {
          sessionStorage.clear();
          message.success("Logged out successfully.");
          navigate("/sign-in");
        }
      } catch (error) {
        message.error("Failed to log out. Please try again.");
        console.error("Error during sign-out:", error);
      }
    };

    signOut();
  }, [navigate]);
};

export default DeleteCustomer;