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

const sampleIcp: Record<string, { number: string; company: string; type: string; date: string }> = {
  'baidu.com': { number: '京ICP证030173号-1', company: '北京百度网讯科技有限公司', type: '企业', date: '2005-03-15' },
  'qq.com': { number: '粤B2-20090059-5', company: '深圳市腾讯计算机系统有限公司', type: '企业', date: '2000-06-28' },
  'jd.com': { number: '京ICP备11041704号-2', company: '北京京东叁佰陆拾度电子商务有限公司', type: '企业', date: '2007-04-17' },
};

export default function Icp() {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState<typeof sampleIcp[string] | null>(null);

  const handleLookup = () => {
    const d = domain.trim().toLowerCase();
    const found = sampleIcp[d];
    setResult(found || null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter') handleLookup(); };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={h1Style}>ICP 备案查询</h1>
        <p style={descStyle}>查询网站工信部ICP备案信息，包括备案号、主办单位和审核日期</p>
      </div>
      <div style={noteStyle}>注意：ICP备案查询需要接入工信部API。当前为演示模式，仅支持 baidu.com / qq.com / jd.com。</div>
      <div style={{ marginTop: 16, marginBottom: 16 }}>
        <div style={labelStyle}>域名</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <input style={{ ...inputStyle, maxWidth: 300 }} placeholder="输入域名，如 baidu.com" value={domain} onChange={(e) => setDomain(e.target.value)} onKeyDown={handleKeyDown} />
          <button style={btnPrimary} onClick={handleLookup}>查询</button>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>可用示例: baidu.com, qq.com, jd.com</div>
      </div>
      {result && (
        <div style={cardStyle}>
          <div style={infoRow}><span style={{ color: 'var(--text-secondary)' }}>域名</span><span style={{ fontWeight: 600 }}>{domain}</span></div>
          <div style={infoRow}><span style={{ color: 'var(--text-secondary)' }}>备案号</span><span style={{ color: 'var(--color-blue)', fontFamily: 'var(--font-mono)' }}>{result.number}</span></div>
          <div style={infoRow}><span style={{ color: 'var(--text-secondary)' }}>主办单位</span><span>{result.company}</span></div>
          <div style={infoRow}><span style={{ color: 'var(--text-secondary)' }}>单位性质</span><span>{result.type}</span></div>
          <div style={{ ...infoRow, borderBottom: 'none' }}><span style={{ color: 'var(--text-secondary)' }}>审核日期</span><span>{result.date}</span></div>
        </div>
      )}
      {domain && !result && (
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 12 }}>未找到 {domain} 的演示数据</div>
      )}
    </div>
  );
}
