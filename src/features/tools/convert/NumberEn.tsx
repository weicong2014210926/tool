import React, { useState, useCallback } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };
const sectionStyle: React.CSSProperties = { marginBottom: 20 };
const resultStyle: React.CSSProperties = { fontSize: 14, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', lineHeight: 2 };

const chineseDigits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
const chineseUnits = ['', '十', '百', '千'];
const chineseBigUnits = ['', '万', '亿', '万亿', '亿亿'];

const engOnes = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const engTeens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const engTens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const engBig = ['', 'thousand', 'million', 'billion', 'trillion'];

function chineseNumber(num: number): string {
  if (num === 0) return '零';
  const absNum = Math.abs(num);
  const sign = num < 0 ? '负' : '';
  const parts: string[] = [];

  // Split into groups of 4 digits
  const str = String(Math.floor(absNum));
  const groups: string[] = [];
  for (let i = str.length; i > 0; i -= 4) {
    groups.unshift(str.substring(Math.max(0, i - 4), i));
  }

  for (let g = 0; g < groups.length; g++) {
    const group = groups[g];
    let groupStr = '';
    for (let i = 0; i < group.length; i++) {
      const digit = parseInt(group[i]);
      const pos = group.length - i - 1;
      if (digit === 0) {
        if (groupStr && groupStr[groupStr.length - 1] !== '零') {
          groupStr += '零';
        }
      } else {
        groupStr += chineseDigits[digit] + chineseUnits[pos];
      }
    }
    // trim trailing zero
    if (groupStr[groupStr.length - 1] === '零') {
      groupStr = groupStr.slice(0, -1);
    }
    if (groupStr) {
      parts.push(groupStr + chineseBigUnits[groups.length - g - 1]);
    }
  }

  return sign + parts.join('');
}

function englishNumber(num: number): string {
  if (num === 0) return 'zero';
  const absNum = Math.abs(num);
  const sign = num < 0 ? 'negative ' : '';

  function under1000(n: number): string {
    if (n === 0) return '';
    const parts: string[] = [];
    const h = Math.floor(n / 100);
    if (h > 0) parts.push(engOnes[h] + ' hundred');
    const rest = n % 100;
    if (rest > 0) {
      if (rest < 10) parts.push(engOnes[rest]);
      else if (rest < 20) parts.push(engTeens[rest - 10]);
      else {
        const t = Math.floor(rest / 10);
        const o = rest % 10;
        parts.push(engTens[t] + (o > 0 ? '-' + engOnes[o] : ''));
      }
    }
    return parts.join(' ');
  }

  const str = String(Math.floor(absNum));
  const groups: number[] = [];
  for (let i = str.length; i > 0; i -= 3) {
    groups.unshift(parseInt(str.substring(Math.max(0, i - 3), i)));
  }

  const parts: string[] = [];
  for (let i = 0; i < groups.length; i++) {
    const g = groups[i];
    if (g > 0) {
      const bigIdx = groups.length - i - 1;
      parts.push(under1000(g) + (bigIdx > 0 ? ' ' + engBig[bigIdx] : ''));
    }
  }

  return sign + parts.join(', ');
}

export default function NumberEn() {
  const [value, setValue] = useState('');
  const [output, setOutput] = useState('');
  const [results, setResults] = useState<{ chinese: string; english: string; wan: string; yi: string } | null>(null);

  const handleInput = (val: string) => {
    setValue(val);
    if (!val.trim()) { setOutput(''); setResults(null); return; }
    const n = parseInt(val.replace(/,/g, ''));
    if (isNaN(n)) { setOutput('请输入有效数字'); return; }

    const cn = chineseNumber(n);
    const en = englishNumber(n);
    const wan = (n / 10000).toFixed(4);
    const yi = (n / 100000000).toFixed(6);

    setResults({ chinese: cn, english: en, wan, yi });
    setOutput(`中文: ${cn}\n英文: ${en}\n万: ${wan}万\n亿: ${yi}亿`);
  };

  return (
    <ToolLayout
      toolId="conv-number-en"
      title="英文计数单位换算"
      description="将数字转换为中英文读法，显示万/亿单位数值"
      inputValue={value}
      onInputChange={handleInput}
      outputValue={output}
      inputPlaceholder="输入大数字，如 123456789"
    />
  );
}
