// Modal.js
import React, { useEffect } from "react";
import { modalActions } from "~/stores/slice/modal";
import { useDispatch } from "react-redux";

const Modal = ({ children, isOpen }) => {
  const dispatch = useDispatch();

  function onClose() {
    dispatch(
      modalActions.toggleModal({ childrenModal: null, isOpenModal: false })
    );
  }

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] overflow-y-auto"
      onClick={() => {
        onClose();
      }}
    >
      {/* Overlay */}
      <div
        className="fixed z-[1] inset-0 bg-black/30 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className="z-[999] min-h-screen relative transform transition-all duration-300 ease-in-out 
            scale-95 opacity-0 animate-modal-enter flex justify-center items-center"
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
