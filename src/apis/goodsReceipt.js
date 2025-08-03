import { http } from "~/utils/http";
const apiGetGoodsReceiptNote = async ({ accessToken, page = 1, size = 10, grnCode }) => {
    try {
        page = page <= 1 ? 0 : page - 1;
        const params = {
            page,
            size,
            grnCode
        }
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params
        }
        const { data } = await http.get("goods-receipt-notes/search-by-code?", config);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};
const apiGetGoodsReceiptNoteDetail = async ({ accessToken, id }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
        const { data } = await http.get(`goods-receipt-notes/${id}`, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};
const apiCreateGoodsReceiptNote = async ({ accessToken, body }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
        const response = await http.post("goods-receipt-notes/create", body, config);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};
// const apiUpdateGoodsReceiptNote = async ({ accessToken, id, data }) => {
//     try {
//         const config = {
//             headers: {
//                 Authorization: `Bearer ${accessToken}`,
//             },
//         }
//         const response = await http.put(`goods-receipt-notes/${id}`, data, config);
//         return response.data;
//     } catch (error) {
//         if (error.response && error.response.data) {
//             return error.response.data;
//         }
//         throw new Error(error.message);
//     }
// };
const apiDeleteGoodsReceiptNote = async ({ accessToken, id }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
        const response = await http.delete(`goods-receipt-notes/${id}`, config);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};
export { apiGetGoodsReceiptNote, apiGetGoodsReceiptNoteDetail, apiCreateGoodsReceiptNote, apiDeleteGoodsReceiptNote };