import { http } from "~/utils/http";

const apiGetBrands = async () => {
    try {
        const { data } = await http.get("brands");
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};

export const apiCreateBrand = async ({ body, accessToken }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    };

    const response = await http.post("/brands/create", body, config);
    const res = response.data;

    if (res?.code === 200) {
      return { success: true, data: res.data, message: res.message || "Tạo brand thành công!" };
    } else {
      return { success: false, message: res.message || "Tạo brand thất bại." };
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Không thể kết nối máy chủ.",
    };
  }
};

export const apiUpdateBrand = async ({ id, body, accessToken }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await http.put(`/brands/update/${id}`, body, config);
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

export const apiDeleteBrand = async ({ accessToken, id}) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const res = await http.delete(`/brands/${id}`, config);

    if (res.data?.code === 200) {
      return { success: true, message: res.data.message || "Xóa thành công" };
    } else {
      return { success: false, message: res.data.message || "Xóa thất bại" };
    }
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Lỗi server hoặc không có quyền.",
    };
  }
};


export { apiGetBrands }