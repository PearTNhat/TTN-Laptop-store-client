import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { productPaths } from "~/constants/paths";

export const SearchBar = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // Lấy keyword từ URL để hiển thị trong ô search nếu có
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("keyword") || ""
  );

  // Hàm xử lý việc tìm kiếm và điều hướng
  const handleSearch = (e) => {
    // Ngăn form submit và reload trang (nếu dùng thẻ form)
    e.preventDefault();

    // Bỏ qua nếu ô tìm kiếm trống
    if (!searchTerm.trim()) {
      // Tùy chọn: có thể điều hướng về trang products không có keyword
      // navigate(productPaths.PRODUCTS);
      return;
    }

    // Điều hướng đến trang sản phẩm với query parameter
    navigate(`${productPaths.PRODUCTS}?keyword=${searchTerm.trim()}`);
  };

  return (
    // Sử dụng thẻ form để có thể submit bằng phím Enter một cách tự nhiên
    <form onSubmit={handleSearch} className="relative w-full">
      <input
        type="text"
        placeholder="Tìm kiếm sản phẩm..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full h-11 px-4 py-2  pr-12 text-gray-700 bg-gray-100 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
      />
      {/* Nút tìm kiếm (icon kính lúp) */}
      <button
        type="submit" // Nút này sẽ submit form khi được click
        className="absolute right-0 top-0 h-full px-3 flex items-center text-gray-400 hover:text-blue-600 rounded-full"
        aria-label="Tìm kiếm"
      >
        <Search size={18} />
      </button>
    </form>
  );
};
