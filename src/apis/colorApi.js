// src/apis/color.js
import { http } from "~/utils/http";

// Lấy danh sách màu
export const apiGetColors = async ({accessToken}) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const { data } = await http.get("/colors", config);
    return data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw new Error(error.message);
  }
};

// Tạo mới màu
export const apiCreateColor = async ({ body, accessToken }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await http.post("/colors/create", body, config);
    const res = response.data;

    if (res?.code === 200) {
      return {
        success: true,
        data: res.data,
        message: res.message || "Tạo màu thành công!",
      };
    } else {
      return {
        success: false,
        message: res.message || "Tạo màu thất bại.",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Không thể kết nối máy chủ.",
    };
  }
};

// Cập nhật màu
export const apiUpdateColor = async ({ id, body, accessToken }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await http.put(`/colors/update/${id}`, body, config);
    const res = response.data;

    if (res?.code === 200) {
      return {
        success: true,
        data: res.data,
        message: res.message || "Cập nhật màu thành công!",
      };
    } else {
      return {
        success: false,
        message: res.message || "Cập nhật màu thất bại.",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Không thể kết nối máy chủ.",
    };
  }
};

// Xoá màu
export const apiDeleteColor = async ({ id, accessToken }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await http.delete(`/colors/${id}`, config);
    const res = response.data;

    if (res?.code === 200) {
      return {
        success: true,
        message: res.message || "Xoá màu thành công!",
      };
    } else {
      return {
        success: false,
        message: res.message || "Xoá màu thất bại.",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Không thể kết nối máy chủ.",
    };
  }
};
