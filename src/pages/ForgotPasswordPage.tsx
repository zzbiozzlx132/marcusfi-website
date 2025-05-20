// src/pages/ForgotPasswordPage.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const { language } = useLanguage();
  const navigate = useNavigate();

  const content = {
    en: {
      pageTitle: 'Reset Your Password',
      subtitle: 'Enter your email address and we will send you instructions to reset your password.',
      backToHome: 'Back to Home',
      emailLabel: 'Email address',
      emailPlaceholder: 'you@example.com',
      sendInstructionsButton: 'Send Reset Instructions',
      sendingButton: 'Sending...',
      successMessage: 'If an account exists with this email, you will receive password reset instructions shortly.',
      errorMessage: 'An error occurred. Please try again later.',
      rememberPassword: 'Remember your password?',
      signInLinkText: 'Sign In',
      dontHaveAccount: "Don't have an account?", // Thêm cho dễ hiểu
      signUpLinkText: 'Sign Up',          // Thêm cho dễ hiểu
    },
    vi: {
      pageTitle: 'Đặt Lại Mật Khẩu',
      subtitle: 'Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn hướng dẫn để đặt lại mật khẩu.',
      backToHome: 'Về Trang Chủ',
      emailLabel: 'Địa chỉ Email',
      emailPlaceholder: 'ban@example.com',
      sendInstructionsButton: 'Gửi Hướng Dẫn Đặt Lại',
      sendingButton: 'Đang gửi...',
      successMessage: 'Nếu có tài khoản tồn tại với email này, bạn sẽ sớm nhận được hướng dẫn đặt lại mật khẩu.',
      errorMessage: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.',
      rememberPassword: 'Nhớ mật khẩu của bạn?',
      signInLinkText: 'Đăng Nhập',
      dontHaveAccount: "Chưa có tài khoản?",
      signUpLinkText: 'Đăng Ký',
    },
  };

  const t = content[language] || content.en;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setMessage({ type: 'success', text: t.successMessage });
    } catch (error) {
      setMessage({ type: 'error', text: t.errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerSignInModalOnHome = () => {
    navigate('/', { state: { openModal: 'signIn' } });
  };

  const triggerSignUpModalOnHome = () => {
    navigate('/', { state: { openModal: 'signUp' } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-indigo-950 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-10">
        <Link
          to="/"
          className="inline-flex items-center text-sm font-medium text-purple-300 hover:text-purple-200 transition-colors group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          {t.backToHome}
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sm:mx-auto sm:w-full sm:max-w-md text-center"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-3">
          {t.pageTitle}
        </h2>
        <p className="text-sm text-gray-300 mb-8">
          {t.subtitle}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/90 dark:bg-slate-800/80 backdrop-blur-lg shadow-2xl rounded-2xl p-8 space-y-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email-forgot" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.emailLabel}
              </label>
              <div className="mt-1 relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
                </div>
                <input
                  id="email-forgot"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-[#6e00ff] focus:border-[#6e00ff] transition-colors sm:text-sm"
                  placeholder={t.emailPlaceholder}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-lg p-4 flex items-start ${
                  message.type === 'success'
                    ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                }`}
              >
                {message.type === 'success' ? (
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
                )}
                <p className="text-sm">{message.text}</p>
              </motion.div>
            )}

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-gradient-to-r from-[#6e00ff] to-[#c026d3] hover:from-[#7a1aff] hover:to-[#d946ef] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6e00ff] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {/* ... (Nội dung nút submit giữ nguyên) ... */}
                 {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t.sendingButton}
                  </>
                ) : (
                  t.sendInstructionsButton
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t.rememberPassword}{' '}
              <button
                onClick={triggerSignInModalOnHome} // << SỬ DỤNG HÀM MỚI
                className="font-medium text-[#6e00ff] hover:text-[#8f00ff] dark:hover:text-purple-400 hover:underline"
              >
                {t.signInLinkText}
              </button>
            </p>
             <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {t.dontHaveAccount}{' '}
              <button
                onClick={triggerSignUpModalOnHome} // << SỬ DỤNG HÀM MỚI
                className="font-medium text-[#6e00ff] hover:text-[#8f00ff] dark:hover:text-purple-400 hover:underline"
              >
                {t.signUpLinkText}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;