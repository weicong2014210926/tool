import React, { useState, useCallback } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };
const rowStyle: React.CSSProperties = { display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' };
const sectionStyle: React.CSSProperties = { marginBottom: 20 };
const resultStyle: React.CSSProperties = { fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', fontFamily: '"Fira Code", "Noto Sans SC", monospace', padding: '20px', textAlign: 'center', background: 'var(--bg-tool)', borderRadius: 14, border: '1px solid var(--border-light)', wordBreak: 'break-word' };

const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function numberToWords(num: number): string {
  if (num === 0) return 'Zero';
  if (num < 10) return ones[num];
  if (num < 20) return teens[num - 10];
  if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? '-' + ones[num % 10] : '');
  if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' ' + numberToWords(num % 100) : '');
  if (num < 1000000) return numberToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + numberToWords(num % 1000) : '');
  if (num < 1000000000) return numberToWords(Math.floor(num / 1000000)) + ' Million' + (num % 1000000 ? ' ' + numberToWords(num % 1000000) : '');
  return numberToWords(Math.floor(num / 1000000000)) + ' Billion' + (num % 1000000000 ? ' ' + numberToWords(num % 1000000000) : '');
}

function convertEnAmount(amount: number, currency: string): string {
  const intPart = Math.floor(amount);
  const cents = Math.round((amount - intPart) * 100);
  const intWords = numberToWords(intPart);
  const centStr = cents.toString().padStart(2, '0');
  return intWords + ' and ' + centStr + '/100 ' + currency;
}

const currencies = [
  { code: 'USD', name: 'Dollars' },
  { code: 'EUR', name: 'Euros' },
  { code: 'GBP', name: 'Pounds' },
  { code: 'JPY', name: 'Yen' },
];

export default function EnAmount() {
  const [input, setInput] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [output, setOutput] = useState('');

  const handleInput = useCallback((value: string) => {
    setInput(value);
    if (!value.trim()) {
      setOutput('');
      return;
    }
    const num = parseFloat(value);
    if (isNaN(num) || num < 0) {
      setOutput('请输入有效金额');
      return;
    }
    const cur = currencies.find(c => c.code === currency)!;
    setOutput(convertEnAmount(num, cur.name));
  }, [currency]);

  const handleCurrency = useCallback((value: string) => {
    setCurrency(value);
    if (input.trim()) {
      const num = parseFloat(input);
      if (!isNaN(num) && num >= 0) {
        const cur = currencies.find(c => c.code === value)!;
        setOutput(convertEnAmount(num, cur.name));
      }
    }
  }, [input]);

  return (
    <ToolLayout
      toolId="fin-en-amount"
      title="英文金额大写转换"
      description="将数字金额转换为英文大写金额格式，适用于国际结算和英文合同"
      hideInput
      outputValue={output}
    >
      <div style={sectionStyle}>
        <div style={labelStyle}>输入金额</div>
        <div style={rowStyle}>
          <input
            style={{ ...inputStyle, maxWidth: 250 }}
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            placeholder="例如：1234.56"
            type="number"
            step="0.01"
          />
          <select style={inputStyle} value={currency} onChange={(e) => handleCurrency(e.target.value)}>
            {currencies.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
          </select>
        </div>
      </div>
      {output && <div style={resultStyle}>{output}</div>}
    </ToolLayout>
  );
}
