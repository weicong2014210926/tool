import React, { useState } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const btnStyle: React.CSSProperties = { padding: '8px 16px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 2px 0 var(--border-color)', transition: 'all 150ms ease' };
const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };
const rowStyle: React.CSSProperties = { display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' };
const statCard: React.CSSProperties = { padding: '16px 20px', borderRadius: 14, border: '1px solid var(--border-light)', background: 'var(--bg-tool)', textAlign: 'center', minWidth: 100 };
const sectionStyle: React.CSSProperties = { marginBottom: 20 };
const resultStyle: React.CSSProperties = { fontSize: 14, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' };

export default function DateCalc() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [addValue, setAddValue] = useState('');
  const [addUnit, setAddUnit] = useState('days');
  const [output, setOutput] = useState('');

  const calcDiff = () => {
    if (!startDate || !endDate) return;
    const d1 = new Date(startDate);
    const d2 = new Date(endDate);
    const diffMs = d2.getTime() - d1.getTime();
    const absMs = Math.abs(diffMs);
    const sign = diffMs < 0 ? '-' : '';
    const days = Math.floor(absMs / (1000 * 60 * 60 * 24));
    const weeks = (days / 7).toFixed(1);
    const months = (days / 30.4375).toFixed(1);
    const years = (days / 365.25).toFixed(2);
    setOutput(`${sign}${days} 天\n${sign}${weeks} 周\n${sign}${months} 个月\n${sign}${years} 年`);
  };

  const calcAdd = () => {
    if (!startDate || !addValue) return;
    const d = new Date(startDate);
    const n = parseInt(addValue);
    if (isNaN(n)) return;
    switch (addUnit) {
      case 'days': d.setDate(d.getDate() + n); break;
      case 'weeks': d.setDate(d.getDate() + n * 7); break;
      case 'months': d.setMonth(d.getMonth() + n); break;
      case 'years': d.setFullYear(d.getFullYear() + n); break;
    }
    setOutput(d.toLocaleDateString('zh-CN'));
  };

  return (
    <ToolLayout
      toolId="date-calc"
      title="日期时间计算器"
      description="计算日期间隔天数、推算未来日期等日期相关操作"
      hideInput
      outputValue={output}
    >
      {/* Date Difference */}
      <div style={sectionStyle}>
        <div style={labelStyle}>日期差计算</div>
        <div style={rowStyle}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>开始日期</div>
            <input type="date" style={inputStyle} value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>结束日期</div>
            <input type="date" style={inputStyle} value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>
          <button style={btnStyle} onClick={calcDiff}>计算差</button>
        </div>
      </div>

      {/* Date Addition */}
      <div style={{ ...sectionStyle, marginTop: 20 }}>
        <div style={labelStyle}>日期推算</div>
        <div style={rowStyle}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>基准日期</div>
            <input type="date" style={inputStyle} value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>加减数量</div>
            <input type="number" style={{ ...inputStyle, width: 80 }} value={addValue} onChange={e => setAddValue(e.target.value)} placeholder="N" />
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>单位</div>
            <select style={inputStyle} value={addUnit} onChange={e => setAddUnit(e.target.value)}>
              <option value="days">天</option>
              <option value="weeks">周</option>
              <option value="months">月</option>
              <option value="years">年</option>
            </select>
          </div>
          <button style={btnStyle} onClick={calcAdd}>推算</button>
        </div>
      </div>
    </ToolLayout>
  );
}
