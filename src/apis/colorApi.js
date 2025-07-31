import { http } from "~/utils/http";

const apiGetColors = async ({ accessToken }) => {
    try {
        const { data } = await http.get("colors", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};
export { apiGetColors }