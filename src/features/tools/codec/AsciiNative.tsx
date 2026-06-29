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

function asciiToNative(text: string): string {
  return text.replace(/\\u([0-9a-fA-F]{4})/g, (_match, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  });
}

function nativeToAscii(text: string): string {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (code > 0x7f) {
      result += '\\u' + code.toString(16).padStart(4, '0');
    } else {
      result += text[i];
    }
  }
  return result;
}

export default function AsciiNative() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [activeAction, setActiveAction] = useState<'ascii' | 'native' | null>(null);

  const handleAsciiToNative = useCallback(() => {
    setActiveAction('ascii');
    setOutput(asciiToNative(input));
  }, [input]);

  const handleNativeToAscii = useCallback(() => {
    setActiveAction('native');
    setOutput(nativeToAscii(input));
  }, [input]);

  const handleInput = (value: string) => {
    setInput(value);
    if (activeAction) {
      if (activeAction === 'ascii') setOutput(asciiToNative(value));
      else setOutput(nativeToAscii(value));
    } else {
      setOutput('');
    }
  };

  const extraActions = (
    <>
      <button
        style={activeAction === 'ascii' ? btnActive : btnBase}
        onClick={handleAsciiToNative}
      >
        ASCII → 中文
      </button>
      <button
        style={activeAction === 'native' ? btnActive : btnBase}
        onClick={handleNativeToAscii}
      >
        中文 → ASCII
      </button>
    </>
  );

  return (
    <ToolLayout
      toolId="codec-ascii-native"
      title="Ascii与Native编码转换"
      description="在ASCII码（\\uXXXX格式）和原生字符（如中文、日文）编码之间进行转换"
      inputValue={input}
      onInputChange={handleInput}
      outputValue={output}
      inputPlaceholder="输入 \\uXXXX 格式编码或原生文本..."
      extraActions={extraActions}
    />
  );
}
