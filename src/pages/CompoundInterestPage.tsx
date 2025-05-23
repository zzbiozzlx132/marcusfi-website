import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowLeft, TrendingUp, PiggyBank, Percent, Wallet, Info, Clock,
    BarChartHorizontalBig, RefreshCw, ChevronsUpDown
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
        const allowDecimal = (step !== undefined && step < 1) || id.toLowerCase().includes('rate') || id.toLowerCase().includes('percent') || id.toLowerCase().includes('discount');
        let validChars = "";
        let hasDecimalPoint = false;
        for (const char of rawValue) {
            if ((char >= '0' && char <= '9') || (allowDecimal && char === '.' && !hasDecimalPoint)) {
                validChars += char;
                if (char === '.') { hasDecimalPoint = true; }
            } else if (char === '-' && validChars === '' && min !== undefined && min < 0) {
                validChars += char;
            }
        }
        rawValue = validChars;
        setInputValue(rawValue);
        const numericValue = parseFormattedNumber(rawValue);
        if (numericValue !== undefined) { onChange(numericValue); }
        else if (rawValue === '' && !isRequired) { onChange(min); }
        else if (rawValue === '-' && min !==undefined && min < 0) { /* Đang nhập số âm */ }
    };
    const handleBlur = () => {
        let numericValue = parseFormattedNumber(inputValue);
        if (numericValue === undefined || isNaN(numericValue)) { numericValue = isRequired ? min : min; }
        if (numericValue < min) { numericValue = min; }
        if (max !== undefined && numericValue > max) { numericValue = max; }
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
        if (rawValue === '') { setDisplayValue(''); onValueChange(undefined); return; }
        const numericValue = parseFormattedNumber(rawValue);
        if (numericValue !== undefined) { setDisplayValue(formatCurrency(numericValue, false)); onValueChange(numericValue); }
        else { const onlyNumbers = rawValue.replace(/[^0-9]/g, ''); setDisplayValue(onlyNumbers); }
    };
    const handleBlur = () => {
        let finalNumericValue = parseFormattedNumber(displayValue);
        if (finalNumericValue === undefined) {
            if (isRequired) { finalNumericValue = min; setDisplayValue(formatCurrency(finalNumericValue, false)); onValueChange(finalNumericValue); }
            else { onValueChange(undefined); setDisplayValue(''); }
        } else { 
            if (finalNumericValue < min) { finalNumericValue = min; }
            setDisplayValue(formatCurrency(finalNumericValue, false)); onValueChange(finalNumericValue);
        }
    };
    return (
    <div className="mb-6">
      <label htmlFor={id} className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {icon && <span className="mr-2 opacity-70">{icon}</span>}
        {label} {isRequired && <span className="text-red-500 ml-0.5">*</span>}
        {tooltip && ( <span className="ml-1.5 group relative"> <Info size={14} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 cursor-help" /> <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-md p-2.5 text-xs text-white bg-slate-800 dark:bg-slate-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-lg leading-relaxed"> {tooltip} </span> </span> )}
      </label>
      <div className="relative">
        <input type="text" inputMode="numeric" id={id} value={displayValue} onChange={handleChange} onBlur={handleBlur} placeholder={placeholder} disabled={disabled}
          className={`w-full px-4 py-2.5 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-lg ${disabled ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed' : 'border-gray-300 dark:border-gray-600'}`}/>
        {unit && <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-sm pointer-events-none ${disabled ? 'text-gray-400 dark:text-gray-500' : 'text-gray-500 dark:text-gray-400'}`}>{unit}</span>}
      </div>
    </div>
    );
};

// --- Component Tính Lãi Kép ---
// Sửa lỗi: Bỏ yearlyBreakdown khỏi CompoundResult
interface CompoundResult {
    futureValue: number;
    totalPrincipal: number;
    totalInterest: number;
    realFutureValue?: number;
}

const CompoundInterestCalculator: React.FC = () => {
    const [initialPrincipal, setInitialPrincipal] = useState<number | undefined>(10000000);
    const [monthlyContribution, setMonthlyContribution] = useState<number | undefined>(1000000);
    const [annualInterestRate, setAnnualInterestRate] = useState<number>(7);
    const [yearsToGrow, setYearsToGrow] = useState<number>(10);
    const [compoundingFrequency, setCompoundingFrequency] = useState<number>(12);
    const [annualInflationRate, setAnnualInflationRate] = useState<number>(2);

    const [result, setResult] = useState<CompoundResult | null>(null);
    // Các state liên quan đến "Sức mạnh của thời gian" và "Biểu đồ" đã được bỏ


    const calculateCompoundInterest = useCallback((
        P: number,
        PMT_per_period: number,
        r_per_period: number,
        n_per_year: number,
        t: number
    // Sửa lỗi: Bỏ yearlyBreakdown khỏi kiểu trả về
    ): Omit<CompoundResult, 'realFutureValue' | 'yearlyBreakdown'> => {
        let futureValueCalculated = P;
        let totalPrincipalSoFar = P;
        let currentBalance = P;

        for (let year = 1; year <= t; year++) {
            for (let period_in_year = 0; period_in_year < n_per_year; period_in_year++) {
                const interestForPeriod = currentBalance * r_per_period;
                currentBalance += interestForPeriod;
                currentBalance += PMT_per_period;
            }
            // Cập nhật tổng vốn gốc sau mỗi năm (chỉ cộng thêm phần đóng góp của năm đó)
            totalPrincipalSoFar += (PMT_per_period * n_per_year);
        }
        futureValueCalculated = currentBalance;
        // Tính lại tổng vốn gốc chính xác cuối cùng
        const finalTotalPrincipal = P + (PMT_per_period * n_per_year * t);
        const totalInterestCalculated = futureValueCalculated - finalTotalPrincipal;

        return { 
            futureValue: futureValueCalculated, 
            totalPrincipal: finalTotalPrincipal, 
            totalInterest: totalInterestCalculated,
        };
    }, []);

    const handleSubmit = useCallback(() => {
        if (initialPrincipal === undefined || monthlyContribution === undefined || annualInterestRate === undefined || yearsToGrow === undefined || compoundingFrequency === undefined || annualInflationRate === undefined) {
            alert("Vui lòng nhập đầy đủ thông tin.");
            return;
        }
        if (yearsToGrow <=0 || annualInterestRate < 0 || initialPrincipal < 0 || monthlyContribution < 0 || compoundingFrequency <=0 ) {
            alert("Các giá trị số tiền, lãi suất, thời gian và tần suất ghép lãi phải hợp lệ (không âm, thời gian > 0).");
            return;
        }

        const P = initialPrincipal;
        const r_annual = annualInterestRate / 100;
        const n_per_year = compoundingFrequency;
        const t = yearsToGrow;
        
        const PMT_per_period = (monthlyContribution * 12) / n_per_year;
        const r_per_period = r_annual / n_per_year;

        const mainCalc = calculateCompoundInterest(P, PMT_per_period, r_per_period, n_per_year, t);
        
        const inflation_r = annualInflationRate / 100;
        const realFutureValue = mainCalc.futureValue / Math.pow(1 + inflation_r, t);
        
        // Sửa lỗi: Bỏ yearlyBreakdown khi setResult
        setResult({ 
            futureValue: mainCalc.futureValue,
            totalPrincipal: mainCalc.totalPrincipal,
            totalInterest: mainCalc.totalInterest,
            realFutureValue
            // yearlyBreakdown: [] // ĐÃ BỎ
        });
    }, [initialPrincipal, monthlyContribution, annualInterestRate, yearsToGrow, compoundingFrequency, annualInflationRate, calculateCompoundInterest]);
    
    const resetForm = () => {
        setInitialPrincipal(10000000);
        setMonthlyContribution(1000000);
        setAnnualInterestRate(7);
        setYearsToGrow(10);
        setCompoundingFrequency(12);
        setAnnualInflationRate(2);
        setResult(null);
    };
    
    return (
        <div className="max-w-3xl mx-auto py-8 px-4 sm:px-0">
            <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl sm:text-3xl font-bold text-purple-700 dark:text-purple-400 mb-2 text-center">
                    Công Cụ Tính Lãi Kép
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-8">
                    Khám phá sức mạnh của lãi kép và xem số tiền của bạn có thể tăng trưởng như thế nào theo thời gian!
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    <FormattedInputField id="initialPrincipal" label="Vốn Đầu Tư Ban Đầu" value={initialPrincipal} onValueChange={setInitialPrincipal}
                        icon={<PiggyBank size={20} className="text-purple-500 dark:text-purple-400"/>} unit="VNĐ" placeholder="Số tiền ban đầu"
                        tooltip="Số tiền bạn có sẵn để bắt đầu đầu tư hoặc tiết kiệm."/>
                    
                    <FormattedInputField id="monthlyContribution" label="Đóng Góp Thêm Hàng Tháng" value={monthlyContribution} onValueChange={setMonthlyContribution}
                        icon={<Wallet size={20} className="text-purple-500 dark:text-purple-400"/>} unit="VNĐ" placeholder="Tiền tiết kiệm/đầu tư thêm"
                        tooltip="Số tiền bạn dự định đóng góp thêm vào khoản đầu tư này mỗi tháng."/>

                    <InputField id="annualInterestRate" label="Lãi Suất Hàng Năm Kỳ Vọng" value={annualInterestRate} onChange={setAnnualInterestRate}
                        icon={<Percent size={20} className="text-purple-500 dark:text-purple-400"/>} unit="%" placeholder="Lãi suất %/năm"
                        tooltip="Tỷ lệ lợi nhuận bạn kỳ vọng nhận được từ khoản đầu tư này mỗi năm (trước thuế, trước lạm phát). Lãi suất càng cao, rủi ro thường càng lớn." min={0} max={100} step={0.1} isRequired/>

                    <InputField id="yearsToGrow" label="Số Năm Đầu Tư" value={yearsToGrow} onChange={setYearsToGrow}
                        icon={<Clock size={20} className="text-purple-500 dark:text-purple-400"/>} unit="năm" placeholder="Thời gian đầu tư"
                        tooltip="Bạn dự định đầu tư hoặc tiết kiệm trong bao nhiêu năm?" min={1} max={100} step={1} isRequired/>
                    
                    <div className="md:col-span-1 mb-6">
                        <label htmlFor="compoundingFrequency" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                             <ChevronsUpDown size={20} className="mr-2 opacity-70 text-purple-500 dark:text-purple-400"/> Tần Suất Ghép Lãi Hàng Năm
                            <span className="ml-1.5 group relative"><Info size={14} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 cursor-help" />
                                <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-xs p-2.5 text-xs text-white bg-slate-800 dark:bg-slate-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg">
                                    Lãi được tính và cộng vào vốn bao nhiêu lần trong một năm? (Phổ biến: 12 lần/năm nếu ghép lãi hàng tháng và bạn đóng góp hàng tháng).
                                </span>
                            </span>
                        </label>
                        <select id="compoundingFrequency" value={compoundingFrequency} onChange={(e) => setCompoundingFrequency(Number(e.target.value))}
                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-700 text-lg">
                            <option value={1}>Hàng năm (1 lần/năm)</option>
                            <option value={2}>Nửa năm (2 lần/năm)</option>
                            <option value={4}>Hàng quý (4 lần/năm)</option>
                            <option value={12}>Hàng tháng (12 lần/năm)</option>
                        </select>
                    </div>

                     <InputField id="annualInflationRate" label="Tỷ Lệ Lạm Phát Hàng Năm Dự Kiến" value={annualInflationRate} onChange={setAnnualInflationRate}
                        icon={<TrendingUp size={20} className="text-orange-500"/>} unit="%" placeholder="Lạm phát %/năm"
                        tooltip="Tỷ lệ lạm phát trung bình hàng năm bạn dự kiến. Điều này giúp tính toán sức mua thực tế của số tiền trong tương lai." min={0} max={20} step={0.1}/>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row gap-4">
                    <button onClick={handleSubmit} className="flex-1 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 text-lg flex items-center justify-center">
                        <BarChartHorizontalBig size={20} className="mr-2" /> Tính Toán
                    </button>
                     <button onClick={resetForm} title="Đặt lại các giá trị về mặc định" className="flex-1 sm:flex-none px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 text-lg flex items-center justify-center">
                        <RefreshCw size={18} className="mr-2"/> Nhập Lại
                    </button>
                </div>
            </div>

            {result && (
                <div className="mt-10 bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl sm:text-2xl font-semibold text-purple-700 dark:text-purple-400 mb-6 text-center">Kết Quả Ước Tính</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 text-center">
                        <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                            <p className="text-sm text-purple-800 dark:text-purple-300">Tổng Số Tiền Dự Kiến (Sau {yearsToGrow} năm)</p>
                            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{formatCurrency(result.futureValue)}</p>
                        </div>
                        {result.realFutureValue !== undefined && (
                             <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                                <p className="text-sm text-indigo-800 dark:text-indigo-300">Giá Trị Thực Tế (Sau Lạm Phát {annualInflationRate}%)</p>
                                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">{formatCurrency(result.realFutureValue)}</p>
                            </div>
                        )}
                        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <p className="text-sm text-gray-700 dark:text-gray-300">Tổng Vốn Gốc Đã Đóng Góp</p>
                            <p className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-1">{formatCurrency(result.totalPrincipal)}</p>
                        </div>
                        <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                            <p className="text-sm text-green-800 dark:text-green-300">Tổng Tiền Lãi Kiếm Được</p>
                            <p className="text-xl font-bold text-green-600 dark:text-green-400 mt-1">{formatCurrency(result.totalInterest)}</p>
                        </div>
                    </div>

                    <div className="mt-6 p-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                        <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">So Sánh Lãi Đơn và Lãi Kép:</h4>
                        {(() => {
                            if (initialPrincipal === undefined || monthlyContribution === undefined || annualInterestRate === undefined || yearsToGrow === undefined || yearsToGrow <=0) return null;
                            const P_simple = initialPrincipal;
                            const total_contributions_simple = monthlyContribution * 12 * yearsToGrow;
                            const r_simple_annual = annualInterestRate / 100;
                            const t_simple = yearsToGrow;
                            
                            let totalInterest_simple_calc = P_simple * r_simple_annual * t_simple;
                            for (let i = 0; i < t_simple; i++) {
                                totalInterest_simple_calc += (monthlyContribution * 12) * r_simple_annual * (t_simple - i - 0.5);
                            }
                            
                            const totalPrincipal_simple_final = P_simple + total_contributions_simple;
                            const futureValue_simple = totalPrincipal_simple_final + totalInterest_simple_calc;

                            return (
                                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                    <p>Với lãi kép (như trên): <strong className="text-purple-600 dark:text-purple-400">{formatCurrency(result.futureValue)}</strong></p>
                                    <p>Nếu chỉ tính lãi đơn (ước tính): <strong className="text-gray-700 dark:text-gray-300">{formatCurrency(futureValue_simple)}</strong></p>
                                    <p>Chênh lệch nhờ lãi kép: <strong className="text-green-600 dark:text-green-400">{formatCurrency(result.futureValue - futureValue_simple)}</strong></p>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            )}
             <div className="mt-12 text-xs text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
              <p className='font-bold'>Lưu ý quan trọng:</p>
              <ul className="list-disc list-inside text-left mt-2 space-y-1 leading-relaxed">
                <li>Công cụ này chỉ mang tính chất minh họa. Lãi suất thực tế có thể thay đổi và đầu tư luôn có rủi ro.</li>
                <li>Kết quả chưa tính đến thuế thu nhập cá nhân trên lợi nhuận đầu tư (nếu có).</li>
                <li>Lạm phát có thể ảnh hưởng đến sức mua của số tiền trong tương lai. Hãy xem xét "Giá Trị Thực Tế".</li>
                <li>Bắt đầu sớm và đầu tư đều đặn là chìa khóa để tận dụng sức mạnh của lãi kép.</li>
              </ul>
            </div>
        </div>
    );
};

// --- Trang Chính: CompoundInterestPage ---
const CompoundInterestPage: React.FC = () => {
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
                    Công Cụ Tính Lãi Kép
                </h1>
            </div>
        </div>
        <CompoundInterestCalculator />
      </div>
    </div>
  );
};

export default CompoundInterestPage;