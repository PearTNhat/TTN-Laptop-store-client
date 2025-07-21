import { http } from "~/utils/http";

export const apiFetchMyInfo = async ({ token }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await http.get("users/fetchInfo", config);
    return data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw new Error(error.message);
  }
};

export const apiUpdateUserInfo = async ({ body }) => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await http.put("/users/update", body, config);
    const res = response.data;

    if (res?.code === 200) {
      return { success: true, data: res.data, message: res.message };
    } else {
      return { success: false, message: res.message || "Cập nhật thất bại." };
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Không thể kết nối máy chủ.",
    };
  }
};

