import React, { useState } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const btnStyle: React.CSSProperties = { padding: '8px 16px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 2px 0 var(--border-color)', transition: 'all 150ms ease' };
const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };
const rowStyle: React.CSSProperties = { display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' };
const sectionStyle: React.CSSProperties = { marginBottom: 20 };

export default function Timestamp() {
  const [tsInput, setTsInput] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [output, setOutput] = useState('');
  const [tsUnit, setTsUnit] = useState('auto');

  const pad = (n: number) => String(n).padStart(2, '0');

  const fmtDate = (d: Date) => {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };

  const tsToDate = () => {
    if (!tsInput.trim()) return;
    let ts = parseInt(tsInput);
    if (isNaN(ts)) { setOutput('无效的时间戳'); return; }
    if (tsUnit === 'auto') {
      ts = ts > 9999999999999 ? ts : ts > 9999999999 ? ts : ts * 1000;
    } else if (tsUnit === 'sec') {
      ts = ts * 1000;
    }
    const d = new Date(ts);
    setOutput(
      `本地:  ${fmtDate(d)}\n` +
      `UTC:   ${d.toUTCString()}\n` +
      `ISO:   ${d.toISOString()}\n` +
      `时间戳(秒): ${Math.floor(d.getTime() / 1000)}\n` +
      `时间戳(毫秒): ${d.getTime()}`
    );
  };

  const dateToTs = () => {
    if (!dateInput) return;
    const d = new Date(dateInput);
    setOutput(
      `时间戳(秒): ${Math.floor(d.getTime() / 1000)}\n` +
      `时间戳(毫秒): ${d.getTime()}`
    );
  };

  const now = () => {
    const ts = Date.now();
    setTsInput(String(ts));
    const d = new Date(ts);
    setOutput(
      `本地:  ${fmtDate(d)}\n` +
      `UTC:   ${d.toUTCString()}\n` +
      `ISO:   ${d.toISOString()}\n` +
      `时间戳(秒): ${Math.floor(ts / 1000)}\n` +
      `时间戳(毫秒): ${ts}`
    );
  };

  return (
    <ToolLayout
      toolId="date-timestamp"
      title="时间戳转换"
      description="在Unix时间戳和可读日期时间格式之间进行相互转换"
      inputValue=""
      onInputChange={() => {}}
      outputValue={output}
      inputPlaceholder=""
    >
      {/* Timestamp to Date */}
      <div style={sectionStyle}>
        <div style={labelStyle}>时间戳 → 日期</div>
        <div style={rowStyle}>
          <input type="number" style={{ ...inputStyle, maxWidth: 260 }} value={tsInput} onChange={e => setTsInput(e.target.value)} placeholder="输入时间戳" />
          <select style={inputStyle} value={tsUnit} onChange={e => setTsUnit(e.target.value)}>
            <option value="auto">自动检测</option>
            <option value="sec">秒(10位)</option>
            <option value="ms">毫秒(13位)</option>
          </select>
          <button style={btnStyle} onClick={tsToDate}>转换</button>
          <button style={btnStyle} onClick={now}>现在</button>
        </div>
      </div>

      {/* Date to Timestamp */}
      <div style={sectionStyle}>
        <div style={labelStyle}>日期 → 时间戳</div>
        <div style={rowStyle}>
          <input type="datetime-local" style={{ ...inputStyle, maxWidth: 300 }} value={dateInput} onChange={e => setDateInput(e.target.value)} />
          <button style={btnStyle} onClick={dateToTs}>转换</button>
        </div>
      </div>
    </ToolLayout>
  );
}
