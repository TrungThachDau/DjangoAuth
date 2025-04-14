import './sign_up.css';
import { Button, Input, Form, message} from 'antd';
import {Link} from "react-router-dom";
import axiosInstance from "../../axios.js";

const SignUp = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const onSubmitLogin= (values) => {


        if (!values.username || !values.password) {
            messageApi.error('Please fill in both username and password').then(r => console.log(r));

        }
        else if (values.password !== values.retypePassword)
            messageApi.error('Passwords do not match').then(r => console.log(r));

        else {
            axiosInstance.post('/auth/signup/', {
                username: values.username,
                hashed_password: values.password,
                email: values.email,
                name: values.name,

            })
                .then(response => {
                    console.log(response.data);
                    sessionStorage.setItem('username', response.data.username);
                    messageApi.success('Sign up successful. Please sign in').then(r => console.log(r));
                })
                .catch(error => {
                    messageApi.error(error.response.data.message).then(r => console.log(r));
                });
        }
    }
    return (
        <div className='signin-container'>
            <div className='signin-content'>
                <h2>Sign up</h2>
                <Form onFinish={onSubmitLogin}>
                    <Form.Item name="name">
                        <Input className='signin-input' placeholder='Name' />
                    </Form.Item>
                    <Form.Item name="username">
                        <Input className='signin-input' placeholder='Username' />
                    </Form.Item>
                    <Form.Item name="email">
                        <Input className='signin-input' placeholder='Email' />
                    </Form.Item>

                    <Form.Item name="password">
                        <Input.Password className='signin-input' placeholder='Password' />
                    </Form.Item>
                    <Form.Item name="retypePassword">
                        <Input.Password className='signin-input' placeholder='Retype Password' />
                    </Form.Item>
                    {contextHolder}
                    <Button  className='signin-button' htmlType="submit">Sign Up</Button>
                    <Link to="/sign-in" className='forgot-password'>Back to Sign In</Link>

                </Form>
            </div>
        </div>
    );
}

export default SignUp;