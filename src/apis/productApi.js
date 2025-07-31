import { http } from "~/utils/http";

const apiGetProducts = async ({ page = 1, size = 10, minPrice,
    maxPrice,
    categoryId,
    brandId,
    seriesId,
    sortBy,
    sortDirection }) => {
    try {
        page = page <= 1 ? 0 : page - 1;
        const params = {
            page,
            size,
            minPrice,
            maxPrice,
            categoryId,
            brandId,
            seriesId,
            sortBy,
            sortDirection
        }
        const config = {
            params
        }
        const { data } = await http.get("products/item-filter", config);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};
const apiGetDetailProduct = async ({ pId }) => {
    try {
        const { data } = await http.get("products/" + pId);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};
const apiGetListProducts = async ({ accessToken, page = 1, size = 10 }) => {
    try {
        page = page <= 1 ? 0 : page - 1;
        const params = {
            page,
            size
        }
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params
        }
        const { data } = await http.get("products", config);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};
const apiCreateProduct = async ({ accessToken, body }) => {
    try {
        console.log(JSON.stringify(body));
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
        const { data } = await http.get("products/create", body, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};


export { apiGetProducts, apiGetDetailProduct, apiGetListProducts, apiCreateProduct };