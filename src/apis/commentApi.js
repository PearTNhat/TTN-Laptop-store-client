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
export { apiGetComments };