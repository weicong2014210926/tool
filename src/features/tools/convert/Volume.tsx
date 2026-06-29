import React, { useState, useCallback } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };
const rowStyle: React.CSSProperties = { display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' };
const sectionStyle: React.CSSProperties = { marginBottom: 20 };
const resultStyle: React.CSSProperties = { fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', fontFamily: '"Fira Code", monospace', padding: '20px', textAlign: 'center', background: 'var(--bg-tool)', borderRadius: 14, border: '1px solid var(--border-light)' };

const units: { name: string; toL: number }[] = [
  { name: '毫升 (mL)', toL: 0.001 },
  { name: '升 (L)', toL: 1 },
  { name: '立方米 (m³)', toL: 1000 },
  { name: '杯 (cup)', toL: 0.24 },
  { name: '品脱 (pint)', toL: 0.473176 },
  { name: '夸脱 (quart)', toL: 0.946353 },
  { name: '加仑 US (gal)', toL: 3.78541 },
  { name: '加仑 UK (gal)', toL: 4.54609 },
  { name: '液盎司 (fl oz)', toL: 0.0295735 },
];

export default function Volume() {
  const [value, setValue] = useState('');
  const [from, setFrom] = useState('升 (L)');
  const [to, setTo] = useState('加仑 US (gal)');
  const [output, setOutput] = useState('');

  const convert = useCallback((val: string, f: string, t: string) => {
    if (!val) { setOutput(''); return; }
    const n = parseFloat(val);
    if (isNaN(n)) { setOutput('无效输入'); return; }
    const fromUnit = units.find(u => u.name === f)!;
    const toUnit = units.find(u => u.name === t)!;
    const result = (n * fromUnit.toL) / toUnit.toL;
    setOutput(result.toPrecision(10));
  }, []);

  return (
    <ToolLayout
      toolId="conv-volume"
      title="体积单位换算"
      description="在立方米、升、毫升、加仑、品脱等体积和容积单位之间进行换算"
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
