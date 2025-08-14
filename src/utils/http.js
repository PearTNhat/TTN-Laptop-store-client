import axios from 'axios'
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import { apiRefreshToken } from '~/apis/authApi';
import { userActions } from '~/stores/slice/userSlice';
export const axiosPrivate = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    timeout: 20000,
    headers: {
        'Content-Type': 'application/json'
    }
});
export const http =
    axios.create({
        baseURL: import.meta.env.VITE_SERVER_URL,
        timeout: 20000,
        headers: {
            'Content-Type': 'application/json'
        }
    })
let isRefreshing = false;
let failedQueue = [];
const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};
// Add a request interceptor
http.interceptors.request.use(async function (config) {
    const { store } = await import('~/stores');
    const { accessToken } = store.getState().user;
    if (!accessToken) return config
    const decodeAccessToken = jwtDecode(accessToken)
    const currentTime = Date.now() / 1000
    if (decodeAccessToken.exp < currentTime - 60) {
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then(token => {
                console.log("First token:", token)
                config.headers.Authorization = `Bearer ${token}`;
                return config;
            }).catch(error => {
                return Promise.reject(error);
            });
        }
        isRefreshing = true;
        try {
            const dispatch = store.dispatch
            const res = await apiRefreshToken()
            if (res.code === 200) {
                const newAccessToken = res.data;
                console.log("refresh", newAccessToken);
                config.headers.Authorization = `Bearer ${newAccessToken}`
                dispatch(userActions.setAccessToken({ accessToken: newAccessToken }))
                processQueue(null, newAccessToken);
                return config
            } else {
                throw new Error("Failed to refresh token");
            }
        } catch (error) {
            processQueue(error, null);
            await Swal.fire("Oops!", "Đăng nhập đã hết hạn vui lòng đăng nhập lại", "info").then(() => {
                store.dispatch(userActions.logout());
                window.location.href = '/login'
            })
            return Promise.reject(error);
        }
        finally {
            isRefreshing = false;
        }
    }
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
http.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, function (error) {
    return Promise.reject(error);
});