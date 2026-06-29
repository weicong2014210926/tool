import React, { useState } from 'react';

const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%' };
const tableCell: React.CSSProperties = { padding: '8px 12px', borderBottom: '1px solid var(--border-light)', fontSize: 13 };

const containerStyle: React.CSSProperties = { maxWidth: 900, margin: '0 auto' };
const headerStyle: React.CSSProperties = { marginBottom: 24 };
const h1Style: React.CSSProperties = { fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', marginBottom: 8 };
const descStyle: React.CSSProperties = { fontSize: 14, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', lineHeight: 1.6 };
const thStyle: React.CSSProperties = { ...tableCell, fontWeight: 700, color: 'var(--text-secondary)', textAlign: 'left' as const, background: 'var(--bg-tool)' };
const continentTitle: React.CSSProperties = { fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', padding: '12px 0 8px', fontFamily: 'var(--font-sans)' };

const data: { continent: string; countries: { name: string; capital: string }[] }[] = [
  { continent: '亚洲', countries: [
    { name: '中国', capital: '北京' }, { name: '日本', capital: '东京' }, { name: '韩国', capital: '首尔' },
    { name: '印度', capital: '新德里' }, { name: '泰国', capital: '曼谷' }, { name: '越南', capital: '河内' },
    { name: '新加坡', capital: '新加坡' }, { name: '马来西亚', capital: '吉隆坡' }, { name: '印度尼西亚', capital: '雅加达' },
    { name: '菲律宾', capital: '马尼拉' }, { name: '沙特阿拉伯', capital: '利雅得' }, { name: '以色列', capital: '耶路撒冷' },
    { name: '土耳其', capital: '安卡拉' }, { name: '巴基斯坦', capital: '伊斯兰堡' }, { name: '阿联酋', capital: '阿布扎比' },
  ]},
  { continent: '欧洲', countries: [
    { name: '英国', capital: '伦敦' }, { name: '法国', capital: '巴黎' }, { name: '德国', capital: '柏林' },
    { name: '意大利', capital: '罗马' }, { name: '西班牙', capital: '马德里' }, { name: '荷兰', capital: '阿姆斯特丹' },
    { name: '俄罗斯', capital: '莫斯科' }, { name: '瑞典', capital: '斯德哥尔摩' }, { name: '挪威', capital: '奥斯陆' },
    { name: '丹麦', capital: '哥本哈根' }, { name: '芬兰', capital: '赫尔辛基' }, { name: '瑞士', capital: '伯尔尼' },
    { name: '奥地利', capital: '维也纳' }, { name: '比利时', capital: '布鲁塞尔' }, { name: '葡萄牙', capital: '里斯本' },
    { name: '波兰', capital: '华沙' }, { name: '爱尔兰', capital: '都柏林' },
  ]},
  { continent: '北美洲', countries: [
    { name: '美国', capital: '华盛顿' }, { name: '加拿大', capital: '渥太华' }, { name: '墨西哥', capital: '墨西哥城' },
    { name: '古巴', capital: '哈瓦那' },
  ]},
  { continent: '南美洲', countries: [
    { name: '巴西', capital: '巴西利亚' }, { name: '阿根廷', capital: '布宜诺斯艾利斯' }, { name: '智利', capital: '圣地亚哥' },
    { name: '秘鲁', capital: '利马' }, { name: '哥伦比亚', capital: '波哥大' },
  ]},
  { continent: '非洲', countries: [
    { name: '南非', capital: '比勒陀利亚' }, { name: '埃及', capital: '开罗' }, { name: '肯尼亚', capital: '内罗毕' },
    { name: '尼日利亚', capital: '阿布贾' }, { name: '埃塞俄比亚', capital: '亚的斯亚贝巴' },
  ]},
  { continent: '大洋洲', countries: [
    { name: '澳大利亚', capital: '堪培拉' }, { name: '新西兰', capital: '惠灵顿' },
  ]},
];

export default function Capitals() {
  const [search, setSearch] = useState('');
  const filtered = data.map((g) => ({
    ...g,
    countries: g.countries.filter((c) => c.name.includes(search) || c.capital.includes(search)),
  })).filter((g) => g.countries.length > 0);

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={h1Style}>世界各国首都</h1>
        <p style={descStyle}>按大洲分组展示世界各国及其首都信息</p>
      </div>
      <input style={{ ...inputStyle, maxWidth: 320, marginBottom: 16 }} placeholder="搜索国家或首都..." value={search} onChange={(e) => setSearch(e.target.value)} />
      {filtered.map((group) => (
        <div key={group.continent}>
          <div style={continentTitle}>{group.continent}（{group.countries.length}个）</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 16 }}>
            <thead>
              <tr>
                <th style={thStyle}>国家</th>
                <th style={thStyle}>首都</th>
              </tr>
            </thead>
            <tbody>
              {group.countries.map((c) => (
                <tr key={c.name}>
                  <td style={{ ...tableCell, fontWeight: 600 }}>{c.name}</td>
                  <td style={tableCell}>{c.capital}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
