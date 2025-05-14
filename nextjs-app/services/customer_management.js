import axiosInstance from "../axios";



export async function getAllCustomers(){
    return await axiosInstance.get("/customer/",
        {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        }
    )
    .then(res => {
        return res;
    })
    .catch(err => {
        handleApiError(err, async () => await getAllCustomers());
    })
}
export async function deleteCustomer(id){
    return await axiosInstance.delete(`/customer/${id}/`,
        {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        }
    )
    .then(res => {
        return res;
    })
    .catch(err => {
        handleApiError(err, async () => await deleteCustomer(id));
    })
}
export async function addCustomer(customerData){
    return await axiosInstance.post("/customer/", customerData,
        {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        }
    )
    .then(res => {
        return res;
    })
    .catch(err => {
        handleApiError(err, async () => await addCustomer(customerData));
    })
}
export async function getCustomer(id){
    return await axiosInstance.get(`/customer/${id}/`,
        {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        }
    ) 
    .then(res => {
        return res;
    })
    .catch(err => {
        handleApiError(err, async () => await getCustomer(id));
    })
}
export async function updateCustomer(id, customerData){
    return await axiosInstance.put(`/customer/${id}/`, customerData,
        {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        }
    )
    .then(res => {
        return res;
    })
    .catch(err => {
        handleApiError(err, async () => await updateCustomer(id, customerData));
    })
}
async function handleApiError(error, retryFunction){
    if(error.response.status === 401){
        const newToken = await refreshToken();
        if(newToken){
          return await retryFunction(); // Thêm return
        }
        else{
          throw new Error('Failed to refresh token');
        }
      }
      else if (error.response.status === 403){
        throw new Error('You do not have permission to access this resource');
      }

    throw error;
}
