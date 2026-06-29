import React, { useState, useCallback } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const btnStyle: React.CSSProperties = { padding: '8px 16px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 2px 0 var(--border-color)', transition: 'all 150ms ease' };
const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };
const rowStyle: React.CSSProperties = { display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' };
const sectionStyle: React.CSSProperties = { marginBottom: 20 };
const resultStyle: React.CSSProperties = { fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', fontFamily: '"Fira Code", monospace', padding: '20px', textAlign: 'center', background: 'var(--bg-tool)', borderRadius: 14, border: '1px solid var(--border-light)' };

const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];

// Binary (1024)
const binaryFactors: Record<string, number> = { B: 1, KB: 1024, MB: 1048576, GB: 1073741824, TB: 1099511627776, PB: 1125899906842624 };
// Decimal (1000)
const decimalFactors: Record<string, number> = { B: 1, KB: 1000, MB: 1000000, GB: 1000000000, TB: 1000000000000, PB: 1000000000000000 };

export default function Byte() {
  const [value, setValue] = useState('');
  const [from, setFrom] = useState('MB');
  const [to, setTo] = useState('GB');
  const [standard, setStandard] = useState<'binary' | 'decimal'>('binary');
  const [output, setOutput] = useState('');

  const convert = useCallback((val: string, f: string, t: string, std: string) => {
    if (!val) { setOutput(''); return; }
    const n = parseFloat(val);
    if (isNaN(n)) { setOutput('无效输入'); return; }
    const factors = std === 'binary' ? binaryFactors : decimalFactors;
    const bytes = n * factors[f];
    const result = bytes / factors[t];
    setOutput(result.toPrecision(12));
  }, []);

  const activeBtnStyle = (v: string): React.CSSProperties => ({
    ...btnStyle,
    background: standard === v ? 'var(--color-blue)' : 'var(--bg-card)',
    color: standard === v ? '#fff' : 'var(--text-primary)',
    borderColor: standard === v ? 'var(--color-blue)' : 'var(--border-color)',
  });

  return (
    <ToolLayout
      toolId="conv-byte"
      title="字节单位换算"
      description="在字节、KB、MB、GB、TB、PB等数据存储单位之间进行换算"
      hideInput
      outputValue={output}
    >
      <div style={sectionStyle}>
        <div style={labelStyle}>换算标准</div>
        <div style={rowStyle}>
          <button style={activeBtnStyle('binary')} onClick={() => { setStandard('binary'); convert(value, from, to, 'binary'); }}>二进制 (1024)</button>
          <button style={activeBtnStyle('decimal')} onClick={() => { setStandard('decimal'); convert(value, from, to, 'decimal'); }}>十进制 (1000)</button>
        </div>
      </div>
      <div style={sectionStyle}>
        <div style={labelStyle}>输入值</div>
        <input style={{ ...inputStyle, maxWidth: 300 }} value={value} onChange={e => { setValue(e.target.value); convert(e.target.value, from, to, standard); }} placeholder="输入数值" type="number" />
      </div>
      <div style={sectionStyle}>
        <div style={labelStyle}>从 → 到</div>
        <div style={{ ...rowStyle, alignItems: 'center' }}>
          <select style={inputStyle} value={from} onChange={e => { setFrom(e.target.value); convert(value, e.target.value, to, standard); }}>
            {units.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
          <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>→</span>
          <select style={inputStyle} value={to} onChange={e => { setTo(e.target.value); convert(value, from, e.target.value, standard); }}>
            {units.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
      </div>
      {output && <div style={resultStyle}>{value} {from} = {output} {to}</div>}
    </ToolLayout>
  );
}
