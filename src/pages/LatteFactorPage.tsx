// src/pages/LatteFactorPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, TrendingUp, PiggyBank, Percent, Wallet, Info, ChevronRight,
    ChevronLeft, RefreshCw, DivideCircle, HelpCircle, Briefcase, Zap,
    BarChart2, CheckCircle, Target, Clock, AlertTriangle, Settings2,
    ShieldCheck, List
} from 'lucide-react';

// --- Helper Functions ---
const formatCurrency = (value: number | null | undefined, showUnit = true, removeZeroFraction = true): string => {
    if (value === null || value === undefined || isNaN(value)) return showUnit ? '0 VNĐ' : '0';
    const options: Intl.NumberFormatOptions = {
        minimumFractionDigits: removeZeroFraction ? 0 : 2,
        maximumFractionDigits: removeZeroFraction ? 0 : 2,
    };
    const formatted = new Intl.NumberFormat('vi-VN', options).format(value);
    return showUnit ? `${formatted} VNĐ` : formatted;
};

const parseFormattedNumber = (formattedValue: string): number | undefined => {
  if (typeof formattedValue !== 'string' || formattedValue.trim() === '') return undefined;
  const withoutThousandsSeparators = formattedValue.replace(/\./g, '');
  const parsableString = withoutThousandsSeparators.replace(/,/g, '.');
  if (parsableString === '') return undefined;
  const numberValue = parseFloat(parsableString);
  return isNaN(numberValue) ? undefined : numberValue;
};
// --- Kết Thúc Helper Functions ---


// --- InputField Component ---
interface InputFieldProps {
    id: string;
    label: string;
    value: number;
    onChange: (value: number) => void;
    icon?: React.ReactNode;
    unit?: string;
    placeholder?: string;
    tooltip?: string;
    min?: number;
    max?: number;
    step?: number;
    isRequired?: boolean;
    disabled?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
    id, label, value, onChange, icon, unit, placeholder, tooltip,
    min = 0, max, step = 1, isRequired, disabled = false
}) => {
    const [inputValue, setInputValue] = useState<string>(String(value));
    useEffect(() => {
        const currentNumericInputValue = parseFormattedNumber(inputValue);
        if (String(value) !== inputValue && (value !== currentNumericInputValue || (isNaN(currentNumericInputValue as number) && String(value) !== ''))) {
             setInputValue(String(value));
        }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let rawValue = e.target.value;
        const allowDecimal = (step !== undefined && step < 1) || id.toLowerCase().includes('rate') || id.toLowerCase().includes('probability') || id.toLowerCase().includes('discount');
        let validChars = "";
        let hasDecimalPoint = false;
        for (const char of rawValue) {
            if ((char >= '0' && char <= '9') || (allowDecimal && char === '.' && !hasDecimalPoint)) {
                validChars += char;
                if (char === '.') {
                    hasDecimalPoint = true;
                }
            } else if (char === '-' && validChars === '' && min !== undefined && min < 0) {
                validChars += char;
            }
        }
        rawValue = validChars;
        setInputValue(rawValue);
        const numericValue = parseFormattedNumber(rawValue);
        if (numericValue !== undefined) {
            onChange(numericValue);
        } else if (rawValue === '' && !isRequired) {
            onChange(min);
        } else if (rawValue === '-' && min !==undefined && min < 0) {
            // Đang nhập số âm
        }
    };

    const handleBlur = () => {
        let numericValue = parseFormattedNumber(inputValue);
        if (numericValue === undefined || isNaN(numericValue)) {
            numericValue = isRequired ? min : min;
        }
        
        if (numericValue < min) {
            numericValue = min;
        }
        if (max !== undefined && numericValue > max) {
            numericValue = max;
        }
        setInputValue(String(numericValue));
        onChange(numericValue);
    };

    return (
    <div className="mb-6">
      <label htmlFor={id} className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {icon && <span className="mr-2 opacity-70">{icon}</span>}
        {label} {isRequired && <span className="text-red-500 ml-0.5">*</span>}
        {tooltip && (
          <span className="ml-1.5 group relative">
            <Info size={14} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 cursor-help" />
            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-xs p-2.5 text-xs text-white bg-slate-800 dark:bg-slate-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-lg leading-relaxed">
              {tooltip}
            </span>
          </span>
        )}
      </label>
      <div className="relative">
        <input
          type="text" inputMode="decimal" id={id} value={inputValue} onChange={handleChange} onBlur={handleBlur} placeholder={placeholder} disabled={disabled}
          className={`w-full px-4 py-2.5 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-lg ${disabled ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed' : 'border-gray-300 dark:border-gray-600'}`}
        />
        {unit && <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-sm pointer-events-none ${disabled ? 'text-gray-400 dark:text-gray-500' : 'text-gray-500 dark:text-gray-400'}`}>{unit}</span>}
      </div>
    </div>
    );
};
// ----- KẾT THÚC InputField -----


// --- FormattedInputField Component ---
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
    disabled?: boolean;
}

const FormattedInputField: React.FC<FormattedInputFieldProps> = ({
    id, label, value, onValueChange, icon, unit, placeholder, tooltip, min = 0, isRequired, disabled = false
}) => {
    const [displayValue, setDisplayValue] = useState<string>(value !== undefined ? formatCurrency(value, false) : '');
    useEffect(() => {
        const currentNumericDisplayValue = parseFormattedNumber(displayValue);
        if (value !== currentNumericDisplayValue || (value === undefined && displayValue !== '')) {
             setDisplayValue(value !== undefined ? formatCurrency(value, false) : '');
        }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        if (rawValue === '') {
            setDisplayValue('');
            onValueChange(undefined);
            return;
        }
        const numericValue = parseFormattedNumber(rawValue);
        if (numericValue !== undefined) {
            setDisplayValue(formatCurrency(numericValue, false));
            onValueChange(numericValue);
        } else {
            const onlyNumbers = rawValue.replace(/[^0-9]/g, '');
            setDisplayValue(onlyNumbers);
        }
    };

    const handleBlur = () => {
        let finalNumericValueTyped: number | undefined = parseFormattedNumber(displayValue);
    
        if (finalNumericValueTyped === undefined) {
            if (isRequired) {
                finalNumericValueTyped = min; // Gán giá trị min nếu bắt buộc và trống/không hợp lệ
            } else {
                onValueChange(undefined); // Nếu không bắt buộc và trống, giá trị là undefined
                setDisplayValue('');
                return; // Thoát sớm
            }
        }
        // Từ đây, finalNumericValueTyped chắc chắn là một number (hoặc đã được gán min)
        if (finalNumericValueTyped < min) {
            finalNumericValueTyped = min;
        }
    
        setDisplayValue(formatCurrency(finalNumericValueTyped, false));
        onValueChange(finalNumericValueTyped);
    };

    return (
    <div className="mb-6">
      <label htmlFor={id} className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {icon && <span className="mr-2 opacity-70">{icon}</span>}
        {label} {isRequired && <span className="text-red-500 ml-0.5">*</span>}
        {tooltip && (
            <span className="ml-1.5 group relative">
                <Info size={14} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 cursor-help" />
                <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-xs p-2.5 text-xs text-white bg-slate-800 dark:bg-slate-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-lg leading-relaxed">
                {tooltip}
                </span>
            </span>
        )}
      </label>
      <div className="relative">
        <input
          type="text" inputMode="numeric" id={id} value={displayValue} onChange={handleChange} onBlur={handleBlur} placeholder={placeholder} disabled={disabled}
          className={`w-full px-4 py-2.5 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-lg ${disabled ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed' : 'border-gray-300 dark:border-gray-600'}`}
        />
        {unit && <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-sm pointer-events-none ${disabled ? 'text-gray-400 dark:text-gray-500' : 'text-gray-500 dark:text-gray-400'}`}>{unit}</span>}
      </div>
    </div>
    );
};
// ----- KẾT THÚC FormattedInputField -----


// --- Component chính cho công cụ so sánh quyết định ---
type OptionType = 'asset_growth' | 'project_course' | 'savings' | 'manual_entry';
type OptionKey = 'optionA' | 'optionB';

interface DecisionOption { /* ... giữ nguyên ... */ 
    name: string;
    initialInvestment: number | undefined;
    years: number;
    probabilitySuccess: number;
    optionType: OptionType;
    annualGrowthRateSuccess?: number;
    valueRetentionFailure?: number;
    savingsInterestRate?: number;
    valueIfSuccess?: number | undefined;
    valueIfFailure?: number | undefined;
}
const initialDecisionOption: DecisionOption = { /* ... giữ nguyên ... */ 
    name: '',
    initialInvestment: undefined,
    years: 1,
    probabilitySuccess: 70,
    optionType: 'manual_entry',
    valueIfSuccess: undefined,
    valueIfFailure: 0,
    annualGrowthRateSuccess: 7,
    valueRetentionFailure: 90,
    savingsInterestRate: 5,
};
interface CalculationResult { /* ... giữ nguyên ... */ 
    finalValueSuccess: number;
    finalValueFailure: number;
    expectedEndValue: number;
    expectedNetPresentValue: number;
}

interface InvestmentSuggestion {
    id: string;
    name: string;
    annualReturnSuggestion: number; // Chỉ dùng annualReturnSuggestion
    note: string;
}

const assetGrowthSuggestions: InvestmentSuggestion[] = [
    { id: 'gold', name: 'Vàng', annualReturnSuggestion: 5, note: 'Lợi nhuận trung bình dài hạn tham khảo. Giá vàng có thể biến động mạnh. (Đây là VÍ DỤ)' },
    { id: 'vnindex', name: 'Chứng khoán (VN-Index)', annualReturnSuggestion: 12, note: 'Lợi nhuận trung bình dài hạn tham khảo, rủi ro và biến động cao. (Đây là VÍ DỤ)' },
    { id: 'gov_bond', name: 'Trái phiếu Chính phủ (10 năm)', annualReturnSuggestion: 4, note: 'Rủi ro thấp hơn. Lãi suất thay đổi theo thị trường. (Đây là VÍ DỤ)' },
];


const DecisionComparisonTool: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [optionA, setOptionA] = useState<DecisionOption>({ ...initialDecisionOption, name: 'Lựa chọn A', optionType: 'asset_growth' });
    const [optionB, setOptionB] = useState<DecisionOption>({ ...initialDecisionOption, name: 'Lựa chọn B', optionType: 'project_course' });
    const [discountRate, setDiscountRate] = useState<number>(7);

    const [resultA, setResultA] = useState<CalculationResult | null>(null);
    const [resultB, setResultB] = useState<CalculationResult | null>(null);
    const [comparisonMessage, setComparisonMessage] = useState<string>('');
    const [errorMessages, setErrorMessages] = useState<{ [key: string]: string }>({});
    const [showSuggestionsFor, setShowSuggestionsFor] = useState<OptionKey | null>(null);


    const handleOptionChange = (
        setter: React.Dispatch<React.SetStateAction<DecisionOption>>,
        field: keyof DecisionOption
    ) => (value: string | number | undefined | OptionType) => {
        setter(prev => ({ ...prev, [field]: value }));
    };
    const getTerminalValues = (option: DecisionOption): { finalValueSuccess?: number, finalValueFailure?: number } => {
        if (option.initialInvestment === undefined || option.initialInvestment < 0 || option.years === undefined || option.years <= 0) {
            return { finalValueSuccess: undefined, finalValueFailure: undefined };
        }
        const P = option.initialInvestment;
        const n = option.years;

        switch (option.optionType) {
            case 'asset_growth':
                const rSuccess = (option.annualGrowthRateSuccess ?? 0) / 100;
                const valSuccess = P * Math.pow(1 + rSuccess, n);
                const valFailure = P * ((option.valueRetentionFailure ?? 0) / 100);
                return { finalValueSuccess: valSuccess, finalValueFailure: valFailure };
            case 'savings':
                const rSavings = (option.savingsInterestRate ?? 0) / 100;
                const valSavings = P * Math.pow(1 + rSavings, n);
                return { finalValueSuccess: valSavings, finalValueFailure: P };
            case 'project_course':
            case 'manual_entry':
            default:
                const fvSuccess = typeof option.valueIfSuccess === 'number' ? option.valueIfSuccess : undefined;
                const fvFailure = typeof option.valueIfFailure === 'number' ? option.valueIfFailure : undefined;
                return { finalValueSuccess: fvSuccess, finalValueFailure: fvFailure };
        }
    };
    
    const validateOption = (option: DecisionOption, optionKey: string): boolean => {
        const currentErrors: { [key: string]: string } = {};
        let isValid = true;
        if (!option.name.trim()) { currentErrors[`${optionKey}_name`] = "Tên không được trống."; isValid = false; }
        if (option.initialInvestment === undefined || option.initialInvestment < 0) { currentErrors[`${optionKey}_initialInvestment`] = "Vốn đầu tư phải >= 0."; isValid = false; }
        if (option.years === undefined || option.years <= 0) { currentErrors[`${optionKey}_years`] = "Thời gian phải > 0."; isValid = false; }
        if (option.probabilitySuccess === undefined || option.probabilitySuccess < 0 || option.probabilitySuccess > 100) { currentErrors[`${optionKey}_probabilitySuccess`] = "Xác suất từ 0-100."; isValid = false; }

        const terminalValues = getTerminalValues(option);
        if (terminalValues.finalValueSuccess === undefined || terminalValues.finalValueSuccess < 0) { currentErrors[`${optionKey}_valueIfSuccess_derived`] = "Giá trị thành công không hợp lệ hoặc thiếu thông tin."; isValid = false; }
        if (terminalValues.finalValueFailure === undefined || terminalValues.finalValueFailure < 0) { currentErrors[`${optionKey}_valueIfFailure_derived`] = "Giá trị thất bại không hợp lệ hoặc thiếu thông tin."; isValid = false; }
        
        switch (option.optionType) {
            case 'asset_growth':
                if (option.annualGrowthRateSuccess === undefined || option.annualGrowthRateSuccess < -100) { currentErrors[`${optionKey}_annualGrowthRateSuccess`] = "Tăng trưởng TC không hợp lệ."; isValid = false; }
                if (option.valueRetentionFailure === undefined || option.valueRetentionFailure < 0 || option.valueRetentionFailure > 200) { currentErrors[`${optionKey}_valueRetentionFailure`] = "% giá trị còn lại (TB) từ 0-200."; isValid = false; }
                break;
            case 'savings':
                if (option.savingsInterestRate === undefined || option.savingsInterestRate < 0) { currentErrors[`${optionKey}_savingsInterestRate`] = "Lãi suất TK phải >= 0."; isValid = false; }
                break;
        }

        setErrorMessages(prev => {
            const nextErrors = {...prev};
            Object.keys(prev).forEach(key => { if (key.startsWith(optionKey)) delete nextErrors[key]; });
            return {...nextErrors, ...currentErrors};
        });
        return isValid;
    };
    
    const calculateENPV = (option: DecisionOption, effectiveDiscountRate: number): CalculationResult | null => {
        const terminal = getTerminalValues(option);
        if (option.initialInvestment === undefined || terminal.finalValueSuccess === undefined || terminal.finalValueFailure === undefined || option.years <= 0) {
             return null;
        }
        const { finalValueSuccess, finalValueFailure } = terminal;
        const probS = option.probabilitySuccess / 100;
        const probF = 1 - probS;
        const discountRateD = effectiveDiscountRate / 100;
        if (discountRateD < -1 && (1 + discountRateD) <= 0) { 
             console.error("Discount rate too low, would result in non-real number for Math.pow");
             return null; 
        }

        const pvSuccess = finalValueSuccess / Math.pow(1 + discountRateD, option.years);
        const pvFailure = finalValueFailure / Math.pow(1 + discountRateD, option.years);

        const expectedPresentValueOfPayoffs = (pvSuccess * probS) + (pvFailure * probF);
        const expectedNetPresentValue = expectedPresentValueOfPayoffs - option.initialInvestment;

        return {
            finalValueSuccess, finalValueFailure,
            expectedEndValue: (finalValueSuccess * probS) + (finalValueFailure * probF),
            expectedNetPresentValue: expectedNetPresentValue,
        };
    };

    const handleNextStep = () => {
        setErrorMessages({}); 
        if (currentStep === 1) {
            if (validateOption(optionA, 'optionA')) {
                setCurrentStep(2);
            }
        } else if (currentStep === 2) {
            if (validateOption(optionB, 'optionB')) {
                setCurrentStep(3);
            }
        }
    };

    const handlePrevStep = () => {
        setCurrentStep(prev => Math.max(1, prev - 1));
    };

    const handleCompare = () => {
        setErrorMessages(prev => { const next = {...prev}; delete next.discountRate; return next; });
        let isValidA = validateOption(optionA, 'optionA');
        let isValidB = validateOption(optionB, 'optionB');
        let isValidDiscountRate = true;
        if (discountRate === undefined || discountRate < -100) {
            setErrorMessages(prev => ({ ...prev, discountRate: "Tỷ lệ hoàn vốn không hợp lệ." }));
            isValidDiscountRate = false;
        }

        if (!isValidA || !isValidB || !isValidDiscountRate) {
            setResultA(null); setResultB(null); setComparisonMessage('Vui lòng kiểm tra lại các thông tin đã nhập.'); return;
        }

        const resA = calculateENPV(optionA, discountRate);
        const resB = calculateENPV(optionB, discountRate);
        setResultA(resA);
        setResultB(resB);

        if (resA && resB) {
            let msg = '';
            const enpvA = resA.expectedNetPresentValue;
            const enpvB = resB.expectedNetPresentValue;
            if (Math.abs(enpvA - enpvB) < 0.01) {
                 msg = `Cả hai lựa chọn có Lợi Ích Ròng Dự Kiến (ENPV) gần như tương đương (khoảng ${formatCurrency(enpvA)}). Hãy xem xét các yếu tố phi tài chính khác.`;
            } else if (enpvA > enpvB) {
                msg = `Lựa chọn A ("${optionA.name}") có Lợi Ích Ròng Dự Kiến (ENPV) cao hơn. Chi phí cơ hội nếu chọn B là khoảng ${formatCurrency(enpvA - enpvB)}.`;
            } else {
                msg = `Lựa chọn B ("${optionB.name}") có Lợi Ích Ròng Dự Kiến (ENPV) cao hơn. Chi phí cơ hội nếu chọn A là khoảng ${formatCurrency(enpvB - enpvA)}.`;
            }
            setComparisonMessage(msg);
            setCurrentStep(4);
        } else {
             setComparisonMessage('Không thể tính toán do thiếu thông tin hoặc thông tin không hợp lệ ở các trường tính giá trị cuối kỳ.');
        }
    };
    
    const resetAll = () => {
        setOptionA({ ...initialDecisionOption, name: 'Lựa chọn A', optionType: 'asset_growth' });
        setOptionB({ ...initialDecisionOption, name: 'Lựa chọn B', optionType: 'project_course' });
        setDiscountRate(7);
        setResultA(null); setResultB(null); setComparisonMessage('');
        setErrorMessages({}); setCurrentStep(1);
    };

    const renderStepIndicator = () => (
        <div className="flex justify-center space-x-2 sm:space-x-4 mb-8">
            {[
                { num: 1, label: "Lựa chọn A" }, { num: 2, label: "Lựa chọn B" },
                { num: 3, label: "Tỷ lệ HV" }, { num: 4, label: "Kết quả" }
            ].map(stepInfo => (
                <div key={stepInfo.num} className="flex flex-col items-center w-1/4 sm:w-auto">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                        ${currentStep === stepInfo.num ? 'bg-purple-600 border-purple-600 text-white scale-110' : 
                         currentStep > stepInfo.num ? 'bg-green-500 border-green-500 text-white' : 
                         'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'}`}
                    >
                        {currentStep > stepInfo.num ? <CheckCircle size={18}/> : stepInfo.num}
                    </div>
                    <span className={`mt-2 text-xs sm:text-sm text-center transition-colors duration-300 ${currentStep >= stepInfo.num ? 'text-purple-600 dark:text-purple-400 font-semibold' : 'text-gray-500 dark:text-gray-400'}`}>
                        {stepInfo.label}
                    </span>
                </div>
            ))}
        </div>
    );

    const handleSuggestionClick = (
        setter: React.Dispatch<React.SetStateAction<DecisionOption>>,
        suggestionValue: number
    ) => {
        setter(prev => ({ ...prev, annualGrowthRateSuccess: suggestionValue }));
        setShowSuggestionsFor(null);
    };

    const renderOptionInputForm = (
        option: DecisionOption,
        setOption: React.Dispatch<React.SetStateAction<DecisionOption>>,
        optionKey: OptionKey,
        title: string
    ) => (
        <motion.div
            key={optionKey}
            initial={{ opacity: 0, x: (optionKey === 'optionA' && currentStep === 1) || (optionKey === 'optionB' && currentStep === 2) ? -50 : 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700"
        >
            <h3 className="text-xl sm:text-2xl font-semibold text-purple-700 dark:text-purple-400 mb-6 flex items-center">
                {optionKey === 'optionA' ? <Zap size={24} className="mr-3 text-blue-500" /> : <Briefcase size={24} className="mr-3 text-green-500" />}
                Thông Tin {title}
            </h3>
            <div className="mb-4">
                <label htmlFor={`${optionKey}_name`} className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Tên Lựa chọn/Dự án <span className="text-red-500">*</span></label>
                <input type="text" id={`${optionKey}_name`} value={option.name} onChange={(e) => handleOptionChange(setOption, 'name')(e.target.value)} placeholder={`Ví dụ: ${title}`}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-lg"/>
                {errorMessages[`${optionKey}_name`] && <p className="text-red-500 text-xs mt-1">{errorMessages[`${optionKey}_name`]}</p>}
            </div>
            <FormattedInputField id={`${optionKey}_initialInvestment`} label="Vốn Đầu Tư Ban Đầu" value={option.initialInvestment} onValueChange={(val) => handleOptionChange(setOption, 'initialInvestment')(val)}
                icon={<Wallet size={20} className="text-purple-500 dark:text-purple-400" />} unit="VNĐ" placeholder="Số tiền bạn bỏ ra" tooltip="Tổng số tiền bạn cần bỏ ra ngay từ đầu cho lựa chọn này." isRequired/>
            {errorMessages[`${optionKey}_initialInvestment`] && <p className="text-red-500 text-xs mt-[-15px] mb-[15px]">{errorMessages[`${optionKey}_initialInvestment`]}</p>}
            
            <InputField id={`${optionKey}_years`} label="Thời Gian Xem Xét" value={option.years} onChange={(val) => handleOptionChange(setOption, 'years')(val)}
                icon={<Clock size={20} className="text-purple-500 dark:text-purple-400" />} unit="năm" placeholder="Số năm" tooltip="Khoảng thời gian bạn dự kiến nắm giữ đầu tư hoặc để dự án này cho ra kết quả cuối cùng." min={0.1} step={0.1} isRequired/>
            {errorMessages[`${optionKey}_years`] && <p className="text-red-500 text-xs mt-[-15px] mb-[15px]">{errorMessages[`${optionKey}_years`]}</p>}
            
            <div className="mb-6">
                <label htmlFor={`${optionKey}_optionType`} className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    <Settings2 size={20} className="mr-2 opacity-70 text-purple-500 dark:text-purple-400" /> Loại Hình Lựa Chọn <span className="text-red-500 ml-0.5">*</span>
                    <span className="ml-1.5 group relative"><Info size={14} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 cursor-help" />
                        <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-xs p-2.5 text-xs text-white bg-slate-800 dark:bg-slate-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-lg leading-relaxed">
                            Chọn loại hình phù hợp để công cụ gợi ý các trường nhập liệu ước tính giá trị thu về.
                        </span>
                    </span>
                </label>
                <select id={`${optionKey}_optionType`} value={option.optionType} onChange={(e) => handleOptionChange(setOption, 'optionType')(e.target.value as OptionType)}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-700 text-lg">
                    <option value="asset_growth">Đầu tư Tăng trưởng Tài sản (Vàng, Cổ phiếu, BĐS...)</option>
                    <option value="project_course">Dự án Kinh doanh / Khóa học / Kỹ năng</option>
                    <option value="savings">Gửi Tiết kiệm Ngân hàng</option>
                    <option value="manual_entry">Khác (Tự nhập giá trị cuối kỳ)</option>
                </select>
            </div>

            {option.optionType === 'asset_growth' && (
                <div className="pl-4 border-l-2 border-blue-200 dark:border-blue-700">
                    <h4 className="text-md font-semibold text-gray-600 dark:text-gray-400 mt-1 mb-3">Ước Tính Cho Đầu Tư Tăng Trưởng Tài Sản</h4>
                    <InputField id={`${optionKey}_annualGrowthRateSuccess`} label="Tăng Trưởng Hàng Năm Ước Tính (Nếu Thành Công)" value={option.annualGrowthRateSuccess ?? 7} onChange={(val) => handleOptionChange(setOption, 'annualGrowthRateSuccess')(val)}
                        icon={<TrendingUp size={20} className="text-green-500"/>} unit="%" placeholder="Ví dụ: 10" tooltip="Tỷ lệ % giá trị tài sản ước tính tăng lên mỗi năm NẾU kịch bản TỐT xảy ra." min={-50} max={100} step={0.1} isRequired/>
                    {errorMessages[`${optionKey}_annualGrowthRateSuccess`] && <p className="text-red-500 text-xs mt-[-15px] mb-[15px]">{errorMessages[`${optionKey}_annualGrowthRateSuccess`]}</p>}
                    
                    <div className="mb-4 text-right">
                        <button type="button" onClick={() => setShowSuggestionsFor(optionKey)}
                                className="text-xs text-purple-600 dark:text-purple-400 hover:underline">
                            <List size={14} className="inline mr-1"/> Xem gợi ý % tăng trưởng
                        </button>
                    </div>
                    {showSuggestionsFor === optionKey && (
                        <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} className="mb-4 p-3 border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-xs">
                            <p className="font-semibold mb-2 text-gray-700 dark:text-gray-300">Gợi ý % tăng trưởng/năm (tham khảo):</p>
                            <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-400">
                                {assetGrowthSuggestions.map(sugg => (
                                    <li key={sugg.id}>
                                        <button type="button" className="text-blue-600 dark:text-blue-400 hover:underline" onClick={() => handleSuggestionClick(setOption, sugg.annualReturnSuggestion)}>
                                            {sugg.name}: {`${sugg.annualReturnSuggestion}%`}
                                        </button>
                                        <span className="ml-1 text-gray-500 dark:text-gray-500">- {sugg.note}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-2 text-red-600 dark:text-red-400 text-xs italic">Lưu ý: Các con số này chỉ mang tính chất tham khảo lịch sử/ví dụ, không đảm bảo lợi nhuận tương lai. Hãy tự nghiên cứu kỹ lưỡng.</p>
                        </motion.div>
                    )}
                    
                    <InputField id={`${optionKey}_valueRetentionFailure`} label="Giá Trị Vốn Gốc Còn Lại (Nếu Thất Bại)" value={option.valueRetentionFailure ?? 90} onChange={(val) => handleOptionChange(setOption, 'valueRetentionFailure')(val)}
                        icon={<ShieldCheck size={20} className="text-orange-500"/>} unit="% Vốn Gốc" placeholder="Ví dụ: 80" tooltip="Nếu thị trường diễn biến XẤU, bạn ước tính tài sản của mình còn lại bao nhiêu PHẦN TRĂM so với vốn đầu tư ban đầu? (Ví dụ: 90% nghĩa là mất 10% vốn, 100% là huề vốn, 0% là mất trắng hoàn toàn)." min={0} max={200} step={1} isRequired/>
                    {errorMessages[`${optionKey}_valueRetentionFailure`] && <p className="text-red-500 text-xs mt-[-15px] mb-[15px]">{errorMessages[`${optionKey}_valueRetentionFailure`]}</p>}
                    {/* Hiển thị lỗi _derived nếu có */}
                    {errorMessages[`${optionKey}_valueIfSuccess_derived`] && <p className="text-red-500 text-xs mt-1">{errorMessages[`${optionKey}_valueIfSuccess_derived`]}</p>}
                    {errorMessages[`${optionKey}_valueIfFailure_derived`] && <p className="text-red-500 text-xs mt-1">{errorMessages[`${optionKey}_valueIfFailure_derived`]}</p>}
                </div>
            )}
            {option.optionType === 'savings' && ( <div className="pl-4 border-l-2 border-blue-200 dark:border-blue-700">
                <h4 className="text-md font-semibold text-gray-600 dark:text-gray-400 mt-1 mb-3">Ước Tính Cho Gửi Tiết Kiệm</h4>
                    <InputField id={`${optionKey}_savingsInterestRate`} label="Lãi Suất Tiết Kiệm Hàng Năm" value={option.savingsInterestRate ?? 5} onChange={(val) => handleOptionChange(setOption, 'savingsInterestRate')(val)}
                        icon={<PiggyBank size={20} className="text-blue-500"/>} unit="%" placeholder="Lãi suất ngân hàng" tooltip="Lãi suất tiết kiệm cố định hàng năm ngân hàng trả cho bạn. Với lựa chọn này, xác suất thành công thường rất cao (ví dụ 99.9%) và giá trị nếu thất bại thường là vốn gốc (do có bảo hiểm tiền gửi ở mức độ nhất định)." min={0} max={20} step={0.1} isRequired/>
                    {errorMessages[`${optionKey}_savingsInterestRate`] && <p className="text-red-500 text-xs mt-[-15px] mb-[15px]">{errorMessages[`${optionKey}_savingsInterestRate`]}</p>}
                    {errorMessages[`${optionKey}_valueIfSuccess_derived`] && <p className="text-red-500 text-xs mt-1">{errorMessages[`${optionKey}_valueIfSuccess_derived`]}</p>}
            </div>)}
            {(option.optionType === 'project_course' || option.optionType === 'manual_entry') && ( <div className="pl-4 border-l-2 border-blue-200 dark:border-blue-700">
                <h4 className="text-md font-semibold text-gray-600 dark:text-gray-400 mt-1 mb-3">Ước Tính Thủ Công Giá Trị Cuối Kỳ</h4>
                    <FormattedInputField id={`${optionKey}_valueIfSuccess`} label="Giá Trị Thu Về Cuối Kỳ (Nếu Thành Công)" value={option.valueIfSuccess} onValueChange={(val) => handleOptionChange(setOption, 'valueIfSuccess')(val)}
                        icon={<TrendingUp size={20} className="text-green-500" />} unit="VNĐ" placeholder="Tổng giá trị cuối kỳ"
                        tooltip={option.optionType === 'project_course' ? "Với dự án/khóa học, hãy ước tính TỔNG LỢI ÍCH TÀI CHÍNH RÒNG (ví dụ: thu nhập tăng thêm sau khi trừ các chi phí liên quan nếu có, giá trị ước tính của doanh nghiệp/kỹ năng...) bạn nhận được sau thời gian xem xét, NẾU thành công." : "Tổng giá trị bạn dự kiến có được vào CUỐI KỲ XEM XÉT, NẾU lựa chọn này thành công."}
                        isRequired/>
                    {errorMessages[`${optionKey}_valueIfSuccess_derived`] && <p className="text-red-500 text-xs mt-[-15px] mb-[15px]">{errorMessages[`${optionKey}_valueIfSuccess_derived`]}</p>}
                    <FormattedInputField id={`${optionKey}_valueIfFailure`} label="Giá Trị Thu Về Cuối Kỳ (Nếu Thất BẠI)" value={option.valueIfFailure} onValueChange={(val) => handleOptionChange(setOption, 'valueIfFailure')(val)}
                        icon={<AlertTriangle size={20} className="text-red-500" />} unit="VNĐ" placeholder="Giá trị nếu không như ý"
                        tooltip={option.optionType === 'project_course' ? "Nếu dự án/khóa học không mang lại lợi ích tài chính như kỳ vọng, giá trị thu về có thể là 0 (mất vốn đầu tư), hoặc một con số tượng trưng cho kinh nghiệm/kiến thức bạn có thể lượng hóa." : "Tổng giá trị bạn dự kiến có được vào CUỐI KỲ XEM XÉT, NẾU lựa chọn này thất bại."}
                        isRequired/>
                    {errorMessages[`${optionKey}_valueIfFailure_derived`] && <p className="text-red-500 text-xs mt-[-15px] mb-[15px]">{errorMessages[`${optionKey}_valueIfFailure_derived`]}</p>}
            </div>)}
            <div className="mt-6 border-t dark:border-gray-700 pt-4">
                <InputField id={`${optionKey}_probabilitySuccess`} label="Khả Năng Kịch Bản 'Thành Công' Xảy Ra" value={option.probabilitySuccess} onChange={(val) => handleOptionChange(setOption, 'probabilitySuccess')(val)}
                    icon={<Target size={20} className="text-teal-500" />} unit="%" placeholder="0-100"
                    tooltip="Ước tính của bạn về khả năng kịch bản 'Thành Công' (với các thông số giá trị bạn đã nhập ở trên) xảy ra (từ 0 đến 100%). Kịch bản 'Thất Bại' sẽ có xác suất là (100% - con số này)."
                    min={0} max={100} step={1} isRequired/>
                {errorMessages[`${optionKey}_probabilitySuccess`] && <p className="text-red-500 text-xs mt-[-15px] mb-[15px]">{errorMessages[`${optionKey}_probabilitySuccess`]}</p>}
            </div>
        </motion.div>
    );
    
    return (
        <div className="max-w-3xl mx-auto py-8 px-4 sm:px-0">
            {renderStepIndicator()}
            <AnimatePresence mode="wait">
                {currentStep === 1 && renderOptionInputForm(optionA, setOptionA, 'optionA', 'Lựa Chọn A')}
                {currentStep === 2 && renderOptionInputForm(optionB, setOptionB, 'optionB', 'Lựa Chọn B')}
                {currentStep === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl sm:text-2xl font-semibold text-purple-700 dark:text-purple-400 mb-6 flex items-center">
                            <Percent size={24} className="mr-3 text-purple-500 dark:text-purple-400" />
                            Thông Số Chung Để So Sánh
                        </h3>
                        <InputField id="discountRate" label="Tỷ Lệ Hoàn Vốn Mong Muốn Hàng Năm (Tỷ lệ chiết khấu)" value={discountRate} onChange={setDiscountRate}
                            icon={<HelpCircle size={20} className="text-purple-500 dark:text-purple-400" />} unit="%" placeholder="Ví dụ: 7"
                            tooltip="Đây là mức lợi nhuận TỐI THIỂU bạn kỳ vọng mỗi năm từ một khoản đầu tư có rủi ro tương đương. Hoặc có thể coi là lãi suất bạn có thể nhận được từ một lựa chọn đầu tư an toàn khác (như gửi tiết kiệm dài hạn). Con số này dùng để đánh giá giá trị 'thực' của các khoản tiền trong tương lai về thời điểm HIỆN TẠI."
                            min={-20} max={100} step={0.1} isRequired
                        />
                        {errorMessages.discountRate && <p className="text-red-500 text-xs mt-[-15px] mb-[15px]">{errorMessages.discountRate}</p>}
                    </motion.div>
                )}
                 {currentStep === 4 && resultA && resultB && (
                    <motion.div key="step4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100 text-center mb-6 flex items-center justify-center">
                            <BarChart2 size={28} className="mr-3 text-purple-600 dark:text-purple-400" /> Kết Quả Phân Tích Chi Tiết
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            {[
                                { option: optionA, result: resultA, title: "Lựa Chọn A", borderColor: "border-blue-300 dark:border-blue-600", bgColor: "bg-blue-50 dark:bg-blue-900/30", textColor: "text-blue-700 dark:text-blue-300", highlightColor: "text-blue-600 dark:text-blue-400" },
                                { option: optionB, result: resultB, title: "Lựa Chọn B", borderColor: "border-green-300 dark:border-green-600", bgColor: "bg-green-50 dark:bg-green-900/30", textColor: "text-green-700 dark:text-green-300", highlightColor: "text-green-600 dark:text-green-400" }
                            ].map(item => {
                                const terminal = getTerminalValues(item.option);
                                return (
                                <div key={item.title} className={`p-4 rounded-lg border ${item.borderColor} ${item.bgColor}`}>
                                    <h4 className={`text-lg font-semibold ${item.textColor} mb-2`}>{item.option.name || item.title}</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Vốn đầu tư: {formatCurrency(item.option.initialInvestment)}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Thời gian: {item.option.years} năm</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Giá trị nếu TC: {formatCurrency(terminal?.finalValueSuccess)} ({item.option.probabilitySuccess}%)</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Giá trị nếu TB: {formatCurrency(terminal?.finalValueFailure)} ({100-item.option.probabilitySuccess}%)</p>
                                    <p className="font-bold mt-2 text-gray-800 dark:text-gray-100">Lợi Ích Ròng Dự Kiến (ENPV): <span className={item.highlightColor}>{formatCurrency(item.result?.expectedNetPresentValue)}</span></p>
                                </div>
                            )})}
                        </div>
                         <div className={`p-4 rounded-lg border text-center mt-4 ${
                            Math.abs(resultA.expectedNetPresentValue - resultB.expectedNetPresentValue) < 0.01 ? 'bg-gray-100 dark:bg-gray-700/40 border-gray-300 dark:border-gray-600' :
                            resultA.expectedNetPresentValue > resultB.expectedNetPresentValue ? 'bg-blue-50 dark:bg-blue-900/40 border-blue-300 dark:border-blue-600' :
                            'bg-green-50 dark:bg-green-900/40 border-green-300 dark:border-green-600' 
                        }`}>
                            <h4 className="text-lg font-semibold mb-2 flex items-center justify-center text-gray-800 dark:text-gray-100">
                                {Math.abs(resultA.expectedNetPresentValue - resultB.expectedNetPresentValue) < 0.01 ? <HelpCircle size={22} className="mr-2 text-gray-600 dark:text-gray-300"/> :
                                (resultA.expectedNetPresentValue > resultB.expectedNetPresentValue ? <CheckCircle size={22} className="mr-2 text-blue-600 dark:text-blue-400"/> :
                                <CheckCircle size={22} className="mr-2 text-green-600 dark:text-green-400"/>)
                                } Gợi Ý Dựa Trên Phân Tích Tài Chính
                            </h4>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{comparisonMessage}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="mt-8 flex flex-wrap justify-between items-center gap-4">
                {currentStep > 1 && ( <button onClick={handlePrevStep} className="px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg shadow hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors flex items-center text-base"> <ChevronLeft size={20} className="mr-1.5" /> Quay Lại </button> )}
                <div className="flex-grow hidden sm:block"></div>
                {currentStep < 3 && ( <button onClick={handleNextStep} className="w-full sm:w-auto px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition-colors flex items-center justify-center text-base disabled:opacity-50 disabled:cursor-not-allowed"> Tiếp Theo <ChevronRight size={20} className="ml-1.5" /> </button> )}
                {currentStep === 3 && ( <button onClick={handleCompare} className="w-full sm:w-auto px-8 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-lg flex items-center justify-center"> <DivideCircle size={20} className="mr-2" /> Xem Kết Quả Phân Tích </button> )}
                {currentStep === 4 && ( <button onClick={resetAll} className="w-full sm:w-auto px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 text-lg flex items-center justify-center"> <RefreshCw size={20} className="mr-2" /> Phân Tích Lựa Chọn Khác </button> )}
            </div>
            <div className="mt-12 text-xs text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
              <p className='font-bold'>Lưu ý quan trọng:</p>
              <ul className="list-disc list-inside text-left mt-2 space-y-1 leading-relaxed">
                <li>Công cụ này tính toán dựa trên các con số và ước tính do bạn cung cấp. Kết quả ("Lợi Ích Ròng Dự Kiến" - ENPV) là một chỉ số tham khảo.</li>
                <li>"Tỷ Lệ Hoàn Vốn Mong Muốn" là một yếu tố quan trọng. Tỷ lệ này càng cao, các dự án có lợi nhuận xa trong tương lai hoặc rủi ro cao sẽ có ENPV thấp hơn.</li>
                <li>Việc ước tính "Giá trị thu về" và "Xác suất thành công" là chủ quan. Hãy cố gắng đưa ra con số thực tế nhất.</li>
                <li>Luôn xem xét các yếu tố phi tài chính (đam mê, kỹ năng, chiến lược, tác động xã hội) mà công cụ này không thể đo lường.</li>
                <li>Đây không phải là lời khuyên đầu tư. Hãy tìm hiểu kỹ hoặc tham vấn chuyên gia cho các quyết định tài chính quan trọng.</li>
              </ul>
            </div>
        </div>
    );
};

// --- Trang Chính: LatteFactorPage ---
const LatteFactorPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 sm:py-12 text-gray-900 dark:text-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto relative mb-8">
            <div className="relative flex items-center justify-center py-4">
                <Link
                  to="/"
                  className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors group py-2 pr-2 -ml-1 sm:ml-0"
                >
                  <ArrowLeft size={18} className="mr-1.5 transition-transform group-hover:-translate-x-1" />
                  Trang chủ
                </Link>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-100 text-center">
                    Phân Tích & So Sánh Lựa Chọn
                </h1>
            </div>
        </div>
        <DecisionComparisonTool />
      </div>
    </div>
  );
};

export default LatteFactorPage;