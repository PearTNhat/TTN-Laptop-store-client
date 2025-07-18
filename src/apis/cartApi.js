import { http } from "~/utils/http";

const apiCreateCart = async ({ token, productDetailId, quantity }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },

        }
        const body = {
            productDetailId,
            quantity,
        }
        const { data } = await http.post("carts/create", body, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};
const apiUpdateCart = async ({ token, body }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },

        }
        const { data } = await http.post("carts/update", body, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};
const apiDeleteCart = async ({ token, pId }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },

        }
        const { data } = await http.delete("carts" + pId, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};
export { apiCreateCart, apiUpdateCart, apiDeleteCart };