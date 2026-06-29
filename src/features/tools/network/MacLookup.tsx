import React, { useState } from 'react';

const btnPrimary: React.CSSProperties = { padding: '8px 16px', borderRadius: 10, border: '1px solid var(--color-blue)', background: 'var(--color-blue)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 2px 0 var(--border-color)', transition: 'all 150ms ease' };
const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };
const cardStyle: React.CSSProperties = { padding: '16px 20px', borderRadius: 14, border: '1px solid var(--border-light)', background: 'var(--bg-tool)' };
const infoRow: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-light)', fontSize: 13 };
const errorStyle: React.CSSProperties = { color: 'var(--color-red)', fontSize: 13, marginTop: 6, fontFamily: 'var(--font-sans)' };

const containerStyle: React.CSSProperties = { maxWidth: 900, margin: '0 auto' };
const headerStyle: React.CSSProperties = { marginBottom: 24 };
const h1Style: React.CSSProperties = { fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', marginBottom: 8 };
const descStyle: React.CSSProperties = { fontSize: 14, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', lineHeight: 1.6 };

const ouiMap: Record<string, string> = {
  '00:1A:11': 'Google', '00:1B:63': 'Apple', '00:0C:29': 'VMware',
  'F0:1F:AF': 'Xiaomi', '28:6C:07': 'Sony', '00:1E:65': 'Huawei',
  '00:25:00': 'Apple', '00:1D:92': 'Microsoft', '00:1A:A0': 'Nokia',
  '00:01:42': 'Cisco', '00:24:B2': 'Samsung', '00:13:CE': 'Intel',
  '00:1E:C2': 'Apple', '00:26:BB': 'Apple', '00:25:4B': 'Apple',
  '00:23:DF': 'Apple', '00:1F:F3': 'Apple', '00:21:E9': 'Apple',
  '00:22:41': 'Apple', '00:23:12': 'Apple', '00:24:36': 'Apple',
  '00:26:B0': 'Apple', '00:26:08': 'Apple', '00:23:32': 'Apple',
  '00:25:BC': 'Apple', '00:1E:52': 'Apple', '00:1F:5B': 'Apple',
  '08:00:27': 'Oracle', '00:15:5D': 'Microsoft Hyper-V',
  '00:05:69': 'VMware', '00:50:56': 'VMware', '3C:15:C2': 'Apple',
  'B8:27:EB': 'Raspberry Pi', 'DC:A6:32': 'Raspberry Pi',
  'E4:5F:01': 'Raspberry Pi', 'B8:47:C6': 'Motorola',
  '00:0A:95': 'Sony Ericsson', '00:16:CB': 'Apple',
  '60:A3:7D': 'Samsung', 'CC:46:D6': 'Cisco', '00:1A:70': 'Cisco',
  '00:0A:F3': 'Samsung', '00:19:D1': 'Huawei', '84:2B:2B': 'Dell',
  '00:26:B9': 'Dell', 'D4:BE:D9': 'Dell', '5C:26:0A': 'Dell',
  'C8:1F:66': 'Dell', '00:02:B3': 'Intel', '00:03:47': 'Intel',
  '00:04:23': 'Intel', '00:07:E9': 'Intel', '00:0C:F1': 'Intel',
  '00:11:11': 'Intel', '00:12:F0': 'Intel', '00:13:02': 'Intel',
  '00:14:A5': 'Intel', '00:16:6F': 'Intel',
};

export default function MacLookup() {
  const [mac, setMac] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState('');

  const isValidMac = (addr: string): boolean => {
    return /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(addr);
  };

  const handleLookup = () => {
    setError('');
    setResult(null);
    const addr = mac.trim().toUpperCase();
    if (!isValidMac(addr)) {
      setError('请输入有效的MAC地址 (格式: XX:XX:XX:XX:XX:XX)');
      return;
    }
    const oui = addr.substring(0, 8).replace(/-/g, ':');
    const manufacturer = ouiMap[oui] || '未知厂商';
    setResult(manufacturer);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter') handleLookup(); };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={h1Style}>MAC 地址查询</h1>
        <p style={descStyle}>通过MAC地址前3个字节（OUI）查询网卡制造商信息</p>
      </div>
      <div style={{ marginBottom: 16 }}>
        <div style={labelStyle}>MAC 地址</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <input style={{ ...inputStyle, maxWidth: 300, fontFamily: 'var(--font-mono)' }} placeholder="XX:XX:XX:XX:XX:XX" value={mac} onChange={(e) => setMac(e.target.value)} onKeyDown={handleKeyDown} />
          <button style={btnPrimary} onClick={handleLookup}>查询</button>
        </div>
        {error && <div style={errorStyle}>{error}</div>}
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>示例: 00:1A:11:22:33:44 (Google), F0:1F:AF:AA:BB:CC (Xiaomi)</div>
      </div>
      {result && (
        <div style={cardStyle}>
          <div style={infoRow}><span style={{ color: 'var(--text-secondary)' }}>MAC地址</span><span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{mac}</span></div>
          <div style={infoRow}><span style={{ color: 'var(--text-secondary)' }}>OUI</span><span style={{ fontFamily: 'var(--font-mono)' }}>{mac.trim().toUpperCase().substring(0, 8).replace(/-/g, ':')}</span></div>
          <div style={{ ...infoRow, borderBottom: 'none' }}><span style={{ color: 'var(--text-secondary)' }}>制造商</span><span style={{ fontWeight: 600, color: 'var(--color-blue)' }}>{result}</span></div>
        </div>
      )}
    </div>
  );
}
