import React, { useState, useCallback } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };
const rowStyle: React.CSSProperties = { display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' };
const sectionStyle: React.CSSProperties = { marginBottom: 20 };
const bigResult: React.CSSProperties = { fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', fontFamily: '"Fira Code", monospace', padding: '20px', textAlign: 'center', background: 'var(--bg-tool)', borderRadius: 14, border: '1px solid var(--border-light)' };

export default function Radix() {
  const [input, setInput] = useState('');
  const [fromBase, setFromBase] = useState(10);
  const [toBase, setToBase] = useState(2);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const convert = useCallback((val: string, from: number, to: number) => {
    if (!val.trim()) { setOutput(''); setError(''); return; }
    try {
      const parts = val.split('.');
      const intPart = parts[0];
      const fracPart = parts[1];

      // Convert integer part
      const intNum = parseInt(intPart, from);
      if (isNaN(intNum)) { setOutput('无效输入'); setError('请检查输入数字'); return; }

      let result = intNum.toString(to).toUpperCase();

      // Handle fractional part
      if (fracPart) {
        let fracValue = 0;
        for (let i = 0; i < fracPart.length; i++) {
          const digit = parseInt(fracPart[i], from);
          if (isNaN(digit)) { setOutput(''); setError('小数部分包含无效字符'); return; }
          fracValue += digit / Math.pow(from, i + 1);
        }
        if (fracValue > 0) {
          let fracResult = '';
          for (let i = 0; i < 10; i++) {
            fracValue *= to;
            const digit = Math.floor(fracValue);
            fracResult += digit.toString(to).toUpperCase();
            fracValue -= digit;
          }
          result += '.' + fracResult;
        }
      }

      setOutput(result);
      setError('');
    } catch {
      setOutput('');
      setError('转换错误');
    }
  }, []);

  const handleInput = (val: string) => {
    setInput(val);
    convert(val, fromBase, toBase);
  };

  const handleFromBase = (val: number) => {
    setFromBase(val);
    convert(input, val, toBase);
  };

  const handleToBase = (val: number) => {
    setToBase(val);
    convert(input, fromBase, val);
  };

  return (
    <ToolLayout
      toolId="conv-radix"
      title="进制转换器"
      description="在二进制、八进制、十进制、十六进制等不同进制之间进行数值转换"
      hideInput
      outputValue={output}
      error={error}
    >
      <div style={sectionStyle}>
        <div style={labelStyle}>输入数字</div>
        <div style={rowStyle}>
          <input style={{ ...inputStyle, maxWidth: 300 }} value={input} onChange={e => handleInput(e.target.value)} placeholder="输入数字" />
        </div>
      </div>
      <div style={sectionStyle}>
        <div style={labelStyle}>源进制 → 目标进制</div>
        <div style={{ ...rowStyle, alignItems: 'center' }}>
          <select style={inputStyle} value={fromBase} onChange={e => handleFromBase(Number(e.target.value))}>
            {[2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,20,24,32,36].map(b => (
              <option key={b} value={b}>Base-{b}</option>
            ))}
          </select>
          <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>→</span>
          <select style={inputStyle} value={toBase} onChange={e => handleToBase(Number(e.target.value))}>
            {[2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,20,24,32,36].map(b => (
              <option key={b} value={b}>Base-{b}</option>
            ))}
          </select>
        </div>
      </div>
      {output && (
        <div style={bigResult}>{output}</div>
      )}
    </ToolLayout>
  );
}
