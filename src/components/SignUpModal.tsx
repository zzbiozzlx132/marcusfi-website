// src/components/modals/SignUpModal.tsx (Hoặc một đường dẫn phù hợp trong dự án của bạn)
import React, { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext'; // Điều chỉnh đường dẫn nếu cần
import { motion } from 'framer-motion';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignIn: () => void; // Prop để chuyển sang modal Đăng nhập
}

const SignUpModal: React.FC<SignUpModalProps> = ({ isOpen, onClose, onSwitchToSignIn }) => {
  const initialFormData = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  };
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { language } = useLanguage();
  // const { register } = useAuth(); // Ví dụ: nếu bạn có hàm register trong AuthContext

  // Reset form khi modal được mở hoặc đóng
  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData);
      setErrors({});
    }
  }, [isOpen]);

  const content = {
    en: {
      title: "Create Your Account",
      subtitle: "Join MarcusFI and start your journey to financial freedom",
      fullNameLabel: "Full Name",
      fullNamePlaceholder: "Enter your full name",
      emailLabel: "Email Address",
      emailPlaceholder: "Enter your email address",
      passwordLabel: "Password",
      passwordPlaceholder: "Choose a strong password",
      confirmPasswordLabel: "Confirm Password",
      confirmPasswordPlaceholder: "Confirm your password",
      signUpButton: "Create Account",
      alreadyHaveAccount: "Already have an account?",
      signInLink: "Sign in here",
      validation: {
        fullNameRequired: 'Full name is required.',
        emailRequired: 'Email is required.',
        emailInvalid: 'Invalid email format.',
        passwordRequired: 'Password is required.',
        passwordMinLength: 'Password must be at least 8 characters.',
        confirmPasswordMatch: 'Passwords do not match.'
      }
    },
    vi: {
      title: "Tạo Tài Khoản",
      subtitle: "Tham gia MarcusFI và bắt đầu hành trình tự do tài chính của bạn",
      fullNameLabel: "Họ và Tên",
      fullNamePlaceholder: "Nhập họ và tên của bạn",
      emailLabel: "Địa Chỉ Email",
      emailPlaceholder: "Nhập địa chỉ email của bạn",
      passwordLabel: "Mật Khẩu",
      passwordPlaceholder: "Chọn mật khẩu mạnh",
      confirmPasswordLabel: "Xác Nhận Mật Khẩu",
      confirmPasswordPlaceholder: "Xác nhận mật khẩu của bạn",
      signUpButton: "Tạo Tài Khoản",
      alreadyHaveAccount: "Đã có tài khoản?",
      signInLink: "Đăng nhập tại đây",
      validation: {
        fullNameRequired: 'Vui lòng nhập họ và tên.',
        emailRequired: 'Vui lòng nhập email.',
        emailInvalid: 'Định dạng email không hợp lệ.',
        passwordRequired: 'Vui lòng nhập mật khẩu.',
        passwordMinLength: 'Mật khẩu phải có ít nhất 8 ký tự.',
        confirmPasswordMatch: 'Mật khẩu xác nhận không khớp.'
      }
    }
  };

  const t = content[language as keyof typeof content] || content.en;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = t.validation.fullNameRequired;
    if (!formData.email.trim()) {
      newErrors.email = t.validation.emailRequired;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t.validation.emailInvalid;
    }
    if (!formData.password) {
      newErrors.password = t.validation.passwordRequired;
    } else if (formData.password.length < 8) {
      newErrors.password = t.validation.passwordMinLength;
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t.validation.confirmPasswordMatch;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Sign up form submitted:', formData);
      // Nơi bạn sẽ gọi API đăng ký
      // try {
      //   await register(formData.fullName, formData.email, formData.password); // Giả sử bạn có hàm register
      //   alert('Registration successful!'); // Hoặc thông báo thành công khác
      //   onClose(); // Đóng modal sau khi đăng ký thành công
      // } catch (apiError: any) {
      //   setErrors(prev => ({ ...prev, general: apiError.message || 'Sign up failed. Please try again.' }));
      // }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (errors.general) { // Xóa lỗi chung nếu có
        setErrors(prev => ({...prev, general: ''}));
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 sm:p-8 text-left align-middle shadow-xl transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <Dialog.Title className="text-xl sm:text-2xl font-bold leading-tight text-gray-900">
                    {t.title}
                  </Dialog.Title>
                  <p className="text-sm text-gray-500 mt-1">{t.subtitle}</p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1 -m-1 text-gray-400 hover:text-gray-600 transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6e00ff]"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {/* Hiển thị lỗi chung (nếu có từ API chẳng hạn) */}
              {errors.general && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-4"
                >
                    {errors.general}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="signUpFullName" className="block text-sm font-medium text-gray-700 mb-1">
                    {t.fullNameLabel}
                  </label>
                  <input
                    type="text"
                    id="signUpFullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#6e00ff] focus:border-[#6e00ff] transition-colors text-sm sm:text-base ${
                      errors.fullName ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={t.fullNamePlaceholder}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="signUpEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    {t.emailLabel}
                  </label>
                  <input
                    type="email"
                    id="signUpEmail"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#6e00ff] focus:border-[#6e00ff] transition-colors text-sm sm:text-base ${
                      errors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={t.emailPlaceholder}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="signUpPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    {t.passwordLabel}
                  </label>
                  <input
                    type="password"
                    id="signUpPassword"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#6e00ff] focus:border-[#6e00ff] transition-colors text-sm sm:text-base ${
                      errors.password ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={t.passwordPlaceholder}
                  />
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="signUpConfirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    {t.confirmPasswordLabel}
                  </label>
                  <input
                    type="password"
                    id="signUpConfirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#6e00ff] focus:border-[#6e00ff] transition-colors text-sm sm:text-base ${
                      errors.confirmPassword ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={t.confirmPasswordPlaceholder}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#6e00ff] to-[#ff007a] hover:from-[#7a1aff] hover:to-[#ff00e0] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6e00ff]"
                >
                  {t.signUpButton}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-600">
                {t.alreadyHaveAccount}{' '}
                <button
                  type="button"
                  onClick={onSwitchToSignIn}
                  className="text-[#6e00ff] hover:text-[#8f00ff] font-medium focus:outline-none hover:underline"
                >
                  {t.signInLink}
                </button>
              </p>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SignUpModal;