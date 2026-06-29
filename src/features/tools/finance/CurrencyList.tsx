import React, { useState } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };
const sectionStyle: React.CSSProperties = { marginBottom: 20 };
const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', fontSize: 12, fontFamily: 'var(--font-sans)' };
const thStyle: React.CSSProperties = { padding: '8px 12px', borderBottom: '1px solid var(--border-color)', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)', background: 'var(--bg-card)', position: 'sticky' as const, top: 0 };
const tdStyle: React.CSSProperties = { padding: '8px 12px', borderBottom: '1px solid var(--border-light)', color: 'var(--text-primary)' };

const currencies = [
  { country: '中国', currency: '人民币', symbol: '¥', code: 'CNY' },
  { country: '美国', currency: '美元', symbol: '$', code: 'USD' },
  { country: '欧盟', currency: '欧元', symbol: '€', code: 'EUR' },
  { country: '英国', currency: '英镑', symbol: '£', code: 'GBP' },
  { country: '日本', currency: '日元', symbol: '¥', code: 'JPY' },
  { country: '韩国', currency: '韩元', symbol: '₩', code: 'KRW' },
  { country: '香港', currency: '港元', symbol: 'HK$', code: 'HKD' },
  { country: '澳大利亚', currency: '澳元', symbol: 'A$', code: 'AUD' },
  { country: '加拿大', currency: '加元', symbol: 'C$', code: 'CAD' },
  { country: '瑞士', currency: '瑞士法郎', symbol: 'CHF', code: 'CHF' },
  { country: '新加坡', currency: '新加坡元', symbol: 'S$', code: 'SGD' },
  { country: '印度', currency: '印度卢比', symbol: '₹', code: 'INR' },
  { country: '俄罗斯', currency: '俄罗斯卢布', symbol: '₽', code: 'RUB' },
  { country: '巴西', currency: '巴西雷亚尔', symbol: 'R$', code: 'BRL' },
  { country: '墨西哥', currency: '墨西哥比索', symbol: 'Mex$', code: 'MXN' },
  { country: '泰国', currency: '泰铢', symbol: '฿', code: 'THB' },
  { country: '越南', currency: '越南盾', symbol: '₫', code: 'VND' },
  { country: '马来西亚', currency: '马来西亚林吉特', symbol: 'RM', code: 'MYR' },
  { country: '菲律宾', currency: '菲律宾比索', symbol: '₱', code: 'PHP' },
  { country: '印度尼西亚', currency: '印尼盾', symbol: 'Rp', code: 'IDR' },
  { country: '台湾', currency: '新台币', symbol: 'NT$', code: 'TWD' },
  { country: '澳门', currency: '澳门元', symbol: 'MOP$', code: 'MOP' },
  { country: '新西兰', currency: '新西兰元', symbol: 'NZ$', code: 'NZD' },
  { country: '瑞典', currency: '瑞典克朗', symbol: 'kr', code: 'SEK' },
  { country: '挪威', currency: '挪威克朗', symbol: 'kr', code: 'NOK' },
  { country: '丹麦', currency: '丹麦克朗', symbol: 'kr', code: 'DKK' },
  { country: '南非', currency: '南非兰特', symbol: 'R', code: 'ZAR' },
  { country: '土耳其', currency: '土耳其里拉', symbol: '₺', code: 'TRY' },
  { country: '沙特阿拉伯', currency: '沙特里亚尔', symbol: '﷼', code: 'SAR' },
  { country: '阿联酋', currency: '阿联酋迪拉姆', symbol: 'د.إ', code: 'AED' },
  { country: '埃及', currency: '埃及镑', symbol: 'E£', code: 'EGP' },
  { country: '尼日利亚', currency: '尼日利亚奈拉', symbol: '₦', code: 'NGN' },
  { country: '阿根廷', currency: '阿根廷比索', symbol: 'AR$', code: 'ARS' },
  { country: '智利', currency: '智利比索', symbol: 'CLP$', code: 'CLP' },
  { country: '哥伦比亚', currency: '哥伦比亚比索', symbol: 'COL$', code: 'COP' },
  { country: '秘鲁', currency: '秘鲁索尔', symbol: 'S/', code: 'PEN' },
  { country: '以色列', currency: '以色列新谢克尔', symbol: '₪', code: 'ILS' },
  { country: '波兰', currency: '波兰兹罗提', symbol: 'zł', code: 'PLN' },
  { country: '捷克', currency: '捷克克朗', symbol: 'Kč', code: 'CZK' },
  { country: '匈牙利', currency: '匈牙利福林', symbol: 'Ft', code: 'HUF' },
  { country: '罗马尼亚', currency: '罗马尼亚列伊', symbol: 'lei', code: 'RON' },
  { country: '乌克兰', currency: '乌克兰格里夫纳', symbol: '₴', code: 'UAH' },
  { country: '巴基斯坦', currency: '巴基斯坦卢比', symbol: '₨', code: 'PKR' },
  { country: '孟加拉国', currency: '孟加拉塔卡', symbol: '৳', code: 'BDT' },
  { country: '伊朗', currency: '伊朗里亚尔', symbol: '﷼', code: 'IRR' },
  { country: '伊拉克', currency: '伊拉克第纳尔', symbol: 'ع.د', code: 'IQD' },
  { country: '科威特', currency: '科威特第纳尔', symbol: 'د.ك', code: 'KWD' },
  { country: '卡塔尔', currency: '卡塔尔里亚尔', symbol: 'ر.ق', code: 'QAR' },
  { country: '摩洛哥', currency: '摩洛哥迪拉姆', symbol: 'د.م.', code: 'MAD' },
  { country: '肯尼亚', currency: '肯尼亚先令', symbol: 'KSh', code: 'KES' },
  { country: '加纳', currency: '加纳塞地', symbol: 'GH₵', code: 'GHS' },
  { country: '哈萨克斯坦', currency: '哈萨克斯坦坚戈', symbol: '₸', code: 'KZT' },
];

export default function CurrencyList() {
  const [search, setSearch] = useState('');

  const filtered = currencies.filter(c =>
    c.country.includes(search) ||
    c.currency.includes(search) ||
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    c.symbol.includes(search)
  );

  return (
    <ToolLayout
      toolId="fin-currency-list"
      title="世界各国货币查询"
      description="查询世界各国使用的货币名称、货币代码和货币符号"
      hideInput
      outputValue=""
    >
      <div style={sectionStyle}>
        <div style={labelStyle}>搜索货币</div>
        <input
          style={{ ...inputStyle, maxWidth: 400 }}
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="输入国家、货币名称或代码..."
        />
      </div>
      <div style={{ maxHeight: 500, overflow: 'auto' }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>国家/地区</th>
              <th style={thStyle}>货币名称</th>
              <th style={thStyle}>符号</th>
              <th style={thStyle}>ISO代码</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => (
              <tr key={i}>
                <td style={tdStyle}>{c.country}</td>
                <td style={tdStyle}>{c.currency}</td>
                <td style={tdStyle}>{c.symbol}</td>
                <td style={tdStyle}>{c.code}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8, fontFamily: 'var(--font-sans)' }}>
        共 {filtered.length} 种货币
      </div>
    </ToolLayout>
  );
}
