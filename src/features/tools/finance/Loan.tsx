import React, { useState } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };
const sectionStyle: React.CSSProperties = { marginBottom: 16 };
const statCard: React.CSSProperties = { padding: '14px 18px', borderRadius: 14, border: '1px solid var(--border-light)', background: 'var(--bg-tool)', textAlign: 'center' as const, minWidth: 120 };
const statLabel: React.CSSProperties = { fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', marginBottom: 4 };
const statValue: React.CSSProperties = { fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' };
const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', fontSize: 12, fontFamily: 'var(--font-sans)', marginTop: 8 };
const thStyle: React.CSSProperties = { padding: '6px 10px', borderBottom: '1px solid var(--border-color)', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)' };
const tdStyle: React.CSSProperties = { padding: '6px 10px', borderBottom: '1px solid var(--border-light)', color: 'var(--text-primary)' };

export default function Loan() {
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');
  const [method, setMethod] = useState<'equal' | 'principal'>('equal');

  const principal = parseFloat(amount) || 0;
  const annualRate = parseFloat(rate) || 0;
  const totalMonths = (parseFloat(years) || 0) * 12;
  const monthlyRate = annualRate / 100 / 12;

  let monthlyPayment = 0;
  let totalInterest = 0;
  let totalRepayment = 0;
  let table: { month: number; payment: number; principal: number; interest: number; balance: number }[] = [];

  if (principal > 0 && annualRate > 0 && totalMonths > 0) {
    if (method === 'equal') {
      // 等额本息
      if (monthlyRate > 0) {
        monthlyPayment = principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
      } else {
        monthlyPayment = principal / totalMonths;
      }
      totalRepayment = monthlyPayment * totalMonths;
      totalInterest = totalRepayment - principal;

      let balance = principal;
      for (let i = 1; i <= Math.min(12, totalMonths); i++) {
        const interest = balance * monthlyRate;
        const prin = monthlyPayment - interest;
        balance -= prin;
        table.push({ month: i, payment: monthlyPayment, principal: prin, interest, balance: Math.max(0, balance) });
      }
      // Last month
      if (totalMonths > 12) {
        // Recalculate balance before last month
        let bal = principal;
        for (let i = 1; i < totalMonths; i++) {
          const int = bal * monthlyRate;
          bal -= (monthlyPayment - int);
        }
        const lastBal = Math.max(0, bal);
        const lastInt = lastBal * monthlyRate;
        const lastPrin = lastBal;
        const lastPmt = lastPrin + lastInt;
        table.push({ month: totalMonths, payment: lastPmt, principal: lastPrin, interest: lastInt, balance: 0 });
      }
    } else {
      // 等额本金
      const monthlyPrincipal = principal / totalMonths;
      let balance = principal;
      totalInterest = 0;
      for (let i = 1; i <= Math.min(12, totalMonths); i++) {
        const interest = balance * monthlyRate;
        const payment = monthlyPrincipal + interest;
        totalInterest += interest;
        balance -= monthlyPrincipal;
        table.push({ month: i, payment, principal: monthlyPrincipal, interest, balance: Math.max(0, balance) });
      }
      // Last month
      if (totalMonths > 12) {
        const lastInt = (principal / totalMonths) * monthlyRate;
        const lastPmt = monthlyPrincipal + lastInt;
        totalInterest += lastInt;
        table.push({ month: totalMonths, payment: lastPmt, principal: monthlyPrincipal, interest: lastInt, balance: 0 });
      }
      monthlyPayment = table.length > 0 ? table[0].payment : 0;
      totalRepayment = principal + totalInterest;
    }
  }

  return (
    <ToolLayout
      toolId="fin-loan"
      title="贷款计算器"
      description="计算住房贷款、消费贷款等各类贷款的月供、利息和还款计划"
      hideInput
      outputValue=""
    >
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <div style={sectionStyle}>
          <div style={labelStyle}>贷款金额（元）</div>
          <input style={{ ...inputStyle, maxWidth: 200 }} value={amount} onChange={e => setAmount(e.target.value)} placeholder="贷款金额" type="number" step="0.01" />
        </div>
        <div style={sectionStyle}>
          <div style={labelStyle}>年利率 (%)</div>
          <input style={{ ...inputStyle, maxWidth: 120 }} value={rate} onChange={e => setRate(e.target.value)} placeholder="年利率" type="number" step="0.01" />
        </div>
        <div style={sectionStyle}>
          <div style={labelStyle}>贷款年限</div>
          <input style={{ ...inputStyle, maxWidth: 100 }} value={years} onChange={e => setYears(e.target.value)} placeholder="年限" type="number" step="1" />
        </div>
        <div style={sectionStyle}>
          <div style={labelStyle}>还款方式</div>
          <select style={inputStyle} value={method} onChange={e => setMethod(e.target.value as 'equal' | 'principal')}>
            <option value="equal">等额本息</option>
            <option value="principal">等额本金</option>
          </select>
        </div>
      </div>

      {principal > 0 && annualRate > 0 && totalMonths > 0 && (
        <>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
            <div style={statCard}>
              <div style={statLabel}>月供</div>
              <div style={statValue}>{method === 'equal' ? monthlyPayment.toFixed(2) : table[0]?.payment.toFixed(2)}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{method === 'equal' ? '每月相同' : '首月'}</div>
            </div>
            <div style={statCard}>
              <div style={statLabel}>总利息</div>
              <div style={statValue}>{totalInterest.toFixed(2)}</div>
            </div>
            <div style={statCard}>
              <div style={statLabel}>总还款</div>
              <div style={statValue}>{totalRepayment.toFixed(2)}</div>
            </div>
          </div>

          <div style={labelStyle}>还款明细（前12期 + 最后一期）</div>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>期数</th>
                <th style={thStyle}>月供</th>
                <th style={thStyle}>本金</th>
                <th style={thStyle}>利息</th>
                <th style={thStyle}>剩余本金</th>
              </tr>
            </thead>
            <tbody>
              {table.map((row, i) => (
                <tr key={i}>
                  <td style={tdStyle}>{row.month}</td>
                  <td style={tdStyle}>{row.payment.toFixed(2)}</td>
                  <td style={tdStyle}>{row.principal.toFixed(2)}</td>
                  <td style={tdStyle}>{row.interest.toFixed(2)}</td>
                  <td style={tdStyle}>{row.balance.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </ToolLayout>
  );
}
