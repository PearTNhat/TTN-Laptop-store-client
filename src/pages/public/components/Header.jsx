import React, { useState, useRef, useEffect } from "react";
import {
  ShoppingCart,
  Menu,
  X,
  Home,
  Laptop,
  Search,
  LogOut,
} from "lucide-react";
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
import { DefaultUser } from "~/assets/images";
import { SearchBar } from "./SearchBar";
import { fetchBrands } from "~/stores/action/brand";

// Navigation links data
const navigationLinks = [
  {
    id: 1,
    name: "Trang chủ",
    path: publicPaths.HOME,
    icon: <Home size={20} />,
  },
  {
    id: 2,
    name: "Sản phẩm",
    path: productPaths.PRODUCTS,
    icon: <Laptop size={20} />,
  },
];

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData, accessToken } = useSelector((state) => state.user);
  const { carts: myCart } = useSelector((state) => state.cart);
  const isLoggedIn = !!accessToken;

  // TÁCH STATE: Quản lý riêng state cho từng menu
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const userDropdownRef = useRef(null);

  // Hook để đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch data on mount
  useEffect(() => {
    if (accessToken) {
      dispatch(fetchCurrentUser({ accessToken }));
      dispatch(fetchMyAddress({ accessToken }));
      dispatch(fetchCart({ accessToken }));
    }
    dispatch(fetchBrands());
    dispatch(fetchCategories());
  }, [accessToken, dispatch]);
  useEffect(() => {
    console.log("dataa", userData);
    if (!userData?.id) return;
    let isCustomer = false;
    let isAdmin = false;
    for (const role of userData.roles) {
      if (role.id === "ADMIN") {
        isAdmin = true;
      } else if (role.id === "CUSTOMER") {
        isCustomer = true;
      }
    }
    // admin k phai customeer
    // if (isAdmin && !isCustomer) {
    //   navigate("/admin");
    // }
  }, [userData]);

  const handleLogout = () => {
    dispatch(userActions.logout());
    showToastSuccess("Đăng xuất thành công!");
    navigate("/login");
  };

  // Lọc dropdown profile dựa trên role
  const filteredDropDownProfile = dropDownProfile.filter(
    (item) => !(item.name === "Admin" && userData?.role?.roleId === "112")
  );

  // Các hàm xử lý giỏ hàng (giữ nguyên)
  const updateCartItemQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const response = await apiUpdateCart({
        accessToken,
        body: { productDetailId: itemId, quantity: newQuantity },
      });
      if (response.code !== 200) throw new Error(response.message);
      showToastSuccess("Cập nhật giỏ hàng thành công");
      dispatch(
        cartActions.updateCartQuantity({ id: itemId, quantity: newQuantity })
      );
    } catch (error) {
      showToastError(error.message || "Lỗi cập nhật giỏ hàng");
    }
  };

  const removeCartItem = async (itemId) => {
    try {
      const response = await apiDeleteCart({ accessToken, pId: itemId });
      if (response.code !== 200) throw new Error(response.message);
      showToastSuccess("Xóa sản phẩm thành công");
      dispatch(cartActions.removeFromCart(itemId));
    } catch (error) {
      showToastError(error.message || "Lỗi xóa sản phẩm");
    }
  };

  const clearCart = () => dispatch(cartActions.clearCart());

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <Laptop className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hidden sm:inline">
                Laptop Store
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {navigationLinks.map((link) => (
                <NavLink
                  key={link.id}
                  to={link.path}
                  end
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                    }`
                  }
                >
                  {link.icon}
                  <span>{link.name}</span>
                </NavLink>
              ))}
            </nav>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex flex-1 justify-center px-8">
              <div className="w-full max-w-md">
                <SearchBar />
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Mở giỏ hàng"
              >
                <ShoppingCart size={22} />
                {myCart?.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {myCart.length}
                  </span>
                )}
              </button>

              {/* User Menu / Auth Buttons */}
              {isLoggedIn ? (
                <div className="relative" ref={userDropdownRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Mở menu người dùng"
                  >
                    <img
                      src={userData?.avatar || DefaultUser}
                      alt={userData?.lastName || "Avatar"}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-offset-1 ring-blue-200"
                    />
                  </button>

                  {/* Desktop User Dropdown */}
                  <div
                    className={`absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 transition-all duration-200 ease-in-out transform ${
                      isUserMenuOpen
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-95 pointer-events-none"
                    }`}
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {userData?.firstName} {userData?.lastName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {userData?.email}
                      </p>
                    </div>
                    <div className="py-1">
                      {filteredDropDownProfile.map((item) => {
                        const isLogout = item.name === "Đăng xuất";
                        return (
                          <Link
                            key={item.id}
                            to={item.to}
                            onClick={() => {
                              if (isLogout) handleLogout();
                              setIsUserMenuOpen(false);
                            }}
                            className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors ${
                              isLogout
                                ? "text-red-600 hover:bg-red-50"
                                : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                            }`}
                          >
                            <span
                              className={
                                isLogout ? "text-red-500" : "text-gray-400"
                              }
                            >
                              {item.icon}
                            </span>
                            <span>{item.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <button
                    onClick={() => navigate("/login")}
                    className="px-4 py-2 text-sm font-medium text-blue-600 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    Đăng nhập
                  </button>
                  <button
                    onClick={() => navigate("/register")}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    Đăng ký
                  </button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Mở menu"
              >
                <Menu size={22} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* CẢI TIẾN: Mobile Slide-in Menu */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${
          isMobileMenuOpen ? "visible" : "invisible"
        }`}
      >
        {/* Overlay */}
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className={`absolute inset-0 bg-black/40 transition-opacity ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Menu Content */}
        <div
          className={`absolute top-0 right-0 h-full w-full max-w-xs bg-white shadow-xl transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <span className="font-semibold text-lg text-gray-800">Menu</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                aria-label="Đóng menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Search bar for mobile */}
            <div className="p-4 border-b border-gray-200">
              <SearchBar />
            </div>

            {/* Navigation Links */}
            <nav className="flex-grow p-4 space-y-2">
              {navigationLinks.map((link) => (
                <NavLink
                  key={link.id}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  end
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      isActive
                        ? "text-blue-600 bg-blue-100"
                        : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    }`
                  }
                >
                  {link.icon}
                  <span>{link.name}</span>
                </NavLink>
              ))}

              {/* User-specific links for logged-in users */}
              {isLoggedIn && (
                <div className="pt-4 mt-4 border-t border-gray-200 space-y-2">
                  {filteredDropDownProfile
                    .filter((item) => item.name !== "Đăng xuất")
                    .map((item) => (
                      <Link
                        key={item.id}
                        to={item.to}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-4 px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-gray-500">{item.icon}</span>
                        <span>{item.name}</span>
                      </Link>
                    ))}
                </div>
              )}
            </nav>

            {/* Menu Footer (Auth buttons / Logout) */}
            <div className="p-4 border-t border-gray-200">
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-xl text-base font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                >
                  <LogOut size={20} />
                  <span>Đăng xuất</span>
                </button>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      navigate("/login");
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-center px-4 py-3 text-base font-medium text-blue-600 border border-gray-300 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    Đăng nhập
                  </button>
                  <button
                    onClick={() => {
                      navigate("/register");
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-center px-4 py-3 text-base font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    Đăng ký
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cart Component (giữ nguyên) */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={myCart || []}
        onUpdateQuantity={updateCartItemQuantity}
        onRemoveItem={removeCartItem}
        onClearCart={clearCart}
      />
    </>
  );
}

export default Header;
