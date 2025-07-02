import React from "react";
// THAY ĐỔI Ở ĐÂY: Đã thay thế 'Twitter' bằng 'X'
import {
  Facebook,
  X,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Send,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* === Phần trên: Lưới thông tin === */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Cột 1: Logo và Mạng xã hội */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-wider">
              LAPTOP WORLD
            </h2>
            <p className="text-gray-400">
              Điểm đến hàng đầu cho laptop chính hãng, hiệu năng cao và dịch vụ
              tận tâm.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <Facebook size={20} />
              </a>
              {/* THAY ĐỔI Ở ĐÂY: Sử dụng icon X thay cho Twitter */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <X size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Cột 2: Sản phẩm */}
          <div>
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
              Sản phẩm
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href="#"
                  className="text-base text-gray-400 hover:text-white transition-colors duration-300"
                >
                  Laptop Gaming
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-base text-gray-400 hover:text-white transition-colors duration-300"
                >
                  Laptop Văn phòng
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-base text-gray-400 hover:text-white transition-colors duration-300"
                >
                  Macbook
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-base text-gray-400 hover:text-white transition-colors duration-300"
                >
                  Linh kiện & Phụ kiện
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-base text-gray-400 hover:text-white transition-colors duration-300"
                >
                  Khuyến mãi
                </a>
              </li>
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ khách hàng */}
          <div>
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
              Hỗ trợ
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href="#"
                  className="text-base text-gray-400 hover:text-white transition-colors duration-300"
                >
                  Trung tâm trợ giúp
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-base text-gray-400 hover:text-white transition-colors duration-300"
                >
                  Chính sách bảo hành
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-base text-gray-400 hover:text-white transition-colors duration-300"
                >
                  Chính sách đổi trả
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-base text-gray-400 hover:text-white transition-colors duration-300"
                >
                  Hướng dẫn mua hàng
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-base text-gray-400 hover:text-white transition-colors duration-300"
                >
                  Vận chuyển
                </a>
              </li>
            </ul>
          </div>

          {/* Cột 4: Đăng ký nhận tin & Liên hệ */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                Đăng ký nhận tin
              </h3>
              <p className="mt-4 text-base text-gray-400">
                Nhận thông tin khuyến mãi và sản phẩm mới nhất từ chúng tôi.
              </p>
              <form className="mt-4 flex flex-col sm:flex-row items-center">
                <input
                  type="email"
                  placeholder="Nhập email của bạn"
                  className="w-full px-4 py-2 text-gray-900 bg-white border border-transparent rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="mt-3 sm:mt-0 sm:ml-3 w-full sm:w-auto px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors duration-300 flex-shrink-0"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone size={18} className="text-blue-400" />
                <span className="text-gray-300">1900 1234</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={18} className="text-blue-400" />
                <span className="text-gray-300">support@laptopworld.vn</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin size={18} className="text-blue-400 mt-1" />
                <span className="text-gray-300">
                  123 Nguyễn Văn Linh, P. Tân Phong, Quận 7, TP.HCM
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* === Phần dưới: Copyright và Phương thức thanh toán === */}
        <div className="mt-12 border-t border-gray-700 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-base text-gray-400 text-center md:text-left">
            © {new Date().getFullYear()} LAPTOP WORLD. All Rights Reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <div className="flex items-center space-x-4">
              <span className="font-semibold text-gray-300">Thanh toán:</span>
              <img
                src="https://img.icons8.com/color/48/000000/visa.png"
                alt="Visa"
                className="h-6"
              />
              <img
                src="https://img.icons8.com/color/48/000000/mastercard-logo.png"
                alt="Mastercard"
                className="h-6"
              />
              <img
                src="https://img.icons8.com/fluency/48/000000/paypal.png"
                alt="Paypal"
                className="h-6"
              />
              <img
                src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Icon-VNPAY-QR.png"
                alt="VNPAY"
                className="h-6 bg-white p-1 rounded-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
