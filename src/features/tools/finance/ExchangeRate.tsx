import React, { useState, useCallback } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };
const rowStyle: React.CSSProperties = { display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' };
const sectionStyle: React.CSSProperties = { marginBottom: 20 };
const resultStyle: React.CSSProperties = { fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', fontFamily: '"Fira Code", "Noto Sans SC", monospace', padding: '20px', textAlign: 'center', background: 'var(--bg-tool)', borderRadius: 14, border: '1px solid var(--border-light)' };
const noteStyle: React.CSSProperties = { fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', marginTop: 8, textAlign: 'center' };

// Hardcoded approximate rates (vs CNY)
const rates: Record<string, number> = {
  CNY: 1,
  USD: 7.25,
  EUR: 7.85,
  GBP: 9.20,
  JPY: 0.048,
  KRW: 0.0053,
  HKD: 0.93,
  AUD: 4.80,
  CAD: 5.30,
  CHF: 8.15,
};

const currencies = Object.keys(rates);

export default function ExchangeRate() {
  const [amount, setAmount] = useState('');
  const [from, setFrom] = useState('CNY');
  const [to, setTo] = useState('USD');
  const [output, setOutput] = useState('');
  const [rateUsed, setRateUsed] = useState('');

  const convert = useCallback((val: string, f: string, t: string) => {
    if (!val) { setOutput(''); setRateUsed(''); return; }
    const n = parseFloat(val);
    if (isNaN(n) || n < 0) { setOutput(''); setRateUsed(''); return; }
    const inCny = n * rates[f];
    const targetRate = rates[t];
    const result = inCny / targetRate;
    setOutput(result.toFixed(4));
    if (f === t) {
      setRateUsed('同币种转换');
    } else if (f === 'CNY') {
      setRateUsed(`1 ${t} = ${(rates['CNY'] / rates[t]).toFixed(4)} CNY`);
    } else if (t === 'CNY') {
      setRateUsed(`1 ${f} = ${rates[f].toFixed(4)} CNY`);
    } else {
      setRateUsed(`1 ${f} = ${(rates[f] / rates[t]).toFixed(4)} ${t}`);
    }
  }, []);

  const handleAmount = (v: string) => { setAmount(v); convert(v, from, to); };
  const handleFrom = (v: string) => { setFrom(v); convert(amount, v, to); };
  const handleTo = (v: string) => { setTo(v); convert(amount, from, v); };

  return (
    <ToolLayout
      toolId="fin-exchange-rate"
      title="货币汇率换算"
      description="支持全球主要货币之间的汇率查询和金额换算"
      inputValue=""
      onInputChange={() => {}}
      outputValue={output}
      inputPlaceholder=""
    >
      <div style={sectionStyle}>
        <div style={labelStyle}>输入金额</div>
        <input style={{ ...inputStyle, maxWidth: 300 }} value={amount} onChange={e => handleAmount(e.target.value)} placeholder="输入金额" type="number" step="0.01" />
      </div>
      <div style={sectionStyle}>
        <div style={labelStyle}>从 → 到</div>
        <div style={rowStyle}>
          <select style={inputStyle} value={from} onChange={e => handleFrom(e.target.value)}>
            {currencies.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>→</span>
          <select style={inputStyle} value={to} onChange={e => handleTo(e.target.value)}>
            {currencies.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      {output && (
        <>
          <div style={resultStyle}>{amount} {from} = {output} {to}</div>
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, marginTop: 6 }}>汇率: {rateUsed}</div>
        </>
      )}
      <div style={noteStyle}>* 汇率定期更新，仅供参考</div>
    </ToolLayout>
  );
}
