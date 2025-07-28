import { http } from "~/utils/http";

const apiGetMyAddresss = async ({ accessToken }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
        const { data } = await http.get("/addresses", config);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};
const apiUpdateAddress = async ({ accessToken, id, address, phone, recipient, isDefault }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
        const body = {
            address,
            phone,
            recipient,
            default: isDefault
        }
        const { data } = await http.put("/addresses/" + id, body, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};
const apiDeleteAddress = async ({ accessToken, id }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
        const { data } = await http.delete("/addresses/" + id, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};
const apiCreateAddress = async ({ accessToken, address, phone, recipient }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
        const body = {
            address,
            phone,
            recipient,
            default: false
        }
        const { data } = await http.post("/addresses/create", body, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};
export { apiGetMyAddresss, apiUpdateAddress, apiDeleteAddress, apiCreateAddress };