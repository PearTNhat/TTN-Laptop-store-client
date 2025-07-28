import { Route, Routes } from "react-router-dom";
import {
  adminPaths,
  publicPaths,
  productPaths,
  orderPaths,
} from "./constants/paths";
import PublicLayout from "./pages/public/PublicLayout";
import Home from "./pages/public/home/Home";
import Login from "~/pages/public/auth/Login";
import GoogleCallback from "./pages/public/auth/GoogleCallback";
import Register from "./pages/public/auth/Register";
import ResetPassword from "./pages/public/auth/ResetPassword";
import ChangeEmail from "./pages/user/components/ChangeEmail";
import ChangePassword from "./pages/user/components/ChangePassword";
import MyOrders from "./pages/user/components/MyOrders";
import Voucher from "~/components/Voucher";
import ProfileInfo from "./pages/user/components/ProfileInfo";
import UserProfileLayout from "./pages/user/UserProfileLayout";
import {
  DashBoard,
  UsersManagement,
  Brand,
  Series,
  Products,
  Vouchers,
  AdminLayout,
} from "./pages/admin";
import { useSelector } from "react-redux";
import Modal from "./components/modal/Modal";
import UserManagement from "./pages/admin/users";
import OrderConfirms from "./pages/admin/orders/confirmOrder";
import OrderManagement from "./pages/admin/orders/manageOrder/OrderManagement";
import NotFound from "./components/NotFound";
import DetailProduct from "./pages/public/detailProduct/DetailProduct";
import FilterProductPage from "./pages/public/filterProduct/FilterProductPage";
import PaymentConfirmation from "./pages/payment/PaymentConfirmation";

function App() {
  const { childrenModal, isShowModal } = useSelector((state) => state.modal);
  console.log("Modal children:", childrenModal, isShowModal);
  return (
    <div className="relative h-full w-full overflow-auto">
      <Modal isOpen={isShowModal}>{childrenModal}</Modal>
      <Routes>
        {/* router public */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path={publicPaths.LOGIN} element={<Login />} />
          <Route path={publicPaths.REGISTER} element={<Register />} />
          <Route path={publicPaths.RESET_PASSWORD} element={<ResetPassword />} />
          <Route path="/login/callback" element={<GoogleCallback />} />
          <Route
            path={productPaths.PRODUCT_DETAIL}
            element={<DetailProduct />}
          />
          <Route path={productPaths.PRODUCTS} element={<FilterProductPage />} />
          <Route path={orderPaths.CHECKOUT} element={<PaymentConfirmation />} />
        </Route>
        {/* router user */}
        <Route path="/user" element={<UserProfileLayout />}>
          <Route path="profile" element={<ProfileInfo />} />
          <Route path="voucher" element={<Voucher />} />
          <Route path="orders" element={<MyOrders />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="change_email" element={<ChangeEmail/>} />
        </Route>
        {/* router admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashBoard />} />
          <Route path={adminPaths.USERS} element={<UserManagement />} />
          <Route
            path={adminPaths.USERSMANAGEMENT}
            element={<UsersManagement />}
          />
          <Route path={adminPaths.BRAND} element={<Brand />} />
          <Route path={adminPaths.SERIES} element={<Series />} />
          <Route path={adminPaths.PRODUCTS} element={<Products />} />
          <Route path={adminPaths.ORDER_CONFIRMS} element={<OrderConfirms />} />
          <Route
            path={adminPaths.ORDER_MANAGEMENT}
            element={<OrderManagement />}
          />
          <Route path={adminPaths.VOUCHERS} element={<Vouchers />} />
        </Route>

        {/*Not found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
