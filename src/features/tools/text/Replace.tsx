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

const inputField: React.CSSProperties = {
  padding: '6px 12px',
  borderRadius: 8,
  border: '1px solid var(--border-color)',
  background: 'var(--bg-card)',
  color: 'var(--text-primary)',
  fontSize: 13,
  fontFamily: '"Fira Code", var(--font-sans)',
  outline: 'none',
  minWidth: 160,
};

const checkboxLabel: React.CSSProperties = {
  fontSize: 13,
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-sans)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: 4,
};

const infoStyle: React.CSSProperties = {
  fontSize: 13,
  color: 'var(--text-muted)',
  fontFamily: 'var(--font-sans)',
  marginTop: 8,
};

export default function Replace() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [useRegex, setUseRegex] = useState(false);
  const [matchCount, setMatchCount] = useState(0);
  const [error, setError] = useState('');

  const doReplace = useCallback(
    (text: string) => {
      setError('');
      if (!text) {
        setOutput('');
        setMatchCount(0);
        return;
      }
      if (!findText) {
        setOutput(text);
        setMatchCount(0);
        return;
      }

      try {
        let result: string;
        let count = 0;

        if (useRegex) {
          let flags = 'g';
          if (!caseSensitive) flags += 'i';
          const regex = new RegExp(findText, flags);
          const matches = text.match(regex);
          count = matches ? matches.length : 0;
          result = text.replace(regex, replaceText);
        } else {
          if (caseSensitive) {
            const escaped = findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(escaped, 'g');
            const matches = text.match(regex);
            count = matches ? matches.length : 0;
            result = text.replace(regex, replaceText);
          } else {
            const escaped = findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(escaped, 'gi');
            const matches = text.match(regex);
            count = matches ? matches.length : 0;
            result = text.replace(regex, replaceText);
          }
        }

        setOutput(result);
        setMatchCount(count);
      } catch (e: unknown) {
        setError((e as Error).message || '正则表达式无效');
        setOutput('');
        setMatchCount(0);
      }
    },
    [findText, replaceText, caseSensitive, useRegex]
  );

  useEffect(() => {
    doReplace(input);
  }, [input, findText, replaceText, caseSensitive, useRegex, doReplace]);

  const handleInput = (value: string) => {
    setInput(value);
  };

  return (
    <ToolLayout
      toolId="text-replace"
      title="文本替换工具"
      description="支持普通替换和正则表达式替换，可批量替换文本中的内容"
      inputValue={input}
      onInputChange={handleInput}
      outputValue={output}
      inputPlaceholder="在此粘贴需要替换的文本..."
      error={error}
    >
      <div style={controlBar}>
        <input
          type="text"
          style={inputField}
          placeholder="查找..."
          value={findText}
          onChange={(e) => setFindText(e.target.value)}
        />
        <input
          type="text"
          style={inputField}
          placeholder="替换为..."
          value={replaceText}
          onChange={(e) => setReplaceText(e.target.value)}
        />
        <label style={checkboxLabel}>
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={() => setCaseSensitive(!caseSensitive)}
          />
          区分大小写
        </label>
        <label style={checkboxLabel}>
          <input
            type="checkbox"
            checked={useRegex}
            onChange={() => setUseRegex(!useRegex)}
          />
          使用正则
        </label>
      </div>
      {matchCount > 0 && (
        <div style={infoStyle}>
          共替换 <strong>{matchCount}</strong> 处匹配
        </div>
      )}
    </ToolLayout>
  );
}
