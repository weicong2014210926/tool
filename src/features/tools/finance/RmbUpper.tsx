import React, { useState, useCallback } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };
const sectionStyle: React.CSSProperties = { marginBottom: 20 };
const resultStyle: React.CSSProperties = { fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', fontFamily: '"Fira Code", "Noto Sans SC", monospace', padding: '20px', textAlign: 'center', background: 'var(--bg-tool)', borderRadius: 14, border: '1px solid var(--border-light)', wordBreak: 'break-word' };
const errorStyle: React.CSSProperties = { color: 'var(--color-red)', fontSize: 13, fontFamily: 'var(--font-sans)' };

const digits = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
const radices = ['', '拾', '佰', '仟'];
const bigRadices = ['', '万', '亿', '万亿'];

function toChineseNumber(n: number): string {
  const str = String(Math.floor(n));
  const len = str.length;
  let result = '';
  let zeroFlag = false;
  for (let i = 0; i < len; i++) {
    const p = len - i - 1;
    const d = parseInt(str[i]);
    const q = p % 4;
    if (q === 0 && d === 0) {
      if (p > 0 && !zeroFlag) {
        result += bigRadices[Math.floor(p / 4)];
        zeroFlag = true;
      }
      continue;
    }
    if (d === 0) {
      zeroFlag = true;
    } else {
      if (zeroFlag && result.length > 0 && result[result.length - 1] !== '零') {
        result += '零';
      }
      result += digits[d] + radices[q];
      zeroFlag = false;
    }
    if (q === 0) {
      result += bigRadices[Math.floor(p / 4)];
      zeroFlag = false;
    }
  }
  // Remove trailing big radix if not needed
  if (result.endsWith('万') && result.indexOf('亿') !== -1) {
    // OK fine
  }
  return result || '零';
}

function convertRmb(amount: number): string {
  const integerPart = Math.floor(amount);
  const decimalPart = Math.round((amount - integerPart) * 100);
  
  const intStr = toChineseNumber(integerPart);
  
  const jiao = Math.floor(decimalPart / 10);
  const fen = decimalPart % 10;
  
  let result = intStr + '元';
  
  if (jiao === 0 && fen === 0) {
    result += '整';
  } else if (jiao > 0 && fen === 0) {
    result += digits[jiao] + '角整';
  } else if (jiao === 0 && fen > 0) {
    result += '零' + digits[fen] + '分';
  } else {
    result += digits[jiao] + '角' + digits[fen] + '分';
  }
  
  return result;
}

export default function RmbUpper() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleInput = useCallback((value: string) => {
    setInput(value);
    if (!value.trim()) {
      setOutput('');
      setError('');
      return;
    }
    const num = parseFloat(value);
    if (isNaN(num) || num < 0) {
      setError('请输入有效的正数金额');
      setOutput('');
      return;
    }
    if (num > 99999999999999.99) {
      setError('金额过大，超出支持范围');
      setOutput('');
      return;
    }
    setError('');
    setOutput(convertRmb(num));
  }, []);

  return (
    <ToolLayout
      toolId="fin-rmb-upper"
      title="人民币大写转换"
      description="将阿拉伯数字金额转换为人民币大写金额格式，符合银行和财务规范"
      inputValue=""
      onInputChange={() => {}}
      outputValue={output}
      inputPlaceholder=""
    >
      <div style={sectionStyle}>
        <div style={labelStyle}>输入金额（元）</div>
        <input
          style={{ ...inputStyle, maxWidth: 400 }}
          value={input}
          onChange={(e) => handleInput(e.target.value)}
          placeholder="例如：1234.56"
          type="number"
          step="0.01"
        />
        {error && <div style={errorStyle}>{error}</div>}
      </div>
      {output && <div style={resultStyle}>{output}</div>}
    </ToolLayout>
  );
}
