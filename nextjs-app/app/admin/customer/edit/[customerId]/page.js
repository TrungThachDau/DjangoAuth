"use client";
import NavBar from "@/components/nav_bar.js";
import axiosInstance from "@/axios.js";
import { useEffect, useState } from "react";
import {Button, DatePicker, Form, Input, message} from "antd";
import './page.css';
import dayjs from 'dayjs';
import { useRouter } from "next/navigation";
const UpdateCustomer = () => {
    const { customerId } = useRouter();
    const [customer, setCustomer] = useState([{ }]);
    const [messageApi, contextHolder] = message.useMessage();
    useEffect(() => {
        if (!customerId) return;
        
        axiosInstance
            .get("customer/" + customerId + "/", {
                headers: { Authorization: "Bearer " + sessionStorage.getItem("accessToken") },
            })
            .then((response) => {
                const data = [
                    {
                       name: ['name'], value: response.data.name
                    },
                    {
                        name: ['address'],value:response.data.address,
                    },
                    {
                        name: ['phone'],value:response.data.phone,
                    },
                    {
                        name: ['date'], value: dayjs(response.data.date),
                    }
                ];
                setCustomer(data);

            })
            .catch((error) => {
                console.error("Error fetching customer data:", error);
            });
    }, [customerId]);

    const onSubmit = (values) => {
        console.log(values.date)
        axiosInstance.put("customer/" + customerId + "/", {
            name:values.name,
            address:values.address,
            phone:values.phone,
            date: dayjs(values.date).format('YYYY-MM-DD')
        }, {
            headers: { Authorization: "Bearer " + sessionStorage.getItem("accessToken") },

        })
        .then((response) => {
            messageApi.success('Customer added successfully').then(r => console.log(r));
        })
    }
    return (
        <>
            <NavBar/>
            <div className={"signin-container"}>
                <div className={"signin-content"}>
                <Form onFinish={onSubmit} fields={customer}>
                    <h3>Add new customer</h3>
                    <Form.Item name="name">
                        <Input className='signin-input' placeholder='Name' />
                    </Form.Item>
                    <Form.Item name="address">
                        <Input className='signin-input' placeholder='Address' />
                    </Form.Item>
                    <Form.Item name="phone">
                        <Input className='signin-input' placeholder='Phone' />
                    </Form.Item>
                    <Form.Item name="date">
                        <DatePicker className="signin-input"/>
                    </Form.Item>
                    {contextHolder}
                    <Button  className='signin-button' htmlType="submit">Submit</Button>
                </Form>
                </div>


            </div>
        </>
    );
};

export default UpdateCustomer;