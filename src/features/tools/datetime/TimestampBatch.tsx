import React, { useState } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const btnStyle: React.CSSProperties = { padding: '8px 16px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 2px 0 var(--border-color)', transition: 'all 150ms ease' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };
const sectionStyle: React.CSSProperties = { marginBottom: 20 };
const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'var(--font-sans)' };
const thStyle: React.CSSProperties = { padding: '8px 12px', textAlign: 'left', borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)', fontWeight: 600, fontSize: 12 };
const tdStyle: React.CSSProperties = { padding: '8px 12px', borderBottom: '1px solid var(--border-light)', color: 'var(--text-primary)' };

const pad = (n: number) => String(n).padStart(2, '0');

function fmtLocal(ts: number) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function fmtUtc(ts: number) {
  const d = new Date(ts);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`;
}

export default function TimestampBatch() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [rows, setRows] = useState<{ raw: string; local: string; utc: string }[]>([]);

  const convertAll = () => {
    const lines = input.split('\n').filter(l => l.trim());
    const results = lines.map(line => {
      let ts = parseInt(line.trim());
      if (isNaN(ts)) return { raw: line.trim(), local: '无效', utc: '无效' };
      if (ts > 9999999999999) { } // already ms
      else if (ts > 9999999999) { } // already sec (10 digit)
      else if (ts > 999999999) { ts *= 1000; } // 9-digit -> ms maybe, 10-digit is common
      if (ts < 1000000000000) ts *= 1000; // assume seconds if < ~2001
      const ms = ts > 9999999999999 ? ts : ts;
      return { raw: String(ts), local: fmtLocal(ms), utc: fmtUtc(ms) };
    });
    setRows(results);
    setOutput(results.map(r => `${r.raw} | ${r.local} | ${r.utc}`).join('\n'));
  };

  return (
    <ToolLayout
      toolId="date-timestamp-batch"
      title="时间戳批量转换"
      description="批量将多个时间戳转换为日期时间"
      inputValue={input}
      onInputChange={setInput}
      outputValue={output}
      inputPlaceholder="每行一个时间戳..."
      extraActions={(
        <button style={btnStyle} onClick={convertAll}>批量转换</button>
      )}
    >
      {rows.length > 0 && (
        <div style={sectionStyle}>
          <div style={labelStyle}>转换结果</div>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>时间戳</th>
                <th style={thStyle}>本地时间</th>
                <th style={thStyle}>UTC时间</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td style={tdStyle}>{r.raw}</td>
                  <td style={tdStyle}>{r.local}</td>
                  <td style={tdStyle}>{r.utc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </ToolLayout>
  );
}
