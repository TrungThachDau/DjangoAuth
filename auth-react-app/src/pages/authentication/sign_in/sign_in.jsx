import './sign_in.css';
import { Button, Input, Form, message} from 'antd';
import {Link, useNavigate} from "react-router-dom";
import axiosInstance from '/src/axios.js';
import NavBar from "../../../components/nav_bar/nav_bar.jsx";
import {useEffect} from "react";
const SignIn = () => {

    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    useEffect(() => {
        if (sessionStorage.getItem("refreshToken")) {
        navigate("/customer");
    }
    })
    const onSubmitLogin = (values) => {
    const { username, password } = values;

    if (!username || !password) {
        return messageApi.error('Please fill in both username and password').then(console.log);
    }

    axiosInstance.post('/auth/signin/', { username, password })
        .then((response) => {
            const { user, data } = response.data;

            sessionStorage.setItem('username', user.username);
            sessionStorage.setItem('refreshToken', data.refreshToken);
            sessionStorage.setItem('accessToken', data.accessToken);

            messageApi.success('Sign in successful').then();


            navigate('/customer');
        })
        .catch((error) => {
            const errorMessage = error.response?.data?.message || 'An error occurred';
            console.error('There was an error!', error);
            messageApi.error(errorMessage).then(console.log);
        });
};

    return (
        <>
            {/*<NavBar></NavBar>*/}
            <div className='signin-container'>
            <div className='signin-content'>
                <h2>Sign in</h2>
                <Form onFinish={onSubmitLogin}>
                    <Form.Item name="username">
                        <Input className='signin-input' placeholder='Email or phone number' />
                    </Form.Item>
                    <Form.Item name="password">
                        <Input.Password className='signin-input' placeholder='Password' />
                    </Form.Item>
                    {contextHolder}
                    <Button  className='signin-button' htmlType="submit">Sign In</Button>
                    <a href='/reset-password' className='forgot-password' >Reset password?</a>
                    <Link to="/sign-up" className='forgot-password'>Create a new account</Link>
                </Form>
            </div>
        </div>
        </>

    );
}

export default SignIn;