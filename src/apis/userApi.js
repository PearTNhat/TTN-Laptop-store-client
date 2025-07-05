import { http } from "~/utils/http";

const apiFetchMyInfo = async ({ token }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
        const { data } = await http.get("users/fetchInfo", config);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};
export { apiFetchMyInfo };