import './confirm_password.css';
import { Button, Input, Form, message} from 'antd';
import {useEffect} from 'react'
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import axiosInstance from '/src/axios.js';
import NavBar from "../../../components/nav_bar/nav_bar.jsx";
const ConfirmPassword = () => {

    const [messageApi, contextHolder] = message.useMessage();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');
    const username= searchParams.get('username');
    useEffect(() => {
        if (!token) {
            console.error('Token not found in URL');
            navigate('/sign-in');
        }
    }, [token, navigate]);
    const onSubmitLogin= (values) => {
        if (!values.password) {
            messageApi.error('Please fill in new password').then(r => console.log(r));
        }
        else {
            const url = '/confirm-new-password/' + token+'/';
            axiosInstance.post(url, {
                username: username,
                new_password: values.password,
            })
            .then(response => {
                console.log(response.data);
                messageApi.success('Reset successful').then(r => console.log(r));
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
                <h2>Confirm password</h2>
                <Form onFinish={onSubmitLogin}>
                    <Form.Item name="password">
                        <Input.Password className='signin-input' placeholder='New password' />
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

export default ConfirmPassword;