import React, { useState, useCallback } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };
const rowStyle: React.CSSProperties = { display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' };
const sectionStyle: React.CSSProperties = { marginBottom: 20 };
const resultStyle: React.CSSProperties = { fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', fontFamily: '"Fira Code", monospace', padding: '20px', textAlign: 'center', background: 'var(--bg-tool)', borderRadius: 14, border: '1px solid var(--border-light)' };

const units: { name: string; toKgM3: number }[] = [
  { name: 'kg/m³', toKgM3: 1 },
  { name: 'g/cm³', toKgM3: 1000 },
  { name: 'lb/ft³', toKgM3: 16.0185 },
  { name: 'lb/gal (US)', toKgM3: 119.826 },
];

export default function Density() {
  const [value, setValue] = useState('');
  const [from, setFrom] = useState('kg/m³');
  const [to, setTo] = useState('g/cm³');
  const [output, setOutput] = useState('');

  const convert = useCallback((val: string, f: string, t: string) => {
    if (!val) { setOutput(''); return; }
    const n = parseFloat(val);
    if (isNaN(n)) { setOutput('无效输入'); return; }
    const fromUnit = units.find(u => u.name === f)!;
    const toUnit = units.find(u => u.name === t)!;
    const result = (n * fromUnit.toKgM3) / toUnit.toKgM3;
    setOutput(result.toPrecision(10));
  }, []);

  return (
    <ToolLayout
      toolId="conv-density"
      title="密度单位换算"
      description="在kg/m³、g/cm³、lb/ft³等密度单位之间进行换算"
      inputValue=""
      onInputChange={() => {}}
      outputValue={output}
      inputPlaceholder=""
    >
      <div style={sectionStyle}>
        <div style={labelStyle}>输入值</div>
        <input style={{ ...inputStyle, maxWidth: 300 }} value={value} onChange={e => { setValue(e.target.value); convert(e.target.value, from, to); }} placeholder="输入数值" type="number" />
      </div>
      <div style={sectionStyle}>
        <div style={labelStyle}>从 → 到</div>
        <div style={{ ...rowStyle, alignItems: 'center' }}>
          <select style={inputStyle} value={from} onChange={e => { setFrom(e.target.value); convert(value, e.target.value, to); }}>
            {units.map(u => <option key={u.name} value={u.name}>{u.name}</option>)}
          </select>
          <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>→</span>
          <select style={inputStyle} value={to} onChange={e => { setTo(e.target.value); convert(value, from, e.target.value); }}>
            {units.map(u => <option key={u.name} value={u.name}>{u.name}</option>)}
          </select>
        </div>
      </div>
      {output && <div style={resultStyle}>{value} {from} = {output} {to}</div>}
    </ToolLayout>
  );
}
