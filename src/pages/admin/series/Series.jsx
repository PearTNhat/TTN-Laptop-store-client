import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FaSearch, FaPlus } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Pagination from "~/components/pagination/Pagination";
import { useSelector } from "react-redux";

import SeriesStats from "./components/SeriesStats";
import SeriesTableRow from "./components/SeriesTableRow";
import SeriesForm from "./components/SeriesForm";

import { apiGetSeries, apiCreateSeries, apiUpdateSeries, apiDeleteSeries } from "~/apis/series"
import { apiGetBrands } from "~/apis/brandApi";

function Series() {
  const [series, setSeries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [seriesToDelete, setSeriesToDelete] = useState(null);
  const [brands, setBrands] = useState([]);
  const {accessToken}=useSelector(state=>state.user)

  const seriesPerPage = 5;

  useEffect(() => {
    const fetchSeries = async () => {
      setIsLoading(true);
      try {
        const res = await apiGetSeries();

        // 📌 LOG DỮ LIỆU NHẬN ĐƯỢC
        console.log("📦 Kết quả từ API getSeries:", res);

        // Kiểm tra nếu res là { code: 200, data: [...] }
        const list = Array.isArray(res?.data) ? res.data : [];

        const formatted = list.map((item) => ({
          ...item,
          brandName: item.brandName || "Unknown",
        }));

        setSeries(formatted);
      } catch (error) {
        console.error("❌ Lỗi khi gọi getSeries:", error);
        toast.error("Không thể tải danh sách series");
      } finally {
        setIsLoading(false);
      }
    };
    const fetchBrands = async () => {
      try {
        const res = await apiGetBrands();
        if (res && res.code === 200 && Array.isArray(res.data)) {
          setBrands(res.data);
        }
      } catch (error) {
        toast.error("Không thể tải danh sách thương hiệu");
      }
    };

    fetchSeries();
    fetchBrands();
  }, []);

  
  const handleAdd = async (newSeries) => {
    try {
      // console.log("🔥 Brands đang có:", brands);
      const res = await apiCreateSeries({ brandId: newSeries.brandId, body: newSeries, accessToken });
      if (res.success) {
        const brand = brands.find(b => String(b.id) === String(newSeries.brandId));
        const seriesWithBrand = {
          ...res.data,
          name: res.data.name || newSeries.name,
          description: res.data.description || newSeries.description,
          brandName: brand ? brand.name : "Unknown"
        };

        setSeries([seriesWithBrand, ...series]);
        toast.success("Thêm dòng sản phẩm thành công!");
        setShowDialog(false);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Thêm thất bại!");
    }
  };

  const handleUpdate = async (updatedSeries) => {
    try {
      const res = await apiUpdateSeries({ seriesId: updatedSeries.id, body: updatedSeries, accessToken });
      console.log("🔍 ID cần sửa  :", updatedSeries?.id);
      if (res.success) {
        setSeries(series.map((s) => 
          s.id === updatedSeries.id
            ? {
                ...s, // giữ lại brandName, brandId, v.v...
                name: updatedSeries.name,
                description:updatedSeries.description,
              }
            : s
        ));

        toast.success("Cập nhật dòng sản phẩm thành công!");
        setShowDialog(false);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Cập nhật thất bại!");
    }
  };

  const confirmDelete = async () => {
    if (seriesToDelete) {
      try {
        const res = await apiDeleteSeries({ seriesId: seriesToDelete.id, accessToken });
        console.log("🔍 ID cần xóa:", seriesToDelete?.id);
        if (res.success) {
          setSeries(series.filter((s) => s.id !== seriesToDelete.id));
          toast.success(`Đã xóa "${seriesToDelete.name}"`);
        } else {
          toast.error(res.message);
        }
      } catch (error) {
        toast.error("Xóa thất bại!");
      }
    }
    setShowDeleteDialog(false);
  };

  const filteredSeries = series.filter((s) =>
    (s.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLast = currentPage * seriesPerPage;
  const indexOfFirst = indexOfLast - seriesPerPage;
  const currentSeries = filteredSeries.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredSeries.length / seriesPerPage);
  const totalProducts = series.reduce((sum, s) => sum + (s.productCount || 0), 0);

  return (
    <div className="p-6 bg-white min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />

      <h1 className="text-4xl font-bold text-gray-900 mb-2">Quản lý Dòng sản phẩm</h1>
      <p className="text-gray-600 mb-6">Theo dõi & kiểm soát các dòng sản phẩm</p>

      <SeriesStats total={series.length} totalProducts={totalProducts} />

      <div className="flex items-center justify-between bg-white border p-4 rounded-xl shadow-sm mb-6">
        <div className="relative w-96">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Tìm kiếm dòng sản phẩm..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => {
            setSelectedSeries(null);
            setShowDialog(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaPlus /> Thêm dòng sản phẩm
        </button>
      </div>

      <div className="border rounded-xl shadow-sm overflow-hidden mb-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dòng sản phẩm
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thương hiệu
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan="3" className="px-6 py-4">
                  <Skeleton count={5} height={40} />
                </td>
              </tr>
            ) : currentSeries.length > 0 ? (
              currentSeries.map((s) => (
                <SeriesTableRow
                  key={`series-${s.id}`}
                  series={s}
                  onEdit={(s) => {
                    const actualSeries = s.data ?? s; // Nếu có s.data thì dùng, không thì dùng s
                    console.log("🟡 Đang sửa series:", actualSeries);
                    setSelectedSeries(actualSeries);
                    setShowDialog(true);
                  }}
                  onDelete={(s) => {
                    console.log("🗑 Xóa dòng:", s);
                    setSeriesToDelete(s);
                    setShowDeleteDialog(true);
                  }}
                />
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center text-gray-500 py-4">
                  Không có dòng sản phẩm nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!isLoading && (
        <Pagination
          currentPage={currentPage}
          totalPageCount={totalPages}
          onPageChange={setCurrentPage}
          siblingCount={1}
          showFirstLast
        />
      )}

       {/* Dialog - Xóa */}
      <Transition appear show={showDeleteDialog} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowDeleteDialog(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-30" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl">
                  <Dialog.Title className="text-lg font-semibold mb-4">
                    Xác nhận xóa dòng sản phẩm
                  </Dialog.Title>
                  <p className="text-sm text-gray-600 mb-6">
                    Bạn có chắc chắn muốn xóa dòng sản phẩm "{seriesToDelete?.name}" không? Hành động này không thể hoàn tác.
                  </p>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setShowDeleteDialog(false)}
                      className="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={confirmDelete}
                      className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Xóa
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Dialog - Thêm / Sửa */}
      <Transition appear show={showDialog} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowDialog(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 bg-black bg-opacity-30" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl bg-white rounded-2xl p-6 shadow-xl transition-all">
                  <SeriesForm
                    series={selectedSeries}
                    onSubmit={selectedSeries ? handleUpdate : handleAdd}
                    onCancel={() => setShowDialog(false)}
                    brands={brands}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}

export default Series;
