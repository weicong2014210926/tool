import React, { useState } from 'react';

const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%' };
const tableCell: React.CSSProperties = { padding: '8px 12px', borderBottom: '1px solid var(--border-light)', fontSize: 13 };

const containerStyle: React.CSSProperties = { maxWidth: 900, margin: '0 auto' };
const headerStyle: React.CSSProperties = { marginBottom: 24 };
const h1Style: React.CSSProperties = { fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', marginBottom: 8 };
const descStyle: React.CSSProperties = { fontSize: 14, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', lineHeight: 1.6 };
const thStyle: React.CSSProperties = { ...tableCell, fontWeight: 700, color: 'var(--text-secondary)', textAlign: 'left' as const, background: 'var(--bg-tool)' };

const countries = [
  { cn: '中国', en: 'China', iso2: 'CN', iso3: 'CHN', code: '86' },
  { cn: '美国', en: 'United States', iso2: 'US', iso3: 'USA', code: '1' },
  { cn: '英国', en: 'United Kingdom', iso2: 'GB', iso3: 'GBR', code: '44' },
  { cn: '日本', en: 'Japan', iso2: 'JP', iso3: 'JPN', code: '81' },
  { cn: '韩国', en: 'South Korea', iso2: 'KR', iso3: 'KOR', code: '82' },
  { cn: '法国', en: 'France', iso2: 'FR', iso3: 'FRA', code: '33' },
  { cn: '德国', en: 'Germany', iso2: 'DE', iso3: 'DEU', code: '49' },
  { cn: '意大利', en: 'Italy', iso2: 'IT', iso3: 'ITA', code: '39' },
  { cn: '俄罗斯', en: 'Russia', iso2: 'RU', iso3: 'RUS', code: '7' },
  { cn: '加拿大', en: 'Canada', iso2: 'CA', iso3: 'CAN', code: '1' },
  { cn: '澳大利亚', en: 'Australia', iso2: 'AU', iso3: 'AUS', code: '61' },
  { cn: '印度', en: 'India', iso2: 'IN', iso3: 'IND', code: '91' },
  { cn: '巴西', en: 'Brazil', iso2: 'BR', iso3: 'BRA', code: '55' },
  { cn: '新加坡', en: 'Singapore', iso2: 'SG', iso3: 'SGP', code: '65' },
  { cn: '泰国', en: 'Thailand', iso2: 'TH', iso3: 'THA', code: '66' },
  { cn: '越南', en: 'Vietnam', iso2: 'VN', iso3: 'VNM', code: '84' },
  { cn: '马来西亚', en: 'Malaysia', iso2: 'MY', iso3: 'MYS', code: '60' },
  { cn: '印度尼西亚', en: 'Indonesia', iso2: 'ID', iso3: 'IDN', code: '62' },
  { cn: '菲律宾', en: 'Philippines', iso2: 'PH', iso3: 'PHL', code: '63' },
  { cn: '西班牙', en: 'Spain', iso2: 'ES', iso3: 'ESP', code: '34' },
  { cn: '荷兰', en: 'Netherlands', iso2: 'NL', iso3: 'NLD', code: '31' },
  { cn: '瑞典', en: 'Sweden', iso2: 'SE', iso3: 'SWE', code: '46' },
  { cn: '挪威', en: 'Norway', iso2: 'NO', iso3: 'NOR', code: '47' },
  { cn: '丹麦', en: 'Denmark', iso2: 'DK', iso3: 'DNK', code: '45' },
  { cn: '芬兰', en: 'Finland', iso2: 'FI', iso3: 'FIN', code: '358' },
  { cn: '瑞士', en: 'Switzerland', iso2: 'CH', iso3: 'CHE', code: '41' },
  { cn: '奥地利', en: 'Austria', iso2: 'AT', iso3: 'AUT', code: '43' },
  { cn: '比利时', en: 'Belgium', iso2: 'BE', iso3: 'BEL', code: '32' },
  { cn: '葡萄牙', en: 'Portugal', iso2: 'PT', iso3: 'PRT', code: '351' },
  { cn: '波兰', en: 'Poland', iso2: 'PL', iso3: 'POL', code: '48' },
  { cn: '土耳其', en: 'Turkey', iso2: 'TR', iso3: 'TUR', code: '90' },
  { cn: '沙特阿拉伯', en: 'Saudi Arabia', iso2: 'SA', iso3: 'SAU', code: '966' },
  { cn: '南非', en: 'South Africa', iso2: 'ZA', iso3: 'ZAF', code: '27' },
  { cn: '埃及', en: 'Egypt', iso2: 'EG', iso3: 'EGY', code: '20' },
  { cn: '墨西哥', en: 'Mexico', iso2: 'MX', iso3: 'MEX', code: '52' },
  { cn: '阿根廷', en: 'Argentina', iso2: 'AR', iso3: 'ARG', code: '54' },
  { cn: '新西兰', en: 'New Zealand', iso2: 'NZ', iso3: 'NZL', code: '64' },
  { cn: '阿联酋', en: 'UAE', iso2: 'AE', iso3: 'ARE', code: '971' },
  { cn: '以色列', en: 'Israel', iso2: 'IL', iso3: 'ISR', code: '972' },
  { cn: '爱尔兰', en: 'Ireland', iso2: 'IE', iso3: 'IRL', code: '353' },
  { cn: '巴基斯坦', en: 'Pakistan', iso2: 'PK', iso3: 'PAK', code: '92' },
  { cn: '孟加拉国', en: 'Bangladesh', iso2: 'BD', iso3: 'BGD', code: '880' },
];

export default function CountryCode() {
  const [search, setSearch] = useState('');
  const filtered = countries.filter((c) => c.cn.includes(search) || c.en.toLowerCase().includes(search.toLowerCase()) || c.code.includes(search));

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={h1Style}>国家区号代码</h1>
        <p style={descStyle}>查询世界各国/地区的国际域名缩写（ISO-2/ISO-3）和电话区号</p>
      </div>
      <input style={{ ...inputStyle, maxWidth: 320, marginBottom: 16 }} placeholder="搜索国家名或区号..." value={search} onChange={(e) => setSearch(e.target.value)} />
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={thStyle}>国家/地区</th>
              <th style={thStyle}>英文</th>
              <th style={thStyle}>ISO-2</th>
              <th style={thStyle}>ISO-3</th>
              <th style={thStyle}>电话区号</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.iso2}>
                <td style={{ ...tableCell, fontWeight: 600 }}>{c.cn}</td>
                <td style={tableCell}>{c.en}</td>
                <td style={{ ...tableCell, fontFamily: 'var(--font-mono)' }}>{c.iso2}</td>
                <td style={{ ...tableCell, fontFamily: 'var(--font-mono)' }}>{c.iso3}</td>
                <td style={{ ...tableCell, fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-blue)' }}>+{c.code}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
