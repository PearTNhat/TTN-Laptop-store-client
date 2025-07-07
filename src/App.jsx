import { Route, Routes } from "react-router-dom";
import { adminPaths, publicPaths, productPaths } from "./constants/paths";
import PublicLayout from "./pages/public/PublicLayout";
import Home from "./pages/public/home/Home";
import Login from "~/pages/public/auth/Login";
import Register from "./pages/public/auth/Register";
import ResetPassword from "./pages/public/auth/ResetPassword";
import {
  DashBoard,
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

function App() {
  const { childrenModal, isShowModal } = useSelector((state) => state.modal);
  console.log("Modal children:", childrenModal, isShowModal);
  return (
    <div className="relative h-full w-full overflow-auto">
      <Modal isOpen={isShowModal}>{childrenModal}</Modal>
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path={publicPaths.LOGIN} element={<Login />} />
          <Route path={publicPaths.REGISTER} element={<Register />} />
          <Route
            path={publicPaths.RESET_PASSWORD}
            element={<ResetPassword />}
          />
          <Route
            path={productPaths.PRODUCT_DETAIL}
            element={<DetailProduct />}
          />
          <Route path={productPaths.PRODUCTS} element={<FilterProductPage />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashBoard />} />
          <Route path={adminPaths.USERS} element={<UserManagement />} />
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
