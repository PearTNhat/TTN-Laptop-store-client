import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import {
    FiX,
    FiShoppingCart,
    FiInfo,
    FiTruck,
    FiUser,
    FiMapPin,
    FiPhone,
    FiCalendar,
    FiCreditCard,
    FiBox,
    FiCheckCircle,
    FiPackage,
    FiXCircle,
    FiClock,
    FiSettings,
} from "react-icons/fi";

import RatingBox from "../RatingBox";
import { formatPrice, formatDate } from "~/utils/helper";
// Giả sử bạn có một file utils chứa các map trạng thái này
import { statusDisplayMap } from "./OrderStatus";

// ====================================================================
// COMPONENT 1: SKELETON LOADER
// ====================================================================
const SkeletonLoader = () => (
    <div className="p-6 space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded-md w-1/3"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-200 rounded-xl p-5 h-48"></div>
            <div className="bg-gray-200 rounded-xl p-5 h-48"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded-md w-1/4"></div>
        <div className="space-y-4">
            <div className="bg-gray-200 rounded-xl p-5 h-32 w-full"></div>
            <div className="bg-gray-200 rounded-xl p-5 h-32 w-full"></div>
        </div>
    </div>
);


// ====================================================================
// COMPONENT 2: ORDER STATUS TIMELINE (PHIÊN BẢN NÂNG CẤP)
// ====================================================================
const OrderStatusTimeline = ({ currentStatusKey }) => {
    const timelineSteps = [
        { key: "PENDING",    display: statusDisplayMap.PENDING,    icon: <FiCreditCard size={20} /> },
        { key: "AWAITING",   display: statusDisplayMap.AWAITING,   icon: <FiClock size={20} /> },
        { key: "PROCESSING", display: statusDisplayMap.PROCESSING, icon: <FiSettings size={20} /> },
        { key: "DELIVERED",  display: statusDisplayMap.DELIVERED,  icon: <FiPackage size={20} /> },
        { key: "COMPLETED",  display: statusDisplayMap.COMPLETED,  icon: <FiCheckCircle size={20} /> },
    ];

    if (currentStatusKey === 'CANCELED') {
        return (
            <div className="p-6 bg-red-50 rounded-2xl border border-red-200 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-red-500 text-white mb-4">
                    <FiXCircle size={32} />
                </div>
                <h3 className="font-bold text-red-700 text-xl">{statusDisplayMap.CANCELED}</h3>
                <p className="text-red-600 mt-1 text-sm">Đơn hàng này đã bị hủy và không thể xử lý tiếp.</p>
            </div>
        );
    }
    
    const activeIndex = timelineSteps.findIndex(s => s.key === currentStatusKey);

    return (
        <div className="p-6 bg-gray-50/80 rounded-2xl border border-gray-200">
            <h3 className="font-bold text-gray-800 text-lg mb-6 flex items-center">
                <FiPackage className="mr-3 text-indigo-500" /> Hành trình đơn hàng
            </h3>
            <div className="flex items-start justify-between relative">
                {timelineSteps.map((_, index) => (
                    index > 0 && (
                        <div 
                            key={`line-${index}`}
                            className={`absolute top-5 h-1 transition-all duration-500 ${index <= activeIndex ? 'bg-indigo-500' : 'bg-gray-300'}`}
                            style={{ 
                                left: `calc(${(index - 1) * 100 / (timelineSteps.length - 1)}% + 3rem)`,
                                right: `calc(100% - ${index * 100 / (timelineSteps.length - 1)}% + 3rem)`
                            }}
                        />
                    )
                ))}
                {timelineSteps.map((status, index) => {
                     const isActive = index <= activeIndex;
                     const isCurrent = index === activeIndex;

                    return (
                        <div key={status.key} className="flex flex-col items-center text-center z-10 w-24">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-all duration-300 ${isActive ? 'bg-indigo-600 shadow-lg' : 'bg-gray-300'} ${isCurrent ? 'ring-4 ring-offset-2 ring-indigo-300' : ''}`}>
                                {status.icon}
                            </div>
                            <p className={`mt-3 text-xs font-semibold transition-colors duration-300 ${isActive ? 'text-indigo-600' : 'text-gray-500'}`}>
                                {status.display}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


// ====================================================================
// COMPONENT 3: INFO BLOCK & INFO ROW
// ====================================================================
const InfoBlock = ({ title, icon, children }) => (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
        <h3 className="font-bold text-gray-800 text-lg mb-5 flex items-center">{icon} {title}</h3>
        <div className="space-y-4 text-sm">{children}</div>
    </div>
);

const InfoRow = ({ label, value, icon, valueClassName = "text-gray-800" }) => (
    <div className="flex justify-between items-center pb-3 border-b border-gray-100 last:border-b-0 last:pb-0">
        <div className="flex items-center text-gray-500">
            {icon}
            <span>{label}:</span>
        </div>
        <span className={`font-medium ${valueClassName}`}>{value}</span>
    </div>
);


// ====================================================================
// COMPONENT 4: PRODUCT ITEM
// ====================================================================
const ProductItem = ({ item, orderId, orderStatusKey, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: delay * 0.1, duration: 0.5 }}
    className="bg-white border border-gray-200/80 rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300"
  >
    {/* Hàng trên: ảnh + thông tin */}
    <div className="flex flex-col sm:flex-row gap-5">
      <img
        src={item.thumbnail}
        alt={item.name}
        className="w-full sm:w-32 h-32 object-cover rounded-xl border bg-white shadow-sm flex-shrink-0"
      />
      <div className="flex-1">
        <p className="font-semibold text-gray-900 text-lg mb-2">{item.name}</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4 text-sm text-gray-700">
          <p>
            <span className="text-gray-500">RAM:</span>{" "}
            <span className="font-medium">{item.ramValue}</span>
          </p>
          <p>
            <span className="text-gray-500">SSD:</span>{" "}
            <span className="font-medium">{item.hardDriveValue}</span>
          </p>
          <p>
            <span className="text-gray-500">Màu:</span>{" "}
            <span className="font-medium">{item.colorName}</span>
          </p>
          <p>
            <span className="text-gray-500">Số lượng:</span>{" "}
            <span className="font-medium">x{item.quantity}</span>
          </p>
        </div>
      </div>
    </div>

    {/* Rating xuống riêng bên dưới */}
    {orderStatusKey === "COMPLETED" && (
      <div className="mt-4 pt-4 border-t border-gray-100">
        <RatingBox
          orderId={orderId}
          productDetailId={item.idproductDetail}
          orderStatus={orderStatusKey}
        />
      </div>
    )}
  </motion.div>
);



// ====================================================================
// COMPONENT 5: ORDER SUMMARY
// ====================================================================
const OrderSummary = ({ order }) => {
    const finalTotal = order.total - (order.shopDiscount || 0) - (order.userDiscount || 0);

    return (
        <div className="bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-2xl border border-gray-200 p-6 shadow-inner">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-3">Tổng kết đơn hàng</h3>
            <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tạm tính:</span>
                    <span className="font-medium text-gray-900">{formatPrice(order.total)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-600">Phí vận chuyển:</span>
                    <span className="font-medium text-green-600">Miễn phí</span>
                </div>
                {order.shopDiscount > 0 && (
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Giảm giá cửa hàng:</span>
                        <span className="font-medium text-red-500">- {formatPrice(order.shopDiscount)}</span>
                    </div>
                )}
                {order.userDiscount > 0 && (
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Voucher giảm:</span>
                        <span className="font-medium text-red-500">- {formatPrice(order.userDiscount)}</span>
                    </div>
                )}
            </div>
            <div className="my-4 border-t border-dashed border-gray-300"></div>
            <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-900">Thành tiền</span>
                <span className="text-3xl font-bold text-indigo-600">{formatPrice(finalTotal)}</span>
            </div>
        </div>
    );
};


// ====================================================================
// COMPONENT 6: MAIN ORDER DETAILS (COMPONENT CHÍNH)
// ====================================================================
const OrderDetails = ({ isOpen, onClose, order }) => {
    return (
        <Transition appear show={isOpen} as={React.Fragment}>
            <Dialog onClose={onClose} className="relative z-50">
                <Transition.Child
                    as={React.Fragment}
                    enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
                    leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Transition.Child
                        as={React.Fragment}
                        enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="bg-gray-50 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                            <div className="p-5 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
                                <Dialog.Title className="text-2xl font-bold text-gray-800 flex items-center">
                                    <span className="bg-indigo-600 text-white p-3 rounded-xl mr-4 shadow-md">
                                        <FiShoppingCart size={24} />
                                    </span>
                                    <span>Chi tiết đơn hàng #{order?.code}</span>
                                </Dialog.Title>
                                <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition">
                                    <FiX size={24} />
                                </button>
                            </div>

                            <div className="overflow-y-auto flex-1 p-6 space-y-8 bg-white">
                                {!order ? (
                                    <SkeletonLoader />
                                ) : (
                                    <>
                                        <OrderStatusTimeline currentStatusKey={order.statusfilter} />
                                        
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            <InfoBlock title="Thông tin đơn hàng" icon={<FiInfo className="mr-2 text-indigo-500" />}>
                                                <InfoRow label="Ngày đặt" value={formatDate(order.date)} icon={<FiCalendar className="mr-2"/>} />
                                                <InfoRow 
                                                    label="Trạng thái" 
                                                    value={order.status} 
                                                    icon={<div className="mr-2">{order.statusIcon}</div>}
                                                    valueClassName={order.statusColor.replace("bg-", "text-").replace("-100", "-600")}
                                                />
                                                <InfoRow label="Thanh toán" value={order.paymentMethod} icon={<FiCreditCard className="mr-2"/>} />
                                            </InfoBlock>

                                            <InfoBlock title="Thông tin giao hàng" icon={<FiTruck className="mr-2 text-indigo-500" />}>
                                                <InfoRow label="Người nhận" value={order.recipient} icon={<FiUser className="mr-2"/>} />
                                                <InfoRow label="Địa chỉ" value={order.address} icon={<FiMapPin className="mr-2"/>} />
                                                <InfoRow label="Điện thoại" value={order.phone} icon={<FiPhone className="mr-2"/>} />
                                            </InfoBlock>
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-gray-900 text-xl mb-4 border-b pb-3">Sản phẩm đã đặt</h3>
                                            <div className="space-y-4">
                                                {Array.isArray(order.items) &&
                                                    order.items.map((item, idx) => (
                                                        <ProductItem 
                                                            key={item.idproductDetail} 
                                                            item={item} 
                                                            orderId={order.idOrder}
                                                            orderStatusKey={order.statusfilter}
                                                            delay={idx} 
                                                        />
                                                    ))}
                                            </div>
                                        </div>

                                        <OrderSummary order={order} />
                                    </>
                                )}
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};

export default OrderDetails;