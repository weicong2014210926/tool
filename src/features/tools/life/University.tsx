import React, { useState } from 'react';

const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%' };
const tableCell: React.CSSProperties = { padding: '8px 12px', borderBottom: '1px solid var(--border-light)', fontSize: 13 };
const levelBadge: React.CSSProperties = { padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700 };

const containerStyle: React.CSSProperties = { maxWidth: 900, margin: '0 auto' };
const headerStyle: React.CSSProperties = { marginBottom: 24 };
const h1Style: React.CSSProperties = { fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', marginBottom: 8 };
const descStyle: React.CSSProperties = { fontSize: 14, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', lineHeight: 1.6 };
const thStyle: React.CSSProperties = { ...tableCell, fontWeight: 700, color: 'var(--text-secondary)', textAlign: 'left' as const, background: 'var(--bg-tool)' };
const statCard: React.CSSProperties = { padding: '12px 16px', borderRadius: 10, border: '1px solid var(--border-light)', background: 'var(--bg-card)', textAlign: 'center' as const };

const universities = [
  { name: '北京大学', city: '北京', level: '985', type: '综合' },
  { name: '清华大学', city: '北京', level: '985', type: '理工' },
  { name: '复旦大学', city: '上海', level: '985', type: '综合' },
  { name: '上海交通大学', city: '上海', level: '985', type: '综合' },
  { name: '浙江大学', city: '杭州', level: '985', type: '综合' },
  { name: '南京大学', city: '南京', level: '985', type: '综合' },
  { name: '中国科学技术大学', city: '合肥', level: '985', type: '理工' },
  { name: '哈尔滨工业大学', city: '哈尔滨', level: '985', type: '理工' },
  { name: '西安交通大学', city: '西安', level: '985', type: '综合' },
  { name: '武汉大学', city: '武汉', level: '985', type: '综合' },
  { name: '华中科技大学', city: '武汉', level: '985', type: '理工' },
  { name: '中国人民大学', city: '北京', level: '985', type: '综合' },
  { name: '北京航空航天大学', city: '北京', level: '985', type: '理工' },
  { name: '北京师范大学', city: '北京', level: '985', type: '师范' },
  { name: '南开大学', city: '天津', level: '985', type: '综合' },
  { name: '天津大学', city: '天津', level: '985', type: '理工' },
  { name: '中山大学', city: '广州', level: '985', type: '综合' },
  { name: '华南理工大学', city: '广州', level: '985', type: '理工' },
  { name: '厦门大学', city: '厦门', level: '985', type: '综合' },
  { name: '四川大学', city: '成都', level: '985', type: '综合' },
  { name: '电子科技大学', city: '成都', level: '985', type: '理工' },
  { name: '山东大学', city: '济南', level: '985', type: '综合' },
  { name: '吉林大学', city: '长春', level: '985', type: '综合' },
  { name: '兰州大学', city: '兰州', level: '985', type: '综合' },
  { name: '同济大学', city: '上海', level: '985', type: '理工' },
  { name: '北京理工大学', city: '北京', level: '985', type: '理工' },
  { name: '中国农业大学', city: '北京', level: '985', type: '农林' },
  { name: '中央民族大学', city: '北京', level: '985', type: '民族' },
  { name: '上海财经大学', city: '上海', level: '211', type: '财经' },
  { name: '对外经济贸易大学', city: '北京', level: '211', type: '财经' },
  { name: '北京外国语大学', city: '北京', level: '211', type: '语言' },
  { name: '中国政法大学', city: '北京', level: '211', type: '政法' },
  { name: '北京邮电大学', city: '北京', level: '211', type: '理工' },
  { name: '中国传媒大学', city: '北京', level: '211', type: '艺术' },
  { name: '武汉理工大学', city: '武汉', level: '211', type: '理工' },
  { name: '南京航空航天大学', city: '南京', level: '211', type: '理工' },
  { name: '华东师范大学', city: '上海', level: '985', type: '师范' },
  { name: '深圳大学', city: '深圳', level: '普通', type: '综合' },
  { name: '南方科技大学', city: '深圳', level: '双一流', type: '理工' },
  { name: '北京协和医学院', city: '北京', level: '双一流', type: '医药' },
  { name: '中国科学院大学', city: '北京', level: '双一流', type: '综合' },
  { name: '国防科技大学', city: '长沙', level: '985', type: '军事' },
  { name: '中南大学', city: '长沙', level: '985', type: '综合' },
  { name: '湖南大学', city: '长沙', level: '985', type: '综合' },
];

export default function University() {
  const [search, setSearch] = useState('');
  const filtered = universities.filter((u) => u.name.includes(search) || u.city.includes(search));
  const total = universities.length;
  const count985 = universities.filter((u) => u.level === '985').length;
  const count211 = universities.filter((u) => u.level === '211').length;

  const levelColor = (level: string) => {
    if (level === '985') return '#e74c3c';
    if (level === '211') return '#3498db';
    if (level === '双一流') return '#2ecc71';
    return 'var(--text-secondary)';
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={h1Style}>中国大学查询</h1>
        <p style={descStyle}>查询中国主要高校信息，包括所在城市、办学层次和学校类型</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 16 }}>
        <div style={statCard}><div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>{total}</div><div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>收录总数</div></div>
        <div style={statCard}><div style={{ fontSize: 24, fontWeight: 800, color: '#e74c3c' }}>{count985}</div><div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>985院校</div></div>
        <div style={statCard}><div style={{ fontSize: 24, fontWeight: 800, color: '#3498db' }}>{count211}</div><div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>211院校</div></div>
      </div>
      <input style={{ ...inputStyle, maxWidth: 320, marginBottom: 16 }} placeholder="搜索大学名称或城市..." value={search} onChange={(e) => setSearch(e.target.value)} />
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={thStyle}>大学名称</th>
              <th style={thStyle}>城市</th>
              <th style={thStyle}>层次</th>
              <th style={thStyle}>类型</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr key={i}>
                <td style={{ ...tableCell, fontWeight: 600 }}>{u.name}</td>
                <td style={tableCell}>{u.city}</td>
                <td style={tableCell}><span style={{ ...levelBadge, background: levelColor(u.level) + '20', color: levelColor(u.level) }}>{u.level}</span></td>
                <td style={tableCell}>{u.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-muted)', fontSize: 13 }}>未找到匹配大学</div>}
      </div>
    </div>
  );
}
