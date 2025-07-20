import { BookDashed } from "lucide-react";
import { http } from "~/utils/http";

const apiGetMyAddresss = async ({ accessToken }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
        const { data } = await http.get("addresses", config);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};
// const apiUpdateAddresss = async ({ accessToken, id, address }) => {
//     try {
//         const config = {
//             headers: {
//                 Authorization: `Bearer ${accessToken}`,
//             },
//         }
//         const { data } = await http.put("addresses/" + id, { address }, config);
//         return data;
//     } catch (error) {
//         if (error.response && error.response.data) {
//             return error.response.data;
//         }
//         throw new Error(error.message);
//     }
// };
// const apiUpdateAddresss = async ({ accessToken, id, address }) => {
//     try {
//         const config = {
//             headers: {
//                 Authorization: `Bearer ${accessToken}`,
//             },
//         }
//         const { data } = await http.get("addresses/" + id, { address }, config);
//         return data;
//     } catch (error) {
//         if (error.response && error.response.data) {
//             return error.response.data;
//         }
//         throw new Error(error.message);
//     }
// };
export { apiGetMyAddresss, };