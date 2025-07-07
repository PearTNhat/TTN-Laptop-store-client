import { FaChevronLeft } from "react-icons/fa";

const PrevArrow = ({ onClick }) => (
  <button
    className="absolute top-1/2 left-4 z-10 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-600 hover:text-blue-600 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
    onClick={onClick}
  >
    <FaChevronLeft className="w-5 h-5" />
  </button>
);
export default PrevArrow;
