"use client";
import NavBar from "@/components/nav_bar.js";
import axiosInstance from "@/axios.js";
import { useEffect, useState } from "react";
import {Button, DatePicker, Form, Input, message} from "antd";
import './page.css';
import dayjs from 'dayjs';
import { useRouter } from "next/navigation";
import { getCustomer, updateCustomer } from "@/services/customer_management.js";
const UpdateCustomer = () => {
    const { customerId } = useRouter();
    const [customer, setCustomer] = useState([{ }]);
    const [messageApi, contextHolder] = message.useMessage();
    useEffect(async () => {
        if (!customerId) return;
        try{
            const response = await getCustomer(customerId);
            if(response){
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
            }
        }
        catch(error){
            messageApi.error(error.message);
        }   
    }, [customerId]);

    const onSubmit = async (values) => {
        try{
            const customerData = {
                name:values.name,
                address:values.address,
                phone:values.phone,
                date: dayjs(values.date).format('YYYY-MM-DD')
            }
            setLoading(true);
            const response = await updateCustomer(customerId, customerData);
            if(response){
                messageApi.success('Customer updated successfully').then(r => console.log(r));
            }
        }
        catch(error){
            messageApi.error(error.message);
        }
        finally{
            setLoading(false);
        }
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