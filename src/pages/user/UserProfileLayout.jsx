import React, { useState } from "react";
import SideBar from "./components/SideBar"; // Sidebar riêng cho profile
import ProfileInfo from "./components/ProfileInfo";
import MyOrders from "./components/MyOrders";
import Voucher from "./components/Voucher";
import ChangePassword from "./components/ChangePassword";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("info");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-200 flex p-4 sm:p-6 animate-fade-in">
      {/* Sidebar bên trái */}
      <SideBar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Nội dung hiển thị */}
      <div className="flex-1 p-4 sm:p-6 bg-white rounded-2xl shadow-xl ml-4">
        {activeTab === "info" && <ProfileInfo />}
        {activeTab === "orders" && <MyOrders />}
        {activeTab === "vouchers" && <Voucher />}
        {activeTab === "password" && <ChangePassword />}
      </div>
    </div>
  );
};

export default Profile;
