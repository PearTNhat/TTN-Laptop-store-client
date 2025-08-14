import { http } from "~/utils/http";

const apiUpdateAvatar = async ({ accessToken, file }) => {
  try {
   
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    };

    const { data } = await http.put("/users/update-avatar", file, config);
    return data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw new Error(error.message);
  }
};

export { apiUpdateAvatar };

