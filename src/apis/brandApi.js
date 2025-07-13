import { http } from "~/utils/http";

const apiGetBrands = async () => {
    try {
        const { data } = await http.get("brands ");
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};
export { apiGetBrands }