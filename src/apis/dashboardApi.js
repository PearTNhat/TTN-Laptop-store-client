import { http } from "~/utils/http";

const apiGetSummary = async ({ accessToken }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
        const { data } = await http.get("dashboard/summary", config);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};
const apiRevenue = async ({ accessToken, year }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params: {
                year,
            },
        }
        const { data } = await http.get("dashboard/revenue", config);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};
const apiTopCustomers = async ({ accessToken, limit }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params: {
                limit,
            },
        }
        const { data } = await http.get("dashboard/customers/top", config);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};
const apiTopProducts = async ({ accessToken, limit }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params: {
                limit,
            },
        }
        const { data } = await http.get("dashboard/top-products", config);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};
export {
    apiGetSummary,
    apiRevenue,
    apiTopCustomers,
    apiTopProducts
};