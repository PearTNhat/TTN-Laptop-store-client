// src/components/users/modals/ConfirmationModal.js
import React from 'react';

const ConfirmationModal = ({ title, message, onConfirm, onClose, confirmText, confirmColor = 'red' }) => {
    const colorClasses = {
        red: "bg-red-600 hover:bg-red-700",
        orange: "bg-orange-500 hover:bg-orange-600",
    };
    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="flex justify-end gap-3">
                <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold">Hủy</button>
                <button onClick={onConfirm} className={`px-4 py-2 text-white rounded-lg font-semibold ${colorClasses[confirmColor]}`}>
                    {confirmText}
                </button>
            </div>
        </div>
    );
};

export default ConfirmationModal;