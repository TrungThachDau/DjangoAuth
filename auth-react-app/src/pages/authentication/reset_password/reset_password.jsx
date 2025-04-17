import './reset_password.css';
import { Button, Input, Form, message} from 'antd';
import {Link} from "react-router-dom";
import axiosInstance from '/src/axios.js';
import NavBar from "../../../components/nav_bar/nav_bar.jsx";
const ResetPassword = () => {

    const [messageApi, contextHolder] = message.useMessage();
    const onSubmitLogin= (values) => {
        if (!values.username) {
            messageApi.error('Please fill in both username and password').then(r => console.log(r));
        }
        else {

            axiosInstance.post('/auth/reset-password/', {
                username: values.username,
            })
            .then(response => {
                console.log(response.data);
                messageApi.success('Email sent successful').then(r => console.log(r));
            })
            .catch(error => {
                console.error('There was an error!', error);
                messageApi.error(error.response.data.message).then(r => console.log(r));
            });

        }
    }

    return (
        <>
            <NavBar></NavBar>
            <div className='signin-container'>
            <div className='signin-content'>
                <h2>Reset password</h2>
                <Form onFinish={onSubmitLogin}>
                    <Form.Item name="username">
                        <Input className='signin-input' placeholder='Username' />
                    </Form.Item>
                    {contextHolder}
                    <Button  className='signin-button' htmlType="submit">Submit</Button>

                    <Link to="/sign-up" className='forgot-password'>Create a new account</Link>
                </Form>
            </div>
        </div>
        </>

    );
}

export default ResetPassword;