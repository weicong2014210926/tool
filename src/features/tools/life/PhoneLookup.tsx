import React, { useState } from 'react';
import '../../../layouts/ToolLayout';

const btnStyle: React.CSSProperties = { padding: '8px 16px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 2px 0 var(--border-color)', transition: 'all 150ms ease' };
const btnPrimary: React.CSSProperties = { ...btnStyle, background: 'var(--color-blue)', color: '#fff', borderColor: 'var(--color-blue)' };
const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };
const cardStyle: React.CSSProperties = { padding: '16px 20px', borderRadius: 14, border: '1px solid var(--border-light)', background: 'var(--bg-tool)' };
const infoRow: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-light)', fontSize: 13 };

const containerStyle: React.CSSProperties = { maxWidth: 900, margin: '0 auto' };
const headerStyle: React.CSSProperties = { marginBottom: 24 };
const h1Style: React.CSSProperties = { fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', marginBottom: 8 };
const descStyle: React.CSSProperties = { fontSize: 14, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', lineHeight: 1.6 };
const errorStyle: React.CSSProperties = { color: 'var(--color-red)', fontSize: 13, marginTop: 6, fontFamily: 'var(--font-sans)' };

const carrierPatterns: Record<string, { carrier: string; province: string }> = {
  '134': { carrier: '中国移动', province: '全国' }, '135': { carrier: '中国移动', province: '全国' },
  '136': { carrier: '中国移动', province: '全国' }, '137': { carrier: '中国移动', province: '全国' },
  '138': { carrier: '中国移动', province: '全国' }, '139': { carrier: '中国移动', province: '全国' },
  '147': { carrier: '中国移动', province: '全国' }, '148': { carrier: '中国移动', province: '全国' },
  '150': { carrier: '中国移动', province: '全国' }, '151': { carrier: '中国移动', province: '全国' },
  '152': { carrier: '中国移动', province: '全国' }, '157': { carrier: '中国移动', province: '全国' },
  '158': { carrier: '中国移动', province: '全国' }, '159': { carrier: '中国移动', province: '全国' },
  '165': { carrier: '中国移动', province: '全国' }, '172': { carrier: '中国移动', province: '全国' },
  '178': { carrier: '中国移动', province: '全国' }, '182': { carrier: '中国移动', province: '全国' },
  '183': { carrier: '中国移动', province: '全国' }, '184': { carrier: '中国移动', province: '全国' },
  '187': { carrier: '中国移动', province: '全国' }, '188': { carrier: '中国移动', province: '全国' },
  '195': { carrier: '中国移动', province: '全国' }, '197': { carrier: '中国移动', province: '全国' },
  '198': { carrier: '中国移动', province: '全国' },
  '130': { carrier: '中国联通', province: '全国' }, '131': { carrier: '中国联通', province: '全国' },
  '132': { carrier: '中国联通', province: '全国' }, '145': { carrier: '中国联通', province: '全国' },
  '146': { carrier: '中国联通', province: '全国' }, '155': { carrier: '中国联通', province: '全国' },
  '156': { carrier: '中国联通', province: '全国' }, '166': { carrier: '中国联通', province: '全国' },
  '167': { carrier: '中国联通', province: '全国' }, '171': { carrier: '中国联通', province: '全国' },
  '175': { carrier: '中国联通', province: '全国' }, '176': { carrier: '中国联通', province: '全国' },
  '185': { carrier: '中国联通', province: '全国' }, '186': { carrier: '中国联通', province: '全国' },
  '196': { carrier: '中国联通', province: '全国' },
  '133': { carrier: '中国电信', province: '全国' }, '149': { carrier: '中国电信', province: '全国' },
  '153': { carrier: '中国电信', province: '全国' }, '162': { carrier: '中国电信', province: '全国' },
  '170': { carrier: '中国电信', province: '全国' }, '173': { carrier: '中国电信', province: '全国' },
  '174': { carrier: '中国电信', province: '全国' }, '177': { carrier: '中国电信', province: '全国' },
  '180': { carrier: '中国电信', province: '全国' }, '181': { carrier: '中国电信', province: '全国' },
  '189': { carrier: '中国电信', province: '全国' }, '190': { carrier: '中国电信', province: '全国' },
  '191': { carrier: '中国电信', province: '全国' }, '193': { carrier: '中国电信', province: '全国' },
  '199': { carrier: '中国电信', province: '全国' },
};

const provinceByPrefix: Record<string, string> = {
  '1340': '北京', '1341': '上海', '1342': '广东', '1343': '江苏', '1344': '浙江',
  '1350': '北京', '1351': '广东', '1352': '上海', '1353': '江苏', '1354': '浙江',
  '1360': '广东', '1361': '北京', '1362': '上海', '1363': '四川',
  '1370': '北京', '1371': '广东', '1372': '上海',
  '1380': '北京', '1381': '广东', '1382': '上海', '1383': '江苏',
  '1390': '广东', '1391': '北京', '1392': '上海', '1393': '浙江',
};

export default function PhoneLookup() {
  const [phone, setPhone] = useState('');
  const [result, setResult] = useState<{ province: string; city: string; carrier: string } | null>(null);
  const [error, setError] = useState('');

  const handleLookup = () => {
    setError('');
    setResult(null);
    const num = phone.trim();
    if (!/^1\d{10}$/.test(num)) {
      setError('请输入正确的11位手机号码（以1开头）');
      return;
    }
    const prefix3 = num.substring(0, 3);
    const prefix4 = num.substring(0, 4);
    const info = carrierPatterns[prefix3];
    if (!info) {
      setError('未识别的手机号段');
      return;
    }
    const prov = provinceByPrefix[prefix4] || '全国';
    setResult({ province: prov, city: prov === '全国' ? '未知' : prov, carrier: info.carrier });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLookup();
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={h1Style}>手机号码归属地查询</h1>
        <p style={descStyle}>输入中国大陆11位手机号码，查询所属运营商和归属地信息</p>
      </div>
      <div style={{ marginBottom: 16 }}>
        <div style={labelStyle}>手机号码</div>
        <input
          style={{ ...inputStyle, maxWidth: 320 }}
          placeholder="输入手机号码，如 13800138000"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        {error && <div style={errorStyle}>{error}</div>}
      </div>
      <button style={btnPrimary} onClick={handleLookup}>查询</button>
      {result && (
        <div style={{ ...cardStyle, marginTop: 20 }}>
          <div style={infoRow}><span style={{ color: 'var(--text-secondary)' }}>号码</span><span style={{ fontWeight: 600 }}>{phone}</span></div>
          <div style={infoRow}><span style={{ color: 'var(--text-secondary)' }}>运营商</span><span style={{ fontWeight: 600, color: 'var(--color-blue)' }}>{result.carrier}</span></div>
          <div style={infoRow}><span style={{ color: 'var(--text-secondary)' }}>省份</span><span>{result.province}</span></div>
          <div style={{ ...infoRow, borderBottom: 'none' }}><span style={{ color: 'var(--text-secondary)' }}>城市</span><span>{result.city}</span></div>
        </div>
      )}
    </div>
  );
}
