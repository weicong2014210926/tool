import React, { useState, useCallback } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

type SortOp = 'reverse-lines' | 'reverse-chars' | 'sort-asc' | 'sort-desc' | 'sort-num';

const opLabels: Record<SortOp, string> = {
  'reverse-lines': '反转行',
  'reverse-chars': '反转字符',
  'sort-asc': '升序A-Z',
  'sort-desc': '降序Z-A',
  'sort-num': '数字排序',
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

export default function ReverseSort() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [activeOp, setActiveOp] = useState<SortOp | null>(null);

  const doOp = useCallback((text: string, op: SortOp): string => {
    if (!text) return '';
    switch (op) {
      case 'reverse-lines':
        return text.split('\n').reverse().join('\n');
      case 'reverse-chars':
        return text.split('').reverse().join('');
      case 'sort-asc':
        return text
          .split('\n')
          .sort((a, b) => a.localeCompare(b))
          .join('\n');
      case 'sort-desc':
        return text
          .split('\n')
          .sort((a, b) => b.localeCompare(a))
          .join('\n');
      case 'sort-num': {
        const lines = text.split('\n');
        const numeric: { line: string; num: number }[] = [];
        const nonNumeric: string[] = [];
        for (const line of lines) {
          const n = parseFloat(line);
          if (!isNaN(n)) {
            numeric.push({ line, num: n });
          } else {
            nonNumeric.push(line);
          }
        }
        numeric.sort((a, b) => a.num - b.num);
        return [...numeric.map((x) => x.line), ...nonNumeric].join('\n');
      }
      default:
        return text;
    }
  }, []);

  const handleOp = (op: SortOp) => {
    setActiveOp(op);
    setOutput(doOp(input, op));
  };

  const handleInput = (value: string) => {
    setInput(value);
    if (activeOp) {
      setOutput(doOp(value, activeOp));
    }
  };

  const extraActions = (
    <>
      {Object.entries(opLabels).map(([op, label]) => (
        <button
          key={op}
          style={activeOp === op ? btnActive : btnBase}
          onClick={() => handleOp(op as SortOp)}
        >
          {label}
        </button>
      ))}
    </>
  );

  return (
    <ToolLayout
      toolId="text-reverse-sort"
      title="文本反转排序工具"
      description="支持文本内容的反转、升序降序排列、数字排序等操作"
      inputValue={input}
      onInputChange={handleInput}
      outputValue={output}
      inputPlaceholder="在此粘贴文本，每行一条..."
      extraActions={extraActions}
    />
  );
}
