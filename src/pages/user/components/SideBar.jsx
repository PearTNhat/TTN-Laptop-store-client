const SideBar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "info", name: "Thông tin cá nhân" },
    { id: "orders", name: "Đơn hàng" },
    { id: "vouchers", name: "Voucher" },
    { id: "password", name: "Đổi mật khẩu" },
  ];

  return (
    <aside className="w-64 bg-white rounded-2xl shadow-lg p-4">
      <h2 className="text-xl font-bold mb-4">Tài khoản</h2>
      <ul className="space-y-2">
        {tabs.map((tab) => (
          <li
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`cursor-pointer px-4 py-2 rounded transition 
              ${
                activeTab === tab.id
                  ? "bg-blue-100 text-blue-600 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
          >
            {tab.name}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default SideBar;
