import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const Accordion = ({ icon, title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left py-4 hover:bg-gray-50 transition-colors duration-200 rounded-lg px-2"
      >
        <h3 className="text-md font-semibold text-gray-800 flex items-center space-x-2">
          <span className="flex items-center gap-1">
            {icon} {title}
          </span>
        </h3>
        <FaChevronDown
          className={`text-gray-400 transform transition-all duration-300 ease-in-out ${
            isOpen ? "rotate-180 text-blue-500" : ""
          }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100 pb-6" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-2">{children}</div>
      </div>
    </div>
  );
};

export default Accordion;
