import { http } from "~/utils/http";

const apiCreateOrder = async ({ accessToken, body }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
        const { data } = await http.post("/orders/create", body, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};

const apiGetOrderList = async ({ accessToken, params }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params,
        }
        const { data } = await http.get("/orders/search-by-code", config);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};
const apiChangeStatusOrder = async ({ accessToken, id }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
        const { data } = await http.put(`/orders/change-status/${id}`, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};
export { apiCreateOrder };