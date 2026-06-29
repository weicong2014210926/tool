import React, { useState } from 'react';

const containerStyle: React.CSSProperties = { maxWidth: 900, margin: '0 auto' };
const headerStyle: React.CSSProperties = { marginBottom: 24 };
const pageTitle: React.CSSProperties = { fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', marginBottom: 8 };
const pageDesc: React.CSSProperties = { fontSize: 14, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', lineHeight: 1.6 };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };
const selectStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', minWidth: 120 };
const textareaStyle: React.CSSProperties = { width: '100%', minHeight: 160, padding: 16, borderRadius: 16, border: '1px solid var(--border-color)', background: 'var(--bg-tool)', color: 'var(--text-primary)', fontSize: 14, fontFamily: '"Fira Code", "Noto Sans SC", var(--font-sans)', lineHeight: 1.7, resize: 'vertical', outline: 'none', boxSizing: 'border-box' };
const noticeStyle: React.CSSProperties = { padding: 16, borderRadius: 12, background: '#fef3c7', border: '1px solid #f59e0b', color: '#92400e', fontSize: 13, fontFamily: 'var(--font-sans)', marginTop: 16, lineHeight: 1.6 };

const LANGUAGES = [
  { code: 'zh', name: '中文' },
  { code: 'en', name: 'English' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'es', name: 'Español' },
];

export default function Translate() {
  const [text, setText] = useState('');
  const [from, setFrom] = useState('zh');
  const [to, setTo] = useState('en');

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={pageTitle}>在线翻译</h1>
        <p style={pageDesc}>支持多国语言之间的在线翻译，涵盖主流语言的文本和短语翻译</p>
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 12 }}>
        <div>
          <div style={labelStyle}>源语言</div>
          <select style={selectStyle} value={from} onChange={e => setFrom(e.target.value)}>
            {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
          </select>
        </div>
        <div style={{ marginTop: 18, fontSize: 18, fontWeight: 700, color: 'var(--color-pink)' }}>→</div>
        <div>
          <div style={labelStyle}>目标语言</div>
          <select style={selectStyle} value={to} onChange={e => setTo(e.target.value)}>
            {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
          </select>
        </div>
      </div>

      <textarea
        style={textareaStyle}
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="在此输入要翻译的内容..."
      />

      <div style={noticeStyle}>
        <strong>提示：</strong>在线翻译功能需要接入翻译 API（如 Google Translate、DeepL、百度翻译等）才能实现真实的翻译功能。当前版本提供了完整的界面框架，您只需替换 API 调用部分即可使用。
        <br /><br />
        推荐方案：
        <br />1. 百度翻译开放平台 (fanyi-api.baidu.com)
        <br />2. 腾讯翻译君 (fanyi.qq.com)
        <br />3. 阿里云机器翻译
        <br />4. DeepL API (deepl.com)
      </div>
    </div>
  );
}
