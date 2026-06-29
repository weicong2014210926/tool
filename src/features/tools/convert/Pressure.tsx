import React, { useState, useCallback } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };
const rowStyle: React.CSSProperties = { display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' };
const sectionStyle: React.CSSProperties = { marginBottom: 20 };
const resultStyle: React.CSSProperties = { fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', fontFamily: '"Fira Code", monospace', padding: '20px', textAlign: 'center', background: 'var(--bg-tool)', borderRadius: 14, border: '1px solid var(--border-light)' };

const units: { name: string; toPa: number }[] = [
  { name: '帕斯卡 (Pa)', toPa: 1 },
  { name: '千帕 (kPa)', toPa: 1000 },
  { name: '兆帕 (MPa)', toPa: 1000000 },
  { name: '巴 (bar)', toPa: 100000 },
  { name: '标准大气压 (atm)', toPa: 101325 },
  { name: '磅力/平方英寸 (psi)', toPa: 6894.76 },
  { name: '毫米汞柱 (mmHg)', toPa: 133.322 },
];

export default function Pressure() {
  const [value, setValue] = useState('');
  const [from, setFrom] = useState('帕斯卡 (Pa)');
  const [to, setTo] = useState('标准大气压 (atm)');
  const [output, setOutput] = useState('');

  const convert = useCallback((val: string, f: string, t: string) => {
    if (!val) { setOutput(''); return; }
    const n = parseFloat(val);
    if (isNaN(n)) { setOutput('无效输入'); return; }
    const fromUnit = units.find(u => u.name === f)!;
    const toUnit = units.find(u => u.name === t)!;
    const result = (n * fromUnit.toPa) / toUnit.toPa;
    setOutput(result.toPrecision(10));
  }, []);

  return (
    <ToolLayout
      toolId="conv-pressure"
      title="压力单位换算"
      description="在帕斯卡、巴、大气压、毫米汞柱、psi等压力单位之间进行换算"
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
      {output && <div style={resultStyle}>{value} {from.split(' ')[0]} = {output} {to.split(' ')[0]}</div>}
    </ToolLayout>
  );
}
