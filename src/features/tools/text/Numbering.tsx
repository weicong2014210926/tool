import React, { useState, useCallback, useEffect } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const controlBar: React.CSSProperties = {
  display: 'flex',
  gap: 12,
  flexWrap: 'wrap',
  alignItems: 'center',
  marginBottom: 16,
  padding: '12px 16px',
  borderRadius: 12,
  background: 'var(--bg-tool)',
  border: '1px solid var(--border-light)',
};

const fieldStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
};

const fieldLabel: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--text-muted)',
  fontFamily: 'var(--font-sans)',
  textTransform: 'uppercase',
};

const inputStyle: React.CSSProperties = {
  padding: '6px 10px',
  borderRadius: 8,
  border: '1px solid var(--border-color)',
  background: 'var(--bg-card)',
  color: 'var(--text-primary)',
  fontSize: 13,
  fontFamily: 'var(--font-sans)',
  outline: 'none',
  width: 80,
};

const selectStyle: React.CSSProperties = {
  padding: '6px 10px',
  borderRadius: 8,
  border: '1px solid var(--border-color)',
  background: 'var(--bg-card)',
  color: 'var(--text-primary)',
  fontSize: 13,
  fontFamily: 'var(--font-sans)',
  outline: 'none',
  cursor: 'pointer',
};

type NumStyle = '1' | 'a' | 'A' | 'i' | 'I';

function toRoman(num: number): string {
  const map: [number, string][] = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
    [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
  ];
  let result = '';
  let n = num;
  for (const [value, numeral] of map) {
    while (n >= value) {
      result += numeral;
      n -= value;
    }
  }
  return result;
}

function toAlpha(num: number, uppercase: boolean): string {
  const base = uppercase ? 65 : 97;
  let n = Math.max(1, num);
  let result = '';
  while (n > 0) {
    n--;
    result = String.fromCharCode(base + (n % 26)) + result;
    n = Math.floor(n / 26);
  }
  return result;
}

export default function Numbering() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [prefix, setPrefix] = useState('');
  const [suffix, setSuffix] = useState('');
  const [start, setStart] = useState('1');
  const [style, setStyle] = useState<NumStyle>('1');

  const doNumbering = useCallback(() => {
    if (!input.trim()) {
      setOutput('');
      return;
    }
    const lines = input.split('\n');
    let startNum = parseInt(start, 10);
    if (isNaN(startNum) || startNum < 0) startNum = 1;

    const numbered = lines.map((line, idx) => {
      const num = startNum + idx;
      let numText: string;
      switch (style) {
        case 'a':
          numText = toAlpha(num, false);
          break;
        case 'A':
          numText = toAlpha(num, true);
          break;
        case 'i':
          numText = toRoman(num).toLowerCase();
          break;
        case 'I':
          numText = toRoman(num);
          break;
        default:
          numText = String(num);
          break;
      }
      return `${prefix}${numText}${suffix}${line}`;
    });
    setOutput(numbered.join('\n'));
  }, [input, prefix, suffix, start, style]);

  useEffect(() => {
    doNumbering();
  }, [doNumbering]);

  const handleInput = (value: string) => {
    setInput(value);
  };

  return (
    <ToolLayout
      toolId="text-numbering"
      title="文本增加序号工具"
      description="为多行文本自动添加数字序号、字母序号或自定义前缀后缀"
      inputValue={input}
      onInputChange={handleInput}
      outputValue={output}
      inputPlaceholder="在此粘贴多行文本，每行一条..."
    >
      <div style={controlBar}>
        <div style={fieldStyle}>
          <span style={fieldLabel}>前缀</span>
          <input
            style={{ ...inputStyle, width: 60 }}
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            placeholder="无"
          />
        </div>
        <div style={fieldStyle}>
          <span style={fieldLabel}>后缀</span>
          <input
            style={{ ...inputStyle, width: 60 }}
            value={suffix}
            onChange={(e) => setSuffix(e.target.value)}
            placeholder=". "
          />
        </div>
        <div style={fieldStyle}>
          <span style={fieldLabel}>起始数字</span>
          <input
            style={{ ...inputStyle, width: 60 }}
            type="number"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
        </div>
        <div style={fieldStyle}>
          <span style={fieldLabel}>样式</span>
          <select
            style={selectStyle}
            value={style}
            onChange={(e) => setStyle(e.target.value as NumStyle)}
          >
            <option value="1">1, 2, 3</option>
            <option value="a">a, b, c</option>
            <option value="A">A, B, C</option>
            <option value="i">i, ii, iii</option>
            <option value="I">I, II, III</option>
          </select>
        </div>
      </div>
    </ToolLayout>
  );
}
