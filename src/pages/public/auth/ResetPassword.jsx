import React, { useState, useRef, use } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Eye, EyeOff } from 'lucide-react';
import {
  apiSendOtpForgotPw,
  apiVerifyOtp,
  apiResetPassword,
} from "~/apis/authApi";

const ResetPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resetToken, setResetToken] = useState('');
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [showPasswords, setShowPasswords] = useState({ new: false, confirm: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const otpRefs = useRef([]);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  // ✅ Step 1: Gửi OTP qua email
  const handleSendEmail = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Gọi API gửi OTP
      const res = await apiSendOtpForgotPw(email);
      if (res.code===200) {
        setSuccess(`Đã gửi mã xác minh đến ${email}`);
        setStep(2); // Chuyển sang bước nhập OTP
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError("Gửi mã thất bại, thử lại nhé!");
    } finally {
      setIsSubmitting(false);
    }
  };


  // ✅ Xử lý nhập mã OTP
  const handleChangeOtp = (e, index) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Tự động focus ô tiếp theo
    if (value && index < 5) otpRefs.current[index + 1]?.focus();

    // Bấm backspace thì lùi về ô trước
    if (!value && index > 0 && e.key === 'Backspace') {
      otpRefs.current[index - 1]?.focus();
    }
  };


  // ✅ Step 2: Xác minh OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    const code = otp.join('');
    if (code.length !== 6) {
      setError('Vui lòng nhập đủ 6 số!');
      setIsSubmitting(false);
      return;
    }

    try {
      // Gọi API xác minh OTP
      const res = await apiVerifyOtp({ email, otp: code });

      if (res.code===200) {
        setResetToken(res.resetToken); // ✅ Lưu resetToken để dùng bước 3
        setOtp(['', '', '', '', '', '']);
        setStep(3); // ✅ Chuyển bước nhập mật khẩu mới
      } else {
        setError(res.message);
        setOtp(['', '', '', '', '', '']);
        otpRefs.current[0]?.focus(); // Focus lại ô đầu tiên
      }
    } catch (err) {
      setError('Xác thực thất bại, thử lại nhé!');
    } finally {
      setIsSubmitting(false);
    }
  };


  // ✅ Step 3: Gửi mật khẩu mới kèm resetToken
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    const { password, confirmPassword } = formData;

    if (!password || !confirmPassword) {
      setError("Vui lòng nhập mật khẩu mới và xác nhận!");
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      setIsSubmitting(false);
      return;
    }

    try {
      // Gọi API reset password kèm resetToken
      const res = await apiResetPassword({
        email,
        newPassword: password,
        resetToken, // ✅ Cần phải có resetToken
      });

      if (res.success) {
        setSuccess("Đặt lại mật khẩu thành công!");
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setError(res.message || "Đặt lại mật khẩu thất bại.");
      }
    } catch (err) {
      setError("Đặt lại mật khẩu thất bại, thử lại nhé!");
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-200 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8 animate-fade-in">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-[#e7f3ff] text-[#1877F2] p-3 rounded-full transform transition-transform hover:scale-110">
            <Mail size={24} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#1877F2] mt-4">
            Quên mật khẩu?
          </h2>
          <p className="text-center text-gray-600 text-sm sm:text-base mt-2">
            {step === 1
              ? 'Nhập email của bạn để nhận mã xác minh.'
              : step === 2
              ? 'Nhập mã xác minh đã được gửi tới email của bạn.'
              : 'Nhập mật khẩu mới để hoàn tất.'}
          </p>
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mt-4 text-sm text-center animate-shake">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 text-green-700 p-3 rounded-lg mt-4 text-sm text-center">
              {success}
            </div>
          )}
        </div>

        {step === 1 && (
          <form onSubmit={handleSendEmail} className="space-y-4 sm:space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email của bạn
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="w-full px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1877F2] bg-gray-50 transition-all pl-10"
                  required
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-[#1877F2] hover:bg-[#1666D2] text-white font-semibold py-2 sm:py-3 rounded-lg transition-all transform hover:scale-[1.02] ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Đang gửi...' : 'Gửi mã xác nhận'}
            </button>
            <p className="text-center text-sm text-gray-600 mt-4">
              Quay lại{' '}
              <Link to="/login" className="text-[#1877F2] hover:underline font-medium">
                Đăng nhập
              </Link>
            </p>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mã xác minh
              </label>
              <div className="flex justify-between gap-2">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChangeOtp(e, i)}
                    onKeyDown={(e) => e.key === 'Backspace' && !digit && i > 0 && otpRefs.current[i - 1].focus()}
                    ref={(el) => (otpRefs.current[i] = el)}
                    className="w-10 sm:w-12 h-10 sm:h-12 text-center border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1877F2] bg-gray-50 transition-all text-lg font-medium"
                    required
                  />
                ))}
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-[#1877F2] hover:bg-[#1666D2] text-white font-semibold py-2 sm:py-3 rounded-lg transition-all transform hover:scale-[1.02] ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Đang xác minh...' : 'Xác minh'}
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4 sm:space-y-5">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Mật khẩu mới
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPasswords.new ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Mật khẩu mới"
                  className="w-full px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1877F2] bg-gray-50 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({ ...prev, new: !prev.new }))
                  }
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPasswords.new ?  "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Nhập lại mật khẩu"
                  className="w-full px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1877F2] bg-gray-50 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      confirm: !prev.confirm,
                    }))
                  }
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPasswords.confirm ?  "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-[#1877F2] hover:bg-[#1666D2] text-white font-semibold py-2 sm:py-3 rounded-lg transition-all transform hover:scale-[1.02] ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;