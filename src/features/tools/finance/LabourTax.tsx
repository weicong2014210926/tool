import React, { useState, useCallback } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };
const sectionStyle: React.CSSProperties = { marginBottom: 20 };
const statCard: React.CSSProperties = { padding: '16px 20px', borderRadius: 14, border: '1px solid var(--border-light)', background: 'var(--bg-tool)', textAlign: 'center' as const, minWidth: 120 };
const statLabel: React.CSSProperties = { fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', marginBottom: 4 };
const statValue: React.CSSProperties = { fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' };

export default function LabourTax() {
  const [income, setIncome] = useState('');

  const inc = parseFloat(income) || 0;

  let deduction = 0;
  let taxableIncome = 0;

  if (inc > 0) {
    if (inc <= 4000) {
      deduction = 800;
    } else {
      deduction = inc * 0.2;
    }
    taxableIncome = Math.max(0, inc - deduction);
  }

  let tax = 0;
  if (taxableIncome <= 20000) {
    tax = taxableIncome * 0.2;
  } else if (taxableIncome <= 50000) {
    tax = taxableIncome * 0.3 - 2000;
  } else {
    tax = taxableIncome * 0.4 - 7000;
  }
  tax = Math.max(0, tax);
  const afterTax = inc - tax;

  return (
    <ToolLayout
      toolId="fin-labour-tax"
      title="劳务报酬所得税计算"
      description="计算劳务报酬所得应缴纳的个人所得税，适用于兼职和自由职业者"
      hideInput
      outputValue=""
    >
      <div style={sectionStyle}>
        <div style={labelStyle}>劳务报酬收入</div>
        <input style={{ ...inputStyle, maxWidth: 300 }} value={income} onChange={e => setIncome(e.target.value)} placeholder="输入劳务报酬金额" type="number" step="0.01" />
      </div>

      {inc > 0 && (
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
          <div style={statCard}>
            <div style={statLabel}>费用扣除</div>
            <div style={statValue}>{deduction.toFixed(2)}</div>
          </div>
          <div style={statCard}>
            <div style={statLabel}>应纳税所得额</div>
            <div style={statValue}>{taxableIncome.toFixed(2)}</div>
          </div>
          <div style={statCard}>
            <div style={statLabel}>应缴个税</div>
            <div style={statValue}>{tax.toFixed(2)}</div>
          </div>
          <div style={statCard}>
            <div style={statLabel}>税后收入</div>
            <div style={statValue}>{afterTax.toFixed(2)}</div>
          </div>
        </div>
      )}

      <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', marginTop: 8 }}>
        规则说明：收入≤4000元，扣除800元；收入&gt;4000元，扣除20%。税率：≤2万 20%；2-5万 30%，速算扣除2000；&gt;5万 40%，速算扣除7000。
      </div>
    </ToolLayout>
  );
}
