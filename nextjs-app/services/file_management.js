import axiosInstance from "../axios";


export async function getAllFilesRequest(){
    return await axiosInstance.get("/file/get_all/", {
        headers: { Authorization: "Bearer " + sessionStorage.getItem("accessToken") },
    })
    .then(res => {
        return res.data;
    })
    .catch(err => {
        handleApiError(err, async () => await getAllFilesRequest());
    })
}


async function handleApiError(error, retryFunction){
    if(error.response.status === 401){
        const newToken = await refreshToken();
        if(newToken){
          sessionStorage.setItem("accessToken", newToken);
          return await retryFunction();
        }
        else{
          throw new Error('Failed to refresh token');
        }
      }
      else if (error.response.status === 403){
        throw new Error('You do not have permission to access this resource');
      }
      else{
        throw error;
      }
}


