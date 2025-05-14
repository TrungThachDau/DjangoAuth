import axiosInstance from "../axios";

export async function refreshToken(){
    const refreshToken = sessionStorage.getItem('refreshToken');
    console.log(refreshToken);
    return await axiosInstance.post('/token/refresh/',{
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
    sessionStorage.clear();
      return res.data;
  })
  .catch(err => console.log(err))
}
export async function signUp(username, password, email, name) {
  return await axiosInstance.post("/auth/signup/", {
    username,
    password,
    email,
    name,
  })
  .catch(err =>{
    throw err.response.data;
  })
}

export async function changePassword(old_password, new_password) {
  const accessToken = sessionStorage.getItem('accessToken');
  return await axiosInstance.post("/auth/change-password/", {
    accessToken,
    old_password,
    new_password,
  }, {
    headers: { Authorization: "Bearer " + accessToken }
  })
  .catch(err =>{
    handleApiError(err, async () => await changePassword(old_password, new_password));
  })
}
export async function resetPassword(username, email) {
  return await axiosInstance.post("/auth/reset-password/", {
    username,
    email,
  })
  .catch(err =>{
    throw err.response.data;
  })
}
export async function confirmNewPassword(token, new_password) {
  return await axiosInstance.post(`/auth/confirm-new-password/${token}/`, {
    new_password,
  })
  .catch(err =>{
    throw err.response.data;
  })
}
async function handleApiError(error, tryFunction){
  if(error.response.status === 401){
    const newToken = await refreshToken();
    if(newToken){
      await tryFunction();
    }
    else{
      throw new Error('Failed to refresh token');
    }
  }
  
  throw error;
}
