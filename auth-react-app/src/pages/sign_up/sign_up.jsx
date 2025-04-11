import './sign_up.css';
import { Button, Input, Form, message} from 'antd';
import {Link} from "react-router-dom";

const SignUp = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const onSubmitLogin= (values) => {


        if (!values.username || !values.password) {
            messageApi.error('Please fill in both username and password').then(r => console.log(r));

        }
        else if (values.password !== values.retypePassword)
            messageApi.error('Passwords do not match').then(r => console.log(r));

        else {
            messageApi.info('A function is developing').then(r => console.log(r));
        }
    }

    return (
        <div className='signin-container'>
            <div className='signin-content'>
                <h2>Sign up</h2>
                <Form onFinish={onSubmitLogin}>
                    <Form.Item name="email">
                        <Input className='signin-input' placeholder='Email' />
                    </Form.Item>
                    <Form.Item name="username">
                        <Input className='signin-input' placeholder='Username' />
                    </Form.Item>
                    <Form.Item name="name">
                        <Input className='signin-input' placeholder='Name' />
                    </Form.Item>
                    <Form.Item name="username">
                        <Input className='signin-input' placeholder='Email or phone number' />
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