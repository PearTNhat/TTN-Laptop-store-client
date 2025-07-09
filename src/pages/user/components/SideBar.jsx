import React from "react";

const SideBar = ({ activeTab, setActiveTab, isExpanded, onClose }) => {
  const tabs = [
    { 
      id: "info", 
      name: "Thông tin cá nhân",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    { 
      id: "orders", 
      name: "Đơn hàng",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    { 
      id: "vouchers", 
      name: "Voucher",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
      )
    },
    { 
      id: "password", 
      name: "Đổi mật khẩu",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    },
  ];

  return (
    <aside className={`
      h-full bg-white shadow-lg rounded-r-none rounded-l-2xl
      ${isExpanded ? 'w-64' : 'w-20'}
      transition-all duration-300 ease-in-out
      overflow-hidden
    `}>
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        {isExpanded ? (
          <h2 className="text-xl font-bold text-blue-600">Tài khoản</h2>
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-500 mx-auto"></div>
        )}
        <button 
          onClick={onClose}
          className="sm:hidden text-gray-500 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Menu items */}
      <ul className="p-2">
        {tabs.map((tab) => (
          <li key={tab.id}>
            <button
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center w-full p-3 rounded-lg 
                transition-colors duration-200
                ${activeTab === tab.id 
                  ? 'bg-blue-50 text-blue-600 font-medium' 
                  : 'text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              <span className={`flex-shrink-0 ${isExpanded ? 'mr-3' : 'mx-auto'}`}>
                {tab.icon}
              </span>
              {isExpanded && <span>{tab.name}</span>}
            </button>
          </li>
        ))}
      </ul>

      {/* Footer */}
      {isExpanded && (
        <div className="p-4 border-t mt-auto">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 mr-3 flex items-center justify-center">
              <span className="text-blue-600 font-bold">NV</span>
            </div>
            <div>
              <p className="font-medium">Nguyễn Văn A</p>
              <p className="text-xs text-gray-500">nguyenvana@email.com</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default SideBar;