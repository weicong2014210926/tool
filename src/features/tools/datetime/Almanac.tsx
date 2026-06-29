import React, { useState, useMemo } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };
const cardStyle: React.CSSProperties = { padding: '16px 20px', borderRadius: 14, border: '1px solid var(--border-light)', background: 'var(--bg-tool)', marginBottom: 8 };
const sectionStyle: React.CSSProperties = { marginBottom: 20 };

const heavenlyStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const earthlyBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const zodiacAnimals = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];

// Simplified almanac data based on day-of-year index
const suitableItems: string[][] = [
  ['祭祀', '祈福', '求嗣', '开光', '出行'], ['嫁娶', '纳采', '订盟', '入宅', '安床'],
  ['祭祀', '祈福', '入学', '裁衣', '理发'], ['嫁娶', '祭祀', '出行', '移徙', '入宅'],
  ['开市', '交易', '立券', '纳财', '栽种'], ['祭祀', '祈福', '求嗣', '出行', '解除'],
  ['嫁娶', '订盟', '纳采', '祭祀', '祈福'], ['修造', '动土', '起基', '安门', '安床'],
  ['祭祀', '栽种', '馀事勿取'], ['嫁娶', '出行', '理发', '安床', '启钻'],
  ['祭祀', '祈福', '求嗣', '开光', '入学'], ['纳采', '订盟', '嫁娶', '祭祀', '祈福'],
  ['开市', '交易', '立券', '纳财', '纳畜'], ['祭祀', '入殓', '移柩', '馀事勿取'],
  ['嫁娶', '纳采', '订盟', '入宅', '移徙'], ['修造', '动土', '安床', '安门', '祭祀'],
  ['祭祀', '祈福', '出行', '解除', '沐浴'], ['嫁娶', '祭祀', '出行', '移徙', '入宅'],
  ['开市', '交易', '立券', '纳财', '会亲友'], ['祭祀', '祈福', '求嗣', '斋醮', '入学'],
  ['修造', '动土', '起基', '安门', '作灶'], ['祭祀', '祈福', '栽种', '牧养'],
  ['嫁娶', '订盟', '纳采', '出行', '入宅'], ['开光', '求嗣', '入学', '祭祀', '祈福'],
  ['祭祀', '破土', '除服', '成服', '馀事勿取'], ['嫁娶', '纳采', '出行', '移徙', '入宅'],
  ['开市', '交易', '立券', '纳财', '开仓'], ['祭祀', '祈福', '求嗣', '解除', '伐木'],
  ['修造', '动土', '安床', '栽种', '牧养'], ['嫁娶', '祭祀', '祈福', '出行', '移徙'],
  ['祭祀', '会亲友', '出行', '入学', '裁衣'],
];

const unsuitableItems: string[][] = [
  ['作灶', '开渠', '安葬'], ['开市', '掘井', '开渠'], ['入宅', '安门', '作灶'],
  ['修造', '动土', '出行'], ['嫁娶', '入宅', '安葬'], ['栽种', '掘井', '修造'],
  ['出行', '祈福', '开市'], ['嫁娶', '移徙', '开市'], ['嫁娶', '开市', '安葬'],
  ['修造', '动土', '出行'], ['祭祀', '安葬', '栽种'], ['作灶', '出行', '入宅'],
  ['嫁娶', '入宅', '安葬'], ['开市', '交易', '修造'], ['出行', '祈福', '栽种'],
  ['嫁娶', '开市', '安葬'], ['入宅', '作灶', '出行'], ['祭祀', '修造', '栽种'],
  ['嫁娶', '安葬', '出行'], ['修造', '动土', '开市'], ['嫁娶', '入宅', '祈福'],
  ['开市', '出行', '移徙'], ['修造', '动土', '安葬'], ['嫁娶', '祭祀', '栽种'],
  ['入宅', '开市', '祈福'], ['修造', '动土', '出行'], ['作灶', '安门', '开渠'],
  ['嫁娶', '开市', '移徙'], ['入宅', '安葬', '栽种'], ['修造', '动土', '出行'],
  ['开市', '安葬', '作灶'],
];

export default function Almanac() {
  const [date, setDate] = useState('');
  const [output, setOutput] = useState('');

  const almanacData = useMemo(() => {
    if (!date) return null;
    const d = new Date(date + 'T00:00:00');
    const dayOfYear = Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000);
    const idx = dayOfYear % suitableItems.length;
    const year = d.getFullYear();
    const stem = heavenlyStems[(year - 4) % 10];
    const branch = earthlyBranches[(year - 4) % 12];
    const zodiac = zodiacAnimals[(year - 4) % 12];
    const clash = earthlyBranches[((year - 4) % 12 + 6) % 12];
    const directions = ['东', '南', '西', '北', '东北', '东南', '西南', '西北'];
    const dir = directions[dayOfYear % 8];

    return {
      stemBranch: stem + branch,
      zodiac,
      suitable: suitableItems[idx],
      unsuitable: unsuitableItems[idx],
      clash,
      direction: dir,
      dateStr: `${year}年${d.getMonth() + 1}月${d.getDate()}日`,
    };
  }, [date]);

  const handleDate = (val: string) => {
    setDate(val);
    if (!val) { setOutput(''); return; }
    const d = new Date(val + 'T00:00:00');
    const dayOfYear = Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000);
    const idx = dayOfYear % suitableItems.length;
    const year = d.getFullYear();
    const stem = heavenlyStems[(year - 4) % 10];
    const branch = earthlyBranches[(year - 4) % 12];
    const zodiac = zodiacAnimals[(year - 4) % 12];
    const clash = earthlyBranches[((year - 4) % 12 + 6) % 12];
    const directions = ['东', '南', '西', '北', '东北', '东南', '西南', '西北'];
    const dir = directions[dayOfYear % 8];

    setOutput(
      `公历: ${year}年${d.getMonth() + 1}月${d.getDate()}日\n` +
      `干支: ${stem}${branch}年\n` +
      `生肖: ${zodiac}\n` +
      `冲煞: 冲${clash}\n` +
      `吉方: ${dir}\n` +
      `宜: ${suitableItems[idx].join('、')}\n` +
      `忌: ${unsuitableItems[idx].join('、')}`
    );
  };

  return (
    <ToolLayout
      toolId="date-almanac"
      title="农历老黄历查询"
      description="查询每日的老黄历信息，包括宜忌、冲煞等传统内容"
      inputValue=""
      onInputChange={() => {}}
      outputValue={output}
      inputPlaceholder=""
    >
      <div style={{ marginBottom: 20 }}>
        <div style={labelStyle}>选择日期</div>
        <input type="date" style={{ ...inputStyle, maxWidth: 250 }} value={date} onChange={e => handleDate(e.target.value)} />
      </div>
      {almanacData && (
        <div style={cardStyle}>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>{almanacData.dateStr} · {almanacData.stemBranch}年 · {almanacData.zodiac}</div>
          <div style={{ marginBottom: 8 }}><span style={{ color: 'var(--color-green)', fontWeight: 600 }}>宜: </span><span style={{ color: 'var(--text-secondary)' }}>{almanacData.suitable.join('、')}</span></div>
          <div style={{ marginBottom: 8 }}><span style={{ color: 'var(--color-red)', fontWeight: 600 }}>忌: </span><span style={{ color: 'var(--text-secondary)' }}>{almanacData.unsuitable.join('、')}</span></div>
          <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>冲{almanacData.clash} · 吉方: {almanacData.direction}</div>
        </div>
      )}
    </ToolLayout>
  );
}
