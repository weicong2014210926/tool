import React, { useState, useCallback } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const statCard: React.CSSProperties = { padding: '14px 18px', borderRadius: 14, border: '1px solid var(--border-light)', background: 'var(--bg-tool)', textAlign: 'center' as const, minWidth: 90 };
const statLabel: React.CSSProperties = { fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', marginBottom: 4 };
const statValue: React.CSSProperties = { fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' };

function parseNumbers(text: string): { numbers: number[]; warnings: string[] } {
  const numbers: number[] = [];
  const warnings: string[] = [];
  const lines = text.split(/[\n,;]+/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const num = parseFloat(trimmed);
    if (isNaN(num)) {
      warnings.push(`跳过非数字行: "${trimmed.substring(0, 50)}"`);
    } else {
      numbers.push(num);
    }
  }
  return { numbers, warnings };
}

export default function ListSum() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleInput = useCallback((value: string) => {
    setInput(value);
    if (!value.trim()) {
      setOutput('');
      return;
    }
    const { numbers, warnings } = parseNumbers(value);
    if (numbers.length === 0) {
      setOutput(JSON.stringify({ error: '未识别到有效数字', warnings }));
      return;
    }
    const sum = numbers.reduce((a, b) => a + b, 0);
    const avg = sum / numbers.length;
    const min = Math.min(...numbers);
    const max = Math.max(...numbers);
    const count = numbers.length;
    const sorted = [...numbers].sort((a, b) => a - b);
    const median = count % 2 === 0
      ? (sorted[count / 2 - 1] + sorted[count / 2]) / 2
      : sorted[Math.floor(count / 2)];

    setOutput(JSON.stringify({ sum, avg, min, max, count, median, warnings }));
  }, []);

  let result: any = null;
  try { if (output) result = JSON.parse(output); } catch {}

  return (
    <ToolLayout
      toolId="fin-list-sum"
      title="列表求和计算器"
      description="对列表中的数字进行求和、平均值、最大值、最小值等统计计算"
      inputValue={input}
      onInputChange={handleInput}
      outputValue=""
      inputPlaceholder="输入数字，每行一个或用逗号分隔..."
    >
      {result && !result.error && (
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
          <div style={statCard}>
            <div style={statLabel}>求和</div>
            <div style={statValue}>{result.sum.toFixed(2)}</div>
          </div>
          <div style={statCard}>
            <div style={statLabel}>平均值</div>
            <div style={statValue}>{result.avg.toFixed(2)}</div>
          </div>
          <div style={statCard}>
            <div style={statLabel}>最小值</div>
            <div style={statValue}>{result.min.toFixed(2)}</div>
          </div>
          <div style={statCard}>
            <div style={statLabel}>最大值</div>
            <div style={statValue}>{result.max.toFixed(2)}</div>
          </div>
          <div style={statCard}>
            <div style={statLabel}>个数</div>
            <div style={statValue}>{result.count}</div>
          </div>
          <div style={statCard}>
            <div style={statLabel}>中位数</div>
            <div style={statValue}>{result.median.toFixed(2)}</div>
          </div>
        </div>
      )}
      {result?.warnings?.length > 0 && (
        <div style={{ fontSize: 11, color: 'var(--color-orange)', fontFamily: 'var(--font-sans)' }}>
          {result.warnings.join(' | ')}
        </div>
      )}
      {result?.error && (
        <div style={{ fontSize: 13, color: 'var(--color-red)', fontFamily: 'var(--font-sans)' }}>{result.error}</div>
      )}
    </ToolLayout>
  );
}
