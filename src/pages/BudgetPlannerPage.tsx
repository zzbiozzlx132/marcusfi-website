// src/pages/BudgetPlannerPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, TrendingUp, Wallet, Landmark, Home, ShoppingCart, Info, ChevronRight, RefreshCw } from 'lucide-react';

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

// --- KẾT THÚC HELPER FUNCTIONS ---

// Input Field Component
interface FormattedInputFieldProps {
    id: string; label: string; value: number | undefined;
    onValueChange: (value: number | undefined) => void;
    icon?: React.ReactNode; unit?: string; placeholder?: string;
    tooltip?: string; min?: number; isRequired?: boolean;
}
const FormattedInputField: React.FC<FormattedInputFieldProps> = ({ id, label, value, onValueChange, icon, unit, placeholder, tooltip, min = 0, isRequired }) => {
    const [displayValue, setDisplayValue] = useState<string>(value !== undefined ? formatCurrency(value, false) : '');
    useEffect(() => {
        const currentNumericDisplayValue = parseFormattedNumber(displayValue);
        if (value !== currentNumericDisplayValue || (value === undefined && displayValue !== '')) {
            setDisplayValue(value !== undefined ? formatCurrency(value, false) : '');
        }
    }, [value, displayValue]);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        const numericValue = parseFormattedNumber(rawValue);
        if (rawValue === '') { setDisplayValue(''); onValueChange(undefined); }
        else if (numericValue !== undefined) { setDisplayValue(formatCurrency(numericValue, false)); onValueChange(numericValue); }
        else { const onlyNumbers = rawValue.replace(/[^0-9]/g, ''); setDisplayValue(onlyNumbers); }
    };
    const handleBlur = () => {
        let finalNumericValue = parseFormattedNumber(displayValue);
        if (finalNumericValue === undefined) { if (isRequired) { finalNumericValue = min; } else { onValueChange(undefined); setDisplayValue(''); return; }}
        if (finalNumericValue < min) { finalNumericValue = min; }
        setDisplayValue(formatCurrency(finalNumericValue, false)); onValueChange(finalNumericValue);
    };
    return (
        <div className="mb-5">
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
                <input type="text" inputMode="numeric" id={id} value={displayValue} onChange={handleChange} onBlur={handleBlur} placeholder={placeholder}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-gray-800 placeholder-gray-400 text-lg"/>
                {unit && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">{unit}</span>}
            </div>
        </div>
    );
};


// Slider Component
interface BudgetSliderProps {
    label: string;
    icon: React.ReactNode;
    percentage: number;
    amount: number;
    colorClassFocus: string;
    onPercentageChange: (newPercentage: number) => void;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
}
const BudgetSlider: React.FC<BudgetSliderProps> = ({ label, icon, percentage, amount, colorClassFocus, onPercentageChange, min = 0, max = 100, step = 1, disabled = false }) => {
    return (
        <div className={`mb-4 p-3 sm:p-4 border rounded-lg transition-colors ${disabled ? 'bg-gray-100 opacity-70' : 'bg-slate-50/80 hover:bg-slate-100'}`}>
            <div className="flex justify-between items-center mb-1.5">
                <span className={`flex items-center text-sm font-medium ${disabled ? 'text-gray-500' : 'text-gray-700'}`}>
                    {icon} <span className="ml-2">{label}</span>
                </span>
                <span className={`text-sm font-semibold ${disabled ? 'text-gray-500' : 'text-gray-800'}`}>{percentage}% - {formatCurrency(amount)}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={percentage}
                onChange={(e) => onPercentageChange(parseInt(e.target.value))}
                disabled={disabled}
                className={`w-full h-2.5 rounded-lg appearance-none 
                           ${disabled ? 'bg-gray-300 cursor-not-allowed' : `cursor-pointer bg-gray-200 dark:bg-gray-700 ${colorClassFocus}`}`}
            />
        </div>
    );
};


const BudgetPlannerPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState<number | undefined>(undefined);
  const [hasPriorityDebt, setHasPriorityDebt] = useState<boolean | null>(null);
  const [debtPaymentPercentage, setDebtPaymentPercentage] = useState<number>(20);

  const [needsPercentage, setNeedsPercentage] = useState<number>(50);
  const [wantsPercentage, setWantsPercentage] = useState<number>(30);
  const [goalsPercentage, setGoalsPercentage] = useState<number>(20);

  // Tính toán các giá trị
  const incomeForDistribution = monthlyIncome ?? 0;
  const actualDebtPaymentPercentage = hasPriorityDebt ? debtPaymentPercentage : 0;
  const debtAmount = incomeForDistribution * (actualDebtPaymentPercentage / 100);
  const incomeAfterDebt = incomeForDistribution - debtAmount;

  const needsAmount = incomeAfterDebt * (needsPercentage / 100);
  const wantsAmount = incomeAfterDebt * (wantsPercentage / 100);
  const goalsAmount = incomeAfterDebt * (goalsPercentage / 100);

  const adjustPercentages = useCallback((changedSlider: 'needs' | 'wants' | 'goals', newValue: number) => {
    let currentN = needsPercentage;
    let currentW = wantsPercentage;
    let currentG = goalsPercentage;

    if (changedSlider === 'needs') currentN = newValue;
    else if (changedSlider === 'wants') currentW = newValue;
    else currentG = newValue; // changedSlider === 'goals'

    // Ensure the directly changed value is within bounds
    currentN = Math.max(0, Math.min(100, currentN));
    currentW = Math.max(0, Math.min(100, currentW));
    currentG = Math.max(0, Math.min(100, currentG));
    
    const targetTotal = 100;
    let sumOfAllThree = currentN + currentW + currentG;
    let diff = targetTotal - sumOfAllThree;

    if (diff !== 0) {
        // Distribute diff among the OTHER TWO sliders proportionally to their original values
        if (changedSlider === 'needs') {
            const sumOthersOriginal = wantsPercentage + goalsPercentage;
            if (sumOthersOriginal > 0) {
                currentW += diff * (wantsPercentage / sumOthersOriginal);
                currentG += diff * (goalsPercentage / sumOthersOriginal);
            } else { // If both others were 0, split diff equally
                currentW += diff / 2;
                currentG += diff / 2;
            }
        } else if (changedSlider === 'wants') {
            const sumOthersOriginal = needsPercentage + goalsPercentage;
            if (sumOthersOriginal > 0) {
                currentN += diff * (needsPercentage / sumOthersOriginal);
                currentG += diff * (goalsPercentage / sumOthersOriginal);
            } else {
                currentN += diff / 2;
                currentG += diff / 2;
            }
        } else { // changedSlider === 'goals'
            const sumOthersOriginal = needsPercentage + wantsPercentage;
            if (sumOthersOriginal > 0) {
                currentN += diff * (needsPercentage / sumOthersOriginal);
                currentW += diff * (wantsPercentage / sumOthersOriginal);
            } else {
                currentN += diff / 2;
                currentW += diff / 2;
            }
        }
    }

    // Clamp all values after distribution and round them
    let finalN = Math.max(0, Math.min(100, Math.round(currentN)));
    let finalW = Math.max(0, Math.min(100, Math.round(currentW)));
    let finalG = Math.max(0, Math.min(100, Math.round(currentG)));
    
    // Final pass to ensure sum is exactly 100 due to rounding/clamping.
    // Adjust one of the sliders (preferably not the one user just changed, or goals as a last resort)
    sumOfAllThree = finalN + finalW + finalG;
    diff = targetTotal - sumOfAllThree;

    if (diff !== 0) {
        if (changedSlider !== 'goals' && finalG + diff >= 0 && finalG + diff <= 100) {
            finalG += diff;
        } else if (changedSlider !== 'wants' && finalW + diff >= 0 && finalW + diff <= 100) {
            finalW += diff;
        } else if (changedSlider !== 'needs' && finalN + diff >= 0 && finalN + diff <= 100) {
            finalN += diff;
        } else { // Fallback: if preferred adjustment failed, adjust any available one. Start with goals.
            if (finalG + diff >= 0 && finalG + diff <= 100) finalG += diff;
            else if (finalW + diff >= 0 && finalW + diff <= 100) finalW += diff;
            else finalN += diff; // This should now make sum 100
        }
    }

    // Ensure final values are set and sum to 100
    // Re-calculate one (e.g., goals) based on the other two to guarantee 100 sum after rounding.
    const aN = Math.max(0, Math.min(100, Math.round(finalN)));
    const aW = Math.max(0, Math.min(100, Math.round(finalW)));
    const aG = targetTotal - aN - aW;

    setNeedsPercentage(aN);
    setWantsPercentage(aW);
    setGoalsPercentage(Math.max(0, Math.min(100, aG))); // Ensure goals is also clamped

  }, [needsPercentage, wantsPercentage, goalsPercentage]);


  useEffect(() => {
    const savedBudget = localStorage.getItem('simpleBudgetPlanner_v1');
    if (savedBudget) {
        const data = JSON.parse(savedBudget);
        setMonthlyIncome(data.monthlyIncome);
        setHasPriorityDebt(data.hasPriorityDebt === undefined ? null : data.hasPriorityDebt);
        setDebtPaymentPercentage(data.debtPaymentPercentage || 20);
        setNeedsPercentage(data.needsPercentage || 50);
        setWantsPercentage(data.wantsPercentage || 30);
        setGoalsPercentage(data.goalsPercentage || 20);
    }
  }, []);

  useEffect(() => {
    if (monthlyIncome !== undefined && hasPriorityDebt !== null) {
        const budgetData = {
            monthlyIncome, hasPriorityDebt, debtPaymentPercentage,
            needsPercentage, wantsPercentage, goalsPercentage
        };
        localStorage.setItem('simpleBudgetPlanner_v1', JSON.stringify(budgetData));
    }
  }, [monthlyIncome, hasPriorityDebt, debtPaymentPercentage, needsPercentage, wantsPercentage, goalsPercentage]);


  const proceedToStep1 = () => setCurrentStep(1);
  const proceedToStep2 = () => {
    if (monthlyIncome !== undefined && monthlyIncome > 0) {
        // If Needs, Wants, Goals don't sum to 100 (e.g. due to initial load or odd state), reset to defaults.
        if (Math.round(needsPercentage + wantsPercentage + goalsPercentage) !== 100) {
            setNeedsPercentage(50);
            setWantsPercentage(30);
            setGoalsPercentage(20);
        }
        setCurrentStep(2);
    } else {
        alert("Vui lòng nhập tổng thu nhập hàng tháng của bạn.");
    }
  };
  const resetAll = () => {
    setCurrentStep(0);
    setMonthlyIncome(undefined);
    setHasPriorityDebt(null);
    setDebtPaymentPercentage(20);
    setNeedsPercentage(50);
    setWantsPercentage(30);
    setGoalsPercentage(20);
    localStorage.removeItem('simpleBudgetPlanner_v1');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="relative mb-6 pt-4">
            <div className="relative flex items-center justify-between sm:justify-center">
              <Link to="/" className="flex items-center text-sm text-purple-600 hover:text-purple-800 transition-colors group py-2 pr-2 -ml-1 sm:absolute sm:left-0 sm:top-1/2 sm:-translate-y-1/2">
                <ArrowLeft size={18} className="mr-1.5 group-hover:-translate-x-0.5" /> Trang chủ
              </Link>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 text-center sm:mx-auto">
                Simple Budget Planner
              </h1>
            </div>
          </div>
          <p className="text-center text-gray-700 mb-8 text-sm sm:text-base leading-relaxed">
            Công cụ này giúp bạn phân bổ thu nhập hàng tháng một cách hợp lý, có tính đến tình trạng nợ (nếu có).
            <br />Hãy bắt đầu bằng cách trả lời câu hỏi dưới đây.
          </p>

          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <motion.div key="step0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="bg-white p-6 sm:p-8 rounded-xl shadow-xl border border-gray-200">
                <div className="flex items-center mb-4">
                  <span className="bg-slate-500 text-white rounded-full h-9 w-9 flex items-center justify-center text-md font-bold mr-3 shadow">?</span>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-700">Tình trạng Nợ Ưu Tiên</h2>
                </div>
                <p className="text-sm text-gray-600 mb-5">
                  Bạn có các khoản nợ (ngoài vay mua nhà/xe dài hạn đã có kế hoạch trả riêng) cần ưu tiên trả hàng tháng không? (Ví dụ: Nợ thẻ tín dụng, vay tiêu dùng lãi suất cao)
                </p>
                <div className="flex flex-col sm:flex-row sm:justify-center gap-3">
                  <button onClick={() => { setHasPriorityDebt(true); proceedToStep1(); }}
                    className="w-full sm:w-auto px-6 py-2.5 bg-red-500 text-white font-medium rounded-lg shadow-md hover:bg-red-600 transition">
                    Có, tôi có nợ cần trả
                  </button>
                  <button onClick={() => { setHasPriorityDebt(false); proceedToStep1(); }}
                    className="w-full sm:w-auto px-6 py-2.5 bg-green-500 text-white font-medium rounded-lg shadow-md hover:bg-green-600 transition">
                    Không, tôi không có nợ ưu tiên
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="bg-white p-6 sm:p-8 rounded-xl shadow-xl border border-gray-200">
                <div className="flex items-center mb-6 pb-3 border-b border-gray-200">
                  <span className="bg-purple-600 text-white rounded-full h-9 w-9 flex items-center justify-center text-md font-bold mr-3 shadow">1</span>
                  <h2 className="text-xl sm:text-2xl font-semibold text-purple-700">Nhập Thu Nhập Hàng Tháng</h2>
                </div>
                <FormattedInputField
                  id="monthlyIncome"
                  label="Tổng thu nhập ròng của bạn"
                  value={monthlyIncome}
                  onValueChange={setMonthlyIncome}
                  icon={<Wallet size={20} className="text-purple-500"/>}
                  unit="VNĐ"
                  placeholder="Ví dụ: 15,000,000"
                  tooltip="Là số tiền thực nhận sau khi đã trừ thuế và các khoản khấu trừ bắt buộc (nếu có)."
                  isRequired
                />
                <button onClick={proceedToStep2} disabled={monthlyIncome === undefined || monthlyIncome <= 0}
                  className="mt-6 w-full flex items-center justify-center px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition disabled:opacity-50">
                  Xem Phân Bổ Ngân Sách <ChevronRight size={20} className="ml-2"/>
                </button>
                 <button onClick={() => setCurrentStep(0)} className="mt-3 w-full text-sm text-gray-600 hover:text-purple-600 py-2">
                    ← Quay lại
                </button>
              </motion.div>
            )}

            {currentStep === 2 && monthlyIncome !== undefined && (
              <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="bg-white p-6 sm:p-8 rounded-xl shadow-xl border border-gray-200">
                <div className="flex items-center mb-6 pb-3 border-b border-gray-200">
                  <span className="bg-teal-600 text-white rounded-full h-9 w-9 flex items-center justify-center text-md font-bold mr-3 shadow">2</span>
                  <h2 className="text-xl sm:text-2xl font-semibold text-teal-700">Phân Bổ Ngân Sách Đề Xuất</h2>
                </div>
                <div className="mb-4 p-3 bg-indigo-50 rounded-md border border-indigo-200">
                    <p className="text-sm text-indigo-800">Tổng thu nhập hàng tháng: <strong className="ml-1">{formatCurrency(monthlyIncome)}</strong></p>
                </div>
                
                {hasPriorityDebt && (
                  <BudgetSlider label="Ưu tiên Trả Nợ" icon={<Landmark size={18} className="text-red-500"/>} 
                    percentage={debtPaymentPercentage} amount={debtAmount} 
                    colorClassFocus="focus:ring-red-500 accent-red-500"
                    onPercentageChange={setDebtPaymentPercentage}
                    min={0} max={100} step={5}
                  />
                )}

                <p className="text-sm text-gray-600 mb-2 mt-5 pt-3 border-t border-gray-100">
                  Phân bổ cho phần thu nhập còn lại (<strong className="text-gray-800">{formatCurrency(incomeAfterDebt)}</strong>):
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  Tổng % của Nhu cầu thiết yếu, Mong muốn cá nhân, và Mục tiêu tài chính cần là <strong className="text-blue-600">100%</strong>.
                </p>
                
                <BudgetSlider label="Nhu Cầu Thiết Yếu" icon={<Home size={18} className="text-sky-500"/>} 
                    percentage={needsPercentage} amount={needsAmount} 
                    colorClassFocus="focus:ring-sky-500 accent-sky-500"
                    onPercentageChange={(val) => adjustPercentages('needs', val)}
                    min={0} max={100}
                />
                <BudgetSlider label="Mong Muốn Cá Nhân" icon={<ShoppingCart size={18} className="text-amber-500"/>} 
                    percentage={wantsPercentage} amount={wantsAmount} 
                    colorClassFocus="focus:ring-amber-500 accent-amber-500"
                    onPercentageChange={(val) => adjustPercentages('wants', val)}
                    min={0} max={100}
                />
                <BudgetSlider label="Mục Tiêu Tài Chính" icon={<TrendingUp size={18} className="text-emerald-500"/>} 
                    percentage={goalsPercentage} amount={goalsAmount} 
                    colorClassFocus="focus:ring-emerald-500 accent-emerald-500"
                    onPercentageChange={(val) => adjustPercentages('goals', val)}
                    min={0} max={100}
                />
                { Math.round(needsPercentage + wantsPercentage + goalsPercentage) !== 100 && incomeAfterDebt > 0 &&
                    <p className="text-xs text-red-500 mt-1 text-center">
                        Tổng % (Nhu cầu, Mong muốn, Mục tiêu) hiện là {needsPercentage + wantsPercentage + goalsPercentage}%. 
                        Cần điều chỉnh để tổng là 100%.
                    </p>
                }
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <button onClick={resetAll} className="w-full flex items-center justify-center px-6 py-3 bg-slate-600 text-white font-semibold rounded-lg shadow-md hover:bg-slate-700 transition">
                        <RefreshCw size={18} className="mr-2"/> Bắt đầu lại
                    </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-12 text-center text-xs text-gray-500 max-w-2xl mx-auto">
          <p><strong>Lưu ý:</strong> Công cụ này cung cấp một kế hoạch ngân sách gợi ý. Bạn hoàn toàn có thể điều chỉnh các tỷ lệ phần trăm cho phù hợp với tình hình và mục tiêu tài chính cá nhân của mình.</p>
        </div>
      </div>
    </div>
  );
};

export default BudgetPlannerPage;