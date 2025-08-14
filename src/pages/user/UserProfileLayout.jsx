import { NavLink, Outlet } from "react-router-dom";
import { userNavItems } from "~/constants/navUser";
import { HiOutlineUser, HiCamera } from "react-icons/hi";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { apiFetchMyInfo, apiGetRankUser } from "~/apis/userApi";
import { apiUpdateAvatar } from "~/apis/update_useravatarApi";

export default function UserProfileLayout() {
  const { accessToken } = useSelector((state) => state.user);
  const [avatar, setAvatar] = useState("");
  const [fullName, setFullName] = useState("");
  const [userRank, setUserRank] = useState(null);
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const fileInputRef = useRef(null);

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
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || file.size > 2 * 1024 * 1024) {
      alert("Ảnh quá lớn! Vui lòng chọn ảnh dưới 2MB.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    setLoadingAvatar(true);

    try {
      const updateRes = await apiUpdateAvatar({ accessToken, file: formData });
      if (updateRes.code === 200) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-indigo-100 text-sky-900 font-[Inter]">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4 relative">
            {/* Avatar */}
            <label className="relative group w-20 h-20 rounded-full overflow-hidden border-4 border-sky-500 shadow-lg cursor-pointer">
              {avatar ? (
                <>
                  <img
                    src={avatar}
                    alt="Avatar"
                    className="w-full h-full object-cover group-hover:opacity-60 transition"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black bg-opacity-30">
                    <HiCamera className="text-white text-2xl" />
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-sky-100 text-sky-500">
                  <HiOutlineUser size={40} />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {/* Thông tin người dùng */}
            <div>
              <h1 className="text-2xl font-bold text-sky-800 dark:text-white">{fullName}</h1>
              <div className="space-y-2">
                <p className="text-sm text-sky-600 dark:text-gray-400 flex items-center gap-2">
                  <span>Thành viên hạng: </span>
                  <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800 text-xs rounded-full font-medium">
                    {userRank?.currentRank?.name || "Chưa có hạng"}
                  </span>
                </p>

                {userRank?.nextRank && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>
                        Tiến tới hạng <strong>{userRank.nextRank.name}</strong>
                      </span>
                      <span className="ml-2">
                        {new Intl.NumberFormat("vi-VN").format(userRank.amountUsed || 0)}đ /{" "}
                        {new Intl.NumberFormat("vi-VN").format(
                          userRank.spendingToNextRank + (userRank.amountUsed || 0)
                        )}đ
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-sky-400 to-indigo-500 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            ((userRank.amountUsed || 0) /
                              (userRank.spendingToNextRank + (userRank.amountUsed || 0))) *
                              100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}

                {!userRank?.nextRank && userRank?.currentRank && (
                  <p className="text-xs text-green-600 font-medium">
                    🎉 Bạn đã đạt hạng cao nhất: <strong>{userRank.currentRank.name}</strong>
                  </p>
                )}
              </div>
            </div>
          </div>

          <a
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-sky-500 hover:bg-sky-600 rounded-full shadow-md transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <span className="text-xl">🏠</span>
            <span>Trang chủ</span>
          </a>
        </div>
      </header>

      {/* Tabs + Content */}
      <div className="max-w-5xl mx-auto px-6 mt-6">
        <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300">
          {/* Tabs */}
          <nav className="flex flex-wrap gap-3 mb-4 border-b pb-3">
            {userNavItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                    isActive
                      ? "bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-lg"
                      : "bg-sky-100 text-sky-700 hover:bg-sky-200"
                  }`
                }
              >
                {item.icon} {item.name}
              </NavLink>
            ))}
          </nav>
          {/* Nội dung tab */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}

