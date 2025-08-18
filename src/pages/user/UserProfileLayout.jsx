import { NavLink, Outlet } from "react-router-dom";
import { userNavItems } from "~/constants/navUser";
// Giữ lại các icon cũ và thêm một vài icon mới để UI sinh động hơn
import { HiOutlineUser, HiCamera, HiArrowRight, HiX } from "react-icons/hi";
import { FaTrophy, FaArrowUp, FaCheckCircle, FaStar } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { apiFetchMyInfo, apiGetRankUser } from "~/apis/userApi";
import { apiUpdateAvatar } from "~/apis/update_useravatarApi";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

// COMPONENT CON: RankProgress được cải tiến với giao diện đẹp hơn
const RankProgress = ({ label, currentValue, targetValue, unit = "" }) => {
  const progress = targetValue > 0 ? Math.min((currentValue / targetValue) * 100, 100) : 100;
  const isCompleted = progress >= 100;

  return (
    <div>
      <div className="flex justify-between items-center text-sm mb-1">
        <span className="font-medium text-gray-700">{label}</span>
        <div className="flex items-center gap-1.5 text-xs">
          {isCompleted && <FaCheckCircle className="text-emerald-500" />}
          <span className={`font-semibold ${isCompleted ? "text-emerald-600" : "text-gray-600"}`}>
            {new Intl.NumberFormat("vi-VN").format(currentValue)} / {new Intl.NumberFormat("vi-VN").format(targetValue)}{unit}
          </span>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden shadow-inner">
        <div
          className={`h-2 rounded-full transition-all duration-700 ease-out ${isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-cyan-400 to-blue-500'}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};


export default function UserProfileLayout() {
  const { accessToken } = useSelector((state) => state.user);
  const [avatar, setAvatar] = useState("");
  const [fullName, setFullName] = useState("");
  const [userRank, setUserRank] = useState(null);
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  const [isRankModalOpen, setIsRankModalOpen] = useState(false);
  
  const openRankModal = () => setIsRankModalOpen(true);
  const closeRankModal = () => setIsRankModalOpen(false);

  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiFetchMyInfo({ accessToken });
        if (response.code === 200 && response.data) {
          setAvatar(response.data.avatar);
          const name = `${response.data.lastName || ""} ${response.data.firstName || ""}`.trim();
          setFullName(name || "Người dùng");
        }

        const rankRes = await apiGetRankUser({ accessToken });
        if (rankRes.code === 200 && rankRes.data) {
          setUserRank(rankRes.data);
        }
      } catch (err) {
        console.error("❌ Lỗi khi fetch profile data:", err);
      }
    };
    fetchProfile();
  }, [accessToken]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Ảnh quá lớn! Vui lòng chọn ảnh dưới 2MB.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    setLoadingAvatar(true);

    try {
      const updateRes = await apiUpdateAvatar({ accessToken, file: formData });
      if (updateRes.code === 200) {
        // Tạo URL tạm thời để hiển thị ảnh ngay lập tức
        setAvatar(URL.createObjectURL(file));
      } else {
        alert(updateRes.message || "Cập nhật avatar thất bại!");
      }
    } catch (err) {
      console.error("❌ Lỗi khi xử lý ảnh:", err);
      alert("Có lỗi xảy ra khi cập nhật ảnh.");
    } finally {
      setLoadingAvatar(false);
    }
  };

  // Nâng cấp giao diện tổng thể
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Header được làm lại với hiệu ứng glassmorphism */}
      <header className="bg-white/70 backdrop-blur-lg border-b border-gray-200/80 shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Avatar với hiệu ứng mới */}
            <div className="relative">
              <label className="group w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg cursor-pointer block transform hover:scale-105 transition-transform duration-300">
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Avatar"
                    className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-50"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                    <HiOutlineUser size={48} />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <HiCamera className="text-white text-4xl" />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {loadingAvatar && (
                <div className="absolute inset-0 rounded-full bg-white/60 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            {/* Thông tin người dùng & Hạng, thiết kế lại cho rõ ràng hơn */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800">{fullName}</h1>
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaTrophy className="text-amber-500" />
                    <span>Hạng:</span>
                    <span className="px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs rounded-full font-bold shadow-md">
                      {userRank?.currentRank?.name || "Chưa có hạng"}
                    </span>
                  </div>
                  <button
                    onClick={openRankModal}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 group"
                  >
                    Xem chi tiết
                    <HiArrowRight className="transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {userRank?.nextRank && (
                  <p className="text-sm text-gray-700 bg-blue-50 p-2 rounded-lg inline-block">
                    Cần thêm <strong>{userRank.ordersToNextRank}</strong> đơn hàng để lên hạng <strong>{userRank.nextRank.name}</strong>.
                  </p>
                )}

                {!userRank?.nextRank && userRank?.currentRank && (
                  <p className="text-sm text-emerald-700 font-medium bg-emerald-50 p-2 rounded-lg inline-flex items-center gap-2">
                    <FaStar />
                    Chúc mừng! Bạn đã đạt hạng thành viên cao nhất.
                  </p>
                )}
              </div>
            </div>
          </div>

          <a
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-full shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
          >
            <span className="text-xl">🏠</span>
            <span>Về trang chủ</span>
          </a>
        </div>
        
        {/* Modal được nâng cấp toàn diện */}
        <Transition appear show={isRankModalOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={closeRankModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
              leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-gray-50 p-6 sm:p-8 text-left align-middle shadow-2xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-2xl font-bold leading-6 text-gray-900 flex items-center gap-3 mb-6 border-b pb-4"
                    >
                      <span className="bg-gradient-to-br from-amber-400 to-orange-500 text-white p-2.5 rounded-full shadow-lg">
                        <FaTrophy size={20}/>
                      </span>
                      <span>Thông tin hạng thành viên</span>
                    </Dialog.Title>

                    {/* Nút đóng modal được thiết kế lại */}
                    <button onClick={closeRankModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
                      <HiX size={24} />
                    </button>

                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Card Hạng hiện tại */}
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-amber-200/80">
                          <h4 className="font-semibold text-amber-800">Hạng hiện tại</h4>
                          <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600 mt-1">
                            {userRank?.currentRank?.name || "Chưa có hạng"}
                          </p>
                          <p className="text-sm text-gray-600 mt-2 h-10">
                            {userRank?.currentRank?.description || ""}
                          </p>

                          {userRank?.currentRank?.promotion && (
                            <div className="mt-4 bg-amber-50 p-3 rounded-lg border border-amber-200">
                              <p className="text-sm font-medium text-amber-700">Ưu đãi của bạn:</p>
                              <div className="mt-2 flex flex-wrap gap-2">
                                <span className="text-xs px-2.5 py-1 bg-white text-gray-700 rounded-full shadow-sm">
                                  Mã: <strong>{userRank.currentRank.promotion.code}</strong>
                                </span>
                                <span className="text-xs px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-semibold">
                                  Giảm {userRank.currentRank.promotion.discountValue}%
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Card Hạng tiếp theo */}
                        {userRank?.nextRank && (
                          <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-200/80">
                            <h4 className="font-semibold text-blue-800">Hạng tiếp theo</h4>
                            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600 mt-1">{userRank.nextRank.name}</p>
                            <p className="text-sm text-gray-600 mt-2 h-10">{userRank.nextRank.description}</p>
                            
                            {userRank.nextRank.promotion && (
                              <div className="mt-4 bg-blue-50 p-3 rounded-lg border border-blue-200">
                                <p className="text-sm font-medium text-blue-700">Ưu đãi khi đạt hạng:</p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  <span className="text-xs px-2.5 py-1 bg-white text-gray-700 rounded-full shadow-sm">
                                    Mã: <strong>{userRank.nextRank.promotion.code}</strong>
                                  </span>
                                  <span className="text-xs px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-semibold">
                                    Giảm {userRank.nextRank.promotion.discountValue}%
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Tiến trình lên hạng */}
                      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200/80">
                        <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-5">
                          <FaArrowUp />
                          Tiến trình lên hạng
                        </h4>
                        {userRank?.nextRank ? (
                          <div className="space-y-5">
                            <RankProgress
                              label="Số đơn hàng đã mua"
                              currentValue={userRank.amountOrder || 0}
                              targetValue={userRank.nextRank.minOrder}
                            />
                            <RankProgress
                              label="Tổng chi tiêu"
                              currentValue={userRank.amountUsed || 0}
                              targetValue={userRank.nextRank.minSpending}
                              unit="đ"
                            />
                          </div>
                        ) : (
                           <div className="text-center py-4 bg-emerald-50 rounded-lg">
                              <p className="text-emerald-700 font-medium">
                                🎉 Chúc mừng! Bạn đã đạt được hạng thành viên cao nhất!
                              </p>
                           </div>
                        )}
                      </div>

                      {/* CTA Mua hàng */}
                      {userRank?.nextRank && (
                        <div className="bg-gradient-to-r from-orange-400 to-red-500 p-6 rounded-xl shadow-xl text-white">
                          <h4 className="font-bold flex items-center gap-2 text-lg">
                            <span>🔥</span>
                            <span>Chinh phục hạng mới ngay!</span>
                          </h4>
                          <div className="mt-2 space-y-1 text-sm text-white/90">
                            {userRank.ordersToNextRank > 0 && (
                              <p>
                                Chỉ cần thêm <strong>{userRank.ordersToNextRank} đơn hàng</strong> nữa để nhận ưu đãi hạng <strong>{userRank.nextRank.name}</strong>.
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => {
                              closeRankModal();
                              // Thay thế bằng navigate của react-router-dom nếu có thể
                              window.location.href = "/products"; 
                            }}
                            className="mt-4 w-full bg-white text-orange-600 py-2.5 px-4 rounded-lg text-sm font-bold hover:bg-orange-50 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                          >
                            Mua sắm ngay
                          </button>
                        </div>
                      )}
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </header>

      {/* Tabs và Nội dung chính */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white/60 backdrop-blur-lg rounded-xl shadow-lg p-4 sm:p-6 transition-all duration-300">
          <nav className="flex flex-wrap gap-2 sm:gap-3 mb-6 border-b pb-4">
            {userNavItems.map((item, index) => (
              <NavLink 
                key={index} 
                to={item.path} 
                className={({ isActive }) => 
                  `px-3.5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2.5 transform hover:scale-105 active:scale-95 ${ 
                    isActive 
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`
                }
              >
                {item.icon} {item.name}
              </NavLink>
            ))}
          </nav>
          <div className="px-2">
             <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}