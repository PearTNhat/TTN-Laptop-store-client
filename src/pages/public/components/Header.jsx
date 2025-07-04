import React, { useEffect, useState, useRef } from "react";
import { ShoppingCart, Menu, X, Camera } from "lucide-react";
import {
  useNavigate,
  NavLink,
  Link,
  createSearchParams,
} from "react-router-dom";
import { dropDownProfile } from "~/constances/dropdown";
import { showToastSuccess } from "~/utils/alert";
import { publicPaths } from "~/constances/paths";

// 4. Component Search giả
const SearchWithSuggestions = () => {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search products..."
        className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

// 5. Component Cart giả
const Cart = ({ isOpen, onClose, cartItems }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-[100] p-4 transform transition-transform duration-300 ease-in-out"
      style={{ transform: isOpen ? "translateX(0)" : "translateX(100%)" }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">My Cart</h2>
        <button onClick={onClose} className="p-1">
          <X size={24} />
        </button>
      </div>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cartItems.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-center border-b py-2"
            >
              <span>{item.name}</span>
              <span>x{item.quantity}</span>
            </li>
          ))}
        </ul>
      )}
      <button className="w-full mt-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Checkout
      </button>
    </div>
  );
};

// --- COMPONENT HEADER CHÍNH ---

function Header() {
  const navigate = useNavigate();

  // --- Thay thế Redux bằng useState ---
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Đặt là `true` để thấy profile, `false` để thấy nút Login/Register
  const [userData, setUserData] = useState({
    userId: "user123",
    lastName: "P",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d", // Ảnh đại diện giả
    role: { roleId: "user" }, // Vai trò 'user' hoặc '112' để test lọc dropdown
  });
  const [myCart, setMyCart] = useState([
    { id: 1, name: "Bút bi Thiên Long", quantity: 2 },
    { id: 2, name: "Vở kẻ ngang", quantity: 5 },
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  // --- Kết thúc phần thay thế Redux ---
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const fileInputRef = useRef(null);

  // Lọc danh sách dropdown dựa trên vai trò người dùng
  const filteredDropDownProfile = dropDownProfile.filter((item) => {
    // Ẩn mục 'Admin' nếu vai trò người dùng là '112' (giống logic gốc)
    if (item.name === "Admin" && userData?.role.roleId === "112") {
      return false;
    }
    return true;
  });

  const handleCartToggle = () => {
    setIsCartOpen((prev) => !prev);
  };

  const handleLogout = () => {
    // Mô phỏng việc đăng xuất
    console.log("Logging out...");
    setIsLoggedIn(false);
    setUserData(null);
    showToastSuccess("Logout successfully");
    navigate("/login");
  };

  const handleImageSearch = (file) => {
    console.log("Searching with image:", file.name);
    showToastSuccess("Đang phân tích hình ảnh...");

    // Mô phỏng API call với setTimeout
    setTimeout(() => {
      const fakeLabel = "Bút chì 2B"; // Kết quả giả
      const newParams = { search: fakeLabel };
      navigate({
        pathname: publicPaths.PRODUCT,
        search: createSearchParams(newParams).toString(),
      });
      showToastSuccess(`Tìm thấy sản phẩm: ${fakeLabel}`);
    }, 1500); // Giả lập độ trễ 1.5 giây
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageSearch(file);
    }
  };

  // useEffect này không còn cần thiết vì chúng ta không fetch dữ liệu thật nữa.
  // Bạn có thể giữ lại nếu muốn thực hiện hành động nào đó khi trạng thái đăng nhập thay đổi.
  useEffect(() => {
    if (isLoggedIn) {
      console.log("User is logged in. Welcome!");
    } else {
      console.log("User is logged out.");
    }
  }, [isLoggedIn]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 shadow-md bg-white px-6 py-3 flex items-center justify-between md:px-10">
      <Link to="/">
        <div className="text-2xl font-bold text-blue-600 cursor-pointer">
          Stationery's P
        </div>
      </Link>

      <div className="hidden md:flex space-x-6 text-gray-700">
        <NavLink
          to={publicPaths.PUBLIC}
          className={({ isActive }) =>
            isActive
              ? "text-blue-600 font-bold"
              : "text-gray-700 hover:text-blue-500 transition"
          }
        >
          Home
        </NavLink>
        <NavLink
          to={publicPaths.ABOUT}
          className={({ isActive }) =>
            isActive
              ? "text-blue-600 font-bold"
              : "text-gray-700 hover:text-blue-500 transition"
          }
        >
          About
        </NavLink>
        <NavLink
          to={publicPaths.PRODUCT}
          className={({ isActive }) =>
            isActive
              ? "text-blue-600 font-bold"
              : "text-gray-700 hover:text-blue-500 transition"
          }
        >
          Product
        </NavLink>
        <NavLink
          to={publicPaths.SERVICE}
          className={({ isActive }) =>
            isActive
              ? "text-blue-600 font-bold"
              : "text-gray-700 hover:text-blue-500 transition"
          }
        >
          Service
        </NavLink>
        <NavLink
          to={publicPaths.CONTACT}
          className={({ isActive }) =>
            isActive
              ? "text-blue-600 font-bold"
              : "text-gray-700 hover:text-blue-500 transition"
          }
        >
          Contact
        </NavLink>
      </div>

      <div className="hidden md:flex items-center space-x-2">
        <SearchWithSuggestions />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          type="button"
          onClick={handleCameraClick}
          className="p-2 text-gray-500 hover:text-blue-500"
          aria-label="Search by image"
        >
          <Camera size={20} />
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative cursor-pointer" onClick={handleCartToggle}>
          <ShoppingCart
            size={24}
            className="text-gray-700 hover:text-blue-500 transition"
          />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
            {myCart.length}
          </span>
        </div>

        {isLoggedIn ? (
          <div className="d-dropdown d-dropdown-hover d-dropdown-end">
            <div
              tabIndex={0}
              className="w-10 h-10 rounded-full overflow-hidden"
            >
              <img
                src={userData?.avatar}
                alt={userData?.lastName}
                className="w-full h-full object-cover"
              />
            </div>
            <ul
              tabIndex={0}
              className="d-dropdown-content d-menu bg-base-100 rounded-md z-10 w-52 p-2 shadow-md"
            >
              {filteredDropDownProfile.map((item) => {
                let Comp = "button";
                if (item.to) {
                  Comp = Link;
                }
                return (
                  <li
                    key={item.id}
                    className={`${item.styleParent ? item.styleParent : ""}`}
                  >
                    <Comp
                      {...(item.to ? { to: item.to } : {})}
                      onClick={item?.onClick ? handleLogout : undefined}
                      className={`flex items-center w-full px-4 py-2 ${
                        item.style
                          ? item.style
                          : "text-gray-700 hover:bg-gray-100 transition  "
                      }`}
                    >
                      {item.icon}
                      {item.name}
                    </Comp>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <div className="hidden md:flex space-x-3">
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            >
              Register
            </button>
          </div>
        )}

        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md md:hidden z-[999]">
          <div className="flex flex-col space-y-4 p-4 text-gray-700">
            {/* ... (Các NavLink cho mobile view) ... */}
            {!isLoggedIn && (
              <>
                <button
                  onClick={() => {
                    navigate("/auth?mode=login");
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    navigate("/auth?mode=register");
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      )}
      <Cart isOpen={isCartOpen} onClose={handleCartToggle} cartItems={myCart} />
    </nav>
  );
}

export default Header;
