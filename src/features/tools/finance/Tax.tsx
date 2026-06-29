import React, { useState, useCallback } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };
const rowStyle: React.CSSProperties = { display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' };
const sectionStyle: React.CSSProperties = { marginBottom: 20 };
const statCard: React.CSSProperties = { padding: '16px 20px', borderRadius: 14, border: '1px solid var(--border-light)', background: 'var(--bg-tool)', textAlign: 'center' as const, minWidth: 120 };
const statLabel: React.CSSProperties = { fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', marginBottom: 4 };
const statValue: React.CSSProperties = { fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' };
const radioStyle: React.CSSProperties = { display: 'flex', gap: 16, marginBottom: 8 };

export default function Tax() {
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState('13');
  const [mode, setMode] = useState<'inclusive' | 'exclusive'>('exclusive');
  const [output, setOutput] = useState('');

  const calculate = useCallback((a: string, r: string, m: 'inclusive' | 'exclusive') => {
    const amt = parseFloat(a);
    const rt = parseFloat(r);
    if (isNaN(amt) || isNaN(rt) || amt < 0 || rt < 0) {
      setOutput('');
      return;
    }
    if (m === 'exclusive') {
      const tax = amt * rt / 100;
      const postTax = amt + tax;
      setOutput(JSON.stringify({ taxAmount: tax.toFixed(2), preTaxAmount: amt.toFixed(2), postTaxAmount: postTax.toFixed(2) }));
    } else {
      const preTax = amt / (1 + rt / 100);
      const tax = amt - preTax;
      setOutput(JSON.stringify({ taxAmount: tax.toFixed(2), preTaxAmount: preTax.toFixed(2), postTaxAmount: amt.toFixed(2) }));
    }
  }, []);

  const handleAmount = (v: string) => { setAmount(v); calculate(v, rate, mode); };
  const handleRate = (v: string) => { setRate(v); calculate(amount, v, mode); };
  const handleMode = (m: 'inclusive' | 'exclusive') => { setMode(m); calculate(amount, rate, m); };

  let result: any = null;
  try { if (output) result = JSON.parse(output); } catch {}

  return (
    <ToolLayout
      toolId="fin-tax"
      title="税金税率计算器"
      description="计算各类税金的应缴税额，支持含税价和不含税价两种模式"
      inputValue=""
      onInputChange={() => {}}
      outputValue={output ? '' : ''}
      inputPlaceholder=""
    >
      <div style={sectionStyle}>
        <div style={labelStyle}>金额</div>
        <input style={{ ...inputStyle, maxWidth: 300 }} value={amount} onChange={e => handleAmount(e.target.value)} placeholder="输入金额" type="number" step="0.01" />
      </div>
      <div style={sectionStyle}>
        <div style={labelStyle}>税率 (%)</div>
        <input style={{ ...inputStyle, maxWidth: 150 }} value={rate} onChange={e => handleRate(e.target.value)} placeholder="税率" type="number" step="0.01" />
      </div>
      <div style={sectionStyle}>
        <div style={labelStyle}>计算模式</div>
        <div style={radioStyle as React.CSSProperties}>
          <label style={{ cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-sans)' }}>
            <input type="radio" checked={mode === 'exclusive'} onChange={() => handleMode('exclusive')} /> 不含税价
          </label>
          <label style={{ cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-sans)' }}>
            <input type="radio" checked={mode === 'inclusive'} onChange={() => handleMode('inclusive')} /> 含税价
          </label>
        </div>
      </div>
      {result && (
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div style={statCard}>
            <div style={statLabel}>税额</div>
            <div style={statValue}>{result.taxAmount}</div>
          </div>
          <div style={statCard}>
            <div style={statLabel}>税前金额</div>
            <div style={statValue}>{result.preTaxAmount}</div>
          </div>
          <div style={statCard}>
            <div style={statLabel}>税后金额</div>
            <div style={statValue}>{result.postTaxAmount}</div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
