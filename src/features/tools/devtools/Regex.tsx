import React, { useState, useCallback, useMemo } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: '"Fira Code", monospace', outline: 'none', width: '100%' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };
const sectionStyle: React.CSSProperties = { marginBottom: 16 };
const statCard: React.CSSProperties = { padding: '10px 16px', borderRadius: 12, border: '1px solid var(--border-light)', background: 'var(--bg-tool)', textAlign: 'center' as const, minWidth: 70 };
const statLabel: React.CSSProperties = { fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', marginBottom: 2 };
const statValue: React.CSSProperties = { fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' };
const errorStyle: React.CSSProperties = { color: 'var(--color-red)', fontSize: 12, fontFamily: 'var(--font-sans)', marginTop: 6 };

export default function Regex() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testText, setTestText] = useState('');

  const result = useMemo(() => {
    if (!pattern || !testText) return null;
    try {
      const regex = new RegExp(pattern, flags);
      const matches = [...testText.matchAll(regex)];
      return {
        count: matches.length,
        matches: matches.map((m, i) => ({
          index: i + 1,
          full: m[0],
          groups: m.length > 1 ? m.slice(1).map((g, gi) => `分组 ${gi + 1}: ${g ?? '(空)'}`) : [],
          position: m.index ?? 0,
        })),
      };
    } catch (e: any) {
      return { error: e.message };
    }
  }, [pattern, flags, testText]);

  return (
    <ToolLayout
      toolId="dev-regex"
      title="正则表达式测试"
      description="在线测试正则表达式，实时显示匹配结果和分组详情"
      inputValue=""
      onInputChange={() => {}}
      outputValue=""
      inputPlaceholder=""
    >
      <div style={sectionStyle}>
        <div style={labelStyle}>正则表达式</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <span style={{ color: 'var(--text-primary)', fontSize: 16, alignSelf: 'center' }}>/</span>
          <input
            style={{ ...inputStyle, maxWidth: 400 }}
            value={pattern}
            onChange={e => setPattern(e.target.value)}
            placeholder="输入正则表达式"
          />
          <span style={{ color: 'var(--text-primary)', fontSize: 16, alignSelf: 'center' }}>/</span>
          <input
            style={{ ...inputStyle, maxWidth: 100 }}
            value={flags}
            onChange={e => setFlags(e.target.value)}
            placeholder="标志"
          />
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle}>测试文本</div>
        <textarea
          style={{ width: '100%', minHeight: 120, padding: 12, borderRadius: 12, border: '1px solid var(--border-color)', background: 'var(--bg-tool)', color: 'var(--text-primary)', fontSize: 13, fontFamily: '"Fira Code", monospace', outline: 'none', resize: 'vertical' }}
          value={testText}
          onChange={e => setTestText(e.target.value)}
          placeholder="输入要测试的文本..."
        />
      </div>

      {result && 'error' in result && (
        <div style={errorStyle}>正则表达式错误: {result.error}</div>
      )}

      {result && 'count' in result && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
            <div style={statCard}>
              <div style={statLabel}>匹配数</div>
              <div style={statValue}>{result.count}</div>
            </div>
          </div>
          {result.matches.map((m) => (
            <div key={m.index} style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-light)', background: 'var(--bg-tool)', marginBottom: 6, fontSize: 12, fontFamily: '"Fira Code", monospace', color: 'var(--text-primary)' }}>
              <div style={{ fontWeight: 600, color: 'var(--color-blue)', marginBottom: 4 }}>
                匹配 #{m.index} (位置 {m.position})
              </div>
              <div style={{ marginBottom: 4 }}>全文: {m.full}</div>
              {m.groups.length > 0 && (
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                  {m.groups.map((g, gi) => <div key={gi}>{g}</div>)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </ToolLayout>
  );
}
