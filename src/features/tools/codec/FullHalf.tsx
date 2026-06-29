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

function toFullWidth(text: string): string {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (code === 0x0020) {
      // space → fullwidth space
      result += String.fromCharCode(0x3000);
    } else if (code >= 0x0021 && code <= 0x007e) {
      // printable ASCII → fullwidth
      result += String.fromCharCode(code + 0xFEE0);
    } else {
      result += text[i];
    }
  }
  return result;
}

function toHalfWidth(text: string): string {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (code === 0x3000) {
      // fullwidth space → space
      result += String.fromCharCode(0x0020);
    } else if (code >= 0xFF01 && code <= 0xFF5E) {
      // fullwidth → ASCII
      result += String.fromCharCode(code - 0xFEE0);
    } else {
      result += text[i];
    }
  }
  return result;
}

export default function FullHalf() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [activeAction, setActiveAction] = useState<'full' | 'half' | null>(null);

  const handleFull = useCallback(() => {
    setActiveAction('full');
    setOutput(toFullWidth(input));
  }, [input]);

  const handleHalf = useCallback(() => {
    setActiveAction('half');
    setOutput(toHalfWidth(input));
  }, [input]);

  const handleInput = (value: string) => {
    setInput(value);
    if (activeAction) {
      if (activeAction === 'full') setOutput(toFullWidth(value));
      else setOutput(toHalfWidth(value));
    } else {
      setOutput('');
    }
  };

  const extraActions = (
    <>
      <button
        style={activeAction === 'full' ? btnActive : btnBase}
        onClick={handleFull}
      >
        转全角
      </button>
      <button
        style={activeAction === 'half' ? btnActive : btnBase}
        onClick={handleHalf}
      >
        转半角
      </button>
    </>
  );

  return (
    <ToolLayout
      toolId="codec-full-half"
      title="全角半角转换"
      description="在中文全角字符和英文半角字符之间进行格式转换，支持全角/半角空格"
      inputValue={input}
      onInputChange={handleInput}
      outputValue={output}
      inputPlaceholder="在此输入要转换的文本..."
      extraActions={extraActions}
    />
  );
}
