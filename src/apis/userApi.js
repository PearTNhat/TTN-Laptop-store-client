import { http } from "~/utils/http";

const getAuthHeader = () => {
  const { accessToken } = JSON.parse(localStorage.getItem("persist:shop/user"));
  console.log("aaa", accessToken)
  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
};


const apiFetchMyInfo = async ({ accessToken }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
    const { data } = await http.get("users/fetchInfo", config);
    return data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw new Error(error.message);
  }
};

export const apiUpdateUserInfo = async ({ body, accessToken }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
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
export const apiSendOtpChangeEmail = async (email, accessToken) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        email,
      },
    }
    console.log("âsa", accessToken)
    const response = await http.get("/users/send-otp-change-email", config);

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
export const apiChangeEmail = async ({ newEmail, otpCode, accessToken }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        newEmail,
        otpCode,
      },
    }
    const response = await http.put("/users/change-email", {}, config);

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
const apiGetAllUsers = async ({ accessToken, page = 1, size = 10, block = false }) => {
  try {
    page = page <= 1 ? 0 : page - 1;
    const params = {
      page,
      size,
      block
    };
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params,
    };
    const { data } = await http.get("users/all", config);
    return data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw new Error(error.message);
  }
};


export { apiFetchMyInfo, apiGetAllUsers }