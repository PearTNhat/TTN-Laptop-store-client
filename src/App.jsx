import { Route, Routes } from "react-router-dom";
import { publicPaths } from "./constances/paths";
import PublicLayout from "./pages/public/PublicLayout";
import Home from "./pages/public/home/Home";
import Login from "./pages/public/auth/Login";
import Register from "./pages/public/auth/Register";
import ResetPassword from "./pages/public/auth/ResetPassword";
import Test from "./pages/public/auth/test";

import ChangePassword from "./pages/user/components/ChangePassword";
import MyOrders from "./pages/user/components/MyOrders";
import Voucher from "./pages/user/components/Voucher";
import ProfileInfo from "./pages/user/components/ProfileInfo";
import UserProfileLayout from "./pages/user/UserProfileLayout";

function App() {
  return (
    <div className="relative h-full w-full overflow-auto">
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route element={<Home />} />
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
      </Routes>
    </div>
  );
}

export default App;
