import { http } from "~/utils/http";

const apiGetMyCart = async ({ accessToken }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },

        }
        console.log("Fetching cart with access token:", accessToken);
        const { data } = await http.get("carts", config);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};
const apiCreateCart = async ({ accessToken, productDetailId, quantity }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
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
const apiUpdateCart = async ({ accessToken, body }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },

        }
        const { data } = await http.put("carts/update", body, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};
const apiDeleteCart = async ({ accessToken, pId }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
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
export { apiGetMyCart, apiCreateCart, apiUpdateCart, apiDeleteCart };