import React, { useState } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const btnStyle: React.CSSProperties = { padding: '8px 16px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 2px 0 var(--border-color)', transition: 'all 150ms ease' };
const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };
const rowStyle: React.CSSProperties = { display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' };
const statCard: React.CSSProperties = { padding: '16px 20px', borderRadius: 14, border: '1px solid var(--border-light)', background: 'var(--bg-tool)', textAlign: 'center', minWidth: 100 };
const sectionStyle: React.CSSProperties = { marginBottom: 20 };
const statusStyle = (expired: boolean): React.CSSProperties => ({
  fontSize: 20, fontWeight: 700, padding: '12px 24px', borderRadius: 12, textAlign: 'center',
  background: expired ? 'var(--color-red)' : 'var(--color-green)',
  color: '#fff', fontFamily: 'var(--font-sans)',
});

export default function Expiry() {
  const [prodDate, setProdDate] = useState('');
  const [shelfLife, setShelfLife] = useState('');
  const [unit, setUnit] = useState('days');
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState<{ expired: boolean; remaining: number; expiryDate: string } | null>(null);

  const calc = () => {
    if (!prodDate || !shelfLife) return;
    const d = new Date(prodDate + 'T00:00:00');
    const n = parseInt(shelfLife);
    if (isNaN(n) || n <= 0) { setOutput('请输入有效的保质期'); return; }

    const expiry = new Date(d);
    switch (unit) {
      case 'days': expiry.setDate(expiry.getDate() + n); break;
      case 'months': expiry.setMonth(expiry.getMonth() + n); break;
      case 'years': expiry.setFullYear(expiry.getFullYear() + n); break;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const remainingMs = expiry.getTime() - today.getTime();
    const remainingDays = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));
    const expired = remainingDays < 0;
    const expiryStr = expiry.toLocaleDateString('zh-CN');

    setStatus({ expired, remaining: Math.max(0, remainingDays), expiryDate: expiryStr });
    setOutput(
      `生产日期: ${d.toLocaleDateString('zh-CN')}\n` +
      `保质期: ${n} ${unit === 'days' ? '天' : unit === 'months' ? '月' : '年'}\n` +
      `到期日期: ${expiryStr}\n` +
      `剩余天数: ${expired ? '0 (已过期)' : remainingDays + ' 天'}\n` +
      `状态: ${expired ? '已过期' : '仍有效'}`
    );
  };

  return (
    <ToolLayout
      toolId="date-expiry"
      title="保质期计算器"
      description="根据生产日期和保质期限计算食品、药品等物品的到期日期"
      hideInput
      outputValue={output}
    >
      <div style={sectionStyle}>
        <div style={labelStyle}>生产日期 & 保质期</div>
        <div style={rowStyle}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>生产日期</div>
            <input type="date" style={inputStyle} value={prodDate} onChange={e => setProdDate(e.target.value)} />
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>保质期</div>
            <input type="number" style={{ ...inputStyle, width: 80 }} value={shelfLife} onChange={e => setShelfLife(e.target.value)} placeholder="数量" />
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>单位</div>
            <select style={inputStyle} value={unit} onChange={e => setUnit(e.target.value)}>
              <option value="days">天</option>
              <option value="months">月</option>
              <option value="years">年</option>
            </select>
          </div>
          <button style={btnStyle} onClick={calc}>计算</button>
        </div>
      </div>
      {status && (
        <div style={{ marginBottom: 20 }}>
          <div style={statusStyle(status.expired)}>
            {status.expired ? '已过期' : `剩余 ${status.remaining} 天`}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
