import React, { useState, useCallback } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

type StepType = 'upper' | 'lower' | 'reverse' | 'sort-asc' | 'sort-desc' | 'numbering' | 'replace' | 'dedup';

const stepLabels: Record<StepType, string> = {
  upper: '转大写', lower: '转小写', reverse: '反转行',
  'sort-asc': '排序A-Z', 'sort-desc': '排序Z-A',
  numbering: '添加序号', replace: '查找替换', dedup: '去重',
};

interface WorkflowStep {
  id: number;
  type: StepType;
  config: Record<string, string>;
}

const controlBar: React.CSSProperties = {
  display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center',
  marginBottom: 16, padding: '12px 16px', borderRadius: 12,
  background: 'var(--bg-tool)', border: '1px solid var(--border-light)',
};

const selectStyle: React.CSSProperties = {
  padding: '6px 12px', borderRadius: 8,
  border: '1px solid var(--border-color)', background: 'var(--bg-card)',
  color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)',
  outline: 'none', cursor: 'pointer',
};

const btnStyle: React.CSSProperties = {
  padding: '6px 14px', borderRadius: 8,
  border: '1px solid var(--border-color)', background: 'var(--bg-card)',
  color: 'var(--text-primary)', fontSize: 13, fontWeight: 600,
  fontFamily: 'var(--font-sans)', cursor: 'pointer',
  boxShadow: '0 2px 0 var(--border-color)',
};

const stepCard: React.CSSProperties = {
  padding: '10px 14px', borderRadius: 10, marginBottom: 8,
  background: 'var(--bg-card)', border: '1px solid var(--border-light)',
  display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
};

const stepInput: React.CSSProperties = {
  padding: '4px 10px', borderRadius: 6,
  border: '1px solid var(--border-color)', background: 'var(--bg-tool)',
  color: 'var(--text-primary)', fontSize: 12, fontFamily: 'var(--font-sans)',
  outline: 'none', width: 100,
};

const executeBtn: React.CSSProperties = {
  ...btnStyle, background: 'var(--color-teal)', color: '#fff',
  borderColor: 'var(--color-teal)', boxShadow: '0 2px 0 #5aab8a',
};

function applyStep(text: string, step: WorkflowStep): string {
  if (!text) return '';
  const cfg = step.config;
  switch (step.type) {
    case 'upper': return text.toUpperCase();
    case 'lower': return text.toLowerCase();
    case 'reverse': return text.split('\n').reverse().join('\n');
    case 'sort-asc': return text.split('\n').sort((a, b) => a.localeCompare(b)).join('\n');
    case 'sort-desc': return text.split('\n').sort((a, b) => b.localeCompare(a)).join('\n');
    case 'numbering': {
      const start = parseInt(cfg.start || '1', 10) || 1;
      const prefix = cfg.prefix || '';
      const suffix = cfg.suffix || '';
      return text.split('\n').map((l, i) => `${prefix}${start + i}${suffix}${l}`).join('\n');
    }
    case 'replace': {
      const find = cfg.find || '';
      if (!find) return text;
      const replace = cfg.replace || '';
      try {
        const escaped = find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return text.replace(new RegExp(escaped, 'g'), replace);
      } catch { return text; }
    }
    case 'dedup': {
      const lines = text.split('\n');
      const seen = new Set<string>();
      return lines.filter((l) => { if (seen.has(l)) return false; seen.add(l); return true; }).join('\n');
    }
    default: return text;
  }
}

export default function Workflow() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [selectedStep, setSelectedStep] = useState<StepType>('upper');
  let nextId = React.useRef(1);

  const addStep = () => {
    setSteps([...steps, { id: nextId.current++, type: selectedStep, config: {} }]);
  };

  const removeStep = (id: number) => {
    setSteps(steps.filter((s) => s.id !== id));
  };

  const updateConfig = (id: number, key: string, value: string) => {
    setSteps(steps.map((s) => s.id === id ? { ...s, config: { ...s.config, [key]: value } } : s));
  };

  const executeAll = useCallback(() => {
    if (!input.trim()) { setOutput(''); return; }
    let result = input;
    for (const step of steps) {
      result = applyStep(result, step);
    }
    setOutput(result);
  }, [input, steps]);

  const handleInput = (value: string) => setInput(value);

  const extraActions = (
    <button style={executeBtn} onClick={executeAll}>
      全部执行
    </button>
  );

  return (
    <ToolLayout
      toolId="text-workflow"
      title="文本处理工作流"
      description="通过添加多个处理步骤并按顺序执行，实现复杂的文本处理任务"
      inputValue={input}
      onInputChange={handleInput}
      outputValue={output}
      inputPlaceholder="在此粘贴要处理的文本..."
      extraActions={extraActions}
    >
      <div style={controlBar}>
        <select style={selectStyle} value={selectedStep}
          onChange={(e) => setSelectedStep(e.target.value as StepType)}>
          {Object.entries(stepLabels).map(([type, label]) => (
            <option key={type} value={type}>{label}</option>
          ))}
        </select>
        <button style={btnStyle} onClick={addStep}>+ 添加步骤</button>
        {steps.length > 0 && (
          <button style={{ ...btnStyle, color: 'var(--color-red)' }} onClick={() => setSteps([])}>
            清空所有
          </button>
        )}
      </div>
      {steps.map((step, idx) => (
        <div key={step.id} style={stepCard}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>
            #{idx + 1}
          </span>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>
            {stepLabels[step.type]}
          </span>
          {step.type === 'numbering' && (
            <>
              <input style={stepInput} placeholder="前缀" value={step.config.prefix || ''}
                onChange={(e) => updateConfig(step.id, 'prefix', e.target.value)} />
              <input style={stepInput} placeholder="后缀" value={step.config.suffix || ''}
                onChange={(e) => updateConfig(step.id, 'suffix', e.target.value)} />
              <input style={{ ...stepInput, width: 60 }} placeholder="起始" value={step.config.start || ''}
                onChange={(e) => updateConfig(step.id, 'start', e.target.value)} />
            </>
          )}
          {step.type === 'replace' && (
            <>
              <input style={stepInput} placeholder="查找" value={step.config.find || ''}
                onChange={(e) => updateConfig(step.id, 'find', e.target.value)} />
              <input style={stepInput} placeholder="替换为" value={step.config.replace || ''}
                onChange={(e) => updateConfig(step.id, 'replace', e.target.value)} />
            </>
          )}
          <button style={{ ...btnStyle, color: 'var(--color-red)', border: 'none', boxShadow: 'none', padding: '4px 8px' }}
            onClick={() => removeStep(step.id)}>x</button>
        </div>
      ))}
    </ToolLayout>
  );
}
