import { http } from "~/utils/http";

const apiGetImgString = async ({ accessToken, formData }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "multipart/form-data",
            },
        }
        const { data } = await http.post("/files/image?currentImage", formData, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};
export { apiGetImgString };