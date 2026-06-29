import React, { useState } from 'react';

const btnPrimary: React.CSSProperties = { padding: '8px 16px', borderRadius: 10, border: '1px solid var(--color-blue)', background: 'var(--color-blue)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 2px 0 var(--border-color)', transition: 'all 150ms ease' };
const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };
const cardStyle: React.CSSProperties = { padding: '16px 20px', borderRadius: 14, border: '1px solid var(--border-light)', background: 'var(--bg-tool)' };
const infoRow: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-light)', fontSize: 13 };

const containerStyle: React.CSSProperties = { maxWidth: 900, margin: '0 auto' };
const headerStyle: React.CSSProperties = { marginBottom: 24 };
const h1Style: React.CSSProperties = { fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', marginBottom: 8 };
const descStyle: React.CSSProperties = { fontSize: 14, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', lineHeight: 1.6 };

interface UAInfo {
  browser: string; browserVersion: string; os: string; deviceType: string; engine: string;
}

function parseUA(ua: string): UAInfo {
  let browser = 'Unknown', browserVersion = '', os = 'Unknown', deviceType = 'Desktop', engine = 'Unknown';

  // Browser detection
  if (ua.includes('Edg/')) { browser = 'Edge'; browserVersion = ua.match(/Edg\/([\d.]+)/)?.[1] || ''; }
  else if (ua.includes('Chrome/')) { browser = 'Chrome'; browserVersion = ua.match(/Chrome\/([\d.]+)/)?.[1] || ''; }
  if (ua.includes('Firefox/')) { browser = 'Firefox'; browserVersion = ua.match(/Firefox\/([\d.]+)/)?.[1] || ''; }
  if (ua.includes('Safari/') && !ua.includes('Chrome/')) { browser = 'Safari'; browserVersion = ua.match(/Version\/([\d.]+)/)?.[1] || ''; }

  // OS detection
  if (ua.includes('Windows NT 10')) os = 'Windows 10/11';
  else if (ua.includes('Windows NT 6.3')) os = 'Windows 8.1';
  else if (ua.includes('Mac OS X')) { os = 'macOS'; const m = ua.match(/Mac OS X ([_\d]+)/); if (m) os += ' ' + m[1].replace(/_/g, '.'); }
  if (ua.includes('Linux') && !ua.includes('Android')) os = 'Linux';
  if (ua.includes('Android')) { os = 'Android'; deviceType = 'Mobile'; const m = ua.match(/Android ([\d.]+)/); if (m) os += ' ' + m[1]; }
  if (ua.includes('iPhone') || ua.includes('iPad')) { os = 'iOS'; deviceType = ua.includes('iPad') ? 'Tablet' : 'Mobile'; }
  if (ua.includes('CrOS')) os = 'Chrome OS';

  // Engine
  if (ua.includes('WebKit/')) { engine = 'WebKit'; if (ua.includes('Blink')) engine = 'Blink'; }
  if (ua.includes('Gecko/')) engine = 'Gecko';

  return { browser, browserVersion, os, deviceType, engine };
}

export default function UserAgent() {
  const [customUA, setCustomUA] = useState('');
  const [parsed, setParsed] = useState<UAInfo | null>(null);

  const currentUA = navigator.userAgent;
  const currentInfo = parseUA(currentUA);

  const handleParse = () => {
    if (!customUA.trim()) return;
    setParsed(parseUA(customUA.trim()));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter') handleParse(); };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={h1Style}>User-Agent 解析</h1>
        <p style={descStyle}>查看当前浏览器的User-Agent信息，解析浏览器、操作系统、设备类型，支持自定义UA解析</p>
      </div>
      <div style={cardStyle}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>当前浏览器 UA</div>
        <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', wordBreak: 'break-all', lineHeight: 1.5, marginBottom: 12 }}>{currentUA}</div>
        <div style={infoRow}><span style={{ color: 'var(--text-secondary)' }}>浏览器</span><span style={{ fontWeight: 600 }}>{currentInfo.browser} {currentInfo.browserVersion}</span></div>
        <div style={infoRow}><span style={{ color: 'var(--text-secondary)' }}>操作系统</span><span>{currentInfo.os}</span></div>
        <div style={infoRow}><span style={{ color: 'var(--text-secondary)' }}>设备类型</span><span>{currentInfo.deviceType}</span></div>
        <div style={{ ...infoRow, borderBottom: 'none' }}><span style={{ color: 'var(--text-secondary)' }}>渲染引擎</span><span>{currentInfo.engine}</span></div>
      </div>
      <div style={{ marginTop: 24 }}>
        <div style={labelStyle}>解析自定义 User-Agent</div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
          <input style={inputStyle} placeholder="粘贴User-Agent字符串..." value={customUA} onChange={(e) => setCustomUA(e.target.value)} onKeyDown={handleKeyDown} />
          <button style={btnPrimary} onClick={handleParse}>解析</button>
        </div>
      </div>
      {parsed && (
        <div style={{ ...cardStyle, marginTop: 16 }}>
          <div style={infoRow}><span style={{ color: 'var(--text-secondary)' }}>浏览器</span><span style={{ fontWeight: 600 }}>{parsed.browser} {parsed.browserVersion}</span></div>
          <div style={infoRow}><span style={{ color: 'var(--text-secondary)' }}>操作系统</span><span>{parsed.os}</span></div>
          <div style={infoRow}><span style={{ color: 'var(--text-secondary)' }}>设备类型</span><span>{parsed.deviceType}</span></div>
          <div style={{ ...infoRow, borderBottom: 'none' }}><span style={{ color: 'var(--text-secondary)' }}>渲染引擎</span><span>{parsed.engine}</span></div>
        </div>
      )}
    </div>
  );
}
