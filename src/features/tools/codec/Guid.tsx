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
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  width: 160,
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

type GuidFormat = 'standard' | 'no-dashes' | 'uppercase';

function generateGuid(format: GuidFormat): string {
  let uuid: string = crypto.randomUUID();
  switch (format) {
    case 'no-dashes':
      uuid = uuid.replace(/-/g, '');
      break;
    case 'uppercase':
      uuid = uuid.toUpperCase();
      break;
    default:
      break;
  }
  return uuid;
}

export default function Guid() {
  const [output, setOutput] = useState('');
  const [format, setFormat] = useState<GuidFormat>('standard');
  const [count, setCount] = useState(1);

  const handleGenerate = useCallback(() => {
    const clamped = Math.max(1, Math.min(100, count));
    const guids: string[] = [];
    for (let i = 0; i < clamped; i++) {
      guids.push(generateGuid(format));
    }
    setOutput(guids.join('\n'));
  }, [format, count]);

  const controls = (
    <div>
      <div style={labelStyle}>GUID设置</div>
      <div style={controlRow}>
        <div style={controlCol}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>格式</span>
          <select
            style={selectStyle}
            value={format}
            onChange={(e) => setFormat(e.target.value as GuidFormat)}
          >
            <option value="standard">标准 (xxxxxxxx-xxxx-...)</option>
            <option value="no-dashes">无连字符</option>
            <option value="uppercase">大写</option>
          </select>
        </div>
        <div style={controlCol}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>生成数量 (1-100)</span>
          <input
            style={{ ...inputStyle, width: 80 }}
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
          />
        </div>
      </div>
      <button style={btnPrimary} onClick={handleGenerate}>
        生成
      </button>
    </div>
  );

  return (
    <ToolLayout
      toolId="codec-guid"
      title="GUID生成工具"
      description="批量生成全局唯一标识符GUID/UUID，使用 crypto.randomUUID() 生成标准UUID v4"
      hideInput
      outputValue={output}
      children={controls}
    />
  );
}
