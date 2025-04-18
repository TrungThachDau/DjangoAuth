import NavBar from "../../../components/nav_bar/nav_bar.jsx";
import {Button, DatePicker, Form, Input, message} from "antd";
import {Link} from "react-router-dom";
import axiosInstance from "../../../axios.js";
import moment from "moment";

const AddCustomer = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const onSubmitCustomer = (values) => {
        if (!values.name || !values.phone || !values.address || !values.date) {
            messageApi.error('Please fill in all fields').then(r => console.log(r));
        }
        else {
            axiosInstance.post('customer/', {
                name: values.name,
                phone: values.phone,
                address: values.address,
                date: moment(values.date).format('YYYY-MM-DD')
            },
            {
              headers: {Authorization: "Bearer " + sessionStorage.getItem("accessToken")}
            })
            .then((r) => {
                messageApi.success('Customer added successfully').then(r => console.log(r));
            })
            .catch(error => {
                messageApi.error(error.response.data.message).then(r => console.log(r));
            });
        }
    }
    return (
        <>
            <NavBar></NavBar>
            <div className={"signin-container"}>
                <div className={"signin-content"}>
                <Form onFinish={onSubmitCustomer}>
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
                    <Form.Item
                            name="date"
                        >
                        <DatePicker className="signin-input"
                                    defaultValue={moment('2025-12-23', 'YYYY-MM-DD')}
                        />
                    </Form.Item>
                    {contextHolder}
                    <Button  className='signin-button' htmlType="submit">Submit</Button>
                </Form>
                </div>


            </div>
        </>
    )
}

export default AddCustomer;