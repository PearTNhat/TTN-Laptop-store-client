import { http } from "~/utils/http";

const apiGetSeries = async () => {
  try {
    const { data } = await http.get("series");
    return data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw new Error(error.message);
  }
};

export const apiCreateSeries = async ({ brandId, body, accessToken }) => {
  try {
    const res = await http.post(
      `/series/create/by-brand/${brandId}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return { success: true, data: res.data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Lỗi tạo series",
    };
  }
};

export const apiUpdateSeries = async ({ seriesId, body, accessToken }) => {
  try {
    const res = await http.put(
      `/series/update/${seriesId}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return { success: true, data: res.data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Lỗi cập nhật series",
    };
  }
};

export const apiDeleteSeries = async ({ seriesId, accessToken }) => {
  try {
    const res = await http.delete(`/series/${seriesId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (res.data?.code === 200) {
      return { success: true, message: res.data.message };
    } else {
      return { success: false, message: res.data.message || "Xóa thất bại" };
    }
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Lỗi khi kết nối máy chủ",
    };
  }
};

export { apiGetSeries };
