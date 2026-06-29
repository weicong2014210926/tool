import React, { useState, useCallback } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const btnStyle: React.CSSProperties = { padding: '8px 16px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 2px 0 var(--border-color)', transition: 'all 150ms ease' };
const activeBtn: React.CSSProperties = { ...btnStyle, background: 'var(--color-blue)', color: '#fff', borderColor: 'var(--color-blue)' };
const resultStyle: React.CSSProperties = { padding: '16px', borderRadius: 12, border: '1px solid var(--border-light)', background: 'var(--bg-tool)', fontSize: 18, fontWeight: 600, fontFamily: 'var(--font-sans)', color: 'var(--text-primary)', textAlign: 'center' as const };

type NumMode = 'cardinal' | 'ordinal' | 'currency';

const ONES = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

function numToWords(n: number): string {
  if (n === 0) return 'zero';
  if (n < 0) return 'negative ' + numToWords(-n);
  const parts: string[] = [];
  if (n >= 1000000) {
    const m = Math.floor(n / 1000000);
    parts.push(numToWords(m) + ' million');
    n %= 1000000;
  }
  if (n >= 1000) {
    const t = Math.floor(n / 1000);
    parts.push(numToWords(t) + ' thousand');
    n %= 1000;
  }
  if (n >= 100) {
    parts.push(ONES[Math.floor(n / 100)] + ' hundred');
    n %= 100;
  }
  if (n > 0) {
    if (n < 20) {
      parts.push(ONES[n]);
    } else {
      const ten = Math.floor(n / 10);
      const one = n % 10;
      parts.push(TENS[ten] + (one > 0 ? '-' + ONES[one] : ''));
    }
  }
  return parts.join(' ');
}

function toOrdinal(s: string): string {
  if (s === 'zero') return 'zeroth';
  const words = s.split(' ');
  const last = words[words.length - 1];
  const ordinalMap: Record<string, string> = {
    one:'first',two:'second',three:'third',four:'fourth',five:'fifth',six:'sixth',seven:'seventh',
    eight:'eighth',nine:'ninth',ten:'tenth',eleven:'eleventh',twelve:'twelfth',thirteen:'thirteenth',
    fourteen:'fourteenth',fifteen:'fifteenth',sixteen:'sixteenth',seventeen:'seventeenth',
    eighteen:'eighteenth',nineteen:'nineteenth',twenty:'twentieth',thirty:'thirtieth',
    forty:'fortieth',fifty:'fiftieth',sixty:'sixtieth',seventy:'seventieth',eighty:'eightieth',
    ninety:'ninetieth',hundred:'hundredth',thousand:'thousandth',million:'millionth',
  };
  const parts = last.split('-');
  const finalPart = parts[parts.length - 1];
  if (ordinalMap[last]) {
    words[words.length - 1] = ordinalMap[last];
  } else if (ordinalMap[finalPart]) {
    parts[parts.length - 1] = ordinalMap[finalPart];
    words[words.length - 1] = parts.join('-');
  } else {
    words[words.length - 1] = last + 'th';
  }
  return words.join(' ');
}

export default function NumberEn() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<NumMode>('cardinal');
  const [error, setError] = useState('');

  const handleConvert = useCallback(() => {
    const num = parseInt(input.replace(/,/g, ''), 10);
    if (isNaN(num)) { setError('请输入有效的整数'); setOutput(''); return; }
    if (num > 999999999) { setError('数字范围为 0 - 999,999,999'); setOutput(''); return; }
    setError('');
    const words = numToWords(num);
    switch (mode) {
      case 'cardinal': setOutput(words); break;
      case 'ordinal': setOutput(toOrdinal(words)); break;
      case 'currency': {
        const capitalized = words.charAt(0).toUpperCase() + words.slice(1);
        setOutput(capitalized + (num === 1 ? ' dollar' : ' dollars'));
        break;
      }
    }
  }, [input, mode]);

  const handleInput = (value: string) => {
    setInput(value);
    const num = parseInt(value.replace(/,/g, ''), 10);
    if (isNaN(num)) { setError('请输入有效的整数'); setOutput(''); return; }
    if (num > 999999999) { setError('数字范围为 0 - 999,999,999'); setOutput(''); return; }
    setError('');
    const words = numToWords(num);
    switch (mode) {
      case 'cardinal': setOutput(words); break;
      case 'ordinal': setOutput(toOrdinal(words)); break;
      case 'currency': {
        const capitalized = words.charAt(0).toUpperCase() + words.slice(1);
        setOutput(capitalized + (num === 1 ? ' dollar' : ' dollars'));
        break;
      }
    }
  };

  const modes: { key: NumMode; label: string }[] = [
    { key: 'cardinal', label: '基数词' },
    { key: 'ordinal', label: '序数词' },
    { key: 'currency', label: '金额' },
  ];

  return (
    <ToolLayout
      toolId="lang-number-en"
      title="数字转英文"
      description="将阿拉伯数字转换为英文单词表达，支持整数、序数词和金额格式"
      inputValue={input}
      onInputChange={handleInput}
      outputValue={output}
      inputPlaceholder="输入数字，如：123456"
      error={error}
      extraActions={
        <>
          {modes.map(m => (
            <button
              key={m.key}
              style={mode === m.key ? activeBtn : btnStyle}
              onClick={() => { setMode(m.key); handleConvert(); }}
            >
              {m.label}
            </button>
          ))}
        </>
      }
    />
  );
}
