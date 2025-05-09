
import axiosInstance from "../axios";

export function refreshToken(){
    const refreshToken = sessionStorage.getItem('refreshToken');
    console.log(refreshToken);
    return axiosInstance.post('/token/refresh/',{
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
export async function signIn(username, password) {
  return await axiosInstance.post("/auth/signin/", { username, password },{
  })
  
  .catch(err =>{
    throw err.response.data;
  })
}

export async function signOut(refreshToken){
  await axiosInstance.post('/auth/sign-out/',{refreshToken})
  .then(res => {
      return res.data;
  })
  .catch(err => console.log(err))
}