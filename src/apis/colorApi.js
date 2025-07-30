import { http } from "~/utils/http";

const apiGetColors = async () => {
    try {
        const { data } = await http.get("colors");
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};
export { apiGetColors }