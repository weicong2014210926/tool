import React, { useState, useEffect } from 'react';

const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%' };
const tableCell: React.CSSProperties = { padding: '8px 12px', borderBottom: '1px solid var(--border-light)', fontSize: 13 };
const cardStyle: React.CSSProperties = { padding: '16px 20px', borderRadius: 14, border: '1px solid var(--border-light)', background: 'var(--bg-tool)' };

const containerStyle: React.CSSProperties = { maxWidth: 900, margin: '0 auto' };
const headerStyle: React.CSSProperties = { marginBottom: 24 };
const h1Style: React.CSSProperties = { fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', marginBottom: 8 };
const descStyle: React.CSSProperties = { fontSize: 14, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', lineHeight: 1.6 };
const thStyle: React.CSSProperties = { ...tableCell, fontWeight: 700, color: 'var(--text-secondary)', textAlign: 'left' as const, background: 'var(--bg-tool)' };

const countries = [
  { name: '中国', code: '86', tz: 'Asia/Shanghai' },
  { name: '美国(纽约)', code: '1', tz: 'America/New_York' },
  { name: '美国(洛杉矶)', code: '1', tz: 'America/Los_Angeles' },
  { name: '英国', code: '44', tz: 'Europe/London' },
  { name: '日本', code: '81', tz: 'Asia/Tokyo' },
  { name: '韩国', code: '82', tz: 'Asia/Seoul' },
  { name: '法国', code: '33', tz: 'Europe/Paris' },
  { name: '德国', code: '49', tz: 'Europe/Berlin' },
  { name: '意大利', code: '39', tz: 'Europe/Rome' },
  { name: '俄罗斯', code: '7', tz: 'Europe/Moscow' },
  { name: '加拿大(多伦多)', code: '1', tz: 'America/Toronto' },
  { name: '加拿大(温哥华)', code: '1', tz: 'America/Vancouver' },
  { name: '澳大利亚', code: '61', tz: 'Australia/Sydney' },
  { name: '印度', code: '91', tz: 'Asia/Kolkata' },
  { name: '巴西', code: '55', tz: 'America/Sao_Paulo' },
  { name: '新加坡', code: '65', tz: 'Asia/Singapore' },
  { name: '泰国', code: '66', tz: 'Asia/Bangkok' },
  { name: '越南', code: '84', tz: 'Asia/Ho_Chi_Minh' },
  { name: '马来西亚', code: '60', tz: 'Asia/Kuala_Lumpur' },
  { name: '印度尼西亚', code: '62', tz: 'Asia/Jakarta' },
  { name: '菲律宾', code: '63', tz: 'Asia/Manila' },
  { name: '西班牙', code: '34', tz: 'Europe/Madrid' },
  { name: '荷兰', code: '31', tz: 'Europe/Amsterdam' },
  { name: '瑞典', code: '46', tz: 'Europe/Stockholm' },
  { name: '瑞士', code: '41', tz: 'Europe/Zurich' },
  { name: '土耳其', code: '90', tz: 'Europe/Istanbul' },
  { name: '沙特阿拉伯', code: '966', tz: 'Asia/Riyadh' },
  { name: '南非', code: '27', tz: 'Africa/Johannesburg' },
  { name: '墨西哥', code: '52', tz: 'America/Mexico_City' },
  { name: '新西兰', code: '64', tz: 'Pacific/Auckland' },
  { name: '阿联酋', code: '971', tz: 'Asia/Dubai' },
];

function getTimeInTz(tz: string): string {
  try {
    return new Date().toLocaleTimeString('zh-CN', { timeZone: tz, hour12: false, hour: '2-digit', minute: '2-digit' });
  } catch { return '--:--'; }
}

function getDateInTz(tz: string): string {
  try {
    return new Date().toLocaleDateString('zh-CN', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' });
  } catch { return '----/--/--'; }
}

function getTimeDiff(tz: string): string {
  try {
    const beijing = new Date().toLocaleString('en-US', { timeZone: 'Asia/Shanghai' });
    const local = new Date().toLocaleString('en-US', { timeZone: tz });
    const diffHours = Math.round((new Date(local).getTime() - new Date(beijing).getTime()) / 3600000);
    if (diffHours > 0) return `早${diffHours}小时`;
    if (diffHours < 0) return `晚${Math.abs(diffHours)}小时`;
    return '相同';
  } catch { return '--'; }
}

export default function IntlCall() {
  const [search, setSearch] = useState('');
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 10000);
    return () => clearInterval(timer);
  }, []);

  const filtered = countries.filter((c) => c.name.includes(search) || c.code.includes(search));

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={h1Style}>国际电话时区</h1>
        <p style={descStyle}>查询世界各国的国际电话区号、时区和当前时间，自动计算与北京时间的时差</p>
      </div>
      <input style={{ ...inputStyle, maxWidth: 320, marginBottom: 16 }} placeholder="搜索国家或区号..." value={search} onChange={(e) => setSearch(e.target.value)} />
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={thStyle}>国家/地区</th>
              <th style={thStyle}>区号</th>
              <th style={thStyle}>时区</th>
              <th style={thStyle}>当地时间</th>
              <th style={thStyle}>日期</th>
              <th style={thStyle}>与北京时间差</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => {
              const time = getTimeInTz(c.tz);
              const date = getDateInTz(c.tz);
              const diff = getTimeDiff(c.tz);
              return (
                <tr key={c.name}>
                  <td style={{ ...tableCell, fontWeight: 600 }}>{c.name}</td>
                  <td style={{ ...tableCell, fontFamily: 'var(--font-mono)', color: 'var(--color-blue)', fontWeight: 700 }}>+{c.code}</td>
                  <td style={{ ...tableCell, fontSize: 11 }}>{c.tz}</td>
                  <td style={{ ...tableCell, fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{time}</td>
                  <td style={tableCell}>{date}</td>
                  <td style={tableCell}>{diff}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div style={{ ...cardStyle, marginTop: 16, fontSize: 12, color: 'var(--text-muted)' }}>时间每10秒自动刷新 | 北京时间 {getTimeInTz('Asia/Shanghai')}</div>
    </div>
  );
}
