import axiosInstance from "../axios";


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
function signIn(username, password){
    return axiosInstance.post('/auth/signin/', {
        username: username,
        password: password
    })
    .then(res => {
        if(res.status === 200){
            return res.data.data.accessToken;
        }
    })
    .catch(err => console.log(err))
}
export {refreshToken};