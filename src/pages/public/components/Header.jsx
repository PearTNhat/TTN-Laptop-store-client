import React, { useState, useRef, useEffect } from "react";
import { ShoppingCart, Menu, X, Home, Laptop, ChevronDown } from "lucide-react";
import { useNavigate, NavLink, Link } from "react-router-dom";
import { dropDownProfile } from "~/constants/dropdown";
import { showToastError, showToastSuccess } from "~/utils/alert";
import { productPaths, publicPaths } from "~/constants/paths";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "~/stores/slice/userSlice";
import Cart from "~/components/cart/Cart";
import { fetchCurrentUser } from "~/stores/action/user";
import { fetchCategories } from "~/stores/action/category";
import { fetchCart } from "~/stores/action/cart";
import { cartActions } from "~/stores/slice/cartSlice";
import { apiDeleteCart, apiUpdateCart } from "~/apis/cartApi";
import { fetchMyAddress } from "~/stores/action/address";

// Navigation links data
const navigationLinks = [
  {
    id: 1,
    name: "Trang chủ",
    path: publicPaths.HOME,
    icon: <Home size={18} />,
  },
  {
    id: 2,
    name: "Sản phẩm",
    path: productPaths.PRODUCTS,
    icon: <Laptop size={18} />,
  },
];
// Search component with better styling
const SearchWithSuggestions = () => {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Tìm kiếm sản phẩm..."
        className="w-full md:w-80 px-4 py-2 pl-10 pr-4 text-gray-700 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      />
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>
  );
};

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData, accessToken } = useSelector((state) => state.user);
  const { carts: myCart } = useSelector((state) => state.cart);
  const dropdownRef = useRef(null);
  const isLoggedIn = true; // Giả lập trạng thái đăng nhập, thay thế bằng Redux hoặc Context API trong thực tế

  // const [myCart, setMyCart] = useState(mockCartItems);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
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
    showToastSuccess("Logout successfully");
    dispatch(userActions.logout()); // Gọi action logout từ Redux
    navigate("/login");
  };

  const updateCartItemQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      console.log("Updating cart item:", itemId, "to quantity:", newQuantity);
      const body = {
        productDetailId: itemId,
        quantity: newQuantity,
      };
      const response = await apiUpdateCart({
        accessToken,
        body,
      });
      if (response.code !== 200) {
        throw new Error(response.message || "Failed to update cart item");
      }
      showToastSuccess("Cập nhật giỏ hàng thành công");
      dispatch(
        cartActions.updateCartQuantity({
          id: itemId, // Thay đổi từ productDetailId thành id
          quantity: newQuantity,
        })
      );
    } catch (error) {
      showToastError(error.message || "Failed to update cart item");
    }
  };

  const removeCartItem = async (itemId) => {
    try {
      const response = await apiDeleteCart({
        accessToken,
        pId: itemId,
      });
      if (response.code !== 200) {
        throw new Error(response.message || "Xóa giỏ hàng thất bại");
      }
      showToastSuccess("Xóa giỏ hàng thành công");
      dispatch(cartActions.removeFromCart(itemId));
    } catch (error) {
      showToastError(error.message || "Xóa giỏ hàng thất bại");
    }
  };

  const clearCart = () => {
    dispatch(cartActions.clearCart());
  };
  useEffect(() => {
    dispatch(fetchCurrentUser({ accessToken }));
    dispatch(fetchCategories());
    dispatch(fetchCart({ accessToken }));
    dispatch(fetchMyAddress({ accessToken }));
  }, [accessToken, dispatch]);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Laptop className="w-5 h-5 text-white" />
            </div>
            <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Laptop Store
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navigationLinks.map((link) => (
              <NavLink
                key={link.id}
                to={link.path}
                end
                className={({ isActive }) =>
                  `flex items-center p-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-blue-600 bg-blue-50 shadow-sm"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`
                }
              >
                {link.icon}
                <span>{link.name}</span>
              </NavLink>
            ))}
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-lg mx-8">
            <SearchWithSuggestions />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <div className="relative">
              <button
                onClick={handleCartToggle}
                className="relative p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
              >
                <ShoppingCart size={20} />
                {myCart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                    {myCart.length}
                  </span>
                )}
              </button>
            </div>

            {/* User Menu */}
            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-blue-100">
                    <img
                      src={userData?.avatar || "https://via.placeholder.com/32"}
                      alt={userData?.lastName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          <img
                            src={
                              userData?.avatar ||
                              "https://via.placeholder.com/40"
                            }
                            alt={userData?.lastName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {userData?.firstName} {userData?.lastName}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {userData?.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    {filteredDropDownProfile.map((item) => {
                      const Component = item.to ? Link : "button";
                      const isLogoutItem = item.name === "Đăng xuất";

                      return (
                        <Component
                          key={item.id}
                          {...(item.to ? { to: item.to } : {})}
                          onClick={() => {
                            if (isLogoutItem) {
                              handleLogout();
                            }
                            setIsMenuOpen(false);
                          }}
                          className={`flex items-center w-full px-2 text-left transition-all duration-200 ${
                            isLogoutItem
                              ? "text-red-600 hover:bg-red-50 hover:text-red-700"
                              : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                          }`}
                        >
                          <span
                            className={`w-10 h-10 flex items-center justify-center ${
                              isLogoutItem ? "text-red-500" : "text-gray-400"
                            }`}
                          >
                            {item.icon}
                          </span>
                          <span className="font-medium">{item.name}</span>
                        </Component>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200 font-medium"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-4 py-2 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg"
                >
                  Đăng ký
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden px-4 pb-4">
          <SearchWithSuggestions />
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-xl">
          <div className="px-4 py-6 space-y-4">
            {/* Mobile Navigation Links */}
            <div className="space-y-2">
              {navigationLinks.map((link) => (
                <NavLink
                  key={link.id}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  end
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "text-blue-600 bg-blue-50 border border-blue-200"
                        : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    }`
                  }
                >
                  {link.icon}
                  <span>{link.name}</span>
                </NavLink>
              ))}
            </div>

            {/* Mobile Auth Buttons */}
            {!isLoggedIn && (
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <button
                  onClick={() => {
                    navigate("/login");
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200 font-medium"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => {
                    navigate("/register");
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg"
                >
                  Đăng ký
                </button>
              </div>
            )}

            {/* Mobile User Menu */}
            {isLoggedIn && (
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl mb-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-blue-200">
                    <img
                      src={userData?.avatar}
                      alt={userData?.lastName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Xin chào!</p>
                    <p className="text-sm text-gray-600">
                      {userData?.lastName}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  {filteredDropDownProfile.map((item) => {
                    const isLogoutItem = item?.onClick;
                    const Component = item.to ? Link : "button";

                    return (
                      <Component
                        key={item.id}
                        {...(item.to ? { to: item.to } : {})}
                        onClick={() => {
                          if (isLogoutItem) {
                            handleLogout();
                          }
                          setIsMenuOpen(false);
                        }}
                        className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-all duration-200 ${
                          isLogoutItem
                            ? "text-red-600 hover:bg-red-50 hover:text-red-700"
                            : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                        }`}
                      >
                        <span
                          className={`w-5 h-5 flex items-center justify-center ${
                            isLogoutItem ? "text-red-500" : "text-gray-400"
                          }`}
                        >
                          {item.icon}
                        </span>
                        <span className="font-medium">{item.name}</span>
                      </Component>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <Cart
        isOpen={isCartOpen}
        onClose={handleCartToggle}
        cartItems={myCart}
        onUpdateQuantity={updateCartItemQuantity}
        onRemoveItem={removeCartItem}
        onClearCart={clearCart}
      />
    </nav>
  );
}

export default Header;
