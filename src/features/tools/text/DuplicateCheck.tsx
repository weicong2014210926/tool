import React, { useState, useCallback } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const dualLayout: React.CSSProperties = {
  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16,
  marginBottom: 16,
};

const textareaStyle: React.CSSProperties = {
  width: '100%', minHeight: 140, padding: 12, borderRadius: 12,
  border: '1px solid var(--border-color)', background: 'var(--bg-tool)',
  color: 'var(--text-primary)', fontSize: 13, fontFamily: '"Fira Code", var(--font-sans)',
  lineHeight: 1.6, resize: 'vertical', outline: 'none',
};

const btnStyle: React.CSSProperties = {
  padding: '8px 20px', borderRadius: 12, border: '1px solid var(--border-color)',
  background: 'var(--color-blue)', color: '#fff', fontSize: 13, fontWeight: 600,
  fontFamily: 'var(--font-sans)', cursor: 'pointer',
  boxShadow: '0 2px 0 #6a7fd0', transition: 'all 150ms ease',
};

const resultCard: React.CSSProperties = {
  padding: '16px', borderRadius: 12, background: 'var(--bg-tool)',
  border: '1px solid var(--border-light)', marginBottom: 16,
};

const resultTitle: React.CSSProperties = {
  fontSize: 18, fontWeight: 800, color: 'var(--color-blue)',
  fontFamily: 'var(--font-sans)', marginBottom: 4,
};

const resultDesc: React.CSSProperties = {
  fontSize: 13, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)',
};

const highlightBox: React.CSSProperties = {
  padding: '12px 16px', borderRadius: 8, background: 'var(--bg-card)',
  border: '1px solid var(--border-light)', fontSize: 13,
  fontFamily: '"Fira Code", var(--font-sans)', maxHeight: 300,
  overflow: 'auto', whiteSpace: 'pre-wrap', color: 'var(--text-primary)',
  lineHeight: 1.7,
};

const labelStyle: React.CSSProperties = {
  fontSize: 12, fontWeight: 700, color: 'var(--text-muted)',
  fontFamily: 'var(--font-sans)', marginBottom: 6,
  textTransform: 'uppercase',
};

export default function DuplicateCheck() {
  const [textA, setTextA] = useState('');
  const [textB, setTextB] = useState('');
  const [overlap, setOverlap] = useState<number | null>(null);
  const [commonLines, setCommonLines] = useState<string[]>([]);
  const [compared, setCompared] = useState(false);

  const compare = useCallback(() => {
    const linesA = textA.split('\n').map((l) => l.trim()).filter(Boolean);
    const linesB = textB.split('\n').map((l) => l.trim()).filter(Boolean);
    const setB = new Set(linesB);
    const common = linesA.filter((l) => setB.has(l));
    const pct = linesA.length > 0 ? (common.length / linesA.length) * 100 : 0;
    setOverlap(Math.round(pct * 10) / 10);
    setCommonLines(common);
    setCompared(true);
  }, [textA, textB]);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={resultTitle}>内容重复率检测</div>
      <div style={resultDesc}>比较两段文本中相同行的重叠率</div>
      <div style={{ height: 24 }} />
      <div style={dualLayout}>
        <div>
          <div style={labelStyle}>文本 A</div>
          <textarea style={textareaStyle} value={textA}
            onChange={(e) => setTextA(e.target.value)}
            placeholder="粘贴文本 A..." />
        </div>
        <div>
          <div style={labelStyle}>文本 B</div>
          <textarea style={textareaStyle} value={textB}
            onChange={(e) => setTextB(e.target.value)}
            placeholder="粘贴文本 B..." />
        </div>
      </div>
      <button style={btnStyle} onClick={compare}>
        比对
      </button>
      {compared && overlap !== null && (
        <div style={{ marginTop: 20 }}>
          <div style={resultCard}>
            <div style={resultTitle}>
              {overlap >= 80 ? '\u{1F534} ' : overlap >= 50 ? '\u{1F7E1} ' : '\u{1F7E2} '}
              重复率: {overlap}%
            </div>
            <div style={resultDesc}>
              文本 A 共 {textA.split('\n').filter((l) => l.trim()).length} 行，
              其中 {commonLines.length} 行在文本 B 中也存在
            </div>
          </div>
          {commonLines.length > 0 && (
            <div>
              <div style={{ ...labelStyle, marginTop: 16 }}>共同行 ({commonLines.length})</div>
              <div style={highlightBox}>
                {commonLines.map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
