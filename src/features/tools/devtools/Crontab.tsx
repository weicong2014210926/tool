import React, { useState, useCallback } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: '"Fira Code", monospace', outline: 'none', width: '100%' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };
const sectionStyle: React.CSSProperties = { marginBottom: 16 };
const btnBase: React.CSSProperties = { padding: '6px 12px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)' };
const errorStyle: React.CSSProperties = { color: 'var(--color-red)', fontSize: 12, fontFamily: 'var(--font-sans)', marginTop: 6 };

const presets = [
  { name: '每分钟', expr: '* * * * *' },
  { name: '每小时', expr: '0 * * * *' },
  { name: '每天零点', expr: '0 0 * * *' },
  { name: '每周一零点', expr: '0 0 * * 1' },
  { name: '每月1日零点', expr: '0 0 1 * *' },
];

function parseField(value: string, min: number, max: number): number[] {
  const results = new Set<number>();
  const parts = value.split(',');
  for (let part of parts) {
    if (part === '*') {
      for (let i = min; i <= max; i++) results.add(i);
    } else if (part.includes('/')) {
      const [range, step] = part.split('/');
      const s = parseInt(step);
      let start = min, end = max;
      if (range !== '*') {
        if (range.includes('-')) {
          [start, end] = range.split('-').map(Number);
        } else {
          start = parseInt(range);
        }
      }
      for (let i = start; i <= end; i += s) results.add(i);
    } else if (part.includes('-')) {
      const [s, e] = part.split('-').map(Number);
      for (let i = s; i <= e; i++) results.add(i);
    } else {
      results.add(parseInt(part));
    }
  }
  return [...results].sort((a, b) => a - b);
}

interface CrontabResult {
  description: string;
  nextDates: Date[];
  error?: string;
}

function describeField(value: string, unit: string): string {
  if (value === '*') return `每${unit}`;
  if (value.includes('/')) {
    const [, step] = value.split('/');
    return `每${step}${unit}`;
  }
  if (value.includes('-')) {
    const [s, e] = value.split('-');
    return `${s}-${e}${unit}`;
  }
  if (value.includes(',')) {
    return `${value.split(',').join('、')}${unit}`;
  }
  return `第${value}${unit}`;
}

function analyzeCrontab(expr: string): CrontabResult {
  try {
    const fields = expr.trim().split(/\s+/);
    if (fields.length !== 5) {
      return { description: '', nextDates: [], error: 'crontab 表达式需要5个字段（分 时 日 月 周）' };
    }

    for (let i = 0; i < 5; i++) {
      if (!/^[\d\-,*/]+$/.test(fields[i])) {
        return { description: '', nextDates: [], error: `字段 ${i+1} 包含无效字符` };
      }
    }

    const minParts = parseField(fields[0], 0, 59);
    const hrParts = parseField(fields[1], 0, 23);
    const dayParts = parseField(fields[2], 1, 31);
    const monParts = parseField(fields[3], 1, 12);
    const dowParts = parseField(fields[4], 0, 6);

    const desc = `${describeField(fields[0], '分钟')} ${describeField(fields[1], '小时')} ${describeField(fields[2], '日')} ${describeField(fields[3], '月')} ${describeField(fields[4], '周')}`;

    // Calculate next 5 dates
    const nextDates: Date[] = [];
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() + 1, 0, 0);
    
    for (let d = new Date(start); nextDates.length < 5; d = new Date(d.getTime() + 60000)) {
      if (d.getFullYear() > now.getFullYear() + 2) break;
      const m = d.getMinutes();
      const h = d.getHours();
      const dom = d.getDate();
      const month = d.getMonth() + 1;
      const dow = d.getDay();

      if (monParts.includes(month) && minParts.includes(m) && hrParts.includes(h)) {
        if (dayParts.includes(dom) || dowParts.includes(dow)) {
          nextDates.push(new Date(d));
        }
      }
    }

    return { description: desc, nextDates };
  } catch {
    return { description: '', nextDates: [], error: '解析失败' };
  }
}

export default function Crontab() {
  const [expr, setExpr] = useState('');
  const [result, setResult] = useState<CrontabResult | null>(null);

  const handleExpr = useCallback((v: string) => {
    setExpr(v);
    if (v.trim()) {
      setResult(analyzeCrontab(v));
    } else {
      setResult(null);
    }
  }, []);

  return (
    <ToolLayout
      toolId="dev-crontab"
      title="crontab执行时间计算"
      description="解析crontab表达式，计算并展示任务的下次执行时间列表"
      inputValue=""
      onInputChange={() => {}}
      outputValue=""
      inputPlaceholder=""
    >
      <div style={sectionStyle}>
        <div style={labelStyle}>Crontab 表达式</div>
        <input
          style={{ ...inputStyle, maxWidth: 400 }}
          value={expr}
          onChange={e => handleExpr(e.target.value)}
          placeholder="分 时 日 月 周 (如 0 8 * * *)"
        />
      </div>

      <div style={{ ...sectionStyle, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {presets.map(p => (
          <button key={p.expr} style={btnBase} onClick={() => handleExpr(p.expr)}>
            {p.name}
          </button>
        ))}
      </div>

      {result?.error && <div style={errorStyle}>{result.error}</div>}

      {result && !result.error && (
        <div>
          <div style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border-light)', background: 'var(--bg-tool)', marginBottom: 12, fontSize: 13, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>
            <span style={{ fontWeight: 600 }}>含义: </span>{result.description}
          </div>
          {result.nextDates.length > 0 && (
            <>
              <div style={labelStyle}>接下来5次执行时间</div>
              {result.nextDates.map((d, i) => (
                <div key={i} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-light)', background: 'var(--bg-tool)', marginBottom: 4, fontSize: 12, fontFamily: '"Fira Code", monospace', color: 'var(--text-primary)' }}>
                  {d.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </ToolLayout>
  );
}
