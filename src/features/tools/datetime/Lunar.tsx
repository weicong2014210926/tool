import React, { useState, useMemo } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };
const statCard: React.CSSProperties = { padding: '16px 20px', borderRadius: 14, border: '1px solid var(--border-light)', background: 'var(--bg-tool)', textAlign: 'center', minWidth: 100 };
const cardGridStyle: React.CSSProperties = { display: 'flex', gap: 12, flexWrap: 'wrap' };

/* Simplified lunar calendar data: stores the Chinese New Year date and leap month info */
const lunarInfo = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
  0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
  0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0,
  0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
  0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,
  0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
  0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x05ac0, 0x0ab60, 0x096d5, 0x092e0,
  0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
  0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
  0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x0d0b6, 0x0d250, 0x0d520, 0x0dd45,
  0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,
  0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06aa0, 0x1ae73, 0x092e0,
  0x0d260, 0x0c960, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
  0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
  0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x0d0b6, 0x0d250, 0x0d520, 0x0dd45,
  0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,
];

const heavenlyStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const earthlyBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const zodiacAnimals = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
const lunarMonths = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
const lunarDays = ['', '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];

function lYearDays(y: number) {
  let sum = 348;
  for (let i = 0x8000; i > 0x8; i >>= 1) {
    sum += (lunarInfo[y - 1900] & i) ? 1 : 0;
  }
  return sum + leapDays(y);
}

function leapDays(y: number) {
  if (leapMonth(y)) return (lunarInfo[y - 1900] & 0x10000) ? 30 : 29;
  return 0;
}

function leapMonth(y: number) {
  return lunarInfo[y - 1900] & 0xf;
}

function lMonthDays(y: number, m: number) {
  return (lunarInfo[y - 1900] & (0x10000 >> m)) ? 30 : 29;
}

function solarToLunar(y: number, m: number, d: number) {
  // Days since 1900-01-31 (Chinese New Year base)
  let offset = 0;
  for (let i = 1900; i < y; i++) {
    offset += lYearDays(i);
  }
  // days in this year before this month
  for (let i = 1; i < m; i++) {
    offset += lMonthDays(y, i);
  }
  offset += d - 1;

  // Find lunar year
  let ly = 1900;
  while (ly < 2100 && offset >= lYearDays(ly)) {
    offset -= lYearDays(ly);
    ly++;
  }

  const leap = leapMonth(ly);
  let isLeap = false;
  let lm = 1;
  while (lm <= 12 && offset >= lMonthDays(ly, lm)) {
    offset -= lMonthDays(ly, lm);
    lm++;
  }
  if (leap > 0 && lm === leap + 1) {
    isLeap = true;
    lm--;
    if (offset >= leapDays(ly)) {
      offset -= leapDays(ly);
      lm++;
      isLeap = false;
    }
  }
  const ld = offset + 1;
  return { ly, lm, ld, isLeap };
}

function getStemBranch(year: number) {
  const stem = heavenlyStems[(year - 4) % 10];
  const branch = earthlyBranches[(year - 4) % 12];
  return stem + branch;
}

export default function Lunar() {
  const [date, setDate] = useState('');
  const [output, setOutput] = useState('');

  const lunarData = useMemo(() => {
    if (!date) return null;
    const d = new Date(date + 'T00:00:00');
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const day = d.getDate();
    const lunar = solarToLunar(y, m, day);
    const stemBranch = getStemBranch(lunar.ly);
    const zodiac = zodiacAnimals[(lunar.ly - 4) % 12];
    const monthStr = (lunar.isLeap ? '闰' : '') + lunarMonths[lunar.lm - 1] + '月';
    return { lunar, stemBranch, zodiac, monthStr, dayStr: lunarDays[lunar.ld] };
  }, [date]);

  const handleDate = (val: string) => {
    setDate(val);
    if (!val) { setOutput(''); return; }
    const d = new Date(val + 'T00:00:00');
    const lunar = solarToLunar(d.getFullYear(), d.getMonth() + 1, d.getDate());
    const sb = getStemBranch(lunar.ly);
    const z = zodiacAnimals[(lunar.ly - 4) % 12];
    const mStr = (lunar.isLeap ? '闰' : '') + lunarMonths[lunar.lm - 1] + '月';
    setOutput(
      `农历:  ${sb}年 ${mStr}${lunarDays[lunar.ld]}\n` +
      `干支:  ${sb}年\n` +
      `生肖:  ${z}\n` +
      `公历:  ${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
    );
  };

  return (
    <ToolLayout
      toolId="date-lunar"
      title="农历公历转换"
      description="实现农历和公历日期之间的相互转换，支持干支纪年和生肖查询"
      hideInput
      outputValue={output}
    >
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' }}>选择日期</div>
        <input type="date" style={{ ...inputStyle, maxWidth: 250 }} value={date} onChange={e => handleDate(e.target.value)} />
      </div>
    </ToolLayout>
  );
}
