import {
  BarChart3,
  Users,
  Tag,
  Palette,
  ShoppingBag,
  PackageCheck,
  UserPlus,
  Package,
  ShoppingCart,
  Ticket,
} from "lucide-react";
import { adminPaths } from "./paths";

const navItems = [
  {
    icon: <BarChart3 size={20} />,
    name: "Thống kê",
    path: "/admin",
  },
  {
    icon: <Users size={20} />,
    name: "Người dùng",
    path: "/admin/users",
  },
  {
    icon: <Tag size={20} />,
    name: "Thương hiệu",
    path: "/admin/brand",
  },
  {
    icon: <Palette size={20} />,
    name: "Dòng sản phẩm",
    path: "/admin/series",
  },
  {
    icon: <ShoppingBag size={20} />,
    name: "Đặt hàng nhà cung cấp",
    path: "/admin/purchase-orders",
  },
  {
    icon: <PackageCheck size={20} />,
    name: "Nhập hàng từ nhà cung cấp",
    path: "/admin/goods-receipt",
  },
  {
    icon: <UserPlus size={20} />,
    name: "Xuất hàng cho đơn mua",
    path: "/admin/delivery-notes",
  },
  {
    icon: <Package size={20} />,
    name: "Sản phẩm",
    path: "/admin/products",
  },
  {
    icon: <ShoppingCart size={20} />,
    name: "Quản lý đơn hàng",
    path: adminPaths.ORDER_MANAGEMENT,
  },
  {
    icon: <Ticket size={20} />,
    name: "Khuyến mãi",
    path: "/admin/vouchers",
  },
  {
    icon: <Ticket size={20} />,
    name: "Xếp hạng",
    path: "/admin/rank-level",
  },
];

export { navItems };
