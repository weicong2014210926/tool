import React, { useState } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };
const resultStyle: React.CSSProperties = { fontSize: 14, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', lineHeight: 2 };
const cardStyle: React.CSSProperties = { padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border-light)', background: 'var(--bg-tool)', marginBottom: 8, fontSize: 13, fontFamily: 'var(--font-sans)', color: 'var(--text-primary)' };

const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const shortMonths = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

export default function EnFormat() {
  const [date, setDate] = useState('');
  const [output, setOutput] = useState('');
  const [formats, setFormats] = useState<string[]>([]);

  const handleDate = (val: string) => {
    setDate(val);
    if (!val) { setOutput(''); setFormats([]); return; }
    const d = new Date(val + 'T00:00:00');
    const y = d.getFullYear();
    const m = d.getMonth();
    const day = d.getDate();
    const dow = d.getDay();
    const mn = months[m];
    const sm = shortMonths[m];
    const dd = String(day).padStart(2, '0');
    const mm = String(m + 1).padStart(2, '0');

    const list = [
      `${mn} ${day}, ${y}`,
      `${day} ${mn} ${y}`,
      `${sm} ${day}, ${y}`,
      `${day} ${sm} ${y}`,
      `${days[dow]}, ${mn} ${day}, ${y}`,
      `${mm}/${dd}/${y} (US)`,
      `${dd}/${mm}/${y} (UK)`,
      `ISO 8601: ${y}-${mm}-${dd}`,
    ];
    setFormats(list);
    setOutput(list.join('\n'));
  };

  return (
    <ToolLayout
      toolId="date-en-format"
      title="英文日期格式转换"
      description="将日期转换为英文书写的多种格式，包括美式和英式日期写法"
      inputValue=""
      onInputChange={() => {}}
      outputValue={output}
      inputPlaceholder=""
    >
      <div style={{ marginBottom: 20 }}>
        <div style={labelStyle}>选择日期</div>
        <input type="date" style={{ ...inputStyle, maxWidth: 250 }} value={date} onChange={e => handleDate(e.target.value)} />
      </div>
      {formats.length > 0 && formats.map((f, i) => (
        <div key={i} style={cardStyle}>{f}</div>
      ))}
    </ToolLayout>
  );
}
