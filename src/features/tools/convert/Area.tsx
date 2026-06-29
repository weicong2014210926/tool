import React, { useState, useCallback } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };
const rowStyle: React.CSSProperties = { display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' };
const sectionStyle: React.CSSProperties = { marginBottom: 20 };
const resultStyle: React.CSSProperties = { fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', fontFamily: '"Fira Code", monospace', padding: '20px', textAlign: 'center', background: 'var(--bg-tool)', borderRadius: 14, border: '1px solid var(--border-light)' };

const units: { name: string; toM2: number }[] = [
  { name: '平方毫米 (mm²)', toM2: 0.000001 },
  { name: '平方厘米 (cm²)', toM2: 0.0001 },
  { name: '平方米 (m²)', toM2: 1 },
  { name: '平方千米 (km²)', toM2: 1000000 },
  { name: '公顷 (ha)', toM2: 10000 },
  { name: '亩', toM2: 666.6667 },
  { name: '平方英尺 (sq ft)', toM2: 0.092903 },
  { name: '平方码 (sq yd)', toM2: 0.836127 },
  { name: '英亩 (acre)', toM2: 4046.856 },
  { name: '平方英里 (sq mi)', toM2: 2589988 },
];

export default function Area() {
  const [value, setValue] = useState('');
  const [from, setFrom] = useState('平方米 (m²)');
  const [to, setTo] = useState('亩');
  const [output, setOutput] = useState('');

  const convert = useCallback((val: string, f: string, t: string) => {
    if (!val) { setOutput(''); return; }
    const n = parseFloat(val);
    if (isNaN(n)) { setOutput('无效输入'); return; }
    const fromUnit = units.find(u => u.name === f)!;
    const toUnit = units.find(u => u.name === t)!;
    const result = (n * fromUnit.toM2) / toUnit.toM2;
    setOutput(result.toPrecision(10));
  }, []);

  return (
    <ToolLayout
      toolId="conv-area"
      title="面积单位换算"
      description="在平方米、平方公里、公顷、亩、平方英尺等面积单位之间进行换算"
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
