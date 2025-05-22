// src/pages/FICalculatorPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, TrendingUp, PiggyBank, Percent, ShieldCheck, Wallet, Info, ChevronRight, RefreshCw } from 'lucide-react';

// Helper function to format currency (Vietnamese Dong)
const formatCurrency = (value: number | null | undefined, showUnit = true): string => {
  if (value === null || value === undefined || isNaN(value)) return showUnit ? '0 VNĐ' : '0';
  const formatted = new Intl.NumberFormat('vi-VN').format(value);
  return showUnit ? `${formatted} VNĐ` : formatted;
};

// Helper function to parse formatted currency string to number
const parseFormattedNumber = (formattedValue: string): number | undefined => {
  const cleaned = formattedValue.replace(/[^0-9]/g, '');
  if (cleaned === '') return undefined;
  const numberValue = parseFloat(cleaned);
  return isNaN(numberValue) ? undefined : numberValue;
};

const formatYears = (years: number | null | undefined): string => {
    if (years === null || years === undefined || isNaN(years) || years === Infinity) return '...';
    if (years < 0) return 'N/A';
    const y = Math.floor(years);
    const m = Math.round((years - y) * 12);
    let result = '';
    if (y > 0) result += `${y} năm `;
    if (m > 0) result += `${m} tháng`;
    return result.trim() || (y === 0 && m === 0 ? 'Ngay bây giờ!' : '0 tháng');
};

// --- InputField Component (Sửa đổi để luôn gọi onChange với number) ---
interface InputFieldProps {
    id: string;
    label: string;
    value: number; // Prop value từ component cha là number
    onChange: (value: number) => void; // Prop onChange cũng nhận number
    icon?: React.ReactNode;
    unit?: string;
    placeholder?: string;
    tooltip?: string;
    min?: number;
    max?: number;
    // isPercentage và step không còn thực sự cần thiết cho type="text" theo cách này
}

const InputField: React.FC<InputFieldProps> = ({
    id, label, value, onChange, icon, unit, placeholder, tooltip,
    min = 0,
    max,
}) => {
    const [inputValue, setInputValue] = useState<string>(String(value));

    useEffect(() => {
        // Đồng bộ inputValue với prop value nếu chúng khác nhau
        // Điều này quan trọng khi giá trị được reset từ bên ngoài hoặc khởi tạo
        if (String(value) !== inputValue) {
            // Chỉ cập nhật nếu giá trị số của inputValue thực sự khác với value
            // để tránh ghi đè khi người dùng đang gõ các ký tự hợp lệ nhưng chưa hoàn chỉnh (vd: "7.")
            const currentNumericInputValue = parseFloat(inputValue.replace(',', '.'));
            if (isNaN(currentNumericInputValue) || value !== currentNumericInputValue) {
                setInputValue(String(value));
            }
        }
    }, [value]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let rawValue = e.target.value;
        rawValue = rawValue.replace(',', '.'); // Chuẩn hóa dấu phẩy thành chấm

        let validChars = "";
        let hasDecimal = false;
        for (const char of rawValue) {
            if ((char >= '0' && char <= '9') || (char === '.' && !hasDecimal)) {
                validChars += char;
                if (char === '.') {
                    hasDecimal = true;
                }
            }
        }
        rawValue = validChars;
        setInputValue(rawValue); // Cập nhật hiển thị

        if (rawValue === '' || rawValue === '.') {
            onChange(min); // Nếu rỗng hoặc chỉ có dấu chấm, gọi onChange với giá trị min
        } else {
            const numericValue = parseFloat(rawValue);
            if (!isNaN(numericValue)) {
                onChange(numericValue);
            } else {
                onChange(min); // Nếu không parse được, gọi onChange với giá trị min
            }
        }
    };

    const handleBlur = () => {
        let numericValue = parseFloat(inputValue.replace(',', '.'));

        if (isNaN(numericValue) || numericValue < min) {
            numericValue = min;
        } else if (max !== undefined && numericValue > max) {
            numericValue = max;
        }
        // Sau khi validate, cập nhật cả inputValue và gọi onChange
        setInputValue(String(numericValue));
        onChange(numericValue);
    };

    return (
    <div className="mb-6">
      <label htmlFor={id} className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
        {icon && <span className="mr-2 opacity-70">{icon}</span>}
        {label}
        {tooltip && (
          <span className="ml-1.5 group relative">
            <Info size={14} className="text-gray-400 hover:text-gray-600 cursor-help" />
            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-xs p-2 text-xs text-white bg-slate-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
              {tooltip}
            </span>
          </span>
        )}
      </label>
      <div className="relative">
        <input
          type="text"
          inputMode="decimal"
          id={id}
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-gray-800 placeholder-gray-400 text-lg"
        />
        {unit && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">{unit}</span>}
      </div>
    </div>
    );
};
// ----- KẾT THÚC InputField -----


// Component FormattedInputField cho các giá trị tiền tệ
interface FormattedInputFieldProps {
    id: string;
    label: string;
    value: number | undefined;
    onValueChange: (value: number | undefined) => void;
    icon?: React.ReactNode;
    unit?: string;
    placeholder?: string;
    tooltip?: string;
    min?: number;
    isRequired?: boolean;
}

const FormattedInputField: React.FC<FormattedInputFieldProps> = ({
    id, label, value, onValueChange, icon, unit, placeholder, tooltip, min = 0, isRequired
}) => {
    const [displayValue, setDisplayValue] = useState<string>(value !== undefined ? formatCurrency(value, false) : '');

    useEffect(() => {
        const currentNumericDisplayValue = parseFormattedNumber(displayValue);
        if (value !== currentNumericDisplayValue || (value === undefined && displayValue !== '')) {
            setDisplayValue(value !== undefined ? formatCurrency(value, false) : '');
        }
    }, [value]); // Giờ chỉ phụ thuộc vào prop value

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        const numericValue = parseFormattedNumber(rawValue);

        if (rawValue === '') {
            setDisplayValue('');
            onValueChange(undefined);
        } else if (numericValue !== undefined) {
            setDisplayValue(formatCurrency(numericValue, false));
            onValueChange(numericValue);
        } else {
            const onlyNumbers = rawValue.replace(/[^0-9]/g, '');
            setDisplayValue(onlyNumbers);
        }
    };

    const handleBlur = () => {
        let finalNumericValue = parseFormattedNumber(displayValue);

        if (finalNumericValue === undefined) {
            if (isRequired) {
                finalNumericValue = min;
            } else {
                onValueChange(undefined);
                setDisplayValue('');
                return;
            }
        }
        
        if (finalNumericValue < min) {
            finalNumericValue = min;
        }

        setDisplayValue(formatCurrency(finalNumericValue, false));
        onValueChange(finalNumericValue);
    };

    return (
    <div className="mb-6">
      <label htmlFor={id} className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
        {icon && <span className="mr-2 opacity-70">{icon}</span>}
        {label} {isRequired && <span className="text-red-500 ml-0.5">*</span>}
        {tooltip && (
            <span className="ml-1.5 group relative">
                <Info size={14} className="text-gray-400 hover:text-gray-600 cursor-help" />
                <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-xs p-2 text-xs text-white bg-slate-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
                {tooltip}
                </span>
            </span>
        )}
      </label>
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          id={id}
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-gray-800 placeholder-gray-400 text-lg"
        />
        {unit && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">{unit}</span>}
      </div>
    </div>
    );
};


const FICalculatorPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const [monthlyExpenses, setMonthlyExpenses] = useState<number | undefined>(undefined);
  const [safeWithdrawalRate, setSafeWithdrawalRate] = useState<number>(4); // state là number
  const [fiNumber, setFiNumber] = useState<number | null>(null);

  const [currentSavings, setCurrentSavings] = useState<number | undefined>(undefined);
  const [monthlyContribution, setMonthlyContribution] = useState<number | undefined>(undefined);
  const [expectedReturn, setExpectedReturn] = useState<number>(7); // state là number
  
  const [yearsToFI, setYearsToFI] = useState<number | null>(null);
  const [futureValue, setFutureValue] = useState<number | null>(null);
  const [estimatedFIDate, setEstimatedFIDate] = useState<string>('');

  useEffect(() => {
    if (monthlyExpenses !== undefined && monthlyExpenses > 0 && safeWithdrawalRate > 0) {
      const calculatedFINumber = (monthlyExpenses * 12) / (safeWithdrawalRate / 100);
      setFiNumber(calculatedFINumber);
    } else {
      setFiNumber(null);
    }
  }, [monthlyExpenses, safeWithdrawalRate]);

  const calculateTimeToFI = useCallback(() => {
    if (fiNumber === null || fiNumber <= 0 || currentSavings === undefined || monthlyContribution === undefined || expectedReturn === undefined || monthlyContribution < 0 || expectedReturn < 0) {
      setYearsToFI(null); setFutureValue(null); setEstimatedFIDate(''); return;
    }
    if (currentSavings >= fiNumber) {
        setYearsToFI(0); setFutureValue(currentSavings); setEstimatedFIDate('Đã đạt được!'); return;
    }
    if (monthlyContribution === 0 && currentSavings < fiNumber && expectedReturn === 0) {
        setYearsToFI(Infinity); setFutureValue(currentSavings); setEstimatedFIDate('Không bao giờ (với các thông số hiện tại)'); return;
    }
     if (monthlyContribution === 0 && currentSavings < fiNumber && expectedReturn > 0 && currentSavings * (1 + expectedReturn/100) <= currentSavings && currentSavings > 0) {
         setYearsToFI(Infinity); setFutureValue(currentSavings); setEstimatedFIDate('Không thể đạt được (lãi suất không đủ bù)'); return;
    }

    let years = 0;
    let accumulatedAmount = currentSavings;
    const annualContribution = monthlyContribution * 12;
    const annualReturnRate = expectedReturn / 100;

    if (annualContribution === 0 && annualReturnRate > 0) {
        if (currentSavings <= 0 || currentSavings >= fiNumber) {
            setYearsToFI(currentSavings >= fiNumber ? 0 : Infinity);
            setFutureValue(currentSavings);
            setEstimatedFIDate(currentSavings >= fiNumber ? 'Đã đạt được!' : 'Không thể đạt được');
            return;
        }
        const yearsNeeded = Math.log(fiNumber / currentSavings) / Math.log(1 + annualReturnRate);
        if (yearsNeeded > 0 && yearsNeeded !== Infinity && yearsNeeded <= 100) {
            setYearsToFI(yearsNeeded);
            setFutureValue(currentSavings * Math.pow(1 + annualReturnRate, yearsNeeded));
             const currentDate = new Date();
            const totalMonthsRaw = yearsNeeded * 12;
            currentDate.setMonth(currentDate.getMonth() + Math.round(totalMonthsRaw));
            const dateOptions: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
            setEstimatedFIDate(currentDate.toLocaleDateString('vi-VN', dateOptions));
        } else {
            setYearsToFI(Infinity); setFutureValue(currentSavings); setEstimatedFIDate(yearsNeeded > 100 ? 'Trên 100 năm' : 'Rất lâu hoặc không thể');
        }
        return;
    }
    if (annualContribution <= 0 && annualReturnRate <=0 && currentSavings < fiNumber) {
        setYearsToFI(Infinity); setFutureValue(currentSavings); setEstimatedFIDate('Không thể đạt được (cần tiết kiệm hoặc lãi suất dương)'); return;
    }

    while (accumulatedAmount < fiNumber) {
      accumulatedAmount = (accumulatedAmount + annualContribution) * (1 + annualReturnRate);
      years++;
      if (years > 100) {
        setYearsToFI(Infinity); setFutureValue(accumulatedAmount); setEstimatedFIDate('Trên 100 năm'); return;
      }
    }
    setYearsToFI(years);
    setFutureValue(accumulatedAmount);

    if (years !== Infinity && years >=0) {
        const currentDate = new Date();
        const totalMonthsRaw = years * 12;
        currentDate.setMonth(currentDate.getMonth() + Math.round(totalMonthsRaw));
        const dateOptions: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
        setEstimatedFIDate(currentDate.toLocaleDateString('vi-VN', dateOptions));
    }
  }, [fiNumber, currentSavings, monthlyContribution, expectedReturn]);

  useEffect(() => {
    if (currentStep === 2 && fiNumber !== null && fiNumber > 0) {
        calculateTimeToFI();
    } else if (currentStep === 1) {
        setYearsToFI(null); setFutureValue(null); setEstimatedFIDate('');
    }
  }, [fiNumber, currentSavings, monthlyContribution, expectedReturn, currentStep, calculateTimeToFI]);

  const goToNextStep = () => setCurrentStep(2);
  const goToPrevStep = () => { setCurrentStep(1); };

  const canProceedToStep2 = monthlyExpenses !== undefined && monthlyExpenses > 0 && fiNumber !== null && fiNumber > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
            <div className="relative mb-8 pt-4">
                <div className="relative flex items-center justify-center">
                    <Link
                      to="/"
                      className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center text-sm text-purple-600 hover:text-purple-800 transition-colors group py-2 pr-2 -ml-1 sm:ml-0"
                    >
                      <ArrowLeft size={18} className="mr-1.5 transition-transform group-hover:-translate-x-1" />
                      Trang chủ
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-800 text-center">
                        FI Calculator
                    </h1>
                </div>
            </div>
            <p className="text-center text-gray-600 mb-10 text-sm sm:text-base">
                Khám phá con số mục tiêu và lộ trình dự kiến để đạt được độc lập tài chính.
                Hãy bắt đầu bằng cách nhập chi tiêu hàng tháng của bạn.
            </p>

          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="bg-white p-6 sm:p-8 rounded-xl shadow-xl border border-gray-200"
              >
                <div className="flex items-center mb-6">
                    <span className="bg-purple-600 text-white rounded-full h-8 w-8 flex items-center justify-center text-sm font-bold mr-3">1</span>
                    <h2 className="text-xl sm:text-2xl font-semibold text-purple-700">Xác Định Số Tiền Mục Tiêu (FI)</h2>
                </div>
                <FormattedInputField
                  id="monthlyExpenses"
                  label="Chi tiêu trung bình mỗi tháng"
                  value={monthlyExpenses}
                  onValueChange={setMonthlyExpenses}
                  icon={<Wallet size={20} className="text-purple-500"/>}
                  unit="VNĐ"
                  placeholder="Nhập số tiền (bắt buộc)"
                  tooltip="Tổng số tiền bạn chi tiêu cho tất cả các nhu cầu trong một tháng. Mục này là bắt buộc."
                  isRequired
                />
                <InputField
                  id="safeWithdrawalRate"
                  label="Tỷ lệ rút tiền an toàn (SWR)"
                  value={safeWithdrawalRate}
                  onChange={setSafeWithdrawalRate} // setSafeWithdrawalRate nhận number
                  icon={<ShieldCheck size={20} className="text-purple-500"/>}
                  unit="%"
                  tooltip="Tỷ lệ % bạn dự định rút từ quỹ FI mỗi năm để chi tiêu khi nghỉ hưu. Quy tắc phổ biến là 4%."
                  min={1} max={10}
                />
                {fiNumber !== null && fiNumber > 0 && (
                  <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200 text-center">
                    <p className="text-sm text-purple-800">Để duy trì mức chi tiêu này, bạn cần có quỹ FI là:</p>
                    <p className="text-2xl sm:text-3xl font-bold text-purple-600 mt-1">{formatCurrency(fiNumber)}</p>
                  </div>
                )}
                <button
                  onClick={goToNextStep}
                  disabled={!canProceedToStep2}
                  className="mt-8 w-full flex items-center justify-center px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  Tiếp Tục Ước Tính Thời Gian <ChevronRight size={20} className="ml-2"/>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="bg-white p-6 sm:p-8 rounded-xl shadow-xl border border-gray-200"
              >
                <div className="flex items-center mb-6">
                    <span className="bg-green-600 text-white rounded-full h-8 w-8 flex items-center justify-center text-sm font-bold mr-3">2</span>
                    <h2 className="text-xl sm:text-2xl font-semibold text-green-700">Ước Tính Thời Gian Đạt FI</h2>
                </div>
                <div className="mb-4 p-3 bg-indigo-50 rounded-md border border-indigo-200">
                    <p className="text-sm text-indigo-700">Số tiền mục tiêu FI của bạn: <span className="font-bold">{formatCurrency(fiNumber)}</span></p>
                </div>

                <FormattedInputField
                  id="currentSavings"
                  label="Số tiền bạn đã tích lũy"
                  value={currentSavings}
                  onValueChange={setCurrentSavings}
                  icon={<PiggyBank size={20} className="text-green-500"/>}
                  unit="VNĐ"
                  placeholder="Ví dụ: 50,000,000"
                />
                <FormattedInputField
                  id="monthlyContribution"
                  label="Tiết kiệm/đầu tư thêm mỗi tháng"
                  value={monthlyContribution}
                  onValueChange={setMonthlyContribution}
                  icon={<TrendingUp size={20} className="text-green-500"/>}
                  unit="VNĐ"
                  placeholder="Ví dụ: 5,000,000"
                  min={0}
                />
                <InputField
                  id="expectedReturn"
                  label="Lợi suất đầu tư hàng năm (sau lạm phát)"
                  value={expectedReturn}
                  onChange={setExpectedReturn} // setExpectedReturn nhận number
                  icon={<Percent size={20} className="text-green-500"/>}
                  unit="%"
                  tooltip="Lợi nhuận thực tế hàng năm sau khi đã trừ đi lạm phát. Ví dụ: Lãi suất kỳ vọng 10%, lạm phát 3% => nhập 7%."
                  min={0} max={30}
                />
                {(yearsToFI !== null && fiNumber !== null && fiNumber > 0 && (currentSavings ?? 0) < fiNumber) && (
                  <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200 text-center">
                    <p className="text-sm text-green-800">Thời gian dự kiến để đạt Tự do Tài chính:</p>
                    <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-1">
                      {yearsToFI === Infinity ? "Rất lâu / Không thể" : formatYears(yearsToFI)}
                    </p>
                    {estimatedFIDate && yearsToFI !== Infinity && yearsToFI >= 0 &&(
                        <p className="text-xs text-gray-500 mt-1">Tương đương vào khoảng: {estimatedFIDate}</p>
                    )}
                    {futureValue !== null && yearsToFI !== Infinity && yearsToFI >= 0 && (
                        <p className="text-xs text-gray-500">Tổng số tiền dự kiến khi đó: {formatCurrency(futureValue)}</p>
                    )}
                  </div>
                )}
                {(fiNumber !== null && (currentSavings ?? 0) >= fiNumber) && (
                     <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-300 text-center">
                        <p className="text-lg font-semibold text-emerald-700">🎉 Chúc mừng! Bạn đã đạt Tự do Tài chính!</p>
                     </div>
                 )}
                <button
                  onClick={goToPrevStep}
                  className="mt-8 w-full flex items-center justify-center px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  <RefreshCw size={18} className="mr-2"/> Tính toán lại / Quay lại
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-12 text-center text-xs text-gray-500 max-w-2xl mx-auto">
          <p><strong>Lưu ý:</strong> Các tính toán trên chỉ mang tính chất tham khảo và ước tính dựa trên các thông số bạn cung cấp. Kết quả thực tế có thể khác biệt do biến động thị trường và các yếu tố cá nhân. Hãy coi đây là một công cụ hỗ trợ lập kế hoạch, không phải là lời khuyên tài chính chuyên nghiệp.</p>
        </div>
      </div>
    </div>
  );
};

export default FICalculatorPage;