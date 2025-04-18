import {useNavigate} from "react-router-dom";
import axiosInstance from "../../../axios.js";

const DeleteCustomer =()=>
{
    const refreshToken = sessionStorage.getItem('refreshToken');
    console.log(refreshToken);
    const navigate = useNavigate();
    axiosInstance.post('/auth/sign-out/',{
        refreshToken:refreshToken
    })
    .then(res => {
        if(res.status === 200){
            sessionStorage.clear()
            navigate('/sign-in')
        }

    })
    .catch(err => console.log(err))

}

export default DeleteCustomer;