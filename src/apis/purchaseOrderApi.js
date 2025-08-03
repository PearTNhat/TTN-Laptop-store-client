import { http } from "~/utils/http";
const apiGetPurchaseOrders = async ({ accessToken, page = 1, size = 10, statusEnum, keyword }) => {
    try {
        page = page <= 1 ? 0 : page - 1;
        const params = {
            page,
            size,
            statusEnum,
            keyword
        }
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params
        }
        const { data } = await http.get("purchase-orders/search-by-code?", config);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};
const apiGetPurchaseOrderDetail = async ({ accessToken, id }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
        const { data } = await http.get(`purchase-orders/${id}`, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};
const apiCreatePurchaseOrder = async ({ accessToken, body }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
        const response = await http.post("purchase-orders/create", body, config);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};
const apiUpdatePurchaseOrder = async ({ accessToken, id, data }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
        const response = await http.put(`purchase-orders/update/${id}`, data, config);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};
const apiDeletePurchaseOrder = async ({ accessToken, id }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
        const response = await http.delete(`purchase-orders/${id}`, config);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};
export { apiGetPurchaseOrders, apiGetPurchaseOrderDetail, apiCreatePurchaseOrder, apiUpdatePurchaseOrder, apiDeletePurchaseOrder };