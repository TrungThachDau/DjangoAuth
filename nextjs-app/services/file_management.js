import axiosInstance from "../axios";
import { refreshToken } from "./authentication";

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
export async function authorizeFile(id,status){
    return await axiosInstance.post("/file/authorize/", {
        status: status,
        object_id: id
    }, {
        headers: { Authorization: "Bearer " + sessionStorage.getItem("accessToken") },
    })
    .then(res => {
        return res;
    })
    .catch(err => {
        handleApiError(err, async () => await authorizeFile(id,status));
    })
}
export async function deleteFile(id){
    return await axiosInstance.post("/file/delete/", {
        object_id: id
    }, {
        headers: { Authorization: "Bearer " + sessionStorage.getItem("accessToken") },
    })
    .then(res => {
        return res;
    })
    .catch(err => {
        handleApiError(err, async () => await deleteFile(id));
    })
}
export async function updateFile(formData){
  return await axiosInstance.post("/file/update/", formData, {
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("accessToken"),
      'Content-Type': 'multipart/form-data',
    }
  })
  .then(res => {
    return res;
  })
  .catch(err => {
    handleApiError(err, async () => await updateFile(formData));
  })
}
export async function uploadFile(formData){
  return await axiosInstance.post("/file/upload/", formData, {
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("accessToken"),
      'Content-Type': 'multipart/form-data',
    }
  })
  .then(res => {
    return res;
  })
  .catch(err => {
    handleApiError(err, async () => await uploadFile(formData));
    return err;
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


