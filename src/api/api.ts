import axios from 'axios';

// const API_BASE_URL = 'http://127.0.0.1:8000/api/';
// const API_BASE_URL = 'http://192.168.1.79:8000/api/';
// const API_BASE_URL = 'http://91.165.189.86:8000/api/';
const API_BASE_URL = process.env.REACT_APP_API_URL;
console.log(API_BASE_URL);

const API = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt-token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
// Axios response interceptor
API.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Check if the error status is 401 and if this is not the token refresh request
        if (error.response.status === 401 && !originalRequest._retry) {
            // Check if a token refresh is already in progress
            if (!isRefreshing) {
                originalRequest._retry = true;
                isRefreshing = true;

                try {
                    // Refresh the token and retry the original request
                    const newToken = await refreshToken();
                    if (newToken) {
                        setAuthToken(newToken);
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        return axios(originalRequest);
                    }
                } catch (refreshError) {
                    console.error('Token refresh failed:', refreshError);
                    // Handle the refresh error here, e.g., logout the user
                    // Clear tokens and navigate to the login page
                    setAuthToken(null);
                    setRefreshToken(null);
                    window.location.href = '/login'; // Replace with your login page URL
                } finally {
                    isRefreshing = false;
                }
            } else {
                // Token refresh is already in progress, return an error
                console.error('Token refresh is already in progress');
                // Handle the error here or reject the request with an error message
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export const setAuthToken = (token: string | null) => {
    if (token) {
        API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('jwt-token', token);
    } else {
        delete API.defaults.headers.common['Authorization'];
        localStorage.removeItem('jwt-token');
    }
}

export const setRefreshToken = (token: string | null) => {
    if (token) {
        localStorage.setItem('refresh-token', token);
    } else {
        localStorage.removeItem('refresh-token');
    }
}


const refreshToken = async () => {
    try {
        const refreshToken = localStorage.getItem('refresh-token');
        const data = {'refresh': refreshToken};
        const response = await API.post('token/refresh/', data);
        return response.data.access;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const loginUser = async (loginData: { email: string, password: string }) => {
    console.log(API.defaults.headers.common);
    try {
        const response = await API.post('token/', loginData);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const signup = async (signupData: { email: string, password: string }) => {
    try {
        const response = await API.post('signup/', signupData);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getPlants = async (queryParams = {}) => {
    try {
        const response = await API.get('plants/', { params: queryParams });
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getPlant = async (plantId: string) => {
    try {
        const response = await API.get(`plants/${plantId}/`);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const waterPlant = async (plantId: number) => {
    try {
        const response = await API.post(`plants/${plantId}/water/`);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const repotPlant = async (plantId: number) => {
    try {
        const response = await API.post(`plants/${plantId}/repot/`);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const fertilizePlant = async (plantId: number) => {
    try {
        const response = await API.post(`plants/${plantId}/fertilize/`);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getUser = async () => {
    try {
        const response = await API.get('user/');
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getNotificationCenter = async () => {
    try {
        const response = await API.get('notification-center/');
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getNotifications = async (queryParams: {}) => {
    try {
        const response = await API.get('notifications/', {params: queryParams});
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const createPlant = async (plantData: any) => {
    try {
        const response = await API.post('plants/', plantData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const editPlant = async (plantId: number, plantData: any) => {
    try {
        const response = await API.patch(`plants/${plantId}/`, plantData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const deletePlant = async (plantId: number) => {
    try {
        const response = await API.delete(`plants/${plantId}/`);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const aiCheckPlant = async (plantId: number) => {
     try {
        const response = await API.post(`plants/${plantId}/ai_check/`);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getAiPlantAnswer = async (aiPlantAnswerId: number) => {
    try {
        const response = await API.get(`ai-plant-answers/${aiPlantAnswerId}/`);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const approveAiPlantAnswer = async (aiPlantAnswerId: number) => {
    try {
        const response = await API.post(`ai-plant-answers/${aiPlantAnswerId}/approve_ai_answer/`);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const editUser = async (userData: any) => {
    try {
        const response = await API.patch('user/', userData);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const editNotificationCenter = async (notificationCenterData: any) => {
    try {
        const response = await API.patch('notification-center/', notificationCenterData);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const changePassword = async (passwordData: any) => {
    try {
        const response = await API.put('user/change-password/', passwordData);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export default API;