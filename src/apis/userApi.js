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

export const apiFetchMyInfo = async ({ accessToken }) => {
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
export const apiGetAllUsers = async ({ accessToken, page = 1, size = 10, keyword = "", block = false }) => {
  try {
    page = page <= 1 ? 0 : page - 1;
    const params = {
      page,
      size,
      keyword,
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



export const apiGetRankUser = async ({ accessToken }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
    const { data } = await http.get("rank-levels/user", config);
    return data;
  } catch (error) {
    if (error.res && error.res.data) {
      return error.res.data;
    }
    throw new Error(error.message)
  }
}

export const apiPostRating = async ({ accessToken, content, reviewImage, productDetailId, orderId, rating }) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };
    const body = { content, reviewImage, productDetailId, orderId, rating };
    const { data } = await http.post("/reviews/rating", body, config);
    return data;
  } catch (error) {
    if (error.response?.data) return error.response.data;
    throw new Error(error.message);
  }
};




// để đưa qua usermanagement
export const apiGetRoles = async ({ accessToken }) => {
  try {
    const { data } = await http.get("/roles", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return data;
  } catch (error) {
    console.error("Lỗi getRoles:", error);
    throw error;
  }
};

export const apiChangeUserRole = async ({ userId, roleId, accessToken }) => {
  try {
    const payload = {
      userId,
      roleIds: [roleId],
    };
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const { data } = await http.put("users/change-role", payload, config);
    return data;
  } catch (error) {
    if (error.response?.data) {
      return error.response.data;
    }
    throw new Error(error.message);
  }
};

export const apiDeleteUser = async ({ userId, accessToken }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        userId, // truyền userId vào query param
      }
    };

    const response = await http.delete("/users", config);
    const res = response.data;

    if (res?.code === 200) {
      return {
        success: true,
        message: res.message || "Khóa tài khoản thành công!",
      };
    } else {
      return {
        success: false,
        message: res.message || "Khóa tài khoản thất bại.",
      };
    }
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Không thể kết nối máy chủ.",
    };
  }
};
export const apiCheckRating = async ({ orderId, accessToken }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const { data } = await http.get(
      `reviews/rating/${orderId}`,
      config
    );

    console.log("API Check Rating:", data);
    return data;
  } catch (error) {
    if (error.response && error.response.data) {
      console.error("Lỗi check rating:", error.response.data);
      return error.response.data;
    }
    throw new Error(error.message);
  }
};


