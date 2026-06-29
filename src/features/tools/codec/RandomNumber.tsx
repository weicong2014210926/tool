import React, { useState, useCallback } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: 'var(--text-secondary)',
  marginBottom: 6,
  fontFamily: 'var(--font-sans)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const inputStyle: React.CSSProperties = {
  padding: '8px 12px',
  borderRadius: 10,
  border: '1px solid var(--border-color)',
  background: 'var(--bg-primary)',
  color: 'var(--text-primary)',
  fontSize: 13,
  fontFamily: 'var(--font-sans)',
  outline: 'none',
  width: 100,
};

const checkboxLabel: React.CSSProperties = {
  fontSize: 13,
  fontFamily: 'var(--font-sans)',
  color: 'var(--text-primary)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: 4,
};

const btnPrimary: React.CSSProperties = {
  padding: '8px 20px',
  borderRadius: 12,
  border: '1px solid var(--color-blue)',
  background: 'var(--color-blue)',
  color: '#fff',
  fontSize: 13,
  fontWeight: 600,
  fontFamily: 'var(--font-sans)',
  cursor: 'pointer',
  boxShadow: '0 2px 0 #6a7fd0',
  transition: 'all var(--transition-fast)',
  display: 'flex',
  alignItems: 'center',
  gap: 6,
};

const controlRow: React.CSSProperties = {
  display: 'flex',
  gap: 16,
  flexWrap: 'wrap',
  marginBottom: 12,
  alignItems: 'flex-end',
};

const controlCol: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
};

function getRandomInt(min: number, max: number): number {
  const range = max - min + 1;
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return min + (buf[0] % range);
}

function generateNumbers(min: number, max: number, count: number, unique: boolean): string {
  if (min > max) return '';
  const clampedCount = Math.min(count, unique ? (max - min + 1) : count);

  if (unique && clampedCount >= max - min + 1) {
    // Generate all numbers in range and shuffle
    const arr: number[] = [];
    for (let i = min; i <= max; i++) arr.push(i);
    // Fisher-Yates shuffle
    for (let i = arr.length - 1; i > 0; i--) {
      const j = getRandomInt(0, i);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.slice(0, clampedCount).join('\n');
  }

  const result: number[] = [];
  if (unique) {
    const seen = new Set<number>();
    while (result.length < clampedCount) {
      const n = getRandomInt(min, max);
      if (!seen.has(n)) {
        seen.add(n);
        result.push(n);
      }
    }
  } else {
    for (let i = 0; i < clampedCount; i++) {
      result.push(getRandomInt(min, max));
    }
  }

  return result.join('\n');
}

export default function RandomNumber() {
  const [output, setOutput] = useState('');
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(10);
  const [unique, setUnique] = useState(false);

  const handleGenerate = useCallback(() => {
    if (min > max) {
      setOutput('最小值不能大于最大值');
      return;
    }
    const result = generateNumbers(min, max, count, unique);
    setOutput(result);
  }, [min, max, count, unique]);

  const controls = (
    <div>
      <div style={labelStyle}>随机数设置</div>
      <div style={controlRow}>
        <div style={controlCol}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>最小值</span>
          <input
            style={inputStyle}
            type="number"
            value={min}
            onChange={(e) => setMin(parseInt(e.target.value) || 0)}
          />
        </div>
        <div style={controlCol}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>最大值</span>
          <input
            style={inputStyle}
            type="number"
            value={max}
            onChange={(e) => setMax(parseInt(e.target.value) || 0)}
          />
        </div>
        <div style={controlCol}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>生成数量</span>
          <input
            style={{ ...inputStyle, width: 80 }}
            type="number"
            min={1}
            max={10000}
            value={count}
            onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
          />
        </div>
        <div style={{ ...controlCol, justifyContent: 'flex-end' }}>
          <label style={checkboxLabel}>
            <input type="checkbox" checked={unique} onChange={(e) => setUnique(e.target.checked)}
              style={{ accentColor: 'var(--color-blue)' }} />
            数字不重复
          </label>
        </div>
      </div>
      <button style={btnPrimary} onClick={handleGenerate}>
        生成
      </button>
    </div>
  );

  return (
    <ToolLayout
      toolId="codec-random-number"
      title="随机数生成器"
      description="在指定范围内生成随机整数，支持批量生成和去重选项，使用 crypto.getRandomValues 确保随机性"
      inputValue=""
      onInputChange={() => {}}
      outputValue={output}
      children={controls}
    />
  );
}
