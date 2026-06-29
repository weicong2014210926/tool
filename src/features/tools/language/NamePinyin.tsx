import React, { useState, useCallback } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const btnStyle: React.CSSProperties = { padding: '8px 16px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 2px 0 var(--border-color)', transition: 'all 150ms ease' };
const activeBtn: React.CSSProperties = { ...btnStyle, background: 'var(--color-blue)', color: '#fff', borderColor: 'var(--color-blue)' };

type NameFormat = 'capital' | 'upper' | 'surname';

const formatLabels: Record<NameFormat, string> = {
  capital: 'Li Ming',
  upper: 'LI MING',
  surname: 'Li, Ming',
};

const COMMON_SURNAMES = new Set([
  '王','李','张','刘','陈','杨','赵','黄','周','吴','徐','孙','马','朱','胡','郭','何','高','林',
  '罗','郑','梁','谢','宋','唐','许','韩','冯','邓','曹','彭','曾','肖','田','董','潘','袁','于',
  '蒋','蔡','余','杜','叶','程','苏','魏','吕','丁','任','沈','姚','卢','姜','崔','钟','谭','陆',
  '汪','范','金','石','廖','贾','夏','韦','傅','方','白','邹','孟','熊','秦','邱','江','尹','薛',
  '阎','段','雷','侯','龙','史','陶','黎','贺','顾','毛','郝','龚','邵','万','钱','严','覃','武',
  '戴','莫','孔','向','汤','温','康','施','文','牛','樊','葛','邢','安','齐','易','乔','伍','庞',
]);

const PINYIN: Record<string, string> = {
  王:'Wang',李:'Li',张:'Zhang',刘:'Liu',陈:'Chen',杨:'Yang',赵:'Zhao',黄:'Huang',周:'Zhou',吴:'Wu',
  徐:'Xu',孙:'Sun',马:'Ma',朱:'Zhu',胡:'Hu',郭:'Guo',何:'He',高:'Gao',林:'Lin',罗:'Luo',
  郑:'Zheng',梁:'Liang',谢:'Xie',宋:'Song',唐:'Tang',许:'Xu',韩:'Han',冯:'Feng',邓:'Deng',曹:'Cao',
  彭:'Peng',曾:'Zeng',肖:'Xiao',田:'Tian',董:'Dong',潘:'Pan',袁:'Yuan',于:'Yu',蒋:'Jiang',蔡:'Cai',
  余:'Yu',杜:'Du',叶:'Ye',程:'Cheng',苏:'Su',魏:'Wei',吕:'Lv',丁:'Ding',任:'Ren',沈:'Shen',
  姚:'Yao',卢:'Lu',姜:'Jiang',崔:'Cui',钟:'Zhong',谭:'Tan',陆:'Lu',汪:'Wang',范:'Fan',金:'Jin',
  石:'Shi',廖:'Liao',贾:'Jia',夏:'Xia',韦:'Wei',傅:'Fu',方:'Fang',白:'Bai',邹:'Zou',孟:'Meng',
  熊:'Xiong',秦:'Qin',邱:'Qiu',江:'Jiang',尹:'Yin',薛:'Xue',阎:'Yan',段:'Duan',雷:'Lei',侯:'Hou',
  龙:'Long',史:'Shi',陶:'Tao',黎:'Li',贺:'He',顾:'Gu',毛:'Mao',郝:'Hao',龚:'Gong',邵:'Shao',
  万:'Wan',钱:'Qian',严:'Yan',武:'Wu',戴:'Dai',莫:'Mo',孔:'Kong',向:'Xiang',汤:'Tang',温:'Wen',
  康:'Kang',施:'Shi',文:'Wen',牛:'Niu',樊:'Fan',葛:'Ge',安:'An',齐:'Qi',易:'Yi',乔:'Qiao',
  明:'Ming',华:'Hua',强:'Qiang',伟:'Wei',丽:'Li',芳:'Fang',敏:'Min',静:'Jing',磊:'Lei',洋:'Yang',
  涛:'Tao',雪:'Xue',飞:'Fei',刚:'Gang',超:'Chao',杰:'Jie',峰:'Feng',军:'Jun',平:'Ping',勇:'Yong',
  玲:'Ling',秀:'Xiu',霞:'Xia',波:'Bo',宁:'Ning',燕:'Yan',娜:'Na',佳:'Jia',宇:'Yu',
  鹏:'Peng',亮:'Liang',鑫:'Xin',瑞:'Rui',晶:'Jing',凯:'Kai',浩:'Hao',旭:'Xu',晨:'Chen',
  志:'Zhi',兵:'Bing',春:'Chun',建:'Jian',海:'Hai',国:'Guo',斌:'Bin',畅:'Chang',
  怡:'Yi',欣:'Xin',然:'Ran',萌:'Meng',豪:'Hao',莹:'Ying',辉:'Hui',
  蕾:'Lei',慧:'Hui',婷:'Ting',兰:'Lan',丹:'Dan',红:'Hong',荣:'Rong',健:'Jian',玉:'Yu',
};

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

export default function NamePinyin() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [format, setFormat] = useState<NameFormat>('capital');

  const handleInput = useCallback((value: string) => {
    setInput(value);
    if (!value.trim()) { setOutput(''); return; }
    const chars = [...value.replace(/\s+/g, '')];
    let surname = '';
    let given = '';
    if (COMMON_SURNAMES.has(chars[0])) {
      surname = PINYIN[chars[0]] || chars[0];
      given = chars.slice(1).map(c => PINYIN[c] || c).join('');
    } else if (chars.length === 3) {
      surname = PINYIN[chars[0]] || chars[0];
      given = chars.slice(1).map(c => PINYIN[c] || c).join('');
    } else {
      surname = PINYIN[chars[0]] || chars[0];
      given = chars.slice(1).map(c => PINYIN[c] || c).join('');
    }
    let result = '';
    switch (format) {
      case 'capital':
        result = capitalize(surname) + ' ' + capitalize(given);
        break;
      case 'upper':
        result = (surname + ' ' + given).toUpperCase();
        break;
      case 'surname':
        result = capitalize(surname) + ', ' + capitalize(given);
        break;
    }
    setOutput(result);
  }, [format]);

  const handleFormat = (f: NameFormat) => {
    setFormat(f);
    if (input.trim()) {
      // Manually compute with new format (avoid stale closure)
      const chars = [...input.replace(/\s+/g, '')];
      let surname = PINYIN[chars[0]] || chars[0];
      let given = chars.slice(1).map(c => PINYIN[c] || c).join('');
      if (chars.length >= 2 && COMMON_SURNAMES.has(chars[0])) {
        // already correct
      }
      let result = '';
      switch (f) {
        case 'capital': result = capitalize(surname) + ' ' + capitalize(given); break;
        case 'upper': result = (surname + ' ' + given).toUpperCase(); break;
        case 'surname': result = capitalize(surname) + ', ' + capitalize(given); break;
      }
      setOutput(result);
    }
  };

  return (
    <ToolLayout
      toolId="lang-name-pinyin"
      title="姓名拼音转换"
      description="将中文姓名转换为拼音，支持护照格式等常见姓名拼音书写规范"
      inputValue={input}
      onInputChange={handleInput}
      outputValue={output}
      inputPlaceholder="输入中文姓名，如：张三"
      extraActions={
        <>
          {(Object.entries(formatLabels) as [NameFormat, string][]).map(([f, label]) => (
            <button
              key={f}
              style={format === f ? activeBtn : btnStyle}
              onClick={() => handleFormat(f)}
            >
              {label}
            </button>
          ))}
        </>
      }
    />
  );
}
