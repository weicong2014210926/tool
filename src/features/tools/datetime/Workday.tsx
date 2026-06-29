import React, { useState } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const btnStyle: React.CSSProperties = { padding: '8px 16px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 2px 0 var(--border-color)', transition: 'all 150ms ease' };
const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };
const rowStyle: React.CSSProperties = { display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' };
const statCard: React.CSSProperties = { padding: '16px 20px', borderRadius: 14, border: '1px solid var(--border-light)', background: 'var(--bg-tool)', textAlign: 'center', minWidth: 100 };
const sectionStyle: React.CSSProperties = { marginBottom: 20 };

export default function Workday() {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [holidaysText, setHolidaysText] = useState('');
  const [output, setOutput] = useState('');
  const [stats, setStats] = useState<{ total: number; workdays: number; weekends: number; holidays: number } | null>(null);

  const calc = () => {
    if (!start || !end) return;
    const d1 = new Date(start + 'T00:00:00');
    const d2 = new Date(end + 'T00:00:00');
    if (d2 < d1) { setOutput('结束日期不能早于开始日期'); return; }

    const holidaySet = new Set(
      holidaysText.split(/[,，\n\s]+/).filter(s => s.trim() && /^\d{4}-\d{2}-\d{2}$/.test(s.trim()))
    );

    let total = 0, workdays = 0, weekends = 0, holidays = 0;
    const cur = new Date(d1);
    while (cur <= d2) {
      total++;
      const iso = cur.toISOString().slice(0, 10);
      const dow = cur.getDay();
      if (holidaySet.has(iso)) {
        holidays++;
      } else if (dow === 0 || dow === 6) {
        weekends++;
      } else {
        workdays++;
      }
      cur.setDate(cur.getDate() + 1);
    }

    setStats({ total, workdays, weekends, holidays });
    setOutput(`总天数: ${total}\n工作日: ${workdays}\n周末: ${weekends}\n假期: ${holidays}`);
  };

  return (
    <ToolLayout
      toolId="date-workday"
      title="工作日计算器"
      description="计算两个日期之间的工作日天数，支持自定义假期排除"
      inputValue=""
      onInputChange={() => {}}
      outputValue={output}
      inputPlaceholder=""
    >
      <div style={sectionStyle}>
        <div style={labelStyle}>日期范围</div>
        <div style={rowStyle}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>开始日期</div>
            <input type="date" style={inputStyle} value={start} onChange={e => setStart(e.target.value)} />
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>结束日期</div>
            <input type="date" style={inputStyle} value={end} onChange={e => setEnd(e.target.value)} />
          </div>
          <button style={btnStyle} onClick={calc}>计算</button>
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle}>自定义假期 (可选，逗号分隔，格式: 2025-01-01)</div>
        <input
          style={{ ...inputStyle, maxWidth: 500 }}
          placeholder="2025-01-01, 2025-05-01"
          value={holidaysText}
          onChange={e => setHolidaysText(e.target.value)}
        />
      </div>

      {stats && (
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
          <div style={statCard}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>总天数</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>{stats.total}</div>
          </div>
          <div style={statCard}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>工作日</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-blue)' }}>{stats.workdays}</div>
          </div>
          <div style={statCard}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>周末</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-orange)' }}>{stats.weekends}</div>
          </div>
          <div style={statCard}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>假期</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-red)' }}>{stats.holidays}</div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}