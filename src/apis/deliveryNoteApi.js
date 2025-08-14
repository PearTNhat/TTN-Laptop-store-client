import { http } from "~/utils/http";
const apiGetDeliveryNotes = async ({ accessToken, page = 1, size = 10, status, orderCode }) => {
    try {
        page = page <= 1 ? 0 : page - 1;
        const params = {
            page,
            size,
            status,
            orderCode
        }
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params
        }
        const { data } = await http.get("delivery-notes/search", config);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};
const apiConfirmDeliveryDraft = async ({ accessToken, id }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
        const { data } = await http.post(`delivery-notes/confirm/${id}`, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};
const apiGetDeliveryNoteDetail = async ({ accessToken, id }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
        const { data } = await http.get(`delivery-notes/${id}`, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};
const apiCreateDeliveryNote = async ({ accessToken, body }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
        const response = await http.post("delivery-notes/create", body, config);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};
const apiUpdateDeliveryNote = async ({ accessToken, id, data }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
        const response = await http.put(`delivery-notes/${id}`, data, config);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};
const apiDeleteDeliveryNote = async ({ accessToken, id }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
        const response = await http.delete(`delivery-notes/${id}`, config);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};
export { apiGetDeliveryNotes, apiGetDeliveryNoteDetail, apiConfirmDeliveryDraft, apiCreateDeliveryNote, apiUpdateDeliveryNote, apiDeleteDeliveryNote };