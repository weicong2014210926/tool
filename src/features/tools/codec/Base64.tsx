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

export default function Base64() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [activeAction, setActiveAction] = useState<'encode' | 'decode' | null>(null);

  const handleEncode = useCallback(() => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }
    setActiveAction('encode');
    try {
      const encoded = btoa(unescape(encodeURIComponent(input)));
      setOutput(encoded);
      setError('');
    } catch (e) {
      setError('编码失败，请检查输入内容');
      setOutput('');
    }
  }, [input]);

  const handleDecode = useCallback(() => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }
    setActiveAction('decode');
    try {
      const decoded = decodeURIComponent(escape(atob(input)));
      setOutput(decoded);
      setError('');
    } catch (e) {
      setError('解码失败，请检查输入是否为有效的 Base64 编码');
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
        编码
      </button>
      <button
        style={activeAction === 'decode' ? btnActive : btnBase}
        onClick={handleDecode}
      >
        解码
      </button>
    </>
  );

  return (
    <ToolLayout
      toolId="codec-base64"
      title="Base64编码解码"
      description="对文本或数据进行Base64编码和解码，支持多种字符集"
      inputValue={input}
      onInputChange={handleInput}
      outputValue={output}
      inputPlaceholder="在此输入要编码或解码的文本..."
      error={error}
      extraActions={extraActions}
    />
  );
}
