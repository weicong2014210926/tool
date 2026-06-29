import React, { useState } from 'react';

const btnPrimary: React.CSSProperties = { padding: '8px 16px', borderRadius: 10, border: '1px solid var(--color-blue)', background: 'var(--color-blue)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 2px 0 var(--border-color)', transition: 'all 150ms ease' };
const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };
const cardStyle: React.CSSProperties = { padding: '16px 20px', borderRadius: 14, border: '1px solid var(--border-light)', background: 'var(--bg-tool)' };
const infoRow: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-light)', fontSize: 13 };
const noteStyle: React.CSSProperties = { marginTop: 16, padding: 12, borderRadius: 10, background: '#fff3cd', border: '1px solid #ffc107', fontSize: 12, color: '#856404', fontFamily: 'var(--font-sans)' };

const containerStyle: React.CSSProperties = { maxWidth: 900, margin: '0 auto' };
const headerStyle: React.CSSProperties = { marginBottom: 24 };
const h1Style: React.CSSProperties = { fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', marginBottom: 8 };
const descStyle: React.CSSProperties = { fontSize: 14, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', lineHeight: 1.6 };

const sampleData: Record<string, { registrar: string; createDate: string; expireDate: string; dns: string[] }> = {
  'baidu.com': { registrar: 'MarkMonitor Inc.', createDate: '1999-10-11', expireDate: '2028-10-11', dns: ['ns1.baidu.com', 'ns2.baidu.com'] },
  'qq.com': { registrar: 'MarkMonitor Inc.', createDate: '1995-05-04', expireDate: '2027-05-05', dns: ['ns1.qq.com', 'ns2.qq.com'] },
  'taobao.com': { registrar: 'Alibaba Cloud', createDate: '2003-04-21', expireDate: '2028-04-21', dns: ['ns1.taobao.com', 'ns2.taobao.com'] },
  'google.com': { registrar: 'MarkMonitor Inc.', createDate: '1997-09-15', expireDate: '2028-09-14', dns: ['ns1.google.com', 'ns2.google.com'] },
};

export default function Whois() {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState<typeof sampleData[string] | null>(null);

  const handleLookup = () => {
    const d = domain.trim().toLowerCase();
    const found = sampleData[d];
    if (found) setResult(found);
    else setResult(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter') handleLookup(); };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={h1Style}>WHOIS 域名查询</h1>
        <p style={descStyle}>查询域名的注册信息，包括注册商、创建日期、过期日期和DNS服务器</p>
      </div>
      <div style={noteStyle}>注意：WHOIS查询需要后端服务支持。当前为演示模式，仅支持 baidu.com / qq.com / taobao.com / google.com。</div>
      <div style={{ marginTop: 16, marginBottom: 16 }}>
        <div style={labelStyle}>域名</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <input style={{ ...inputStyle, maxWidth: 300 }} placeholder="输入域名，如 baidu.com" value={domain} onChange={(e) => setDomain(e.target.value)} onKeyDown={handleKeyDown} />
          <button style={btnPrimary} onClick={handleLookup}>查询</button>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>可用示例: baidu.com, qq.com, taobao.com, google.com</div>
      </div>
      {result && (
        <div style={cardStyle}>
          <div style={infoRow}><span style={{ color: 'var(--text-secondary)' }}>域名</span><span style={{ fontWeight: 600 }}>{domain}</span></div>
          <div style={infoRow}><span style={{ color: 'var(--text-secondary)' }}>注册商</span><span>{result.registrar}</span></div>
          <div style={infoRow}><span style={{ color: 'var(--text-secondary)' }}>创建日期</span><span>{result.createDate}</span></div>
          <div style={infoRow}><span style={{ color: 'var(--text-secondary)' }}>过期日期</span><span>{result.expireDate}</span></div>
          <div style={{ ...infoRow, borderBottom: 'none' }}><span style={{ color: 'var(--text-secondary)' }}>DNS服务器</span><span>{result.dns.join(', ')}</span></div>
        </div>
      )}
      {domain && !result && (
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 12 }}>未找到 {domain} 的演示数据</div>
      )}
    </div>
  );
}
