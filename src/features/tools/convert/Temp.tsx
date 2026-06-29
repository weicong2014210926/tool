import React, { useState, useCallback } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };
const rowStyle: React.CSSProperties = { display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' };
const sectionStyle: React.CSSProperties = { marginBottom: 20 };
const resultStyle: React.CSSProperties = { fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', fontFamily: '"Fira Code", monospace', padding: '20px', textAlign: 'center', background: 'var(--bg-tool)', borderRadius: 14, border: '1px solid var(--border-light)' };
const formulaStyle: React.CSSProperties = { fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', marginTop: 8, textAlign: 'center' };

const units = ['摄氏度 (°C)', '华氏度 (°F)', '开尔文 (K)'];

// Convert any to Celsius
function toCelsius(value: number, unit: string): number {
  switch (unit) {
    case '摄氏度 (°C)': return value;
    case '华氏度 (°F)': return (value - 32) * 5 / 9;
    case '开尔文 (K)': return value - 273.15;
    default: return value;
  }
}

// Convert from Celsius to target
function fromCelsius(c: number, unit: string): number {
  switch (unit) {
    case '摄氏度 (°C)': return c;
    case '华氏度 (°F)': return c * 9 / 5 + 32;
    case '开尔文 (K)': return c + 273.15;
    default: return c;
  }
}

function getFormula(from: string, to: string): string {
  if (from === to) return '相同单位无需转换';
  if (from === '摄氏度 (°C)' && to === '华氏度 (°F)') return '°F = °C × 9/5 + 32';
  if (from === '华氏度 (°F)' && to === '摄氏度 (°C)') return '°C = (°F - 32) × 5/9';
  if (from === '摄氏度 (°C)' && to === '开尔文 (K)') return 'K = °C + 273.15';
  if (from === '开尔文 (K)' && to === '摄氏度 (°C)') return '°C = K - 273.15';
  if (from === '华氏度 (°F)' && to === '开尔文 (K)') return 'K = (°F - 32) × 5/9 + 273.15';
  if (from === '开尔文 (K)' && to === '华氏度 (°F)') return '°F = (K - 273.15) × 9/5 + 32';
  return '';
}

export default function Temp() {
  const [value, setValue] = useState('');
  const [from, setFrom] = useState('摄氏度 (°C)');
  const [to, setTo] = useState('华氏度 (°F)');
  const [output, setOutput] = useState('');
  const [formula, setFormula] = useState('');

  const convert = useCallback((val: string, f: string, t: string) => {
    if (!val) { setOutput(''); setFormula(''); return; }
    const n = parseFloat(val);
    if (isNaN(n)) { setOutput('无效输入'); return; }
    const celsius = toCelsius(n, f);
    const result = fromCelsius(celsius, t);
    setOutput(result.toFixed(6));
    setFormula(getFormula(f, t));
  }, []);

  return (
    <ToolLayout
      toolId="conv-temp"
      title="温度单位换算"
      description="在摄氏度、华氏度、开尔文等温度单位之间进行换算"
      hideInput
      outputValue={output}
    >
      <div style={sectionStyle}>
        <div style={labelStyle}>输入值</div>
        <input style={{ ...inputStyle, maxWidth: 300 }} value={value} onChange={e => { setValue(e.target.value); convert(e.target.value, from, to); }} placeholder="输入温度" type="number" />
      </div>
      <div style={sectionStyle}>
        <div style={labelStyle}>从 → 到</div>
        <div style={{ ...rowStyle, alignItems: 'center' }}>
          <select style={inputStyle} value={from} onChange={e => { setFrom(e.target.value); convert(value, e.target.value, to); }}>
            {units.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
          <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>→</span>
          <select style={inputStyle} value={to} onChange={e => { setTo(e.target.value); convert(value, from, e.target.value); }}>
            {units.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
      </div>
      {output && <div style={resultStyle}>{value} {from.split(' ')[0]} = {output} {to.split(' ')[0]}</div>}
      {formula && <div style={formulaStyle}>{formula}</div>}
    </ToolLayout>
  );
}
