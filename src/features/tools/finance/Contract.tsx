import React, { useState, useCallback } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };
const sectionStyle: React.CSSProperties = { marginBottom: 20 };
const btnBase: React.CSSProperties = { padding: '6px 14px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 2px 0 var(--border-color)' };
const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', fontSize: 12, fontFamily: 'var(--font-sans)' };
const thStyle: React.CSSProperties = { padding: '8px 12px', borderBottom: '1px solid var(--border-color)', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)' };
const tdStyle: React.CSSProperties = { padding: '8px 12px', borderBottom: '1px solid var(--border-light)', color: 'var(--text-primary)' };

interface Stage { name: string; percentage: number; }

export default function Contract() {
  const [total, setTotal] = useState('');
  const [stages, setStages] = useState<Stage[]>([
    { name: '预付款', percentage: 30 },
    { name: '进度款', percentage: 50 },
    { name: '尾款', percentage: 20 },
  ]);

  const t = parseFloat(total) || 0;
  const totalPct = stages.reduce((s, st) => s + st.percentage, 0);

  const updateStage = (index: number, field: 'name' | 'percentage', value: string) => {
    const newStages = [...stages];
    if (field === 'name') {
      newStages[index].name = value;
    } else {
      newStages[index].percentage = parseFloat(value) || 0;
    }
    setStages(newStages);
  };

  const addStage = () => {
    setStages([...stages, { name: '', percentage: 0 }]);
  };

  const removeStage = (index: number) => {
    if (stages.length <= 1) return;
    setStages(stages.filter((_, i) => i !== index));
  };

  return (
    <ToolLayout
      toolId="fin-contract"
      title="合同款项计算器"
      description="计算合同中分期付款的每期金额，支持自定义比例分配"
      hideInput
      outputValue=""
    >
      <div style={sectionStyle}>
        <div style={labelStyle}>合同总金额</div>
        <input style={{ ...inputStyle, maxWidth: 300 }} value={total} onChange={e => setTotal(e.target.value)} placeholder="输入合同总金额" type="number" step="0.01" />
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle}>分期设置</div>
        {stages.map((stage, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
            <input
              style={{ ...inputStyle, maxWidth: 150 }}
              value={stage.name}
              onChange={e => updateStage(i, 'name', e.target.value)}
              placeholder="阶段名称"
            />
            <input
              style={{ ...inputStyle, maxWidth: 80 }}
              value={stage.percentage || ''}
              onChange={e => updateStage(i, 'percentage', e.target.value)}
              placeholder="%"
              type="number"
              step="1"
            />
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)' }}>%</span>
            {stages.length > 1 && (
              <button style={{ ...btnBase, color: 'var(--color-red)' }} onClick={() => removeStage(i)}>删除</button>
            )}
          </div>
        ))}
        <button style={btnBase} onClick={addStage}>+ 添加阶段</button>
      </div>

      <div style={{ fontSize: 13, color: totalPct === 100 ? 'var(--color-green)' : 'var(--color-orange)', fontFamily: 'var(--font-sans)', marginBottom: 12 }}>
        合计: {totalPct}% {totalPct !== 100 ? '(不等于100%)' : '✓'}
      </div>

      {t > 0 && (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>阶段</th>
              <th style={thStyle}>比例</th>
              <th style={thStyle}>金额</th>
            </tr>
          </thead>
          <tbody>
            {stages.map((stage, i) => (
              <tr key={i}>
                <td style={tdStyle}>{stage.name || '-'}</td>
                <td style={tdStyle}>{stage.percentage}%</td>
                <td style={tdStyle}>{(t * stage.percentage / 100).toFixed(2)}</td>
              </tr>
            ))}
            <tr>
              <td style={{ ...tdStyle, fontWeight: 600 }}>合计</td>
              <td style={{ ...tdStyle, fontWeight: 600 }}>{totalPct}%</td>
              <td style={{ ...tdStyle, fontWeight: 600 }}>{(t * totalPct / 100).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      )}
    </ToolLayout>
  );
}
