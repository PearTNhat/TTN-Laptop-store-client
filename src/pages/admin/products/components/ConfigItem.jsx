import React from "react";

const ConfigItem = ({ label, value }) => (
  // Sử dụng flexbox để tạo bố cục 2 cột
  <li className="flex flex-col sm:flex-row py-3">
    <p className="text-start capitalize w-full sm:w-1/3 font-medium text-gray-500 flex-shrink-0 mb-1 sm:mb-0">
      {label}
    </p>
    <p className="text-start w-full sm:w-2/3 text-gray-800 leading-snug">
      {value}
    </p>
  </li>
);

export default ConfigItem;
