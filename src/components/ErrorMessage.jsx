import React from "react";
import { AlertTriangle } from "lucide-react";

const ErrorMessage = ({ message }) => {
  return (
    <div
      className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md"
      role="alert"
    >
      <div className="flex items-center">
        <AlertTriangle className="mr-3" />
        <div>
          <p className="font-bold">Đã có lỗi xảy ra</p>
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
