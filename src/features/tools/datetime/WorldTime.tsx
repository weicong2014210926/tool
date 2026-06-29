import React, { useState, useEffect, useRef } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const cities = [
  { name: '北京', tz: 'Asia/Shanghai' },
  { name: '东京', tz: 'Asia/Tokyo' },
  { name: '首尔', tz: 'Asia/Seoul' },
  { name: '新加坡', tz: 'Asia/Singapore' },
  { name: '悉尼', tz: 'Australia/Sydney' },
  { name: '迪拜', tz: 'Asia/Dubai' },
  { name: '莫斯科', tz: 'Europe/Moscow' },
  { name: '伦敦', tz: 'Europe/London' },
  { name: '巴黎', tz: 'Europe/Paris' },
  { name: '柏林', tz: 'Europe/Berlin' },
  { name: '纽约', tz: 'America/New_York' },
  { name: '洛杉矶', tz: 'America/Los_Angeles' },
  { name: '芝加哥', tz: 'America/Chicago' },
  { name: '圣保罗', tz: 'America/Sao_Paulo' },
  { name: '新德里', tz: 'Asia/Kolkata' },
  { name: '曼谷', tz: 'Asia/Bangkok' },
];

const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'var(--font-sans)', marginTop: 8 };
const thStyle: React.CSSProperties = { padding: '10px 12px', textAlign: 'left', borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)', fontWeight: 600, fontSize: 12 };
const tdStyle: React.CSSProperties = { padding: '10px 12px', borderBottom: '1px solid var(--border-light)', color: 'var(--text-primary)' };
const sectionStyle: React.CSSProperties = { marginBottom: 20 };

function pad(n: number) { return String(n).padStart(2, '0'); }

export default function WorldTime() {
  const [now, setNow] = useState(new Date());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => setNow(new Date()), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const fmtTime = (tz: string) => {
    try {
      return now.toLocaleString('zh-CN', { timeZone: tz, hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch { return '--'; }
  };

  const getOffset = (tz: string) => {
    try {
      const lt = now.toLocaleString('en-US', { timeZone: tz, hour12: false });
      const ut = now.toLocaleString('en-US', { timeZone: 'UTC', hour12: false });
      const ld = new Date(lt);
      const ud = new Date(ut);
      const diff = (ld.getTime() - ud.getTime()) / 3600000;
      const sign = diff >= 0 ? '+' : '';
      return `UTC${sign}${diff}`;
    } catch { return '--'; }
  };

  return (
    <ToolLayout
      toolId="date-world-time"
      title="世界时间转换"
      description="查看全球各时区的当前时间"
      inputValue=""
      onInputChange={() => {}}
      outputValue=""
      inputPlaceholder=""
    >
      <div style={sectionStyle}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, fontFamily: 'var(--font-sans)' }}>
          当前时间: {now.toLocaleString('zh-CN', { hour12: false })}
        </div>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>城市</th>
              <th style={thStyle}>时区</th>
              <th style={thStyle}>当前时间</th>
              <th style={thStyle}>UTC偏移</th>
            </tr>
          </thead>
          <tbody>
            {cities.map(c => (
              <tr key={c.tz}>
                <td style={tdStyle}>{c.name}</td>
                <td style={tdStyle}>{c.tz}</td>
                <td style={tdStyle}>{fmtTime(c.tz)}</td>
                <td style={tdStyle}>{getOffset(c.tz)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ToolLayout>
  );
}
