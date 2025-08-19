import { http } from "~/utils/http";

export const apiGetUsers = async ({ page = 0, size = 10, search = "", accessToken }) => {
  try {
    const params = { page, size };
    if (search) params.search = search;

    const { data } = await http.get("/users/all", {
      params,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (data?.code === 200) {
      return {
        content: data.data.content,
        totalPages: data.data.totalPages,
        totalElements: data.data.totalElements,
      };
    } else {
      throw new Error(data.message || "Lấy danh sách người dùng thất bại");
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error(
      error.response?.data?.message || "Không thể kết nối đến máy chủ."
    );
  }
};

export const apiGetReviewByOrder = async ({ orderId, accessToken }) => {
  try {
    const { data } = await http.get(`/reviews/rating/${orderId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (data?.code === 200) {
      return data.data; 
    } else {
      throw new Error(data.message || "Lấy đánh giá thất bại");
    }
  } catch (error) {
    console.error("Error fetching review:", error);
    throw new Error(
      error.response?.data?.message || "Không thể kết nối đến máy chủ."
    );
  }
};

export const apiRepay = async (orderId, accessToken) => {
  try {
    const { data } = await http.get(`/payment/${orderId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (data?.code === 200) {
      return data.data; // { payUrl, qrCodeUrl, deeplink }
    } else {
      throw new Error(data.message || "Tạo lại thanh toán thất bại");
    }
  } catch (error) {
    console.error("❌ Error creating repay link:", error);
    throw new Error(
      error.response?.data?.message || "Không thể kết nối đến máy chủ."
    );
  }
};