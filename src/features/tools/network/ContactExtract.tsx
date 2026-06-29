import React, { useState } from 'react';
import { showToast } from '../../../components/ui/Toast';

const btnPrimary: React.CSSProperties = { padding: '8px 16px', borderRadius: 10, border: '1px solid var(--color-blue)', background: 'var(--color-blue)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 2px 0 var(--border-color)', transition: 'all 150ms ease' };
const btnStyle: React.CSSProperties = { padding: '8px 16px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 2px 0 var(--border-color)', transition: 'all 150ms ease' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };
const cardStyle: React.CSSProperties = { padding: '16px 20px', borderRadius: 14, border: '1px solid var(--border-light)', background: 'var(--bg-tool)' };
const textareaStyle: React.CSSProperties = { width: '100%', minHeight: 160, padding: 12, borderRadius: 12, border: '1px solid var(--border-color)', background: 'var(--bg-tool)', color: 'var(--text-primary)', fontSize: 13, fontFamily: '"Fira Code", var(--font-sans)', lineHeight: 1.7, resize: 'vertical', outline: 'none' };
const sectionTitle: React.CSSProperties = { fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, marginTop: 16 };
const itemChip: React.CSSProperties = { padding: '6px 10px', borderRadius: 8, background: 'var(--bg-primary)', border: '1px solid var(--border-light)', fontSize: 12, fontFamily: 'var(--font-mono)', cursor: 'pointer' };

const containerStyle: React.CSSProperties = { maxWidth: 900, margin: '0 auto' };
const headerStyle: React.CSSProperties = { marginBottom: 24 };
const h1Style: React.CSSProperties = { fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', marginBottom: 8 };
const descStyle: React.CSSProperties = { fontSize: 14, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', lineHeight: 1.6 };

const mobileRegex = /1[3-9]\d{9}/g;
const landlineRegex = /0\d{2,3}-?\d{7,8}/g;
const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const urlRegex = /https?:\/\/[^\s<>"']+/g;

export default function ContactExtract() {
  const [input, setInput] = useState('');
  const [phones, setPhones] = useState<string[]>([]);
  const [landlines, setLandlines] = useState<string[]>([]);
  const [emails, setEmails] = useState<string[]>([]);
  const [urls, setUrls] = useState<string[]>([]);

  const handleExtract = () => {
    const text = input.trim();
    if (!text) return;
    setPhones([...new Set(text.match(mobileRegex) || [])]);
    setLandlines([...new Set(text.match(landlineRegex) || [])]);
    setEmails([...new Set(text.match(emailRegex) || [])]);
    setUrls([...new Set(text.match(urlRegex) || [])]);
  };

  const handleCopy = async (text: string) => {
    try { await navigator.clipboard.writeText(text); showToast('已复制', 'success'); } catch { showToast('复制失败', 'error'); }
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={h1Style}>联系方式提取</h1>
        <p style={descStyle}>从文本中自动提取手机号码、座机号码、邮箱地址和URL链接</p>
      </div>
      <div style={{ marginBottom: 16 }}>
        <div style={labelStyle}>文本内容</div>
        <textarea style={textareaStyle} placeholder="粘贴包含联系方式的文本..." value={input} onChange={(e) => setInput(e.target.value)} />
      </div>
      <button style={btnPrimary} onClick={handleExtract}>提取</button>
      {(phones.length > 0 || landlines.length > 0 || emails.length > 0 || urls.length > 0) && (
        <div style={{ marginTop: 16 }}>
          {phones.length > 0 && (
            <div>
              <div style={sectionTitle}>手机号码 ({phones.length})</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {phones.map((p, i) => (
                  <span key={i} style={itemChip} onClick={() => handleCopy(p)} title="点击复制">{p}</span>
                ))}
              </div>
            </div>
          )}
          {landlines.length > 0 && (
            <div>
              <div style={sectionTitle}>座机号码 ({landlines.length})</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {landlines.map((p, i) => (
                  <span key={i} style={itemChip} onClick={() => handleCopy(p)} title="点击复制">{p}</span>
                ))}
              </div>
            </div>
          )}
          {emails.length > 0 && (
            <div>
              <div style={sectionTitle}>邮箱地址 ({emails.length})</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {emails.map((e, i) => (
                  <span key={i} style={itemChip} onClick={() => handleCopy(e)} title="点击复制">{e}</span>
                ))}
              </div>
            </div>
          )}
          {urls.length > 0 && (
            <div>
              <div style={sectionTitle}>URL 链接 ({urls.length})</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {urls.map((u, i) => (
                  <span key={i} style={itemChip} onClick={() => handleCopy(u)} title="点击复制">{u}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
