import React, { useState } from 'react';

const btnStyle: React.CSSProperties = { padding: '8px 16px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 2px 0 var(--border-color)', transition: 'all 150ms ease' };
const btnPrimary: React.CSSProperties = { ...btnStyle, background: 'var(--color-blue)', color: '#fff', borderColor: 'var(--color-blue)' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };
const textareaStyle: React.CSSProperties = { width: '100%', minHeight: 160, padding: 12, borderRadius: 12, border: '1px solid var(--border-color)', background: 'var(--bg-tool)', color: 'var(--text-primary)', fontSize: 13, fontFamily: '"Fira Code", var(--font-sans)', lineHeight: 1.7, resize: 'vertical', outline: 'none' };
const noteStyle: React.CSSProperties = { marginTop: 16, padding: 12, borderRadius: 10, background: '#fff3cd', border: '1px solid #ffc107', fontSize: 12, color: '#856404', fontFamily: 'var(--font-sans)' };
const errorStyle: React.CSSProperties = { color: 'var(--color-red)', fontSize: 13, marginTop: 6, fontFamily: 'var(--font-sans)' };

const containerStyle: React.CSSProperties = { maxWidth: 900, margin: '0 auto' };
const headerStyle: React.CSSProperties = { marginBottom: 24 };
const h1Style: React.CSSProperties = { fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', marginBottom: 8 };
const descStyle: React.CSSProperties = { fontSize: 14, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', lineHeight: 1.6 };

export default function BulkOpen() {
  const [input, setInput] = useState('');
  const [message, setMessage] = useState('');

  const parseUrls = (): string[] => {
    return input.split('\n').map((l) => l.trim()).filter((l) => /^https?:\/\/.+/.test(l));
  };

  const count = parseUrls().length;

  const handleOpenAll = () => {
    const urls = parseUrls();
    if (urls.length === 0) { setMessage('未找到有效URL（需要以 http:// 或 https:// 开头）'); return; }
    urls.forEach((url) => window.open(url, '_blank'));
    setMessage(`已尝试打开 ${urls.length} 个链接（浏览器可能拦截部分弹窗）`);
  };

  const handleOpenOneByOne = () => {
    const urls = parseUrls();
    if (urls.length === 0) { setMessage('未找到有效URL（需要以 http:// 或 https:// 开头）'); return; }
    setMessage(`开始逐个打开 ${urls.length} 个链接...`);
    urls.forEach((url, i) => {
      setTimeout(() => window.open(url, '_blank'), i * 500);
    });
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={h1Style}>链接批量打开</h1>
        <p style={descStyle}>粘贴多个链接（每行一个），批量在新标签页中打开</p>
      </div>
      <div style={noteStyle}>注意：浏览器可能拦截批量弹窗。如果被拦截，请检查浏览器设置允许弹窗。</div>
      <div style={{ marginTop: 16, marginBottom: 16 }}>
        <div style={labelStyle}>链接列表（每行一个）</div>
        <textarea style={textareaStyle} placeholder={`https://example.com\nhttps://example2.com\nhttps://example3.com`} value={input} onChange={(e) => { setInput(e.target.value); setMessage(''); }} />
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>有效URL数量: {count}</div>
        {message && <div style={errorStyle}>{message}</div>}
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button style={btnPrimary} onClick={handleOpenAll}>全部打开</button>
        <button style={btnStyle} onClick={handleOpenOneByOne}>逐个打开 (500ms间隔)</button>
      </div>
    </div>
  );
}
