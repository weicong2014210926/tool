import React, { useState } from 'react';
import { showToast } from '../../../components/ui/Toast';

const btnStyle: React.CSSProperties = { padding: '8px 16px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 2px 0 var(--border-color)', transition: 'all 150ms ease' };
const btnPrimary: React.CSSProperties = { ...btnStyle, background: 'var(--color-blue)', color: '#fff', borderColor: 'var(--color-blue)' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };
const tableCell: React.CSSProperties = { padding: '8px 12px', borderBottom: '1px solid var(--border-light)', fontSize: 13 };
const textareaStyle: React.CSSProperties = { width: '100%', minHeight: 160, padding: 16, borderRadius: 16, border: '1px solid var(--border-color)', background: 'var(--bg-tool)', color: 'var(--text-primary)', fontSize: 13, fontFamily: '"Fira Code", var(--font-sans)', lineHeight: 1.7, resize: 'vertical', outline: 'none' };
const thStyle: React.CSSProperties = { ...tableCell, fontWeight: 700, color: 'var(--text-secondary)', textAlign: 'left' as const, background: 'var(--bg-tool)' };

const containerStyle: React.CSSProperties = { maxWidth: 900, margin: '0 auto' };
const headerStyle: React.CSSProperties = { marginBottom: 24 };
const h1Style: React.CSSProperties = { fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', marginBottom: 8 };
const descStyle: React.CSSProperties = { fontSize: 14, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', lineHeight: 1.6 };

function suggestAlt(src: string): string {
  const parts = src.replace(/^.*[\\/]/, '').replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
  return parts;
}

export default function AltTag() {
  const [html, setHtml] = useState('');
  const [images, setImages] = useState<{ src: string; alt: string; index: number; fullTag: string }[]>([]);
  const [output, setOutput] = useState('');

  const extractImages = () => {
    const imgRegex = /<img\b[^>]*>/gi;
    const matches = html.match(imgRegex) || [];
    const srcRegex = /src\s*=\s*["']([^"']*)["']/i;
    const altRegex = /alt\s*=\s*["']([^"']*)["']/i;
    const imgs = matches.map((tag, i) => {
      const srcMatch = tag.match(srcRegex);
      const altMatch = tag.match(altRegex);
      return { src: srcMatch?.[1] || '', alt: altMatch?.[1] || '', index: i, fullTag: tag };
    });
    setImages(imgs);
    setOutput('');
  };

  const generateAlt = () => {
    const updated = images.map((img) => {
      if (img.alt) return img;
      return { ...img, alt: suggestAlt(img.src) };
    });
    setImages(updated);
    showToast('已为无alt的图片生成建议文本', 'success');
  };

  const applyAlts = () => {
    let result = html;
    images.forEach((img) => {
      const oldTag = img.fullTag;
      if (!img.alt) return;
      let newTag: string;
      if (oldTag.includes('alt=')) {
        newTag = oldTag.replace(/alt\s*=\s*["'][^"']*["']/i, `alt="${img.alt}"`);
      } else {
        newTag = oldTag.replace(/\s*\/?>$/, ` alt="${img.alt}"$&`);
        newTag = newTag.replace(` alt="${img.alt}"/?>`, ` alt="${img.alt}" />`);
        newTag = newTag.replace(` alt="${img.alt}">`, ` alt="${img.alt}">`);
      }
      result = result.replace(img.fullTag, newTag);
    });
    setOutput(result);
    showToast('已应用ALT属性', 'success');
  };

  const updateAlt = (index: number, alt: string) => {
    setImages((prev) => prev.map((img, i) => (i === index ? { ...img, alt } : img)));
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={h1Style}>图片 ALT 标签管理</h1>
        <p style={descStyle}>提取HTML中的所有图片标签，自动生成或批量修改ALT属性</p>
      </div>
      <div style={{ marginBottom: 16 }}>
        <div style={labelStyle}>HTML 代码</div>
        <textarea style={textareaStyle} placeholder="粘贴包含 &lt;img&gt; 标签的HTML代码..." value={html} onChange={(e) => setHtml(e.target.value)} />
      </div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <button style={btnPrimary} onClick={extractImages}>提取图片</button>
        <button style={btnStyle} onClick={generateAlt}>自动生成ALT</button>
        <button style={btnStyle} onClick={applyAlts} disabled={images.length === 0}>替换</button>
      </div>
      {images.length > 0 && (
        <div style={{ overflowX: 'auto', marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>共找到 {images.length} 个图片标签</div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={thStyle}>#</th>
                <th style={thStyle}>Src</th>
                <th style={thStyle}>Alt</th>
              </tr>
            </thead>
            <tbody>
              {images.map((img, i) => (
                <tr key={i}>
                  <td style={{ ...tableCell, width: 40 }}>{i + 1}</td>
                  <td style={{ ...tableCell, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{img.src}</td>
                  <td style={tableCell}>
                    <input style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, width: '100%', fontFamily: 'var(--font-sans)', outline: 'none' }}
                      value={img.alt} onChange={(e) => updateAlt(i, e.target.value)} placeholder="输入alt文本" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {output && (
        <div>
          <div style={labelStyle}>修改后的HTML</div>
          <textarea style={{ ...textareaStyle, minHeight: 120 }} value={output} readOnly />
        </div>
      )}
    </div>
  );
}
