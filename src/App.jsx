import { Route, Routes } from "react-router-dom";
import { publicPaths } from "./constances/paths";
import PublicLayout from "./pages/public/PublicLayout";
import Home from "./pages/public/home/Home";
import Login from "~/pages/public/auth/Login";
import Register from "./pages/public/auth/Register";
import ResetPassword from "./pages/public/auth/ResetPassword";
import {
  DashBoard,
  Users,
  Brand,
  Series,
  Products,
  Orders,
  Vouchers,
  AdminLayout,
} from "./pages/admin";

function App() {
  return (
    <div className="relative h-full w-full overflow-auto">
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path={publicPaths.LOGIN} element={<Login />} />
          <Route path={publicPaths.REGISTER} element={<Register />} />
          <Route
            path={publicPaths.RESET_PASSWORD}
            element={<ResetPassword />}
          />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashBoard />} />
          <Route path="" element={<DashBoard />} />
          <Route path="users" element={<Users />} />
          <Route path="brand" element={<Brand />} />
          <Route path="series" element={<Series />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="vouchers" element={<Vouchers />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
