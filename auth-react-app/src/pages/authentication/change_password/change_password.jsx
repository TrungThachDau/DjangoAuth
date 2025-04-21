import './change_password.css';
import { Button, Input, Form, message} from 'antd';
import axiosInstance from '/src/axios.js';
import NavBar from "../../../components/nav_bar/nav_bar.jsx";
const ChangePassword = () => {

    const [messageApi, contextHolder] = message.useMessage();

    const onSubmitChange= (values) => {
        if (!values.username || !values.password) {
            messageApi.error('Please fill in both username and password').then(r => console.log(r));
        }
        else {

            axiosInstance.post('/auth/change-password/', {
                username: sessionStorage.getItem('username'),
                old_password: values.old_password,
                new_password: values.new_password,

            },{
               headers: {Authorization: "Bearer " + sessionStorage.getItem("accessToken")}
            })
                .then(() => {
                    messageApi.success('Change successful').then(r => console.log(r));
                })
                .catch(error => {
                    messageApi.error(error.response.data.message).then(r => console.log(r));
                });

        }
    }

    return (
        <>
            <NavBar></NavBar>
            <div className='signin-container'>
                <div className='signin-content'>
                    <h2>Change password</h2>
                    <Form onFinish={onSubmitChange}>
                        <Form.Item name="old-password">
                            <Input.Password className='signin-input' placeholder='Old password' />
                        </Form.Item>
                        <Form.Item name="new-password">
                            <Input.Password className='signin-input' placeholder='New password' />
                        </Form.Item>
                        <Button  className='signin-button' htmlType="submit">Submit</Button>
                    </Form>
                </div>
            </div>
        </>

    );
}

export default ChangePassword;