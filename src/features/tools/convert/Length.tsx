import React, { useState, useCallback } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };
const rowStyle: React.CSSProperties = { display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' };
const sectionStyle: React.CSSProperties = { marginBottom: 20 };
const resultStyle: React.CSSProperties = { fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', fontFamily: '"Fira Code", monospace', padding: '20px', textAlign: 'center', background: 'var(--bg-tool)', borderRadius: 14, border: '1px solid var(--border-light)' };
const formulaStyle: React.CSSProperties = { fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', marginTop: 8, textAlign: 'center' };

interface Unit { name: string; toBase: number; }

const units: Unit[] = [
  { name: '毫米 (mm)', toBase: 0.001 },
  { name: '厘米 (cm)', toBase: 0.01 },
  { name: '米 (m)', toBase: 1 },
  { name: '千米 (km)', toBase: 1000 },
  { name: '英寸 (inch)', toBase: 0.0254 },
  { name: '英尺 (foot)', toBase: 0.3048 },
  { name: '码 (yard)', toBase: 0.9144 },
  { name: '英里 (mile)', toBase: 1609.344 },
];

export default function Length() {
  const [value, setValue] = useState('');
  const [from, setFrom] = useState('米 (m)');
  const [to, setTo] = useState('英尺 (foot)');
  const [output, setOutput] = useState('');
  const [formula, setFormula] = useState('');

  const convert = useCallback((val: string, f: string, t: string) => {
    if (!val) { setOutput(''); setFormula(''); return; }
    const n = parseFloat(val);
    if (isNaN(n)) { setOutput('无效输入'); return; }

    const fromUnit = units.find(u => u.name === f)!;
    const toUnit = units.find(u => u.name === t)!;
    const inMeters = n * fromUnit.toBase;
    const result = inMeters / toUnit.toBase;

    setOutput(result.toPrecision(10));
    setFormula(`1 ${f.split(' ')[0]} = ${(fromUnit.toBase / toUnit.toBase).toPrecision(6)} ${t.split(' ')[0]}`);
  }, []);

  const handleVal = (v: string) => { setValue(v); convert(v, from, to); };
  const handleFrom = (v: string) => { setFrom(v); convert(value, v, to); };
  const handleTo = (v: string) => { setTo(v); convert(value, from, v); };

  return (
    <ToolLayout
      toolId="conv-length"
      title="长度单位换算"
      description="在米、千米、英里、英尺、英寸等常见长度单位之间进行换算"
      inputValue=""
      onInputChange={() => {}}
      outputValue={output}
      inputPlaceholder=""
    >
      <div style={sectionStyle}>
        <div style={labelStyle}>输入值</div>
        <input style={{ ...inputStyle, maxWidth: 300 }} value={value} onChange={e => handleVal(e.target.value)} placeholder="输入数值" type="number" />
      </div>
      <div style={sectionStyle}>
        <div style={labelStyle}>从 → 到</div>
        <div style={{ ...rowStyle, alignItems: 'center' }}>
          <select style={inputStyle} value={from} onChange={e => handleFrom(e.target.value)}>
            {units.map(u => <option key={u.name} value={u.name}>{u.name}</option>)}
          </select>
          <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>→</span>
          <select style={inputStyle} value={to} onChange={e => handleTo(e.target.value)}>
            {units.map(u => <option key={u.name} value={u.name}>{u.name}</option>)}
          </select>
        </div>
      </div>
      {output && <div style={resultStyle}>{value} {from.split(' ')[0]} = {output} {to.split(' ')[0]}</div>}
      {formula && <div style={formulaStyle}>换算公式: {formula}</div>}
    </ToolLayout>
  );
}
