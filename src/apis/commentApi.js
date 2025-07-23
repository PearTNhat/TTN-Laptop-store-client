import { http } from "~/utils/http";

const apiGetComments = async ({ pId }) => {
    try {
        const { data } = await http.get("/reviews/comments?productDetailId=" + pId);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};
const apiReplyComment = async ({ accessToken, body }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };
        const { data } = await http.post("/reviews/reply", body, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
}
const apiComment = async ({ accessToken, body }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };
        console.log("apiComment body:", body);
        const { data } = await http.post("/reviews/comment", body, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
}
export { apiGetComments, apiReplyComment, apiComment };