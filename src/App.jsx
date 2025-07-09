import { Route, Routes } from "react-router-dom";
import { adminPaths, publicPaths } from "./constances/paths";
import PublicLayout from "./pages/public/PublicLayout";
import Home from "./pages/public/home/Home";
import Login from "~/pages/public/auth/Login";
import Register from "./pages/public/auth/Register";
import ResetPassword from "./pages/public/auth/ResetPassword";
import Test from "./pages/public/auth/test";

import ChangePassword from "./pages/user/components/ChangePassword";
import MyOrders from "./pages/user/components/MyOrders";
import Voucher from "./pages/user/components/Voucher";
import ProfileInfo from "./pages/user/components/ProfileInfo";
import UserProfileLayout from "./pages/user/UserProfileLayout";
import {
  DashBoard,
  UsersManagement,
  Brand,
  Series,
  Products,
  Orders,
  Vouchers,
  AdminLayout,
} from "./pages/admin";
import { useSelector } from "react-redux";
import Modal from "./components/modal/Modal";


function App() {
  const { childrenModal, isOpenModal } = useSelector((state) => state.modal);
  return (
    <div className="relative h-full w-full overflow-auto">
      <Modal isOpen={isOpenModal}>{childrenModal}</Modal>
      <Routes>
        {/* router public */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path={publicPaths.LOGIN} element={<Login />} />
          <Route path={publicPaths.REGISTER} element={<Register />} />
          <Route path={publicPaths.RESET_PASSWORD} element={<ResetPassword />} />
          <Route path={publicPaths.TEST} element={<Test />} />
        </Route>
        {/* router user */}
        <Route path="/user" element={<UserProfileLayout />}>
          <Route path="profile" element={<ProfileInfo />} />
          <Route path="voucher" element={<Voucher />} />
          <Route path="orders" element={<MyOrders />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Route>
        {/* router admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashBoard />} />
          <Route path={adminPaths.USERSMANAGEMENT} element={<UsersManagement />} />
          <Route path={adminPaths.BRAND} element={<Brand />} />
          <Route path={adminPaths.SERIES} element={<Series />} />
          <Route path={adminPaths.PRODUCTS} element={<Products />} />
          <Route path={adminPaths.ORDERS} element={<Orders />} />
          <Route path={adminPaths.VOUCHERS} element={<Vouchers />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
