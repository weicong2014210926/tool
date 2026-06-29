import React, { useState } from 'react';

const btnStyle: React.CSSProperties = { padding: '8px 16px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 2px 0 var(--border-color)', transition: 'all 150ms ease' };
const btnPrimary: React.CSSProperties = { ...btnStyle, background: 'var(--color-blue)', color: '#fff', borderColor: 'var(--color-blue)' };
const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };
const cardStyle: React.CSSProperties = { padding: '16px 20px', borderRadius: 14, border: '1px solid var(--border-light)', background: 'var(--bg-tool)' };
const infoRow: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-light)', fontSize: 13 };
const noteStyle: React.CSSProperties = { marginTop: 16, padding: 12, borderRadius: 10, background: 'var(--bg-tool)', border: '1px solid var(--border-light)', fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' };
const errorStyle: React.CSSProperties = { color: 'var(--color-red)', fontSize: 13, marginTop: 6, fontFamily: 'var(--font-sans)' };

const containerStyle: React.CSSProperties = { maxWidth: 900, margin: '0 auto' };
const headerStyle: React.CSSProperties = { marginBottom: 24 };
const h1Style: React.CSSProperties = { fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', marginBottom: 8 };
const descStyle: React.CSSProperties = { fontSize: 14, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', lineHeight: 1.6 };

interface IpInfo {
  ip: string; city: string; region: string; country: string;
  org: string; timezone: string;
}

export default function IpLookup() {
  const [ip, setIp] = useState('');
  const [result, setResult] = useState<IpInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchIp = async (url: string) => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('请求失败');
      const data = await res.json();
      setResult({ ip: data.ip, city: data.city || '-', region: data.region || '-', country: data.country_name || '-', org: data.org || '-', timezone: data.timezone || '-' });
    } catch {
      setError('查询失败，请检查网络或IP地址');
    }
    setLoading(false);
  };

  const handleLookup = () => {
    const val = ip.trim();
    if (!val) { setError('请输入IP地址'); return; }
    fetchIp(`https://ipapi.co/${val}/json/`);
  };

  const handleMyIp = () => fetchIp('https://ipapi.co/json/');

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter') handleLookup(); };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={h1Style}>IP 地址查询</h1>
        <p style={descStyle}>查询IP地址的地理位置、运营商、时区等信息，支持本机IP查询</p>
      </div>
      <div style={{ marginBottom: 16 }}>
        <div style={labelStyle}>IP 地址</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <input style={{ ...inputStyle, maxWidth: 300 }} placeholder="输入IP地址，如 8.8.8.8" value={ip} onChange={(e) => setIp(e.target.value)} onKeyDown={handleKeyDown} />
          <button style={btnPrimary} onClick={handleLookup} disabled={loading}>查询</button>
          <button style={btnStyle} onClick={handleMyIp} disabled={loading}>查询本机IP</button>
        </div>
        {error && <div style={errorStyle}>{error}</div>}
      </div>
      {loading && <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>查询中...</div>}
      {result && (
        <div style={cardStyle}>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-blue)', fontFamily: 'var(--font-mono)', marginBottom: 12 }}>{result.ip}</div>
          <div style={infoRow}><span style={{ color: 'var(--text-secondary)' }}>国家</span><span>{result.country}</span></div>
          <div style={infoRow}><span style={{ color: 'var(--text-secondary)' }}>地区</span><span>{result.region}</span></div>
          <div style={infoRow}><span style={{ color: 'var(--text-secondary)' }}>城市</span><span>{result.city}</span></div>
          <div style={infoRow}><span style={{ color: 'var(--text-secondary)' }}>ISP/组织</span><span>{result.org}</span></div>
          <div style={{ ...infoRow, borderBottom: 'none' }}><span style={{ color: 'var(--text-secondary)' }}>时区</span><span>{result.timezone}</span></div>
        </div>
      )}
      <div style={noteStyle}>IP查询依赖第三方API（ipapi.co），免费版有每日请求限制。</div>
    </div>
  );
}
