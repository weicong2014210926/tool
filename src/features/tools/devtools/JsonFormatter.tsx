import React, { useState, useCallback } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const btnBase: React.CSSProperties = { padding: '8px 16px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 2px 0 var(--border-color)' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };
const errorStyle: React.CSSProperties = { color: 'var(--color-red)', fontSize: 12, fontFamily: 'var(--font-sans)', marginTop: 6 };

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState(2);

  const handleInput = (v: string) => {
    setInput(v);
    setOutput('');
    setError('');
  };

  const format = useCallback(() => {
    if (!input.trim()) return;
    try {
      const obj = JSON.parse(input);
      setOutput(JSON.stringify(obj, null, indent));
      setError('');
    } catch (e: any) {
      setError(`JSON 语法错误: ${e.message}`);
      setOutput('');
    }
  }, [input, indent]);

  const clear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const extraActions = (
    <>
      <button style={btnBase} onClick={format}>格式化</button>
      <button style={btnBase} onClick={clear}>清空</button>
    </>
  );

  return (
    <ToolLayout
      toolId="dev-json-formatter"
      title="JSON代码格式化"
      description="格式化JSON字符串，支持2或4空格缩进"
      inputValue={input}
      onInputChange={handleInput}
      outputValue={output}
      inputPlaceholder="在此粘贴 JSON 文本..."
      error={error}
      extraActions={extraActions}
    >
      <div style={{ marginBottom: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={labelStyle}>缩进: </span>
        <button
          style={{ ...btnBase, ...(indent === 2 ? { background: 'var(--color-blue)', color: '#fff', borderColor: 'var(--color-blue)' } : {}) }}
          onClick={() => setIndent(2)}
        >2空格</button>
        <button
          style={{ ...btnBase, ...(indent === 4 ? { background: 'var(--color-blue)', color: '#fff', borderColor: 'var(--color-blue)' } : {}) }}
          onClick={() => setIndent(4)}
        >4空格</button>
      </div>
    </ToolLayout>
  );
}
