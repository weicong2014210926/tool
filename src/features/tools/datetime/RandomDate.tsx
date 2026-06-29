import React, { useState } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const btnStyle: React.CSSProperties = { padding: '8px 16px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 2px 0 var(--border-color)', transition: 'all 150ms ease' };
const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };
const rowStyle: React.CSSProperties = { display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' };
const sectionStyle: React.CSSProperties = { marginBottom: 20 };
const resultItemStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-light)', background: 'var(--bg-tool)', fontSize: 13, fontFamily: '"Fira Code", monospace', color: 'var(--text-primary)', marginBottom: 4 };

export default function RandomDate() {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [count, setCount] = useState('10');
  const [showTime, setShowTime] = useState(false);
  const [output, setOutput] = useState('');
  const [dates, setDates] = useState<string[]>([]);

  const pad = (n: number) => String(n).padStart(2, '0');

  const generate = () => {
    if (!start || !end) return;
    const d1 = new Date(start).getTime();
    const d2 = new Date(end).getTime();
    if (d2 < d1) { setOutput('结束日期不能早于开始日期'); return; }

    const n = parseInt(count) || 10;
    const results: string[] = [];
    for (let i = 0; i < Math.min(n, 100); i++) {
      const ts = d1 + Math.random() * (d2 - d1);
      const d = new Date(ts);
      if (showTime) {
        results.push(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`);
      } else {
        results.push(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`);
      }
    }
    results.sort();
    setDates(results);
    setOutput(results.join('\n'));
  };

  return (
    <ToolLayout
      toolId="date-random"
      title="随机日期时间生成"
      description="在指定范围内随机生成日期或时间，适用于测试数据和模拟场景"
      hideInput
      outputValue={output}
    >
      <div style={sectionStyle}>
        <div style={labelStyle}>日期范围 & 数量</div>
        <div style={rowStyle}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>开始</div>
            <input type="date" style={inputStyle} value={start} onChange={e => setStart(e.target.value)} />
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>结束</div>
            <input type="date" style={inputStyle} value={end} onChange={e => setEnd(e.target.value)} />
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>数量</div>
            <input type="number" style={{ ...inputStyle, width: 70 }} value={count} onChange={e => setCount(e.target.value)} min={1} max={100} />
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>时间</div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', fontSize: 12, color: 'var(--text-primary)' }}>
              <input type="checkbox" checked={showTime} onChange={e => setShowTime(e.target.checked)} />
              含时间
            </label>
          </div>
          <button style={btnStyle} onClick={generate}>生成</button>
        </div>
      </div>
    </ToolLayout>
  );
}
