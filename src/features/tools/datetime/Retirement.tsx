import React, { useState } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const btnStyle: React.CSSProperties = { padding: '8px 16px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 2px 0 var(--border-color)', transition: 'all 150ms ease' };
const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };
const rowStyle: React.CSSProperties = { display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' };
const statCard: React.CSSProperties = { padding: '16px 20px', borderRadius: 14, border: '1px solid var(--border-light)', background: 'var(--bg-tool)', textAlign: 'center', minWidth: 100 };
const sectionStyle: React.CSSProperties = { marginBottom: 20 };

// 2025 new retirement policy (gradual implementation)
interface RetirementAge {
  male: number;
  femaleGeneral: number;
  femaleCadre: number;
}

function getRetirementAge(birthYear: number, gender: string, workerType: string): number {
  // 2025 reform: gradual delay starting 2025
  if (birthYear < 1960) {
    // Pre-reform
    if (gender === 'male') return 60;
    if (gender === 'female' && workerType === 'cadre') return 55;
    return 50;
  }

  // New policy with gradual transition
  let baseAge: number;
  if (gender === 'male') baseAge = 60;
  else if (gender === 'female' && workerType === 'cadre') baseAge = 55;
  else baseAge = 50;

  const targetAge = gender === 'male' ? 63 : (gender === 'female' && workerType === 'cadre') ? 58 : 55;

  // Gradual delay: 3 months per year from 2025
  const yearsSince2025 = Math.max(0, birthYear - 1960);
  const delayMonths = Math.min(yearsSince2025 * 3, (targetAge - baseAge) * 12);
  return baseAge + delayMonths / 12;
}

export default function Retirement() {
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('male');
  const [workerType, setWorkerType] = useState('general');
  const [output, setOutput] = useState('');
  const [result, setResult] = useState<{ retireDate: Date; age: number } | null>(null);

  const calc = () => {
    if (!birthDate) return;
    const birth = new Date(birthDate + 'T00:00:00');
    const birthYear = birth.getFullYear();
    const retireAge = getRetirementAge(birthYear, gender, workerType);

    // Calculate retirement date
    const fullYears = Math.floor(retireAge);
    const extraMonths = Math.round((retireAge - fullYears) * 12);
    const retireDate = new Date(birth);
    retireDate.setFullYear(birth.getFullYear() + fullYears);
    retireDate.setMonth(birth.getMonth() + extraMonths);

    const today = new Date();
    const remainingMs = retireDate.getTime() - today.getTime();
    const remainingDays = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));
    const remainingYears = Math.floor(remainingDays / 365);
    const remainingMonths = Math.floor((remainingDays % 365) / 30);

    setResult({ retireDate, age: retireAge });

    if (remainingDays < 0) {
      setOutput(
        `退休年龄: ${retireAge}岁\n` +
        `退休日期: ${retireDate.toLocaleDateString('zh-CN')}\n` +
        `状态: 已退休`
      );
    } else {
      setOutput(
        `退休年龄: ${retireAge}岁\n` +
        `退休日期: ${retireDate.toLocaleDateString('zh-CN')}\n` +
        `剩余: 约 ${remainingYears}年${remainingMonths}个月 (${remainingDays}天)`
      );
    }
  };

  const genderLabel = gender === 'male' ? '男' : '女';
  const typeLabel = workerType === 'cadre' ? '女干部' : workerType === 'special' ? '特殊工种' : '普通工人';

  return (
    <ToolLayout
      toolId="date-retirement"
      title="退休年龄计算器"
      description="根据当前退休政策计算法定退休年龄和退休时间（参考2025年新政策）"
      hideInput
      outputValue={output}
    >
      <div style={sectionStyle}>
        <div style={labelStyle}>基本信息</div>
        <div style={rowStyle}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>出生日期</div>
            <input type="date" style={inputStyle} value={birthDate} onChange={e => setBirthDate(e.target.value)} />
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>性别</div>
            <select style={inputStyle} value={gender} onChange={e => setGender(e.target.value)}>
              <option value="male">男</option>
              <option value="female">女</option>
            </select>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>工种</div>
            <select style={inputStyle} value={workerType} onChange={e => setWorkerType(e.target.value)}>
              <option value="general">普通工人</option>
              {gender === 'female' && <option value="cadre">女干部</option>}
              <option value="special">特殊工种</option>
            </select>
          </div>
          <button style={btnStyle} onClick={calc}>计算</button>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
          * 参考2025年渐进式延迟退休政策：男63岁，女工人55岁，女干部58岁
        </div>
      </div>
      {result && (
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
          <div style={statCard}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>退休年龄</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>{result.age}岁</div>
          </div>
          <div style={statCard}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>退休日期</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-blue)' }}>{result.retireDate.toLocaleDateString('zh-CN')}</div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
