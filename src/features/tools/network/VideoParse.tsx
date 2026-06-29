import React, { useState } from 'react';

const btnPrimary: React.CSSProperties = { padding: '8px 16px', borderRadius: 10, border: '1px solid var(--color-blue)', background: 'var(--color-blue)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 2px 0 var(--border-color)', transition: 'all 150ms ease' };
const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };
const cardStyle: React.CSSProperties = { padding: '16px 20px', borderRadius: 14, border: '1px solid var(--border-light)', background: 'var(--bg-tool)' };
const noteStyle: React.CSSProperties = { marginTop: 16, padding: 12, borderRadius: 10, background: '#fff3cd', border: '1px solid #ffc107', fontSize: 12, color: '#856404', fontFamily: 'var(--font-sans)' };
const infoRow: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-light)', fontSize: 13 };

const containerStyle: React.CSSProperties = { maxWidth: 900, margin: '0 auto' };
const headerStyle: React.CSSProperties = { marginBottom: 24 };
const h1Style: React.CSSProperties = { fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', marginBottom: 8 };
const descStyle: React.CSSProperties = { fontSize: 14, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', lineHeight: 1.6 };

const mockResult = { title: '示例视频标题', duration: '12:34', resolution: '1920x1080', format: 'MP4', size: '128MB', cover: 'https://via.placeholder.com/480x270/333/fff?text=Cover', };

export default function VideoParse() {
  const [url, setUrl] = useState('');
  const [parsed, setParsed] = useState(false);

  const handleParse = () => {
    if (!url.trim()) return;
    setParsed(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter') handleParse(); };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={h1Style}>视频解析</h1>
        <p style={descStyle}>解析视频链接，提取视频信息（演示版本）</p>
      </div>
      <div style={noteStyle}>⚠️ 视频解析功能需遵守平台版权规定，仅支持公开分享链接解析。当前为演示版本。</div>
      <div style={{ marginTop: 16, marginBottom: 16 }}>
        <div style={labelStyle}>视频链接</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <input style={{ ...inputStyle, maxWidth: 400 }} placeholder="输入视频链接..." value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={handleKeyDown} />
          <button style={btnPrimary} onClick={handleParse}>解析</button>
        </div>
      </div>
      {parsed && (
        <div style={cardStyle}>
          <div style={{ ...labelStyle, marginBottom: 12 }}>解析结果（演示数据）</div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ width: 240, height: 135, borderRadius: 8, background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11 }}>
              {mockResult.cover ? <div style={{ color: '#888', fontFamily: 'var(--font-sans)' }}>封面预览</div> : '无封面'}
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={infoRow}><span style={{ color: 'var(--text-secondary)' }}>标题</span><span style={{ fontWeight: 600 }}>{mockResult.title}</span></div>
              <div style={infoRow}><span style={{ color: 'var(--text-secondary)' }}>时长</span><span>{mockResult.duration}</span></div>
              <div style={infoRow}><span style={{ color: 'var(--text-secondary)' }}>分辨率</span><span>{mockResult.resolution}</span></div>
              <div style={infoRow}><span style={{ color: 'var(--text-secondary)' }}>格式</span><span>{mockResult.format}</span></div>
              <div style={{ ...infoRow, borderBottom: 'none' }}><span style={{ color: 'var(--text-secondary)' }}>大小</span><span>{mockResult.size}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
