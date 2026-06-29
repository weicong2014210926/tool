import React, { useState } from 'react';
import { showToast } from '../../../components/ui/Toast';

const btnStyle: React.CSSProperties = { padding: '6px 12px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 2px 0 var(--border-color)', transition: 'all 150ms ease' };
const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%' };
const cardStyle: React.CSSProperties = { padding: '16px 20px', borderRadius: 14, border: '1px solid var(--border-light)', background: 'var(--bg-tool)' };

const containerStyle: React.CSSProperties = { maxWidth: 900, margin: '0 auto' };
const headerStyle: React.CSSProperties = { marginBottom: 24 };
const h1Style: React.CSSProperties = { fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', marginBottom: 8 };
const descStyle: React.CSSProperties = { fontSize: 14, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', lineHeight: 1.6 };
const sectionTitle: React.CSSProperties = { fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12, marginTop: 20, fontFamily: 'var(--font-sans)' };
const itemStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-light)', fontSize: 13 };

const phoneData: { category: string; items: { name: string; number: string }[] }[] = [
  {
    category: '紧急',
    items: [
      { name: '报警服务', number: '110' },
      { name: '火警', number: '119' },
      { name: '急救中心', number: '120' },
      { name: '交通事故', number: '122' },
    ],
  },
  {
    category: '生活',
    items: [
      { name: '政府热线', number: '12345' },
      { name: '消费者投诉', number: '12315' },
      { name: '社保服务', number: '12333' },
      { name: '环保热线', number: '12369' },
    ],
  },
  {
    category: '通讯',
    items: [
      { name: '中国电信', number: '10000' },
      { name: '中国联通', number: '10010' },
      { name: '中国移动', number: '10086' },
    ],
  },
  {
    category: '银行',
    items: [
      { name: '中国银行', number: '95566' },
      { name: '工商银行', number: '95588' },
      { name: '建设银行', number: '95533' },
      { name: '农业银行', number: '95599' },
      { name: '招商银行', number: '95555' },
      { name: '交通银行', number: '95559' },
    ],
  },
  {
    category: '快递',
    items: [
      { name: '顺丰', number: '95338' },
      { name: '申通', number: '95543' },
      { name: '圆通', number: '95554' },
      { name: '中通', number: '95311' },
      { name: '韵达', number: '95320' },
    ],
  },
];

export default function PhoneList() {
  const [search, setSearch] = useState('');

  const filtered = phoneData.map((group) => ({
    ...group,
    items: group.items.filter(
      (item) =>
        item.name.includes(search) || item.number.includes(search)
    ),
  })).filter((group) => group.items.length > 0);

  const handleCopy = async (number: string) => {
    try {
      await navigator.clipboard.writeText(number);
      showToast(`已复制 ${number}`, 'success');
    } catch {
      showToast('复制失败', 'error');
    }
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={h1Style}>常用电话号码</h1>
        <p style={descStyle}>收录中国常用紧急、生活、通讯、银行、快递等服务电话号码</p>
      </div>
      <input
        style={{ ...inputStyle, maxWidth: 320, marginBottom: 16 }}
        placeholder="搜索电话名称或号码..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {filtered.map((group) => (
        <div key={group.category}>
          <div style={sectionTitle}>{group.category}</div>
          <div style={cardStyle}>
            {group.items.map((item) => (
              <div key={item.number} style={itemStyle}>
                <span style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{item.number}</span>
                  <button style={btnStyle} onClick={() => handleCopy(item.number)}>复制</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
