import Swal from "sweetalert2";

/**
 * ConfirmModal - Component dùng chung cho tất cả các modal xác nhận
 * Sử dụng SweetAlert2 để hiển thị modal xác nhận
 */
class ConfirmModal {
  /**
   * Hiển thị modal xác nhận cơ bản
   * @param {Object} options - Tùy chọn cho modal
   * @param {string} options.title - Tiêu đề modal
   * @param {string} options.text - Nội dung modal
   * @param {string} options.confirmButtonText - Text nút xác nhận
   * @param {string} options.cancelButtonText - Text nút hủy
   * @param {string} options.icon - Icon hiển thị (success, error, warning, info, question)
   * @param {string} options.confirmButtonColor - Màu nút xác nhận
   * @param {string} options.cancelButtonColor - Màu nút hủy
   * @returns {Promise} Promise trả về kết quả xác nhận
   */
  static async show(options = {}) {
    const {
      title = "Xác nhận",
      text = "Bạn có chắc chắn muốn thực hiện hành động này?",
      confirmButtonText = "Xác nhận",
      cancelButtonText = "Hủy",
      icon = "question",
      confirmButtonColor = "#3085d6",
      cancelButtonColor = "#d33",
      showCancelButton = true,
      ...otherOptions
    } = options;

    return await Swal.fire({
      title,
      text,
      icon,
      showCancelButton,
      confirmButtonColor,
      cancelButtonColor,
      confirmButtonText,
      cancelButtonText,
      reverseButtons: true,
      ...otherOptions,
    });
  }

  /**
   * Modal xác nhận xóa
   */
  static async delete(options = {}) {
    return await this.show({
      title: "Xác nhận xóa",
      text: "Bạn có chắc chắn muốn xóa? Hành động này không thể hoàn tác!",
      icon: "warning",
      confirmButtonText: "Xóa",
      confirmButtonColor: "#d33",
      cancelButtonText: "Hủy",
      ...options,
    });
  }

  /**
   * Modal xác nhận cập nhật
   */
  static async update(options = {}) {
    return await this.show({
      title: "Xác nhận cập nhật",
      text: "Bạn có chắc chắn muốn cập nhật thông tin này?",
      icon: "question",
      confirmButtonText: "Cập nhật",
      confirmButtonColor: "#28a745",
      cancelButtonText: "Hủy",
      ...options,
    });
  }

  /**
   * Modal xác nhận phê duyệt
   */
  static async approve(options = {}) {
    return await this.show({
      title: "Xác nhận phê duyệt",
      text: "Bạn có chắc chắn muốn phê duyệt?",
      icon: "success",
      confirmButtonText: "Phê duyệt",
      confirmButtonColor: "#28a745",
      cancelButtonText: "Hủy",
      ...options,
    });
  }

  /**
   * Modal xác nhận từ chối
   */
  static async reject(options = {}) {
    return await this.show({
      title: "Xác nhận từ chối",
      text: "Bạn có chắc chắn muốn từ chối?",
      icon: "warning",
      confirmButtonText: "Từ chối",
      confirmButtonColor: "#dc3545",
      cancelButtonText: "Hủy",
      ...options,
    });
  }

  /**
   * Modal thông báo thành công
   */
  static async success(options = {}) {
    const {
      title = "Thành công!",
      text = "Thao tác đã được thực hiện thành công.",
      confirmButtonText = "OK",
      ...otherOptions
    } = options;

    return await Swal.fire({
      title,
      text,
      icon: "success",
      confirmButtonText,
      confirmButtonColor: "#28a745",
      ...otherOptions,
    });
  }

  /**
   * Modal thông báo lỗi
   */
  static async error(options = {}) {
    const {
      title = "Lỗi!",
      text = "Đã xảy ra lỗi khi thực hiện thao tác.",
      confirmButtonText = "OK",
      ...otherOptions
    } = options;

    return await Swal.fire({
      title,
      text,
      icon: "error",
      confirmButtonText,
      confirmButtonColor: "#dc3545",
      ...otherOptions,
    });
  }

  /**
   * Modal với input để nhập lý do
   */
  static async withInput(options = {}) {
    const {
      title = "Nhập lý do",
      text = "Vui lòng nhập lý do:",
      inputPlaceholder = "Nhập lý do...",
      confirmButtonText = "Xác nhận",
      cancelButtonText = "Hủy",
      icon = "question",
      inputValidator = null,
      ...otherOptions
    } = options;

    return await Swal.fire({
      title,
      text,
      icon,
      input: "textarea",
      inputPlaceholder,
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText,
      inputValidator:
        inputValidator ||
        ((value) => {
          if (!value.trim()) {
            return "Vui lòng nhập lý do!";
          }
        }),
      ...otherOptions,
    });
  }

  /**
   * Modal với select để chọn trạng thái
   */
  static async withSelect(options = {}) {
    const {
      title = "Chọn trạng thái",
      text = "Vui lòng chọn trạng thái mới:",
      inputOptions = {},
      confirmButtonText = "Xác nhận",
      cancelButtonText = "Hủy",
      icon = "question",
      ...otherOptions
    } = options;

    return await Swal.fire({
      title,
      text,
      icon,
      input: "select",
      inputOptions,
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText,
      inputValidator: (value) => {
        if (!value) {
          return "Vui lòng chọn một tùy chọn!";
        }
      },
      ...otherOptions,
    });
  }

  /**
   * Toast notification
   */
  static toast(options = {}) {
    const {
      icon = "success",
      title = "Thành công!",
      position = "top-end",
      showConfirmButton = false,
      timer = 3000,
      timerProgressBar = true,
      ...otherOptions
    } = options;

    return Swal.fire({
      toast: true,
      position,
      icon,
      title,
      showConfirmButton,
      timer,
      timerProgressBar,
      ...otherOptions,
    });
  }
}

export default ConfirmModal;
