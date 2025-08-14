import { http } from "~/utils/http";

const apiGetMyPromotion = async ({ accessToken }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
        const { data } = await http.get("/promotions/my-vouchers", config);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};
const apiGetProductPromotionById = async ({ accessToken, pId, type }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params: {
                promotionStatus: type,
            },
        }
        const { data } = await http.get("/promotions/product-detail/" + pId, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};
const apiGetPromotionId = async ({ accessToken, promotionId }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
        const { data } = await http.get("/promotions/" + promotionId, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
}

// Admin promotion management APIs
const apiGetPromotions = async ({ accessToken, params }) => {
    try {
        params = {
            ...params,
            page: params.page ? params.page - 1 : 0, // Adjust for API zero-based index
        };
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params: params, // page, size, promotionType, status, etc.
        };
        const { data } = await http.get("/promotions/list", config);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};
const apiGetPromotionDetail = async ({ accessToken, params, promotionId }) => {
    try {
        params = {
            ...params,
            page: params.page ? params.page - 1 : 0, // Adjust for API zero-based index
        };
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params
        };
        const { data } = await http.get("/promotions/details/" + promotionId, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};
const apiCreatePromotion = async ({ accessToken, promotionData }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };
        const { data } = await http.post("promotions/create", promotionData, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};

const apiUpdatePromotion = async ({ accessToken, promotionId, promotionData }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };
        const { data } = await http.put(`/promotions/${promotionId}`, promotionData, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};

const apiDeletePromotion = async ({ accessToken, promotionId }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };
        const { data } = await http.delete(`/promotions/delete/${promotionId}`, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};

const apiGetProductsForPromotion = async ({ accessToken, params }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params: params, // page, size, search, categoryId, etc.
        };
        const { data } = await http.get("/products/promotion-selection", config);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};


export {
    apiGetMyPromotion,
    apiGetProductPromotionById,
    apiGetPromotionId,
    apiGetPromotions,
    apiGetPromotionDetail,
    apiCreatePromotion,
    apiUpdatePromotion,
    apiDeletePromotion,
    apiGetProductsForPromotion,
};