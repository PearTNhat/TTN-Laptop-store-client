// import React, { useState, useEffect } from "react";
// import { Dialog } from "@headlessui/react";
// import { motion, AnimatePresence } from "framer-motion";
// import { 
//   FiShoppingCart, 
//   FiInfo, 
//   FiTruck, 
//   FiCheckCircle, 
//   FiX, 
//   FiCreditCard,
//   FiUser,
//   FiMapPin,
//   FiPhone,
//   FiCalendar
// } from "react-icons/fi";
// import RatingBox from "./RatingBox";
// import { useSelector } from "react-redux";
// import { apiGetOrders } from "~/apis/orderApi";

// const formatPrice = (price) => {
//   if (typeof price === 'number') return price.toLocaleString('vi-VN') + ' ₫';
//   if (typeof price === 'string') return parseInt(price.replace(/\./g, ""), 10).toLocaleString('vi-VN') + ' ₫';
//   return '';
// };

// const formatDate = (dateStr) => {
//   if (!dateStr) return '';
//   return new Date(dateStr).toLocaleDateString('vi-VN', {
//     day: '2-digit',
//     month: '2-digit',
//     year: 'numeric'
//   });
// };

// const statusIcons = {
//   "COMPLETED": <FiCheckCircle className="text-green-500" />,
//   "PENDING": <FiInfo className="text-yellow-500" />,
//   "SHIPPED": <FiTruck className="text-blue-500" />,
//   "CANCELLED": <FiX className="text-red-500" />,
// };

// const statusColors = {
//   "COMPLETED": "bg-green-100 text-green-800 border-green-200",
//   "PENDING": "bg-yellow-100 text-yellow-800 border-yellow-200",
//   "SHIPPED": "bg-blue-100 text-blue-800 border-blue-200",
//   "CANCELLED": "bg-red-100 text-red-800 border-red-200",
// };

// const MyOrders = () => {
//   const [orders, setOrders] = useState([]);
//   const [isOpen, setIsOpen] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const { accessToken } = useSelector((state) => state.user);
//   const [page, setPage] = useState(0);
//   const [size, setSize] = useState(5);
//   const [totalPages, setTotalPages] = useState(1);
//   const [isLoading, setIsLoading] = useState(true);

//   const mapApiOrderToState = (apiOrder) => {
//     const statusInfo = {
//       display: 
//         apiOrder.status === "COMPLETED" ? "Hoàn thành" :
//         apiOrder.status === "PENDING" ? "Đang xử lý" :
//         apiOrder.status === "SHIPPED" ? "Đang giao" :
//         apiOrder.status === "CANCELLED" ? "Đã hủy" : apiOrder.status,
//       color: statusColors[apiOrder.status] || "bg-gray-100 text-gray-800 border-gray-200",
//       icon: statusIcons[apiOrder.status] || <FiInfo />
//     };

//     return {
//       id: apiOrder.id,
//       code: apiOrder.code,
//       date: apiOrder.createdAt,
//       status: statusInfo.display,
//       statusColor: statusInfo.color,
//       statusIcon: statusInfo.icon,
//       recipient: apiOrder.recipient,
//       address: apiOrder.address,
//       phone: apiOrder.phone,
//       items: apiOrder.orderDetails.map(detail => ({
//         name: detail.title,
//         price: detail.price,
//         quantity: detail.quantity,
//         ramValue: detail.ramValue,
//         hardDriveValue: detail.hardDriveValue,
//         colorName: detail.colorName,
//         thumbnail: detail.thumbnail,
//       })),
//       total: apiOrder.totalPrice,
//     };
//   };

//   useEffect(() => {
//     const fetchOrders = async () => {
//       setIsLoading(true);
//       try {
//         const res = await apiGetOrders({ accessToken, page, size });
//         if (res.code === 200) {
//           const mappedOrders = res.data.content.map(mapApiOrderToState);
//           setOrders(mappedOrders);
//           setTotalPages(res.data.totalPages);
//         }
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchOrders();
//   }, [accessToken, page, size]);

//   const handleDetail = (order) => {
//     setSelectedOrder(order);
//     setIsOpen(true);
//   };

//   const handleBuyAgain = (order) => {
//     const cartItems = order.items.map(item => ({
//       name: item.name,
//       quantity: item.quantity
//     }));
//     console.log("Thêm vào giỏ hàng:", cartItems);
//     alert("Đã thêm sản phẩm vào giỏ hàng!");
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (orders.length === 0) {
//     return (
//       <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-2xl mx-auto">
//         <div className="mx-auto max-w-md">
//           <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
//             <FiShoppingCart className="text-4xl text-blue-500" />
//           </div>
//           <h3 className="text-2xl font-bold text-gray-800 mb-3">Bạn chưa có đơn hàng nào</h3>
//           <p className="text-gray-600 mb-8 text-lg">
//             Khi bạn đặt hàng, bạn có thể xem chi tiết đơn hàng tại đây
//           </p>
//           <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all text-lg font-medium shadow-md">
//             Tiếp tục mua sắm
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
//       {/* Header */}
//       <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
//         <div className="flex items-center">
//           <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-3 rounded-xl shadow-md mr-4">
//             <FiShoppingCart className="text-2xl" />
//           </div>
//           <div>
//             <h2 className="text-2xl font-bold text-gray-800">Đơn hàng của tôi</h2>
//             <p className="text-gray-600 mt-1">Quản lý và theo dõi đơn hàng của bạn</p>
//           </div>
//         </div>
//       </div>

//       {/* Order List */}
//       <div className="divide-y divide-gray-100">
//         <AnimatePresence>
//           {orders.map((order) => (
//             <motion.div
//               key={order.id}
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -10 }}
//               transition={{ duration: 0.3 }}
//               className="p-6 hover:bg-blue-50/30 transition-colors"
//             >
//               <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
//                 {/* Order Summary */}
//                 <div className="md:col-span-8">
//                   <div className="flex flex-wrap items-center gap-4 mb-4">
//                     <div className="flex items-center gap-3">
//                       <div className={`p-2 rounded-lg ${order.statusColor} flex items-center justify-center`}>
//                         {order.statusIcon}
//                       </div>
//                       <div>
//                         <p className="text-sm text-gray-500">Mã đơn hàng</p>
//                         <p className="font-bold text-gray-800 text-lg">#{order.id}</p>
//                       </div>
//                     </div>
                    
//                     <div className="flex items-center gap-2">
//                       <FiCalendar className="text-gray-400" />
//                       <p className="text-gray-600">{formatDate(order.date)}</p>
//                     </div>
                    
//                     <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.statusBadge}`}>
//                       {order.status}
//                     </span>
//                   </div>
                  
//                   {/* Products Preview */}
//                   <div className="flex flex-wrap items-center gap-3">
//                     {order.items.slice(0, 3).map((item) => (
//                       <div key={item.id} className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow">
//                         <img 
//                           src={item.thumbnail} 
//                           alt={item.name} 
//                           className="w-16 h-16 object-contain rounded-lg border border-gray-100"
//                         />
//                         <div>
//                           <p className="font-medium text-gray-800 line-clamp-1 max-w-[180px]">{item.name}</p>
//                           <p className="text-sm text-gray-500 mt-1">x{item.quantity}</p>
//                         </div>
//                       </div>
//                     ))}
//                     {order.items.length > 3 && (
//                       <div className="bg-blue-50 rounded-xl px-4 py-2 text-blue-600 font-medium flex items-center">
//                         +{order.items.length - 3} sản phẩm
//                       </div>
//                     )}
//                   </div>
//                 </div>
                
//                 {/* Order Total & Actions */}
//                 <div className="md:col-span-4 flex flex-col justify-between">
//                   <div className="text-right mb-6">
//                     <p className="text-gray-500 text-sm">Tổng tiền</p>
//                     <p className="font-bold text-blue-600 text-2xl">{formatPrice(order.total)}</p>
//                   </div>
                  
//                   <div className="flex justify-end gap-3">
//                     <button
//                       onClick={() => handleDetail(order)}
//                       className="px-4 py-2 border border-gray-300 rounded-xl text-sm hover:bg-gray-50 transition-colors text-gray-700 font-medium flex items-center shadow-sm"
//                     >
//                       <FiInfo className="mr-2" /> Chi tiết
//                     </button>
//                     {order.status === "Hoàn thành" && (
//                       <button
//                         onClick={() => handleBuyAgain(order)}
//                         className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl text-sm hover:from-blue-600 hover:to-indigo-700 transition-all font-medium flex items-center shadow-md transform hover:-translate-y-0.5"
//                       >
//                         <FiShoppingCart className="mr-2" /> Mua lại
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </AnimatePresence>
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="px-6 py-4 border-t border-gray-100 flex justify-center">
//           <div className="flex gap-2">
//             {Array.from({ length: totalPages }, (_, i) => (
//               <button
//                 key={i}
//                 onClick={() => setPage(i)}
//                 className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
//                   page === i 
//                     ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md' 
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 {i + 1}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Order Detail Modal */}
//       <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
//         <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
//         <div className="fixed inset-0 flex items-center justify-center p-4">
//           <Dialog.Panel 
//             as={motion.div}
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.95 }}
//             className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
//           >
//             <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50">
//               <Dialog.Title className="text-xl font-bold text-gray-800 flex items-center">
//                 <span className="bg-blue-500 text-white p-3 rounded-xl mr-3 shadow-md">
//                   <FiShoppingCart className="text-xl" />
//                 </span>
//                 <span className="text-xl">Chi tiết đơn hàng #{selectedOrder?.id}</span>
//               </Dialog.Title>
//               <button 
//                 onClick={() => setIsOpen(false)} 
//                 className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700"
//               >
//                 <FiX className="text-xl" />
//               </button>
//             </div>

//             <div className="overflow-y-auto flex-1 p-6">
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//                 {/* Order Information */}
//                 <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
//                   <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center">
//                     <FiInfo className="mr-2 text-blue-500" /> Thông tin đơn hàng
//                   </h3>
//                   <div className="space-y-4">
//                     <div className="flex justify-between items-center pb-3 border-b border-gray-100">
//                       <div className="flex items-center text-gray-600">
//                         <FiCalendar className="mr-2" />
//                         <span>Ngày đặt:</span>
//                       </div>
//                       <span className="font-medium text-gray-800">{formatDate(selectedOrder?.date)}</span>
//                     </div>
                    
//                     <div className="flex justify-between items-center pb-3 border-b border-gray-100">
//                       <div className="flex items-center text-gray-600">
//                         <div className="mr-2">
//                           {selectedOrder?.statusIcon}
//                         </div>
//                         <span>Trạng thái:</span>
//                       </div>
//                       <span className={`font-medium ${selectedOrder?.statusColor.replace('bg-', 'text-')}`}>
//                         {selectedOrder?.status}
//                       </span>
//                     </div>
                    
//                     <div className="flex justify-between items-center">
//                       <div className="flex items-center text-gray-600">
//                         <FiCreditCard className="mr-2" />
//                         <span>Phương thức thanh toán:</span>
//                       </div>
//                       <span className="font-medium text-gray-800">COD</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Shipping Information */}
//                 <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
//                   <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center">
//                     <FiTruck className="mr-2 text-blue-500" /> Thông tin giao hàng
//                   </h3>
//                   <div className="space-y-4">
//                     <div className="flex items-start pb-3 border-b border-gray-100">
//                       <FiUser className="mt-1 mr-2 text-gray-600" />
//                       <div>
//                         <p className="text-gray-600">Người nhận</p>
//                         <p className="font-medium text-gray-800">{selectedOrder?.recipient}</p>
//                       </div>
//                     </div>
                    
//                     <div className="flex items-start pb-3 border-b border-gray-100">
//                       <FiMapPin className="mt-1 mr-2 text-gray-600" />
//                       <div>
//                         <p className="text-gray-600">Địa chỉ</p>
//                         <p className="font-medium text-gray-800">{selectedOrder?.address}</p>
//                       </div>
//                     </div>
                    
//                     <div className="flex items-start">
//                       <FiPhone className="mt-1 mr-2 text-gray-600" />
//                       <div>
//                         <p className="text-gray-600">Số điện thoại</p>
//                         <p className="font-medium text-gray-800">{selectedOrder?.phone}</p>
//                       </div>
//                     </div>
                    
//                     <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
//                       <div className="flex items-center text-gray-600">
//                         <span>Phí vận chuyển:</span>
//                       </div>
//                       <span className="font-medium text-green-600">Miễn phí</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Products */}
//               <h3 className="font-bold text-gray-800 text-lg mb-4">Sản phẩm đã đặt</h3>
//               <div className="space-y-4">
//                 {Array.isArray(selectedOrder?.items) &&
//                   selectedOrder.items.map((item, idx) => (
//                     <motion.div 
//                       key={idx}
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       transition={{ delay: idx * 0.05 }}
//                       className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-shadow"
//                     >
//                       <div className="flex gap-5">
//                         <img 
//                           src={item.thumbnail} 
//                           alt={item.name} 
//                           className="w-24 h-24 object-contain rounded-lg border border-gray-100 bg-gray-50 p-2"
//                         />
//                         <div className="flex-1">
//                           <p className="font-bold text-gray-900 text-lg mb-1">{item.name}</p>
//                           <div className="grid grid-cols-2 gap-3 mb-3">
//                             <div>
//                               <p className="text-sm text-gray-500">RAM</p>
//                               <p className="font-medium">{item.ramValue}</p>
//                             </div>
//                             <div>
//                               <p className="text-sm text-gray-500">SSD</p>
//                               <p className="font-medium">{item.hardDriveValue}</p>
//                             </div>
//                             <div>
//                               <p className="text-sm text-gray-500">Màu sắc</p>
//                               <p className="font-medium">{item.colorName}</p>
//                             </div>
//                             <div>
//                               <p className="text-sm text-gray-500">Số lượng</p>
//                               <p className="font-medium">x{item.quantity}</p>
//                             </div>
//                           </div>
//                           <div className="flex justify-between items-center">
//                             <p className="text-gray-600">Đơn giá: {formatPrice(item.price)}</p>
//                             <p className="font-bold text-blue-600 text-lg">
//                               {formatPrice(item.price * item.quantity)}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="mt-4 pt-4 border-t border-gray-100">
//                         <RatingBox />
//                       </div>
//                     </motion.div>
//                   ))}
//               </div>
//             </div>

//             <div className="p-6 border-t border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
//               <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
//                 <div className="text-gray-600">
//                   <p className="mb-1">Cần hỗ trợ?</p>
//                   <a href="#" className="text-blue-600 font-medium hover:underline flex items-center">
//                     <FiInfo className="mr-2" /> Liên hệ chúng tôi
//                   </a>
//                 </div>
                
//                 <div className="flex flex-col items-end">
//                   <p className="text-gray-600 text-sm">Tổng cộng</p>
//                   <p className="text-2xl font-bold text-blue-600">
//                     {formatPrice(selectedOrder?.total)}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </Dialog.Panel>
//         </div>
//       </Dialog>
//     </div>
//   );
// };

// export default MyOrders;