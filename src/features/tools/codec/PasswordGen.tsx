import React, { useState, useCallback } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';
import { showToast } from '../../../components/ui/Toast';

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
  width: 80,
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

const btnPrimary: React.CSSProperties = {
  ...btnBase,
  background: 'var(--color-blue)',
  color: '#fff',
  borderColor: 'var(--color-blue)',
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

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const SIMILAR = 'il1Lo0O';

function generatePassword(
  length: number,
  useUpper: boolean,
  useLower: boolean,
  useNumbers: boolean,
  useSymbols: boolean,
  excludeSimilar: boolean,
): string {
  let pool = '';
  if (useUpper) pool += UPPER;
  if (useLower) pool += LOWER;
  if (useNumbers) pool += NUMBERS;
  if (useSymbols) pool += SYMBOLS;

  if (!pool) pool = LOWER + NUMBERS;

  let filtered = pool;
  if (excludeSimilar) {
    filtered = '';
    for (const ch of pool) {
      if (!SIMILAR.includes(ch)) filtered += ch;
    }
    if (!filtered) filtered = pool;
  }

  const chars = new Uint32Array(length);
  crypto.getRandomValues(chars);

  let password = '';
  for (let i = 0; i < length; i++) {
    password += filtered[chars[i] % filtered.length];
  }

  return password;
}

export default function PasswordGen() {
  const [output, setOutput] = useState('');
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(false);
  const [excludeSimilar, setExcludeSimilar] = useState(false);

  const handleGenerate = useCallback(() => {
    const pwd = generatePassword(length, useUpper, useLower, useNumbers, useSymbols, excludeSimilar);
    setOutput(pwd);
  }, [length, useUpper, useLower, useNumbers, useSymbols, excludeSimilar]);

  const handleGenerate10 = useCallback(() => {
    const passwords: string[] = [];
    for (let i = 0; i < 10; i++) {
      passwords.push(generatePassword(length, useUpper, useLower, useNumbers, useSymbols, excludeSimilar));
    }
    setOutput(passwords.join('\n'));
  }, [length, useUpper, useLower, useNumbers, useSymbols, excludeSimilar]);

  const controls = (
    <div>
      <div style={labelStyle}>密码设置</div>
      <div style={controlRow}>
        <div style={controlCol}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>
            长度 (8-64)
          </span>
          <input
            style={inputStyle}
            type="number"
            min={8}
            max={64}
            value={length}
            onChange={(e) => {
              const v = Math.max(8, Math.min(64, parseInt(e.target.value) || 8));
              setLength(v);
            }}
          />
        </div>
        <div style={{ ...controlCol, justifyContent: 'flex-end', gap: 8 }}>
          <label style={checkboxLabel}>
            <input type="checkbox" checked={useUpper} onChange={(e) => setUseUpper(e.target.checked)}
              style={{ accentColor: 'var(--color-blue)' }} />
            大写字母
          </label>
          <label style={checkboxLabel}>
            <input type="checkbox" checked={useLower} onChange={(e) => setUseLower(e.target.checked)}
              style={{ accentColor: 'var(--color-blue)' }} />
            小写字母
          </label>
          <label style={checkboxLabel}>
            <input type="checkbox" checked={useNumbers} onChange={(e) => setUseNumbers(e.target.checked)}
              style={{ accentColor: 'var(--color-blue)' }} />
            数字
          </label>
          <label style={checkboxLabel}>
            <input type="checkbox" checked={useSymbols} onChange={(e) => setUseSymbols(e.target.checked)}
              style={{ accentColor: 'var(--color-blue)' }} />
            特殊符号
          </label>
          <label style={checkboxLabel}>
            <input type="checkbox" checked={excludeSimilar} onChange={(e) => setExcludeSimilar(e.target.checked)}
              style={{ accentColor: 'var(--color-blue)' }} />
            排除易混淆字符 (il1Lo0O)
          </label>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button style={btnPrimary} onClick={handleGenerate}>
          生成
        </button>
        <button style={btnBase} onClick={handleGenerate10}>
          生成10个
        </button>
      </div>
    </div>
  );

  return (
    <ToolLayout
      toolId="codec-password-gen"
      title="随机密码生成"
      description="生成指定长度和复杂度的随机密码，使用 crypto.getRandomValues 保证真随机性"
      inputValue=""
      onInputChange={() => {}}
      outputValue={output}
      children={controls}
    />
  );
}
