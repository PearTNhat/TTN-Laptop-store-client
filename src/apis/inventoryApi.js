
import { http } from "~/utils/http";

const apiGetSeriesNumberByPid = async ({ accessToken, pId }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
        const { data } = await http.get(`/inventories/serial-numbers/${pId}`, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};
export { apiGetSeriesNumberByPid };