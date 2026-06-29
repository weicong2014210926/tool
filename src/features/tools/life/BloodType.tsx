import React, { useState, useEffect } from 'react';

const btnStyle: React.CSSProperties = { padding: '8px 16px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 2px 0 var(--border-color)', transition: 'all 150ms ease' };
const btnPrimary: React.CSSProperties = { ...btnStyle, background: 'var(--color-blue)', color: '#fff', borderColor: 'var(--color-blue)' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };
const cardStyle: React.CSSProperties = { padding: '16px 20px', borderRadius: 14, border: '1px solid var(--border-light)', background: 'var(--bg-tool)' };
const selectStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', cursor: 'pointer' };

const containerStyle: React.CSSProperties = { maxWidth: 900, margin: '0 auto' };
const headerStyle: React.CSSProperties = { marginBottom: 24 };
const h1Style: React.CSSProperties = { fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', marginBottom: 8 };
const descStyle: React.CSSProperties = { fontSize: 14, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', lineHeight: 1.6 };
const resultItem: React.CSSProperties = { marginBottom: 12 };
const barBg: React.CSSProperties = { height: 24, borderRadius: 6, background: 'var(--bg-primary)', overflow: 'hidden', marginTop: 4 };

const bloodTypes = ['A', 'B', 'AB', 'O'] as const;
type BloodType = (typeof bloodTypes)[number];

type Genotype = 'AA' | 'AO' | 'BB' | 'BO' | 'AB' | 'OO';

const alleles: Record<BloodType, string[]> = {
  A: ['A', 'O'], B: ['B', 'O'], AB: ['A', 'B'], O: ['O', 'O'],
};

function childBloodTypes(father: BloodType, mother: BloodType): { type: string; percent: number }[] {
  const fAlleles = alleles[father];
  const mAlleles = alleles[mother];
  const results: Record<string, number> = {};
  const total = fAlleles.length * mAlleles.length;
  for (const fa of fAlleles) {
    for (const ma of mAlleles) {
      const combo = [fa, ma].sort().join('');
      let phenotype: string;
      if (combo === 'AA' || combo === 'AO') phenotype = 'A';
      else if (combo === 'BB' || combo === 'BO') phenotype = 'B';
      else if (combo === 'AB') phenotype = 'AB';
      else phenotype = 'O';
      results[phenotype] = (results[phenotype] || 0) + 1;
    }
  }
  return Object.entries(results)
    .map(([type, count]) => ({ type, percent: Math.round((count / total) * 100) }))
    .sort((a, b) => b.percent - a.percent);
}

const typeColors: Record<string, string> = { A: '#e74c3c', B: '#3498db', AB: '#9b59b6', O: '#2ecc71' };

export default function BloodType() {
  const [father, setFather] = useState<BloodType | ''>('');
  const [mother, setMother] = useState<BloodType | ''>('');
  const [results, setResults] = useState<{ type: string; percent: number }[] | null>(null);

  const handleCalc = () => {
    if (!father || !mother) return;
    setResults(childBloodTypes(father, mother));
  };

  // Auto-calculate when both parents selected
  useEffect(() => {
    if (father && mother) {
      setResults(childBloodTypes(father, mother));
    } else {
      setResults(null);
    }
  }, [father, mother]);

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={h1Style}>血型遗传计算</h1>
        <p style={descStyle}>根据父母血型计算子女可能的血型及概率（基于孟德尔遗传定律）</p>
      </div>
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-end', marginBottom: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={labelStyle}>父亲血型</div>
          <select style={selectStyle} value={father} onChange={(e) => setFather(e.target.value as BloodType)}>
            <option value="">请选择</option>
            {bloodTypes.map((t) => <option key={t} value={t}>{t}型</option>)}
          </select>
        </div>
        <div>
          <div style={labelStyle}>母亲血型</div>
          <select style={selectStyle} value={mother} onChange={(e) => setMother(e.target.value as BloodType)}>
            <option value="">请选择</option>
            {bloodTypes.map((t) => <option key={t} value={t}>{t}型</option>)}
          </select>
        </div>
        <button style={btnPrimary} onClick={handleCalc} disabled={!father || !mother}>计算</button>
      </div>
      {results && (
        <div style={cardStyle}>
          <div style={{ ...labelStyle, marginBottom: 12 }}>子女可能血型</div>
          {results.map((r) => (
            <div key={r.type} style={resultItem}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 2 }}>
                <span style={{ fontWeight: 700, color: typeColors[r.type] }}>{r.type}型</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{r.percent}%</span>
              </div>
              <div style={barBg}>
                <div style={{ height: '100%', borderRadius: 6, background: typeColors[r.type], width: `${r.percent}%`, transition: 'width 500ms ease' }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
