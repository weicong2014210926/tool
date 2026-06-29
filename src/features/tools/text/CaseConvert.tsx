import React, { useState, useCallback } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

type CaseMode = 'upper' | 'lower' | 'capitalize' | 'toggle';

const modeLabels: Record<CaseMode, string> = {
  upper: '全大写',
  lower: '全小写',
  capitalize: '首字母大写',
  toggle: '大小写反转',
};

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
  transition: 'all 150ms ease',
};

const btnActive: React.CSSProperties = {
  ...btnBase,
  background: 'var(--color-blue)',
  color: '#fff',
  borderColor: 'var(--color-blue)',
};

export default function CaseConvert() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [activeMode, setActiveMode] = useState<CaseMode | null>(null);

  const transform = useCallback((text: string, mode: CaseMode): string => {
    if (!text) return '';
    switch (mode) {
      case 'upper':
        return text.toUpperCase();
      case 'lower':
        return text.toLowerCase();
      case 'capitalize':
        return text
          .split('\n')
          .map((line) =>
            line
              .split(' ')
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
              .join(' ')
          )
          .join('\n');
      case 'toggle':
        return text
          .split('')
          .map((ch) =>
            ch === ch.toUpperCase() ? ch.toLowerCase() : ch.toUpperCase()
          )
          .join('');
      default:
        return text;
    }
  }, []);

  const handleMode = (mode: CaseMode) => {
    setActiveMode(mode);
    setOutput(transform(input, mode));
  };

  const handleInput = (value: string) => {
    setInput(value);
    if (activeMode) {
      setOutput(transform(value, activeMode));
    }
  };

  const extraActions = (
    <>
      {Object.entries(modeLabels).map(([mode, label]) => (
        <button
          key={mode}
          style={activeMode === mode ? btnActive : btnBase}
          onClick={() => handleMode(mode as CaseMode)}
        >
          {label}
        </button>
      ))}
    </>
  );

  return (
    <ToolLayout
      toolId="text-case-convert"
      title="英文字母大小写转换"
      description="支持英文文本的大写、小写、首字母大写、大小写反转等多种格式转换"
      inputValue={input}
      onInputChange={handleInput}
      outputValue={output}
      inputPlaceholder="在此输入英文文本..."
      extraActions={extraActions}
    />
  );
}
