import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { PlusCircle, Search, Download, ListFilter } from "lucide-react";
import Swal from "sweetalert2";
import { createRoot } from "react-dom/client";

// --- Các component và API của bạn ---
import { apiGetListProducts } from "~/apis/productApi";
import ProductDetailModal from "./components/ProductDetailModal";
import ProductTable from "./components/ProductTable"; // Import component bảng mới
import LoadingSpinner from "~/components/loading/LoadingSpinner";
import Pagination from "~/components/pagination/Pagination";
import ConfirmModal from "~/components/modal/ConfirmModal";
import { showToastError } from "~/utils/alert";
import { apiGetBrands } from "~/apis/brandApi";
import { apiGetCategories } from "~/apis/categoryApi";
import { apiGetColors } from "~/apis/colorApi";
import ProductCreateDialog from "./components/create/ProductCreateDialog";

const ProductManagement = () => {
  const { accessToken } = useSelector((state) => state.user);
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [colorsOptions, setColorsOptions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [editingProduct, setEditingProduct] = useState(null);
  const currentParams = useMemo(
    () => Object.fromEntries([...searchParams]),
    [searchParams]
  );
  const handleOpenCreateModal = () => {
    setEditingProduct(null); // Đảm bảo không có dữ liệu sửa
    setIsModalOpen(true);
  };
  const handleOpenEditModal = (product) => {
    setEditingProduct(product); // Đặt dữ liệu sản phẩm cần sửa
    setIsModalOpen(true);
  };
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const responseData = await apiGetBrands();
        if (responseData.code !== 200) {
          throw new Error(responseData.message || "Lỗi khi tải sản phẩm");
        }
        const { data } = responseData;
        setBrands(data || []);
      } catch (err) {
        showToastError(err.message);
      }
    };
    const fetchCategories = async () => {
      try {
        const responseData = await apiGetCategories();
        if (responseData.code !== 200) {
          throw new Error(responseData.message || "Lỗi khi tải danh mục");
        }
        const { data } = responseData;
        setCategories(data || []);
      } catch (err) {
        showToastError(err.message);
      }
    };
    const fetchColors = async ({ accessToken }) => {
      try {
        const responseData = await apiGetColors({ accessToken });
        if (responseData.code !== 200) {
          throw new Error(responseData.message || "Lỗi khi tải màu sắc");
        }
        const { data } = responseData;
        setColorsOptions(
          data.map((color) => ({
            value: color.id,
            label: color.name,
            hex: color.hex,
          })) || []
        );
      } catch (err) {
        showToastError(err.message);
      }
    };
    fetchColors({ accessToken });
    fetchBrands();
    fetchCategories();
  }, [accessToken, currentParams]);
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const params = {
          page: currentParams.page || "1",
          size: currentParams.size || "10",
          ...currentParams,
        };
        const responseData = await apiGetListProducts({
          accessToken,
          ...params,
        });
        if (responseData.code !== 0 && responseData.code !== 200) {
          throw new Error(responseData.message || "Lỗi khi tải sản phẩm");
        }
        const { data } = responseData;
        setProducts(data.content || []);
        setPagination({
          currentPage: data.page.number + 1,
          totalPages: data.page.totalPages,
        });
      } catch (err) {
        showToastError(err.message);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [currentParams]);
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm !== (currentParams.q || "")) {
        setSearchParams((prev) => {
          if (searchTerm.trim()) prev.set("q", searchTerm.trim());
          else prev.delete("q");
          prev.set("page", "0");
          return prev;
        });
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, setSearchParams, currentParams.q]);

  const handlePageChange = (page) => {
    setSearchParams({ ...currentParams, page });
  };

  const handleShowDetails = (product) => {
    Swal.fire({
      html: '<div id="product-detail-container"></div>',
      width: "90%",
      maxWidth: "1200px",
      showConfirmButton: false,
      showCloseButton: true,
      customClass: { popup: "p-0", htmlContainer: "m-0" },
      didOpen: () => {
        const container = document.getElementById("product-detail-container");
        if (container)
          createRoot(container).render(
            <ProductDetailModal product={product} />
          );
      },
    });
  };

  // Hàm xử lý khi nhấn nút Sửa (có thể mở modal sửa sau này)
  const handleEditProduct = (product) => {
    setEditingProduct(product); // Đặt dữ liệu sản phẩm cần sửa
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (productId, productName) => {
    const result = await ConfirmModal.delete({
      title: `Xác nhận xóa sản phẩm`,
      text: `Bạn có chắc muốn xóa "${productName}"? Hành động này không thể hoàn tác.`,
    });
    if (result.isConfirmed) {
      // TODO: Gọi API xóa sản phẩm thật ở đây
      ConfirmModal.toast({ icon: "success", title: "Đã xóa sản phẩm!" });
      // fetchProducts();
    }
  };

  const renderContent = () => {
    if (isLoading) return <LoadingSpinner />;
    if (products.length === 0) {
      return (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold text-gray-700">
            Không tìm thấy sản phẩm
          </h3>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Sử dụng component ProductTable mới */}
        <ProductTable
          products={products}
          onShowDetails={handleShowDetails}
          onDelete={handleDeleteProduct}
          onEdit={handleEditProduct}
        />
        <Pagination
          currentPage={pagination.currentPage}
          totalPageCount={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    );
  };

  return (
    <>
      <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
        {/* Header và Filter giữ nguyên */}
        <div className="p-8 rounded-2xl text-white mb-8 bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold">Quản lý Sản phẩm</h1>
              <p className="mt-2 text-blue-200">
                Theo dõi, cập nhật và quản lý kho sản phẩm của bạn.
              </p>
            </div>
            <button
              className="inline-flex items-center justify-center rounded-lg text-sm font-semibold bg-white text-blue-600 hover:bg-blue-50 h-11 px-5 py-2 transition-colors"
              onClick={() => handleOpenCreateModal(true)}
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Thêm sản phẩm
            </button>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-auto flex-grow">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm theo tên, mã sản phẩm, thương hiệu..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:outline-none transition"
            />
          </div>
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 px-4 py-2.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
              <ListFilter size={18} />
              <span>Lọc</span>
            </button>
          </div>
        </div>
        {renderContent()}
      </div>
      <ProductCreateDialog
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onSuccess={() => {}} // Tải lại danh sách khi tạo thành công
        brands={brands}
        colorsOptions={colorsOptions}
        categories={categories}
        accessToken={accessToken}
        editingProduct={editingProduct}
      />
    </>
  );
};

export default ProductManagement;
