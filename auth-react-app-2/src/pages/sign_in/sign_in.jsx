import './sign_in.css';
import { Button, Input, Form, message} from 'antd';
import {Link, useNavigate} from "react-router-dom";
import axiosInstance from '/src/axios.js';
import NavBar from "../../components/nav_bar/nav_bar.jsx";
const SignIn = () => {

    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const onSubmitLogin= (values) => {
        if (!values.username || !values.password) {
            messageApi.error('Please fill in both username and password').then(r => console.log(r));
        }
        else {

            axiosInstance.post('/auth/signin/', {
                username: values.username,
                password: values.password
            })
                .then(response => {
                    console.log(response.data);
                    sessionStorage.setItem('username', response.data.username);
                    messageApi.success('Sign in successful').then(r => console.log(r));
                    // Redirect to customer page
                    navigate('/customer');
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
                {/*<div className='signin-logo'>*/}
                {/*    <img src='./src/assets/logo.png' alt='Messenger Logo' />*/}
                {/*</div>*/}
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

                    <a href='#' className='forgot-password' >Forgot password?</a>
                    <Link to="/sign-up" className='forgot-password'>Create a new account</Link>
                </Form>
            </div>
        </div>
        </>

    );
}

export default SignIn;