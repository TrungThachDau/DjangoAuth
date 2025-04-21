import axiosInstance from "../axios.js";


function refreshToken(){
    const refreshToken = sessionStorage.getItem('refreshToken');
    console.log(refreshToken);
    return axiosInstance.post('/auth/token/refresh/',{
        refresh:refreshToken
    })
    .then(res => {
        if(res.status === 200){
            sessionStorage.setItem('accessToken', res.data.access)
            return res.data.access;
        }
    })
    .catch(err => console.log(err))
}

export {refreshToken};