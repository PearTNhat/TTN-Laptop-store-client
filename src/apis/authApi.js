import { axiosPrivate, http } from "~/utils/http";

const apiLogin = async ({ body }) => {
    try {
        const { data } = await http.post("/auth/login", body);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};
const apiRefreshToken = async () => {
    try {
        const config = {
            withCredentials: true
        }
        const { data } = await axiosPrivate.get("/auth/refresh-token", config);
        console.log("Refresh token response:", data);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};
export { apiLogin, apiRefreshToken };