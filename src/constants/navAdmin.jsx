import { FaShoppingCart, FaUsers } from "react-icons/fa";
import { TbCategoryFilled } from "react-icons/tb";
import { BsTicketPerforatedFill } from "react-icons/bs";
import { RiProductHuntLine } from "react-icons/ri";
import { IoHome } from "react-icons/io5";
import { IoMdColorFill } from "react-icons/io";
import { BiFontSize } from "react-icons/bi";
import { adminPaths } from "./paths";

const navItems = [
  {
    icon: <IoHome />,
    name: "Thống kê",
    path: "/admin",
  },
  {
    icon: <FaUsers />,
    name: "Người dùng",
    path: "/admin/users",
  },
  {
    icon: <TbCategoryFilled />,
    name: "Thương hiệu",
    path: "/admin/brand",
  },
  {
    icon: <IoMdColorFill />,
    name: "Dòng sản phẩm",
    path: "/admin/series",
  },
  {
    icon: <RiProductHuntLine />,
    name: "Sản phẩm",
    path: "/admin/products",
  },
  {
    icon: <FaShoppingCart />,
    name: "Đơn hàng",
    subItems: [
      {
        name: "Quản lý đơn hàng",
        path: adminPaths.ORDER_MANAGEMENT,
        pro: true,
      },
      { name: "Chờ xác nhận", path: adminPaths.ORDER_CONFIRMS, pro: false },
    ],
  },
  {
    icon: <BsTicketPerforatedFill />,
    name: "Khuyến mãi",
    path: "/admin/vouchers",
  },
];
export { navItems };
