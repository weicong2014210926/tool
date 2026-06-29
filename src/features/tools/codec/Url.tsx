import React, { useState, useCallback } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const btnBase: React.CSSProperties = {
  padding: '8px 16px',
  borderRadius: 10,
  border: '1px solid var(--border-color)',
  background: 'var(--bg-card)',
  color: 'var(--text-primary)',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'var(--font-sans)',
  boxShadow: '0 2px 0 var(--border-color)',
};

const btnActive: React.CSSProperties = {
  ...btnBase,
  background: 'var(--color-blue)',
  color: '#fff',
  borderColor: 'var(--color-blue)',
};

export default function Url() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [activeAction, setActiveAction] = useState<'encode' | 'decode' | null>(null);

  const handleEncode = useCallback(() => {
    if (!input.trim()) { setOutput(''); setError(''); return; }
    setActiveAction('encode');
    try {
      setOutput(encodeURIComponent(input));
      setError('');
    } catch (e) {
      setError('URL编码失败');
      setOutput('');
    }
  }, [input]);

  const handleDecode = useCallback(() => {
    if (!input.trim()) { setOutput(''); setError(''); return; }
    setActiveAction('decode');
    try {
      setOutput(decodeURIComponent(input));
      setError('');
    } catch (e) {
      setError('URL解码失败，请检查输入是否为有效的URL编码字符串');
      setOutput('');
    }
  }, [input]);

  const handleInput = (value: string) => {
    setInput(value);
    setOutput('');
    setError('');
    setActiveAction(null);
  };

  const extraActions = (
    <>
      <button
        style={activeAction === 'encode' ? btnActive : btnBase}
        onClick={handleEncode}
      >
        URL编码
      </button>
      <button
        style={activeAction === 'decode' ? btnActive : btnBase}
        onClick={handleDecode}
      >
        URL解码
      </button>
    </>
  );

  return (
    <ToolLayout
      toolId="codec-url"
      title="URL解码编码"
      description="对URL字符串进行编码（encodeURIComponent）和解码（decodeURIComponent）操作"
      inputValue={input}
      onInputChange={handleInput}
      outputValue={output}
      inputPlaceholder="在此输入要编码或解码的URL字符串..."
      error={error}
      extraActions={extraActions}
    />
  );
}
