import React, { useState, useCallback } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };
const rowStyle: React.CSSProperties = { display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' };
const sectionStyle: React.CSSProperties = { marginBottom: 20 };
const resultStyle: React.CSSProperties = { fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', fontFamily: '"Fira Code", "Noto Sans SC", monospace', padding: '20px', textAlign: 'center', background: 'var(--bg-tool)', borderRadius: 14, border: '1px solid var(--border-light)' };
const noteStyle: React.CSSProperties = { fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', marginTop: 8, textAlign: 'center' };

// Hardcoded approximate rates (vs CNY)
const currencyInfo: Record<string, { name: string; rate: number; symbol: string }> = {
  CNY: { name: '人民币', rate: 1, symbol: '¥' },
  USD: { name: '美元', rate: 7.25, symbol: '$' },
  EUR: { name: '欧元', rate: 7.85, symbol: '€' },
  GBP: { name: '英镑', rate: 9.20, symbol: '£' },
  JPY: { name: '日元', rate: 0.048, symbol: '¥' },
  KRW: { name: '韩元', rate: 0.0053, symbol: '₩' },
  HKD: { name: '港币', rate: 0.93, symbol: 'HK$' },
  AUD: { name: '澳元', rate: 4.80, symbol: 'A$' },
  CAD: { name: '加元', rate: 5.30, symbol: 'C$' },
  CHF: { name: '瑞士法郎', rate: 8.15, symbol: 'CHF' },
};

const getCurrencyLabel = (code: string) => {
  const info = currencyInfo[code];
  return info ? `${info.name} (${code} ${info.symbol})` : code;
};

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
    const inCny = n * currencyInfo[f].rate;
    const targetRate = currencyInfo[t].rate;
    const result = inCny / targetRate;
    const fmt = result.toLocaleString('zh-CN', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
    setOutput(fmt);
    if (f === t) {
      setRateUsed('同币种转换');
    } else {
      // 始终显示 1 源货币 = ? 目标货币
      const crossRate = currencyInfo[f].rate / currencyInfo[t].rate;
      setRateUsed(`1 ${getCurrencyLabel(f)} = ${crossRate.toFixed(4)} ${getCurrencyLabel(t)}`);
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
      hideInput
      outputValue={output}
    >
      <div style={sectionStyle}>
        <div style={labelStyle}>输入金额</div>
        <input style={{ ...inputStyle, maxWidth: 300 }} value={amount} onChange={e => handleAmount(e.target.value)} placeholder="输入金额" type="number" step="0.01" />
      </div>
      <div style={sectionStyle}>
        <div style={labelStyle}>从 → 到</div>
        <div style={rowStyle}>
          <select style={inputStyle} value={from} onChange={e => handleFrom(e.target.value)}>
            {Object.keys(currencyInfo).map(c => <option key={c} value={c}>{getCurrencyLabel(c)}</option>)}
          </select>
          <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>→</span>
          <select style={inputStyle} value={to} onChange={e => handleTo(e.target.value)}>
            {Object.keys(currencyInfo).map(c => <option key={c} value={c}>{getCurrencyLabel(c)}</option>)}
          </select>
        </div>
      </div>
      {output && (
        <>
          <div style={resultStyle}>{amount} {getCurrencyLabel(from)} = {output} {getCurrencyLabel(to)}</div>
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, marginTop: 6 }}>汇率: {rateUsed}</div>
        </>
      )}
      <div style={noteStyle}>* 汇率定期更新，仅供参考</div>
    </ToolLayout>
  );
}
