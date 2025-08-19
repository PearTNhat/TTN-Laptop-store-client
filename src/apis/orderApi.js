import { http } from "~/utils/http";

// user
export const apiGetOrders = async ({ accessToken, page = 0, size = 10 }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };
        const { data } = await http.get(`/orders/user?page=${page}&size=${size}`, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};

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
        params = {
            ...params,
            page: params.page ? params.page - 1 : 0, // Adjust for API zero-based index
        };
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params,
        }
        let data;
        if (params.statuses) {
            const temp = params.statuses;
            delete params.statuses;
            data = await http.get(`/orders/search?statuses=${temp[0]}&statuses=${temp[1]}`, config);
        } else {
            data = await http.get("/orders/search", config);
        }
        return data.data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};

const apiGetOrderDetail = async ({ accessToken, id }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
        const { data } = await http.get(`/orders/${id}`, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};

const apiChangeStatusOrder = async ({ accessToken, id, status }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },

        }
        const { data } = await http.put(`/orders/change-status/${id}?status=${status}`, {}, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};
export { apiCreateOrder, apiGetOrderList, apiChangeStatusOrder, apiGetOrderDetail };