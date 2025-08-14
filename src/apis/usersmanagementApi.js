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

// Nếu cần thêm API khác:
// export const apiCreateUser = async ({ body, accessToken }) => {
//   try {
//     const config = {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     };
//     const response = await http.post("/users/create", body, config);
//     const res = response.data;
//     if (res?.code === 200) {
//       return { success: true, data: res.data, message: res.message || "Tạo người dùng thành công!" };
//     } else {
//       return { success: false, message: res.message || "Tạo người dùng thất bại." };
//     }
//   } catch (error) {
//     return {
//       success: false,
//       message: error.response?.data?.message || "Không thể kết nối máy chủ.",
//     };
//   }
// };

// export const apiUpdateUser = async ({ id, body, accessToken }) => {
//   try {
//     const config = {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     };
//     const response = await http.put(`/users/update/${id}`, body, config);
//     const res = response.data;
//     if (res?.code === 200) {
//       return { success: true, data: res.data, message: res.message || "Cập nhật thành công!" };
//     } else {
//       return { success: false, message: res.message || "Cập nhật thất bại." };
//     }
//   } catch (error) {
//     return {
//       success: false,
//       message: error.response?.data?.message || "Không thể kết nối máy chủ.",
//     };
//   }
// };

// export const apiBlockUser = async ({ id, blocked, accessToken }) => {
//   try {
//     const config = {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     };
//     const response = await http.patch(`/users/block/${id}`, { blocked }, config);
//     const res = response.data;
//     if (res?.code === 200) {
//       return { success: true, message: res.message || (blocked ? "Khóa thành công!" : "Mở khóa thành công!") };
//     } else {
//       return { success: false, message: res.message || (blocked ? "Khóa thất bại." : "Mở khóa thất bại.") };
//     }
//   } catch (error) {
//     return {
//       success: false,
//       message: error.response?.data?.message || "Thao tác thất bại.",
//     };
//   }
// };