import { http } from "~/utils/http";

const apiGetCategories = async () => {
    try {
        const { data } = await http.get("categories");
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};
export { apiGetCategories }