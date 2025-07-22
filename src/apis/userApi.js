import { http } from "~/utils/http";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};


export const apiFetchMyInfo = async () => {
  try {
    const { data } = await http.get("users/fetchInfo", getAuthHeader());
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
    const response = await http.put("/users/update", body,  getAuthHeader());
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

export const apiGetMyVouchers = async () => {
  try {
    const response = await http.get("/product-promotions/my-vouchers", getAuthHeader());
    const res = response.data;

    if (res?.code === 200 && res?.data) {
      return {
        success: true,
        data: res.data,
      };
    } else {
      return {
        success: false,
        message: res?.message || "Không lấy được danh sách voucher.",
      };
    }
  } catch (error) {
    if (error.response) {
      return {
        success: false,
        message: error.response.data?.message || "Lỗi từ máy chủ.",
      };
    }
    return { success: false, message: "Không kết nối được đến máy chủ." };
  }
};

/// 🆕 Gửi OTP để đổi email
export const apiSendOtpChangeEmail = async (email) => {
  try {
    const response = await http.get("/users/send-otp-change-email", {
      params: { email },
      ...getAuthHeader(),
    });

    return {
      code: response.data.code,
      message: response.data.message,
    };
  } catch (error) {
    return {
      code: error.response?.status || 500,
      message: error.response?.data?.message || "Không gửi được mã xác nhận.",
    };
  }
};

/// 🆕 Đổi email
export const apiChangeEmail = async ({ newEmail, otpCode }) => {
  try {
    const response = await http.put(
      "/users/change-email",
      {},
      {
        params: { newEmail, otpCode },
        ...getAuthHeader(),
      }
    );

    return {
      code: response.data.code,
      message: response.data.message,
    };
  } catch (error) {
    return {
      code: error.response?.status || 500,
      message: error.response?.data?.message || "Không đổi được email.",
    };
  }
};