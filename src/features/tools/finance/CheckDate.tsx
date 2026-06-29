import React, { useState, useCallback } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };
const sectionStyle: React.CSSProperties = { marginBottom: 20 };
const resultStyle: React.CSSProperties = { fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', fontFamily: '"Fira Code", "Noto Sans SC", monospace', padding: '20px', textAlign: 'center', background: 'var(--bg-tool)', borderRadius: 14, border: '1px solid var(--border-light)', wordBreak: 'break-word' };

const digits = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖', '拾'];

function toChineseYear(year: number): string {
  const s = String(year);
  return s.split('').map(ch => digits[parseInt(ch)]).join('');
}

function toChineseDay(day: number): string {
  if (day <= 10) return (day === 10 ? '拾' : digits[day]);
  if (day < 20) return '拾' + (day === 10 ? '' : digits[day - 10]);
  if (day == 20) return '贰拾';
  if (day < 30) return digits[Math.floor(day / 10)] + '拾' + (day % 10 === 0 ? '' : digits[day % 10]);
  if (day == 30) return '叁拾';
  return '叁拾' + digits[day - 30];
}

function toChineseMonth(month: number): string {
  if (month <= 10) return (month === 10 ? '拾' : digits[month]);
  return '拾' + digits[month - 10];
}

function convertCheckDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const year = toChineseYear(y);
  const month = toChineseMonth(m);
  const day = toChineseDay(d);
  return year + '年' + (m < 10 ? '零' : '') + month + '月' + (d < 10 ? '零' : '') + day + '日';
}

export default function CheckDate() {
  const [date, setDate] = useState('');
  const [output, setOutput] = useState('');

  const handleDate = useCallback((value: string) => {
    setDate(value);
    if (!value) {
      setOutput('');
      return;
    }
    try {
      setOutput(convertCheckDate(value));
    } catch {
      setOutput('日期格式无效');
    }
  }, []);

  return (
    <ToolLayout
      toolId="fin-check-date"
      title="支票日期大写转换"
      description="将日期转换为支票填写所需的中文大写日期格式"
      hideInput
      outputValue={output}
    >
      <div style={sectionStyle}>
        <div style={labelStyle}>选择日期</div>
        <input
          style={{ ...inputStyle, maxWidth: 300 }}
          type="date"
          value={date}
          onChange={(e) => handleDate(e.target.value)}
        />
      </div>
      {output && <div style={resultStyle}>{output}</div>}
    </ToolLayout>
  );
}
