import React, { useState } from 'react';

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

const provinceMap: Record<string, string> = {
  '11': '北京', '12': '天津', '13': '河北', '14': '山西', '15': '内蒙古',
  '21': '辽宁', '22': '吉林', '23': '黑龙江',
  '31': '上海', '32': '江苏', '33': '浙江', '34': '安徽', '35': '福建', '36': '江西', '37': '山东',
  '41': '河南', '42': '湖北', '43': '湖南',
  '44': '广东', '45': '广西', '46': '海南',
  '50': '重庆', '51': '四川', '52': '贵州', '53': '云南', '54': '西藏',
  '61': '陕西', '62': '甘肃', '63': '青海', '64': '宁夏', '65': '新疆',
  '71': '台湾', '81': '香港', '82': '澳门',
};

const weightFactors = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
const checkCodes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];

function validateIdCard(id: string): string | null {
  if (!/^\d{17}[\dXx]$/.test(id)) return '身份证号必须为18位，末位可以是数字或X';
  const birth = id.substring(6, 14);
  if (!/^\d{8}$/.test(birth)) return '出生日期格式不正确';
  const year = parseInt(birth.substring(0, 4));
  const month = parseInt(birth.substring(4, 6));
  const day = parseInt(birth.substring(6, 8));
  if (year < 1900 || year > new Date().getFullYear()) return '出生年份无效';
  if (month < 1 || month > 12) return '出生月份无效';
  const maxDay = new Date(year, month, 0).getDate();
  if (day < 1 || day > maxDay) return '出生日期无效';
  let sum = 0;
  for (let i = 0; i < 17; i++) sum += parseInt(id[i]) * weightFactors[i];
  const expected = checkCodes[sum % 11];
  if (id[17].toUpperCase() !== expected) return '校验位不正确，身份证号可能有误';
  return null;
}

export default function IdCard() {
  const [id, setId] = useState('');
  const [info, setInfo] = useState<{ province: string; birth: string; age: number; gender: string; valid: boolean } | null>(null);
  const [error, setError] = useState('');

  const handleCheck = () => {
    setError('');
    setInfo(null);
    const num = id.trim().toUpperCase();
    const err = validateIdCard(num);
    if (err) { setError(err); return; }
    const province = provinceMap[num.substring(0, 2)] || '未知';
    const birth = `${num.substring(6, 10)}-${num.substring(10, 12)}-${num.substring(12, 14)}`;
    const birthDate = new Date(birth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    if (today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) age--;
    const gender = parseInt(num[16]) % 2 === 1 ? '男' : '女';
    setInfo({ province, birth, age, gender, valid: true });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter') handleCheck(); };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={h1Style}>身份证号查询</h1>
        <p style={descStyle}>验证18位身份证号码有效性，提取出生日期、性别、籍贯等信息</p>
      </div>
      <div style={{ marginBottom: 16 }}>
        <div style={labelStyle}>身份证号码</div>
        <input style={{ ...inputStyle, maxWidth: 320 }} placeholder="输入18位身份证号码" value={id} onChange={(e) => setId(e.target.value)} onKeyDown={handleKeyDown} />
        {error && <div style={errorStyle}>{error}</div>}
      </div>
      <button style={btnPrimary} onClick={handleCheck}>查询</button>
      {info && (
        <div style={{ ...cardStyle, marginTop: 20 }}>
          <div style={infoRow}><span style={{ color: 'var(--text-secondary)' }}>所属地区</span><span style={{ fontWeight: 600 }}>{info.province}</span></div>
          <div style={infoRow}><span style={{ color: 'var(--text-secondary)' }}>出生日期</span><span>{info.birth}</span></div>
          <div style={infoRow}><span style={{ color: 'var(--text-secondary)' }}>年龄</span><span>{info.age} 岁</span></div>
          <div style={{ ...infoRow, borderBottom: 'none' }}><span style={{ color: 'var(--text-secondary)' }}>性别</span><span style={{ fontWeight: 600, color: info.gender === '男' ? 'var(--color-blue)' : '#e91e63' }}>{info.gender}</span></div>
        </div>
      )}
    </div>
  );
}
