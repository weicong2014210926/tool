import React, { useState, useCallback, useEffect } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const controlBar: React.CSSProperties = {
  display: 'flex',
  gap: 16,
  flexWrap: 'wrap',
  alignItems: 'center',
  marginBottom: 16,
  padding: '12px 16px',
  borderRadius: 12,
  background: 'var(--bg-tool)',
  border: '1px solid var(--border-light)',
};

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--text-secondary)',
  fontFamily: 'var(--font-sans)',
};

const inputStyle: React.CSSProperties = {
  padding: '6px 12px',
  borderRadius: 8,
  border: '1px solid var(--border-color)',
  background: 'var(--bg-card)',
  color: 'var(--text-primary)',
  fontSize: 13,
  fontFamily: 'var(--font-sans)',
  outline: 'none',
  width: 120,
};

const radioGroup: React.CSSProperties = {
  display: 'flex',
  gap: 12,
  alignItems: 'center',
};

const radioLabel: React.CSSProperties = {
  fontSize: 13,
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-sans)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: 4,
};

type DedupMode = 'line' | 'char';

export default function DedupSplit() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<DedupMode>('line');
  const [separator, setSeparator] = useState(',');

  const process = useCallback(
    (text: string, currentMode: DedupMode, currentSep: string) => {
      if (!text.trim()) {
        setOutput('');
        return;
      }
      let result: string;
      if (currentMode === 'line') {
        const lines = text.split('\n');
        const seen = new Set<string>();
        const unique = lines.filter((line) => {
          if (seen.has(line)) return false;
          seen.add(line);
          return true;
        });
        result = unique.join(currentSep);
      } else {
        const chars = text.replace(/\n/g, '').split('');
        const seen = new Set<string>();
        const unique = chars.filter((ch) => {
          if (seen.has(ch)) return false;
          seen.add(ch);
          return true;
        });
        result = unique.join(currentSep);
      }
      setOutput(result);
    },
    []
  );

  useEffect(() => {
    process(input, mode, separator);
  }, [input, mode, separator, process]);

  const handleInput = (value: string) => {
    setInput(value);
  };

  return (
    <ToolLayout
      toolId="text-dedup-split"
      title="文本去重分隔工具"
      description="对文本内容进行去重、分隔、合并等操作，支持按行或按字符去重并自定义分隔符"
      inputValue={input}
      onInputChange={handleInput}
      outputValue={output}
      inputPlaceholder="在此粘贴文本内容..."
    >
      <div style={controlBar}>
        <span style={labelStyle}>去重方式</span>
        <div style={radioGroup}>
          <label style={radioLabel}>
            <input
              type="radio"
              name="dedup-mode"
              checked={mode === 'line'}
              onChange={() => setMode('line')}
            />
            按行去重
          </label>
          <label style={radioLabel}>
            <input
              type="radio"
              name="dedup-mode"
              checked={mode === 'char'}
              onChange={() => setMode('char')}
            />
            按字符去重
          </label>
        </div>
        <span style={labelStyle}>分隔符</span>
        <input
          type="text"
          style={inputStyle}
          value={separator}
          onChange={(e) => setSeparator(e.target.value)}
          placeholder="输入分隔符"
        />
      </div>
    </ToolLayout>
  );
}
