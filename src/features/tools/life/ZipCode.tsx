import React, { useState } from 'react';

const btnStyle: React.CSSProperties = { padding: '8px 16px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 2px 0 var(--border-color)', transition: 'all 150ms ease' };
const btnPrimary: React.CSSProperties = { ...btnStyle, background: 'var(--color-blue)', color: '#fff', borderColor: 'var(--color-blue)' };
const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };
const tableCell: React.CSSProperties = { padding: '8px 12px', borderBottom: '1px solid var(--border-light)', fontSize: 13 };

const containerStyle: React.CSSProperties = { maxWidth: 900, margin: '0 auto' };
const headerStyle: React.CSSProperties = { marginBottom: 24 };
const h1Style: React.CSSProperties = { fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', marginBottom: 8 };
const descStyle: React.CSSProperties = { fontSize: 14, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', lineHeight: 1.6 };
const thStyle: React.CSSProperties = { ...tableCell, fontWeight: 700, color: 'var(--text-secondary)', textAlign: 'left' as const, background: 'var(--bg-tool)' };

const cityData: { city: string; zip: string; areaCode: string; province: string }[] = [
  { city: '北京', zip: '100000', areaCode: '010', province: '北京' },
  { city: '上海', zip: '200000', areaCode: '021', province: '上海' },
  { city: '天津', zip: '300000', areaCode: '022', province: '天津' },
  { city: '重庆', zip: '400000', areaCode: '023', province: '重庆' },
  { city: '广州', zip: '510000', areaCode: '020', province: '广东' },
  { city: '深圳', zip: '518000', areaCode: '0755', province: '广东' },
  { city: '东莞', zip: '523000', areaCode: '0769', province: '广东' },
  { city: '佛山', zip: '528000', areaCode: '0757', province: '广东' },
  { city: '珠海', zip: '519000', areaCode: '0756', province: '广东' },
  { city: '南京', zip: '210000', areaCode: '025', province: '江苏' },
  { city: '苏州', zip: '215000', areaCode: '0512', province: '江苏' },
  { city: '无锡', zip: '214000', areaCode: '0510', province: '江苏' },
  { city: '常州', zip: '213000', areaCode: '0519', province: '江苏' },
  { city: '杭州', zip: '310000', areaCode: '0571', province: '浙江' },
  { city: '宁波', zip: '315000', areaCode: '0574', province: '浙江' },
  { city: '温州', zip: '325000', areaCode: '0577', province: '浙江' },
  { city: '合肥', zip: '230000', areaCode: '0551', province: '安徽' },
  { city: '福州', zip: '350000', areaCode: '0591', province: '福建' },
  { city: '厦门', zip: '361000', areaCode: '0592', province: '福建' },
  { city: '南昌', zip: '330000', areaCode: '0791', province: '江西' },
  { city: '济南', zip: '250000', areaCode: '0531', province: '山东' },
  { city: '青岛', zip: '266000', areaCode: '0532', province: '山东' },
  { city: '郑州', zip: '450000', areaCode: '0371', province: '河南' },
  { city: '武汉', zip: '430000', areaCode: '027', province: '湖北' },
  { city: '长沙', zip: '410000', areaCode: '0731', province: '湖南' },
  { city: '成都', zip: '610000', areaCode: '028', province: '四川' },
  { city: '绵阳', zip: '621000', areaCode: '0816', province: '四川' },
  { city: '贵阳', zip: '550000', areaCode: '0851', province: '贵州' },
  { city: '昆明', zip: '650000', areaCode: '0871', province: '云南' },
  { city: '西安', zip: '710000', areaCode: '029', province: '陕西' },
  { city: '兰州', zip: '730000', areaCode: '0931', province: '甘肃' },
  { city: '西宁', zip: '810000', areaCode: '0971', province: '青海' },
  { city: '南宁', zip: '530000', areaCode: '0771', province: '广西' },
  { city: '桂林', zip: '541000', areaCode: '0773', province: '广西' },
  { city: '海口', zip: '570000', areaCode: '0898', province: '海南' },
  { city: '三亚', zip: '572000', areaCode: '0898', province: '海南' },
  { city: '石家庄', zip: '050000', areaCode: '0311', province: '河北' },
  { city: '唐山', zip: '063000', areaCode: '0315', province: '河北' },
  { city: '太原', zip: '030000', areaCode: '0351', province: '山西' },
  { city: '呼和浩特', zip: '010000', areaCode: '0471', province: '内蒙古' },
  { city: '沈阳', zip: '110000', areaCode: '024', province: '辽宁' },
  { city: '大连', zip: '116000', areaCode: '0411', province: '辽宁' },
  { city: '长春', zip: '130000', areaCode: '0431', province: '吉林' },
  { city: '哈尔滨', zip: '150000', areaCode: '0451', province: '黑龙江' },
  { city: '拉萨', zip: '850000', areaCode: '0891', province: '西藏' },
  { city: '银川', zip: '750000', areaCode: '0951', province: '宁夏' },
  { city: '乌鲁木齐', zip: '830000', areaCode: '0991', province: '新疆' },
  { city: '香港', zip: '999077', areaCode: '00852', province: '香港' },
  { city: '澳门', zip: '999078', areaCode: '00853', province: '澳门' },
  { city: '台北', zip: '100', areaCode: '008862', province: '台湾' },
];

export default function ZipCode() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<typeof cityData>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    setSearched(true);
    const q = search.trim().toLowerCase();
    if (!q) {
      setResults(cityData);
    } else {
      setResults(cityData.filter((c) => c.city.toLowerCase().includes(q) || c.province.toLowerCase().includes(q)));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={h1Style}>邮政编码查询</h1>
        <p style={descStyle}>查询中国主要城市的邮政编码和区号信息</p>
      </div>
      <div style={{ marginBottom: 16, display: 'flex', gap: 10 }}>
        <input
          style={{ ...inputStyle, maxWidth: 300 }}
          placeholder="输入城市名，如 北京"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button style={btnPrimary} onClick={handleSearch}>查询</button>
      </div>
      {searched && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={thStyle}>省份</th>
                <th style={thStyle}>城市</th>
                <th style={thStyle}>邮政编码</th>
                <th style={thStyle}>区号</th>
              </tr>
            </thead>
            <tbody>
              {results.map((c) => (
                <tr key={c.city}>
                  <td style={tableCell}>{c.province}</td>
                  <td style={{ ...tableCell, fontWeight: 600 }}>{c.city}</td>
                  <td style={{ ...tableCell, fontFamily: 'var(--font-mono)' }}>{c.zip}</td>
                  <td style={{ ...tableCell, fontFamily: 'var(--font-mono)' }}>{c.areaCode}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {results.length === 0 && (
            <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-muted)', fontSize: 13 }}>未找到匹配城市</div>
          )}
        </div>
      )}
    </div>
  );
}
