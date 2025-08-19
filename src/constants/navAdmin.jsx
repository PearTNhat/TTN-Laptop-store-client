import {
  BarChart3,
  Users,
  Palette,
  ShoppingBag,
  PackageCheck,
  UserPlus,
  Package,
  ShoppingCart,
  Ticket,
  Layers,
  Type,
  Droplet,
  PackageSearch,
  ClipboardList,
  PackagePlus,
  Truck,
  Percent,
  Star,
  Box,
} from "lucide-react";
import { adminPaths } from "./paths";
const navItems = [
  {
    icon: <BarChart3 size={20} className="text-blue-500" />,
    name: "Thống kê",
    path: "/admin",
  },
  {
    icon: <Users size={20} className="text-green-500" />,
    name: "Người dùng",
    path: "/admin/users",
  },
  {
    icon: <Layers size={20} className="text-purple-500" />,
    name: "Danh mục",
    path: "/admin/category",
  },
  {
    icon: <Type size={20} className="text-yellow-500" />,
    name: "Thương hiệu",
    path: "/admin/brand",
  },
  {
    icon: <Droplet size={20} className="text-pink-500" />,
    name: "Màu sắc",
    path: "/admin/color",
  },
  {
    icon: <PackageSearch size={20} className="text-indigo-500" />,
    name: "Dòng sản phẩm",
    path: "/admin/series",
  },
  {
    icon: <ClipboardList size={20} className="text-orange-500" />,
    name: "Đặt hàng nhà cung cấp",
    path: "/admin/purchase-orders",
  },
  {
    icon: <PackagePlus size={20} className="text-cyan-500" />,
    name: "Nhập hàng từ nhà cung cấp",
    path: "/admin/goods-receipt",
  },

  {
    icon: <Box size={20} className="text-teal-500" />,
    name: "Sản phẩm",
    path: "/admin/products",
  },
  {
    icon: <Truck size={20} className="text-red-500" />,
    name: "Xuất hàng cho đơn mua",
    path: "/admin/delivery-notes",
  },
  {
    icon: <ShoppingCart size={20} className="text-blue-400" />,
    name: "Quản lý đơn hàng",
    path: adminPaths.ORDER_MANAGEMENT,
  },
  {
    icon: <Percent size={20} className="text-green-400" />,
    name: "Khuyến mãi",
    path: "/admin/vouchers",
  },
  {
    icon: <Star size={20} className="text-yellow-400" />,
    name: "Xếp hạng",
    path: "/admin/rank-level",
  },
];

export { navItems };
