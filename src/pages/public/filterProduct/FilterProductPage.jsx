import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import FilterSidebar from "./components/FilterSidebar";
import ProductGrid from "./components/ProductGrid";
import FilterHeader from "./components/FilterHeader";
import { fakeProducts } from "~/data/fakeData";

// Bạn sẽ thay thế phần này bằng hàm gọi API thật
import { showToastError } from "~/utils/alert";
import Pagination from "~/components/pagination/Pagination";
import { apiGetProducts } from "~/apis/productApi";

const FilterProductPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  // Dùng useMemo để chỉ tính toán lại currentParams khi searchParams thay đổi
  const currentParams = useMemo(
    () => Object.fromEntries([...searchParams]),
    [searchParams]
  );
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
  });
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        // Lấy các tham số từ URL, gán giá trị mặc định nếu cần
        const params = {
          page: currentParams.page || "0",
          size: currentParams.limit || "12",
          ...currentParams,
        };
        const res = await apiGetProducts({
          ...params,
        });
        console.log(res.data);
        setProducts(res.data.content);
        setPagination({
          totalItems: res.data.totalElements,
          totalPages: res.data.totalPages,
          currentPage: res.data.pageNumber + 1, // API trả về trang hiện tại (0-based)
        });
      } catch (err) {
        const errorMessage = err.message || "Không thể kết nối đến máy chủ.";
        showToastError(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentParams]); // Chỉ chạy lại khi params trên URL thay đổi
  const handlePageChange = (page) => {
    const newPage = page;
    const newParams = { ...currentParams, page: newPage };
    setSearchParams(newParams);
  };
  useEffect(() => {
    window.scrollTo(0, 0); // Cuộn lên đầu trang mỗi khi filter thay đổi
  }, []);

  return (
    <main className="bg-gray-50">
      <div className="mx-auto px-4 py-10">
        {/* Hiển thị các sản phẩm */}
        <div className="flex flex-col lg:flex-row gap-2 items-start">
          <FilterSidebar />
          <div className="w-full lg:flex-1">
            <FilterHeader totalProducts={fakeProducts.length} />
            <ProductGrid products={products} loading={loading} error={error} />
            <Pagination
              currentPage={pagination.currentPage}
              totalPageCount={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default FilterProductPage;
