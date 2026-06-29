import React, { useState, useCallback } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const btnBase: React.CSSProperties = { padding: '8px 16px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 2px 0 var(--border-color)' };
const errorStyle: React.CSSProperties = { color: 'var(--color-red)', fontSize: 12, fontFamily: 'var(--font-sans)', marginTop: 6 };

export default function JsonEditor() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleInput = (v: string) => {
    setInput(v);
    setOutput('');
    setError('');
    setMessage('');
  };

  const format = useCallback(() => {
    if (!input.trim()) return;
    try {
      const obj = JSON.parse(input);
      setOutput(JSON.stringify(obj, null, 2));
      setError('');
      setMessage('格式化成功');
    } catch (e: any) {
      setError(`JSON 语法错误: ${e.message}`);
      setOutput('');
      setMessage('');
    }
  }, [input]);

  const validate = useCallback(() => {
    if (!input.trim()) return;
    try {
      JSON.parse(input);
      setError('');
      setMessage('JSON 格式有效');
      setOutput('');
    } catch (e: any) {
      setError(`JSON 语法错误: ${e.message}`);
      setMessage('');
      setOutput('');
    }
  }, [input]);

  const compress = useCallback(() => {
    if (!input.trim()) return;
    try {
      const obj = JSON.parse(input);
      setOutput(JSON.stringify(obj));
      setError('');
      setMessage('压缩成功');
    } catch (e: any) {
      setError(`JSON 语法错误: ${e.message}`);
      setOutput('');
      setMessage('');
    }
  }, [input]);

  const extraActions = (
    <>
      <button style={btnBase} onClick={format}>格式化</button>
      <button style={btnBase} onClick={validate}>验证</button>
      <button style={btnBase} onClick={compress}>压缩</button>
    </>
  );

  return (
    <ToolLayout
      toolId="dev-json-editor"
      title="JSON编辑器"
      description="可视化编辑和操作JSON数据，支持格式化、验证和压缩"
      inputValue={input}
      onInputChange={handleInput}
      outputValue={output}
      inputPlaceholder="在此粘贴 JSON 文本..."
      error={error}
      extraActions={extraActions}
    />
  );
}
