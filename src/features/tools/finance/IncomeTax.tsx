import React, { useState, useCallback } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };
const sectionStyle: React.CSSProperties = { marginBottom: 16 };
const statCard: React.CSSProperties = { padding: '14px 18px', borderRadius: 14, border: '1px solid var(--border-light)', background: 'var(--bg-tool)', textAlign: 'center' as const, minWidth: 110 };
const statLabel: React.CSSProperties = { fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', marginBottom: 4 };
const statValue: React.CSSProperties = { fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' };
const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', fontSize: 12, fontFamily: 'var(--font-sans)' };
const thStyle: React.CSSProperties = { padding: '8px 12px', borderBottom: '1px solid var(--border-color)', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)' };
const tdStyle: React.CSSProperties = { padding: '8px 12px', borderBottom: '1px solid var(--border-light)', color: 'var(--text-primary)' };

// 2024 Chinese tax brackets (monthly)
const brackets = [
  { max: 3000, rate: 0.03, quick: 0 },
  { max: 12000, rate: 0.10, quick: 210 },
  { max: 25000, rate: 0.20, quick: 1410 },
  { max: 35000, rate: 0.25, quick: 2660 },
  { max: 55000, rate: 0.30, quick: 4410 },
  { max: 80000, rate: 0.35, quick: 7160 },
  { max: Infinity, rate: 0.45, quick: 15160 },
];

export default function IncomeTax() {
  const [salary, setSalary] = useState('');
  const [socialInsurance, setSocialInsurance] = useState('');
  const [specialDeduction, setSpecialDeduction] = useState('');

  const sal = parseFloat(salary) || 0;
  const si = parseFloat(socialInsurance) || 0;
  const sd = parseFloat(specialDeduction) || 0;
  const threshold = 5000;
  const taxableIncome = Math.max(0, sal - threshold - si - sd);

  let monthlyTax = 0;
  let bracketUsed = brackets[0];
  for (const b of brackets) {
    if (taxableIncome <= b.max) {
      monthlyTax = Math.max(0, taxableIncome * b.rate - b.quick);
      bracketUsed = b;
      break;
    }
  }

  const annualTax = monthlyTax * 12;
  const afterTaxMonthly = sal - si - monthlyTax;

  return (
    <ToolLayout
      toolId="fin-income-tax"
      title="个人所得税计算器"
      description="根据2024年中国税法计算个人所得税，支持专项附加扣除"
      hideInput
      outputValue=""
    >
      <div style={sectionStyle}>
        <div style={labelStyle}>月薪（税前）</div>
        <input style={{ ...inputStyle, maxWidth: 300 }} value={salary} onChange={e => setSalary(e.target.value)} placeholder="输入月薪" type="number" step="0.01" />
      </div>
      <div style={sectionStyle}>
        <div style={labelStyle}>社保公积金个人缴纳</div>
        <input style={{ ...inputStyle, maxWidth: 300 }} value={socialInsurance} onChange={e => setSocialInsurance(e.target.value)} placeholder="社保+公积金个人部分" type="number" step="0.01" />
      </div>
      <div style={sectionStyle}>
        <div style={labelStyle}>专项附加扣除合计（子女教育/房贷/赡养老人/继续教育）</div>
        <input style={{ ...inputStyle, maxWidth: 300 }} value={specialDeduction} onChange={e => setSpecialDeduction(e.target.value)} placeholder="专项附加扣除总额" type="number" step="0.01" />
      </div>

      {sal > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
            <div style={statCard}>
              <div style={statLabel}>应纳税所得额</div>
              <div style={statValue}>{taxableIncome.toFixed(2)}</div>
            </div>
            <div style={statCard}>
              <div style={statLabel}>月缴纳个税</div>
              <div style={statValue}>{monthlyTax.toFixed(2)}</div>
            </div>
            <div style={statCard}>
              <div style={statLabel}>年缴纳个税</div>
              <div style={statValue}>{annualTax.toFixed(2)}</div>
            </div>
            <div style={statCard}>
              <div style={statLabel}>税后月收入</div>
              <div style={statValue}>{afterTaxMonthly.toFixed(2)}</div>
            </div>
          </div>

          <div style={labelStyle}>适用税率: {(bracketUsed.rate * 100).toFixed(0)}% | 速算扣除数: {bracketUsed.quick}</div>

          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>级数</th>
                <th style={thStyle}>月应纳税所得额</th>
                <th style={thStyle}>税率</th>
                <th style={thStyle}>速算扣除数</th>
              </tr>
            </thead>
            <tbody>
              {brackets.map((b, i) => (
                <tr key={i} style={taxableIncome > 0 && taxableIncome <= b.max && (i === 0 || taxableIncome > brackets[i-1].max) ? { background: 'rgba(136,157,240,0.1)' } : {}}>
                  <td style={tdStyle}>{i + 1}</td>
                  <td style={tdStyle}>{b.max === Infinity ? '80000+' : `${i === 0 ? '0' : brackets[i-1].max} - ${b.max}`}</td>
                  <td style={tdStyle}>{(b.rate * 100).toFixed(0)}%</td>
                  <td style={tdStyle}>{b.quick}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8, fontFamily: 'var(--font-sans)' }}>
            起征点: 5000元/月 | 适用2024年中国个人所得税法
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
