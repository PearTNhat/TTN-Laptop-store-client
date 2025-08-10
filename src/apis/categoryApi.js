import { http } from "~/utils/http";

const apiGetCategories = async () => {
    try {
        const { data } = await http.get("categories");
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};

export const apiCreateCategory = async ({ body, accessToken }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    console.log("body",body)
    const response = await http.post("/categories/create", body, config);
    const res = response.data;

    if (res?.code === 200) {
      return { success: true, data: res.data, message: res.message || "Tạo category thành công!" };
    } else {
      return { success: false, message: res.message || "Tạo category thất bại." };
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Không thể kết nối máy chủ.",
    };
  }
};

export const apiUpdateCategory = async ({ id, body, accessToken }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await http.put(`/categories/${id}/update`, body, config);
    const res = response.data;

    if (res?.code === 200) {
      return { success: true, data: res.data, message: res.message || "Cập nhật thành công!" };
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

// Xoá category
export const apiDeleteCategory = async ({ id, accessToken }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await http.delete(`/categories/${id}`, config);
    const res = response.data;

    if (res?.code === 200) {
      return { success: true, message: res.message || "Xoá thành công!" };
    } else {
      return { success: false, message: res.message || "Xoá thất bại." };
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Không thể kết nối máy chủ.",
    };
  }
};

export { apiGetCategories }