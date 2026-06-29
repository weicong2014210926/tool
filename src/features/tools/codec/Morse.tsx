import React, { useState, useCallback } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

/* ---- Morse Code Table ---- */
const MORSE_ENCODE: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--',
  '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...',
  ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-',
  '"': '.-..-.', '$': '...-..-', '@': '.--.-.',
};

const MORSE_DECODE: Record<string, string> = {};
for (const [char, code] of Object.entries(MORSE_ENCODE)) {
  MORSE_DECODE[code] = char;
}

/* ---- Styles ---- */
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
};

const btnActive: React.CSSProperties = {
  ...btnBase,
  background: 'var(--color-blue)',
  color: '#fff',
  borderColor: 'var(--color-blue)',
};

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
  width: 120,
};

const controlRow: React.CSSProperties = {
  display: 'flex',
  gap: 16,
  flexWrap: 'wrap',
  marginBottom: 16,
  alignItems: 'flex-end',
};

const controlCol: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
};

const refTableStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
  gap: '4px 8px',
  marginTop: 12,
  fontSize: 12,
  fontFamily: '"Fira Code", var(--font-sans)',
  color: 'var(--text-muted)',
  padding: 12,
  borderRadius: 12,
  background: 'var(--bg-card)',
  border: '1px solid var(--border-light)',
};

const refItemStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '2px 4px',
};

function encodeMorse(text: string, sep: string): string {
  const result: string[] = [];
  for (const ch of text.toUpperCase()) {
    if (ch === ' ') {
      result.push(sep);
    } else if (MORSE_ENCODE[ch]) {
      result.push(MORSE_ENCODE[ch]);
    } else {
      result.push(ch);
    }
  }
  return result.join(sep);
}

function decodeMorse(morse: string, sep: string): string {
  // Split by spaces (word boundaries) and separator (char boundaries)
  const words = morse.trim().split(/\s{2,}/);
  const decoded = words.map((word) => {
    const chars = word.split(sep);
    return chars.map((code) => {
      const trimmed = code.trim();
      if (!trimmed) return '';
      return MORSE_DECODE[trimmed] || '?';
    }).join('');
  });
  return decoded.join(' ');
}

// Reference table entries for display
const refEntries = Object.entries(MORSE_ENCODE).filter(
  ([char]) => /^[A-Z0-9]$/.test(char)
);

export default function Morse() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [separator, setSeparator] = useState(' ');
  const [activeAction, setActiveAction] = useState<'encode' | 'decode' | null>(null);

  const handleEncode = useCallback(() => {
    if (!input.trim()) { setOutput(''); setError(''); return; }
    setActiveAction('encode');
    setError('');
    setOutput(encodeMorse(input, separator));
  }, [input, separator]);

  const handleDecode = useCallback(() => {
    if (!input.trim()) { setOutput(''); setError(''); return; }
    setActiveAction('decode');
    setError('');
    try {
      setOutput(decodeMorse(input, separator));
    } catch (e) {
      setError('解码失败，请检查摩斯电码格式');
      setOutput('');
    }
  }, [input, separator]);

  const handleInput = (value: string) => {
    setInput(value);
    setOutput('');
    setError('');
    setActiveAction(null);
  };

  const controls = (
    <div>
      <div style={labelStyle}>编解码设置</div>
      <div style={controlRow}>
        <div style={controlCol}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>
            分隔符 (默认空格)
          </span>
          <input
            style={inputStyle}
            type="text"
            maxLength={3}
            value={separator}
            onChange={(e) => setSeparator(e.target.value || ' ')}
          />
        </div>
        <div style={{ ...controlCol, justifyContent: 'flex-end' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              style={activeAction === 'encode' ? btnActive : btnBase}
              onClick={handleEncode}
            >
              编码
            </button>
            <button
              style={activeAction === 'decode' ? btnActive : btnBase}
              onClick={handleDecode}
            >
              解码
            </button>
          </div>
        </div>
      </div>

      <div style={labelStyle}>摩斯电码对照表 (A-Z, 0-9)</div>
      <div style={refTableStyle}>
        {refEntries.map(([char, code]) => (
          <div key={char} style={refItemStyle}>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{char}</span>
            <span style={{ letterSpacing: 2 }}>{code}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <ToolLayout
      toolId="codec-morse"
      title="摩斯电码编码解码"
      description="将文本转换为摩斯电码，或将摩斯电码解码还原为文本"
      inputValue={input}
      onInputChange={handleInput}
      outputValue={output}
      inputPlaceholder="在此输入文本或摩斯电码..."
      error={error}
      children={controls}
    />
  );
}
