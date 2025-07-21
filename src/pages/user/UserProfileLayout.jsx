import React, { useState } from "react";
import ProfileInfo from "./components/ProfileInfo";
import MyOrders from "./components/MyOrders";
import Voucher from "./components/Voucher";
import ChangePassword from "./components/ChangePassword";
import ChangeEmail from "./components/ChangeEmail"; // 👉 mới

const Profile = () => {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("activeTab") || "info";
  });

  const changeTab = (tab) => {
    setActiveTab(tab);
    localStorage.setItem("activeTab", tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "info": return <ProfileInfo />;
      case "orders": return <MyOrders />;
      case "vouchers": return <Voucher />;
      case "password": return <ChangePassword />;
      case "email": return <ChangeEmail />; // 👉 thêm
      default: return null;
    }
  };

  const getTabLabel = () => {
    switch (activeTab) {
      case "info": return "Thông tin cá nhân";
      case "orders": return "Đơn hàng của tôi";
      case "vouchers": return "Kho voucher";
      case "password": return "Đổi mật khẩu";
      case "email": return "Đổi email"; // 👉 thêm
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-indigo-100 text-sky-900 font-[Inter]">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full border-4 border-sky-500 overflow-hidden shadow-lg">
              <img
                src="/images/arsenal.jpg"
                alt="Avatar"
                className="w-full h-full object-cover scale-105 hover:scale-110 transition"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-sky-800 dark:text-white">Nguyễn Văn A</h1>
              <p className="text-sm text-sky-600 dark:text-gray-400">Thành viên từ 2025 • TP.HCM</p>
            </div>
          </div>

          <a
            href="/"
            onClick={() => localStorage.removeItem("activeTab")} 
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-indigo-600 hover:to-sky-600 rounded-lg shadow transition"
          >
            🏠 Về trang chủ
          </a>
        </div>
      </header>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-6 mt-6">
        <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300">
          {/* Tabs */}
          <nav className="flex flex-wrap gap-3 mb-4 border-b pb-3">
            <TabButton active={activeTab === "info"} onClick={() => changeTab("info")}>👤 Thông tin</TabButton>
            <TabButton active={activeTab === "orders"} onClick={() => changeTab("orders")}>📦 Đơn hàng</TabButton>
            <TabButton active={activeTab === "vouchers"} onClick={() => changeTab("vouchers")}>🎟 Voucher</TabButton>
            <TabButton active={activeTab === "password"} onClick={() => changeTab("password")}>🔒 Đổi mật khẩu</TabButton>
            <TabButton active={activeTab === "email"} onClick={() => changeTab("email")}>✉️ Đổi email</TabButton> {/* 👉 mới */}
          </nav>

          {/* Section Title */}
          <h2 className="text-lg font-semibold text-indigo-700 mb-4">{getTabLabel()}</h2>

          {/* Tab Content */}
          <div className="animate-fade-in">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

// Tab Button component
const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-medium transition-all 
      ${active
        ? "bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-lg"
        : "bg-sky-100 text-sky-700 hover:bg-sky-200"}`}
  >
    {children}
  </button>
);

export default Profile;
