// src/components/users/modals/ModalWrapper.js
import React from 'react';

const ModalWrapper = ({ onClose, children }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose}>
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all" onClick={e => e.stopPropagation()}>
            {children}
        </div>
    </div>
);

export default ModalWrapper;