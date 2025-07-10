/* eslint-disable react/prop-types */
import { memo } from "react";

/**
 * Component Button linh hoạt với các biến thể.
 * @param {object} props
 * @param {React.ReactNode} props.children - Nội dung bên trong button.
 * @param {function} [props.onClick] - Hàm xử lý sự kiện click.
 * @param {string} [props.className] - Các class TailwindCSS tùy chỉnh.
 * @param {boolean} [props.outline=false] - Biến thể outline.
 * @param {boolean} [props.wf=false] - Chế độ full-width (width: 100%).
 * @param {boolean} [props.disabled=false] - Trạng thái vô hiệu hóa.
 * @param {'button' | 'submit' | 'reset'} [props.type='button'] - Loại button.
 * @param {React.ElementType} [props.as='button'] - Render button dưới dạng thẻ HTML khác (ví dụ: 'a').
 */
function Button({
  children,
  onClick,
  className = "",
  outline = false,
  wf = false,
  disabled = false,
  type = "button",
  as: Component = "button",
  ...rest
}) {
  // --- Định nghĩa các lớp style cơ bản ---
  const baseClasses =
    "inline-flex items-center justify-center px-6 py-2 font-semibold text-center rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const disabledClasses = "disabled:opacity-60 disabled:cursor-not-allowed";

  // --- Định nghĩa style cho các biến thể ---
  const variantClasses = outline
    ? // Style cho button OUTLINE
      "bg-transparent border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white focus:ring-blue-500"
    : // Style cho button SOLID (mặc định)
      "bg-blue-500 text-white border-2 border-transparent hover:bg-blue-600 focus:ring-blue-500";

  // --- Style cho full-width ---
  const widthClass = wf ? "w-full" : "";

  // Kết hợp tất cả các lớp style lại
  const finalClasses = [
    baseClasses,
    variantClasses,
    widthClass,
    disabledClasses,
    className, // Lớp tùy chỉnh từ props sẽ ghi đè nếu cần
  ]
    .filter(Boolean) // Lọc ra các giá trị rỗng
    .join(" ");

  return (
    <Component
      type={Component === "button" ? type : undefined}
      className={finalClasses}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </Component>
  );
}

export default memo(Button);
