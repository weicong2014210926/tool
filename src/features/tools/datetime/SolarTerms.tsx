import React, { useState } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };
const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'var(--font-sans)' };
const thStyle: React.CSSProperties = { padding: '8px 12px', textAlign: 'left', borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)', fontWeight: 600, fontSize: 12 };
const tdStyle: React.CSSProperties = { padding: '8px 12px', borderBottom: '1px solid var(--border-light)', color: 'var(--text-primary)' };

// Approximate solar terms for 2024-2030
const solarTermsData: Record<number, { name: string; date: string }[]> = {
  2024: [
    { name: '小寒', date: '01-06' }, { name: '大寒', date: '01-20' }, { name: '立春', date: '02-04' }, { name: '雨水', date: '02-19' },
    { name: '惊蛰', date: '03-05' }, { name: '春分', date: '03-20' }, { name: '清明', date: '04-04' }, { name: '谷雨', date: '04-19' },
    { name: '立夏', date: '05-05' }, { name: '小满', date: '05-20' }, { name: '芒种', date: '06-05' }, { name: '夏至', date: '06-21' },
    { name: '小暑', date: '07-06' }, { name: '大暑', date: '07-22' }, { name: '立秋', date: '08-07' }, { name: '处暑', date: '08-22' },
    { name: '白露', date: '09-07' }, { name: '秋分', date: '09-22' }, { name: '寒露', date: '10-08' }, { name: '霜降', date: '10-23' },
    { name: '立冬', date: '11-07' }, { name: '小雪', date: '11-22' }, { name: '大雪', date: '12-06' }, { name: '冬至', date: '12-21' },
  ],
  2025: [
    { name: '小寒', date: '01-05' }, { name: '大寒', date: '01-20' }, { name: '立春', date: '02-03' }, { name: '雨水', date: '02-18' },
    { name: '惊蛰', date: '03-05' }, { name: '春分', date: '03-20' }, { name: '清明', date: '04-04' }, { name: '谷雨', date: '04-20' },
    { name: '立夏', date: '05-05' }, { name: '小满', date: '05-21' }, { name: '芒种', date: '06-05' }, { name: '夏至', date: '06-21' },
    { name: '小暑', date: '07-07' }, { name: '大暑', date: '07-22' }, { name: '立秋', date: '08-07' }, { name: '处暑', date: '08-23' },
    { name: '白露', date: '09-07' }, { name: '秋分', date: '09-23' }, { name: '寒露', date: '10-08' }, { name: '霜降', date: '10-23' },
    { name: '立冬', date: '11-07' }, { name: '小雪', date: '11-22' }, { name: '大雪', date: '12-07' }, { name: '冬至', date: '12-21' },
  ],
  2026: [
    { name: '小寒', date: '01-05' }, { name: '大寒', date: '01-20' }, { name: '立春', date: '02-04' }, { name: '雨水', date: '02-18' },
    { name: '惊蛰', date: '03-06' }, { name: '春分', date: '03-20' }, { name: '清明', date: '04-05' }, { name: '谷雨', date: '04-20' },
    { name: '立夏', date: '05-05' }, { name: '小满', date: '05-21' }, { name: '芒种', date: '06-05' }, { name: '夏至', date: '06-21' },
    { name: '小暑', date: '07-07' }, { name: '大暑', date: '07-22' }, { name: '立秋', date: '08-07' }, { name: '处暑', date: '08-23' },
    { name: '白露', date: '09-07' }, { name: '秋分', date: '09-23' }, { name: '寒露', date: '10-08' }, { name: '霜降', date: '10-23' },
    { name: '立冬', date: '11-07' }, { name: '小雪', date: '11-22' }, { name: '大雪', date: '12-07' }, { name: '冬至', date: '12-22' },
  ],
};

export default function SolarTerms() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [output, setOutput] = useState('');

  const data = solarTermsData[year] || [];

  React.useEffect(() => {
    if (data.length > 0) {
      setOutput(data.map(t => `${year}-${t.date}  ${t.name}`).join('\n'));
    } else {
      setOutput('暂无该年份数据（仅支持 2024-2026）');
    }
  }, [year]);

  return (
    <ToolLayout
      toolId="date-solar-terms"
      title="二十四节气速查表"
      description="快速查询全年二十四节气的具体日期时间"
      hideInput
      outputValue={output}
    >
      <div style={{ marginBottom: 20 }}>
        <div style={labelStyle}>选择年份</div>
        <select style={{ ...inputStyle, maxWidth: 200 }} value={year} onChange={e => setYear(Number(e.target.value))}>
          <option value={2024}>2024</option>
          <option value={2025}>2025</option>
          <option value={2026}>2026</option>
        </select>
      </div>
      {data.length > 0 && (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>节气</th>
              <th style={thStyle}>日期</th>
              <th style={thStyle}>节气</th>
              <th style={thStyle}>日期</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 12 }, (_, i) => (
              <tr key={i}>
                <td style={tdStyle}>{data[i]?.name}</td>
                <td style={tdStyle}>{data[i] ? `${year}-${data[i].date}` : ''}</td>
                <td style={tdStyle}>{data[i + 12]?.name}</td>
                <td style={tdStyle}>{data[i + 12] ? `${year}-${data[i + 12].date}` : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </ToolLayout>
  );
}
