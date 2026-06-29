import React, { useState } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };
const sectionStyle: React.CSSProperties = { marginBottom: 20 };
const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', fontSize: 12, fontFamily: 'var(--font-sans)' };
const thStyle: React.CSSProperties = { padding: '8px 12px', borderBottom: '1px solid var(--border-color)', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)', background: 'var(--bg-card)' };
const tdStyle: React.CSSProperties = { padding: '8px 12px', borderBottom: '1px solid var(--border-light)', color: 'var(--text-primary)' };

const banks = [
  { name: '中国工商银行', code: '102100099996', abbr: 'ICBC' },
  { name: '中国农业银行', code: '103100000026', abbr: 'ABC' },
  { name: '中国银行', code: '104100000004', abbr: 'BOC' },
  { name: '中国建设银行', code: '105100000017', abbr: 'CCB' },
  { name: '交通银行', code: '301290000007', abbr: 'BOCOM' },
  { name: '中国邮政储蓄银行', code: '403100000004', abbr: 'PSBC' },
  { name: '招商银行', code: '308584000013', abbr: 'CMB' },
  { name: '中信银行', code: '302100011000', abbr: 'CITIC' },
  { name: '中国光大银行', code: '303100000006', abbr: 'CEB' },
  { name: '华夏银行', code: '304100040000', abbr: 'HXB' },
  { name: '中国民生银行', code: '305100000013', abbr: 'CMBC' },
  { name: '广发银行', code: '306581000003', abbr: 'CGB' },
  { name: '平安银行', code: '307584007998', abbr: 'PAB' },
  { name: '兴业银行', code: '309391000011', abbr: 'CIB' },
  { name: '上海浦东发展银行', code: '310290000013', abbr: 'SPDB' },
  { name: '恒丰银行', code: '315456000107', abbr: 'HFB' },
  { name: '浙商银行', code: '316331000018', abbr: 'CZB' },
  { name: '渤海银行', code: '318110000015', abbr: 'CBHB' },
  { name: '北京银行', code: '313100000013', abbr: 'BOB' },
  { name: '上海银行', code: '313290000017', abbr: 'BOSC' },
  { name: '江苏银行', code: '313301000002', abbr: 'JSB' },
  { name: '南京银行', code: '313301100005', abbr: 'NJCB' },
  { name: '宁波银行', code: '313332082014', abbr: 'NBCB' },
  { name: '杭州银行', code: '313331000014', abbr: 'HZB' },
  { name: '国家开发银行', code: '201100000017', abbr: 'CDB' },
  { name: '中国农业发展银行', code: '203100000013', abbr: 'ADBC' },
  { name: '中国进出口银行', code: '202100000011', abbr: 'EIBC' },
  { name: '汇丰银行(中国)', code: '501290000015', abbr: 'HSBC' },
  { name: '渣打银行(中国)', code: '502290000007', abbr: 'SCB' },
  { name: '花旗银行(中国)', code: '503290000009', abbr: 'Citibank' },
];

export default function BankCode() {
  const [search, setSearch] = useState('');

  const filtered = banks.filter(b =>
    b.name.includes(search) ||
    b.code.includes(search) ||
    b.abbr.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ToolLayout
      toolId="fin-bank-code"
      title="银行联行号查询"
      description="查询全国各大银行的联行号(CNAPS)信息"
      hideInput
      outputValue=""
    >
      <div style={sectionStyle}>
        <div style={labelStyle}>搜索银行</div>
        <input
          style={{ ...inputStyle, maxWidth: 400 }}
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="输入银行名称、联行号或英文缩写..."
        />
      </div>
      <div style={{ maxHeight: 500, overflow: 'auto' }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>银行名称</th>
              <th style={thStyle}>英文缩写</th>
              <th style={thStyle}>联行号(CNAPS)</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b, i) => (
              <tr key={i}>
                <td style={tdStyle}>{b.name}</td>
                <td style={tdStyle}>{b.abbr}</td>
                <td style={{ ...tdStyle, fontFamily: 'monospace' }}>{b.code}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8, fontFamily: 'var(--font-sans)' }}>
        共 {filtered.length} 家银行 | 联行号仅供参考，以实际开户行信息为准
      </div>
    </ToolLayout>
  );
}
