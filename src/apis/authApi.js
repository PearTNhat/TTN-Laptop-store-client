import { http } from "~/utils/http";

const apiLogin = async ({ body }) => {
    try {
        console.log(body)
        const { data } = await http.post("/auth/login", body);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};
export { apiLogin };