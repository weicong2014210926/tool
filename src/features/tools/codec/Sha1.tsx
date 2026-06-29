import React, { useState, useCallback, useEffect } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

/* ---- Styles ---- */
const radioLabel: React.CSSProperties = {
  fontSize: 13,
  fontFamily: 'var(--font-sans)',
  color: 'var(--text-primary)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: 4,
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

const controlRow: React.CSSProperties = {
  display: 'flex',
  gap: 20,
  alignItems: 'center',
  marginBottom: 12,
};

async function sha1Hash(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export default function Sha1() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [uppercase, setUppercase] = useState(false);

  const compute = useCallback(async (text: string, up: boolean) => {
    if (!text) return '';
    const hash = await sha1Hash(text);
    return up ? hash.toUpperCase() : hash;
  }, []);

  useEffect(() => {
    let cancelled = false;
    compute(input, uppercase).then((result) => {
      if (!cancelled) setOutput(result);
    });
    return () => { cancelled = true; };
  }, [input, uppercase, compute]);

  const handleInput = (value: string) => {
    setInput(value);
  };

  const controls = (
    <div>
      <div style={labelStyle}>输出选项</div>
      <div style={controlRow}>
        <label style={radioLabel}>
          <input
            type="checkbox"
            checked={uppercase}
            onChange={(e) => setUppercase(e.target.checked)}
            style={{ accentColor: 'var(--color-blue)' }}
          />
          大写输出
        </label>
      </div>
    </div>
  );

  return (
    <ToolLayout
      toolId="codec-sha1"
      title="SHA1在线加密"
      description="计算文本的SHA1摘要值，用于数据完整性校验和数字签名场景"
      inputValue={input}
      onInputChange={handleInput}
      outputValue={output}
      inputPlaceholder="在此输入要计算SHA1的文本..."
      children={controls}
    />
  );
}
