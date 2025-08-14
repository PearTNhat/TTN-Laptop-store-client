import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { Search, Package, X } from "lucide-react";
import { apiGetAllProductDetails } from "~/apis/productApi";
import { showToastError } from "~/utils/alert";
import { formatPrice } from "~/utils/helper";
import Pagination from "~/components/pagination/Pagination";

const ProductDetailSelectModal = ({
  isOpen,
  onClose,
  onSelect,
  selectedProductId = null,
}) => {
  const { accessToken } = useSelector((state) => state.user);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalElements: 0,
  });

  // Fetch products - sử dụng useCallback để tránh dependency issue
  const fetchProducts = useCallback(
    async (page = 1, title = "") => {
      setLoading(true);
      try {
        const response = await apiGetAllProductDetails({
          accessToken,
          page,
          size: 10,
          title: title.trim() || undefined,
        });

        if (response.code === 200) {
          console.log(response.data.totalPages);
          setProducts(response.data.content || []);
          setPagination({
            currentPage: response.data.pageNumber + 1,
            totalPages: response.data.totalPages,
          });
        } else {
          showToastError("Không thể tải danh sách sản phẩm");
        }
      } catch (error) {
        showToastError("Lỗi khi tải danh sách sản phẩm");
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [accessToken]
  );
  // Load data when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchProducts(1, searchTerm);
    }
  }, [isOpen, fetchProducts, searchTerm]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(1, searchTerm);
  };

  // Handle page change
  const handlePageChange = (page) => {
    fetchProducts(page, searchTerm);
  };

  // Handle select product
  const handleSelectProduct = (product) => {
    onSelect(product);
    onClose();
  };

  // Handle close
  const handleClose = () => {
    setSearchTerm("");
    setProducts([]);
    setPagination({ currentPage: 1, totalPages: 1, totalElements: 0 });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            Chọn Sản Phẩm Detail
          </DialogTitle>
        </DialogHeader>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm theo tên sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit" disabled={loading}>
            Tìm kiếm
          </Button>
        </form>

        {/* Products list */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-gray-500">Đang tải...</div>
            </div>
          ) : products.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-gray-500">Không tìm thấy sản phẩm nào</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className={`flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedProductId === product.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                  onClick={() => handleSelectProduct(product)}
                >
                  {/* Product Image */}
                  <div className="w-16 h-16 flex-shrink-0">
                    <img
                      src={product.thumbnail || "/placeholder-image.jpg"}
                      alt={product.title}
                      className="w-full h-full object-cover rounded-lg border"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {product.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        ID: {product.id}
                      </Badge>
                      {product.name && (
                        <Badge variant="secondary" className="text-xs">
                          {product.name}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      {product.originalPrice && (
                        <span className="text-sm font-medium text-green-600">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                      {product.discountPrice &&
                        product.discountPrice !== product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(product.discountPrice)}
                          </span>
                        )}
                    </div>
                  </div>

                  {/* Color indicator if available */}
                  {product.hex && (
                    <div className="flex-shrink-0">
                      <div
                        className="w-6 h-6 rounded-full border border-gray-300"
                        style={{ backgroundColor: product.hex }}
                        title={`Màu: ${product.name || "N/A"}`}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="border-t pt-4">
          <Pagination
            currentPage={pagination.currentPage}
            totalPageCount={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            <X className="h-4 w-4 mr-2" />
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailSelectModal;
