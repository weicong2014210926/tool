import React, { useState, useEffect } from 'react';

const btnStyle: React.CSSProperties = { padding: '8px 16px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 2px 0 var(--border-color)', transition: 'all 150ms ease' };
const activeBtn: React.CSSProperties = { ...btnStyle, background: 'var(--color-green)', color: '#fff', borderColor: 'var(--color-green)' };
const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };
const cardStyle: React.CSSProperties = { padding: '16px 20px', borderRadius: 14, border: '1px solid var(--border-light)', background: 'var(--bg-tool)' };
const infoRow: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-light)', fontSize: 13 };

const containerStyle: React.CSSProperties = { maxWidth: 900, margin: '0 auto' };
const headerStyle: React.CSSProperties = { marginBottom: 24 };
const h1Style: React.CSSProperties = { fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', marginBottom: 8 };
const descStyle: React.CSSProperties = { fontSize: 14, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', lineHeight: 1.6 };

type Unit = 'metric' | 'imperial';

const categories = [
  { label: '偏瘦', min: 0, max: 18.5, color: '#3498db' },
  { label: '正常', min: 18.5, max: 24, color: '#2ecc71' },
  { label: '偏胖', min: 24, max: 28, color: '#f39c12' },
  { label: '肥胖', min: 28, max: 32, color: '#e67e22' },
  { label: '重度肥胖', min: 32, max: 60, color: '#e74c3c' },
];

export default function BMI() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState<Unit>('metric');
  const [bmi, setBmi] = useState<number | null>(null);

  useEffect(() => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) { setBmi(null); return; }
    let val: number;
    if (unit === 'metric') val = w / ((h / 100) ** 2);
    else val = (w / (h ** 2)) * 703;
    setBmi(Math.round(val * 100) / 100);
  }, [height, weight, unit]);

  const cat = bmi !== null ? categories.find((c) => bmi >= c.min && bmi < c.max) : null;
  const catColor = cat?.color || 'var(--text-secondary)';
  const catText = cat?.label || '';

  const maxBar = 35;
  const bmiClamped = bmi !== null ? Math.min(bmi, maxBar) : 0;

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={h1Style}>BMI 指数计算</h1>
        <p style={descStyle}>计算身体质量指数（BMI），评估体重是否在健康范围内</p>
      </div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <button style={unit === 'metric' ? activeBtn : btnStyle} onClick={() => setUnit('metric')}>kg/cm</button>
        <button style={unit === 'imperial' ? activeBtn : btnStyle} onClick={() => setUnit('imperial')}>lb/inches</button>
      </div>
      <div style={{ display: 'flex', gap: 20, marginBottom: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={labelStyle}>{unit === 'metric' ? '身高 (cm)' : '身高 (inches)'}</div>
          <input style={{ ...inputStyle, maxWidth: 160 }} type="number" placeholder={unit === 'metric' ? '170' : '67'} value={height} onChange={(e) => setHeight(e.target.value)} />
        </div>
        <div>
          <div style={labelStyle}>{unit === 'metric' ? '体重 (kg)' : '体重 (lb)'}</div>
          <input style={{ ...inputStyle, maxWidth: 160 }} type="number" placeholder={unit === 'metric' ? '65' : '150'} value={weight} onChange={(e) => setWeight(e.target.value)} />
        </div>
      </div>
      {bmi !== null && (
        <div style={cardStyle}>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 40, fontWeight: 800, color: catColor, fontFamily: 'var(--font-mono)' }}>{bmi.toFixed(1)}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: catColor, marginTop: 4 }}>{catText}</div>
          </div>
          <div style={{ position: 'relative', height: 32, borderRadius: 8, background: 'var(--bg-primary)', overflow: 'hidden', marginBottom: 8 }}>
            {categories.map((c) => (
              <div key={c.label} style={{ position: 'absolute', left: `${(c.min / maxBar) * 100}%`, width: `${((c.max - c.min) / maxBar) * 100}%`, height: '100%', background: c.color + '30', borderRight: '1px solid ' + c.color }} />
            ))}
            <div style={{ position: 'absolute', left: `${(bmiClamped / maxBar) * 100}%`, top: 0, width: 3, height: '100%', background: '#000', borderRadius: 2, transform: 'translateX(-50%)' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)' }}>
            <span>0</span><span>18.5</span><span>24</span><span>28</span><span>32</span><span>35+</span>
          </div>
          <div style={{ ...infoRow, marginTop: 12, borderBottom: 'none' }}>
            <span style={{ color: 'var(--text-secondary)' }}>健康范围</span>
            <span>{unit === 'metric' ? '18.5 - 24' : '--'}</span>
          </div>
        </div>
      )}
    </div>
  );
}
