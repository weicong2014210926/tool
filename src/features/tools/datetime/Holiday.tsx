import React, { useState } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };
const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'var(--font-sans)', marginTop: 8 };
const thStyle: React.CSSProperties = { padding: '8px 12px', textAlign: 'left', borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)', fontWeight: 600, fontSize: 12 };
const tdStyle: React.CSSProperties = { padding: '8px 12px', borderBottom: '1px solid var(--border-light)', color: 'var(--text-primary)' };

interface HolidayEntry { name: string; dates: string; daysOff: string; makeup: string; }

const holidayData: Record<number, HolidayEntry[]> = {
  2024: [
    { name: '元旦', dates: '2024-01-01', daysOff: '12/30-01/01 (3天)', makeup: '--' },
    { name: '春节', dates: '2024-02-10', daysOff: '02/10-02/17 (8天)', makeup: '02/04, 02/18' },
    { name: '清明节', dates: '2024-04-04', daysOff: '04/04-04/06 (3天)', makeup: '04/07' },
    { name: '劳动节', dates: '2024-05-01', daysOff: '05/01-05/05 (5天)', makeup: '04/28, 05/11' },
    { name: '端午节', dates: '2024-06-10', daysOff: '06/08-06/10 (3天)', makeup: '--' },
    { name: '中秋节', dates: '2024-09-17', daysOff: '09/15-09/17 (3天)', makeup: '09/14' },
    { name: '国庆节', dates: '2024-10-01', daysOff: '10/01-10/07 (7天)', makeup: '09/29, 10/12' },
  ],
  2025: [
    { name: '元旦', dates: '2025-01-01', daysOff: '01/01 (1天)', makeup: '--' },
    { name: '春节', dates: '2025-01-29', daysOff: '01/28-02/04 (8天)', makeup: '01/26, 02/08' },
    { name: '清明节', dates: '2025-04-04', daysOff: '04/04-04/06 (3天)', makeup: '--' },
    { name: '劳动节', dates: '2025-05-01', daysOff: '05/01-05/05 (5天)', makeup: '04/27' },
    { name: '端午节', dates: '2025-05-31', daysOff: '05/31-06/02 (3天)', makeup: '--' },
    { name: '中秋节/国庆节', dates: '2025-10-01', daysOff: '10/01-10/08 (8天)', makeup: '09/28, 10/11' },
  ],
  2026: [
    { name: '元旦', dates: '2026-01-01', daysOff: '01/01-01/03 (3天)', makeup: '--' },
    { name: '春节', dates: '2026-02-17', daysOff: '02/15-02/23 (9天)', makeup: '02/07, 02/28' },
    { name: '清明节', dates: '2026-04-05', daysOff: '04/04-04/06 (3天)', makeup: '--' },
    { name: '劳动节', dates: '2026-05-01', daysOff: '05/01-05/05 (5天)', makeup: '05/09' },
    { name: '端午节', dates: '2026-06-19', daysOff: '06/19-06/21 (3天)', makeup: '--' },
    { name: '中秋节', dates: '2026-09-25', daysOff: '09/25-09/27 (3天)', makeup: '09/19' },
    { name: '国庆节', dates: '2026-10-01', daysOff: '10/01-10/07 (7天)', makeup: '10/10' },
  ],
};

export default function Holiday() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [output, setOutput] = useState('');

  const data = holidayData[year] || [];

  React.useEffect(() => {
    if (data.length > 0) {
      setOutput(data.map(h => `${h.name} | ${h.dates} | ${h.daysOff}`).join('\n'));
    } else {
      setOutput('暂无该年份数据（仅支持 2024-2026）');
    }
  }, [year]);

  return (
    <ToolLayout
      toolId="date-holiday"
      title="年度放假安排"
      description="查看年度法定节假日的放假和调休安排"
      inputValue=""
      onInputChange={() => {}}
      outputValue={output}
      inputPlaceholder=""
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
              <th style={thStyle}>假期名称</th>
              <th style={thStyle}>日期</th>
              <th style={thStyle}>放假天数</th>
              <th style={thStyle}>调休上班</th>
            </tr>
          </thead>
          <tbody>
            {data.map((h, i) => (
              <tr key={i}>
                <td style={tdStyle}>{h.name}</td>
                <td style={tdStyle}>{h.dates}</td>
                <td style={tdStyle}>{h.daysOff}</td>
                <td style={tdStyle}>{h.makeup}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </ToolLayout>
  );
}
