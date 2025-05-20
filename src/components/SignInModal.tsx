// src/components/SignInModal.tsx
import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; // << 1. ĐẢM BẢO ĐÃ IMPORT Link

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignUp: () => void;
}

const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose, onSwitchToSignUp }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { language } = useLanguage();
  const { login, isLoading: isAuthLoading } = useAuth();

  // ... (useEffect và content object giữ nguyên) ...
  const content = {
    en: {
      title: 'Sign In to Your Account',
      identifierLabel: 'Username or Email',
      identifierPlaceholder: 'Enter your username or email',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Enter your password',
      signInButton: 'Sign In',
      signingInButton: 'Signing In...',
      forgotPassword: 'Forgot password?',
      noAccount: "Don't have an account?",
      signUpLink: "Sign up here",
    },
    vi: {
      title: 'Đăng Nhập Vào Tài Khoản',
      identifierLabel: 'Tên đăng nhập hoặc Email',
      identifierPlaceholder: 'Nhập tên đăng nhập hoặc email',
      passwordLabel: 'Mật khẩu',
      passwordPlaceholder: 'Nhập mật khẩu',
      signInButton: 'Đăng Nhập',
      signingInButton: 'Đang đăng nhập...',
      forgotPassword: 'Quên mật khẩu?',
      noAccount: "Chưa có tài khoản?",
      signUpLink: "Đăng ký tại đây",
    }
  };

  const t = content[language as keyof typeof content] || content.en;


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(identifier, password);
      onClose(); 
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message); 
      } else {
        setError('An unexpected error occurred during sign in.'); 
      }
      console.error("Sign In error:", err);
    }
  };

  const handleForgotPasswordClick = () => {
    if (isAuthLoading) return; // Không làm gì nếu đang xác thực
    onClose(); // Đóng modal Sign In trước khi điều hướng
    // Điều hướng sẽ được thực hiện bởi <Link>
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={isAuthLoading ? () => {} : onClose} className="relative z-50">
        {/* ... (Transition.Child cho overlay giữ nguyên) ... */}
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
              {/* ... (Phần Dialog.Title và nút X giữ nguyên) ... */}
              <div className="flex justify-between items-start mb-6">
                <Dialog.Title className="text-xl sm:text-2xl font-bold leading-tight text-gray-900">
                  {t.title}
                </Dialog.Title>
                <button
                  type="button"
                  onClick={isAuthLoading ? () => {} : onClose}
                  disabled={isAuthLoading}
                  className="p-1 -m-1 text-gray-400 hover:text-gray-600 transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6e00ff] disabled:opacity-50"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* ... (Phần error message, input identifier, input password giữ nguyên) ... */}
                 {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 text-red-700 p-3 rounded-lg flex items-center text-sm"
                  >
                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                    {error}
                  </motion.div>
                )}

                <div>
                  <label htmlFor="signInIdentifier" className="block text-sm font-medium text-gray-700 mb-1">
                    {t.identifierLabel}
                  </label>
                  <input
                    type="text"
                    id="signInIdentifier"
                    name="identifier"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#6e00ff] focus:border-[#6e00ff] transition-colors text-sm sm:text-base ${
                      error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={t.identifierPlaceholder}
                    required
                    disabled={isAuthLoading}
                  />
                </div>

                <div>
                  <label htmlFor="signInPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    {t.passwordLabel}
                  </label>
                  <input
                    type="password"
                    id="signInPassword"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#6e00ff] focus:border-[#6e00ff] transition-colors text-sm sm:text-base ${
                      error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={t.passwordPlaceholder}
                    required
                    disabled={isAuthLoading}
                  />
                </div>


                <div className="text-sm">
                  {/* << 2. SỬ DỤNG Link VÀ onClick ĐỂ ĐÓNG MODAL TRƯỚC KHI ĐIỀU HƯỚNG */}
                  <Link
                    to="/forgot-password"
                    onClick={handleForgotPasswordClick} // Gọi hàm để đóng modal
                    className={`font-medium text-[#6e00ff] hover:text-[#8f00ff] hover:underline focus:outline-none ${isAuthLoading ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    {t.forgotPassword}
                  </Link>
                </div>

                {/* ... (Nút Sign In và phần "Don't have an account?" giữ nguyên) ... */}
                 <button
                  type="submit"
                  disabled={isAuthLoading}
                  className="w-full bg-gradient-to-r from-[#6e00ff] to-[#ff007a] hover:from-[#7a1aff] hover:to-[#ff00e0] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6e00ff] disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isAuthLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t.signingInButton}
                    </>
                  ) : (
                    t.signInButton
                  )}
                </button>

                <p className="mt-6 text-center text-sm text-gray-600">
                  {t.noAccount}{' '}
                  <button
                    type="button"
                    onClick={isAuthLoading ? () => {} : onSwitchToSignUp}
                    disabled={isAuthLoading}
                    className="font-medium text-[#6e00ff] hover:text-[#8f00ff] hover:underline focus:outline-none disabled:opacity-50"
                  >
                    {t.signUpLink}
                  </button>
                </p>

              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SignInModal;