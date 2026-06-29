import React, { useState, useCallback } from 'react';
import { showToast } from '../../../components/ui/Toast';

const containerStyle: React.CSSProperties = { maxWidth: 900, margin: '0 auto' };
const headerStyle: React.CSSProperties = { marginBottom: 24 };
const pageTitle: React.CSSProperties = { fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', marginBottom: 8 };
const pageDesc: React.CSSProperties = { fontSize: 14, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', lineHeight: 1.6 };
const cardStyle: React.CSSProperties = { padding: '36px 32px', borderRadius: 16, border: '1px solid var(--border-light)', background: 'var(--bg-tool)', textAlign: 'center' as const, marginBottom: 20 };
const verseStyle: React.CSSProperties = { fontSize: 26, fontWeight: 700, color: 'var(--text-primary)', fontFamily: '"Noto Serif SC", var(--font-sans)', lineHeight: 2, marginBottom: 16 };
const authorStyle: React.CSSProperties = { fontSize: 15, color: 'var(--color-pink)', fontFamily: 'var(--font-sans)', marginBottom: 6 };
const sourceStyle: React.CSSProperties = { fontSize: 14, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' };
const btnStyle: React.CSSProperties = { padding: '10px 28px', borderRadius: 12, border: '1px solid var(--border-color)', background: 'var(--color-blue)', color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 2px 0 #6a7fd0' };
const btnOutline: React.CSSProperties = { ...btnStyle, background: 'var(--bg-card)', color: 'var(--text-primary)', borderColor: 'var(--border-color)', boxShadow: '0 2px 0 var(--border-color)' };

interface Poem { verse: string; author: string; source: string; }

const POEMS: Poem[] = [
  { verse:'床前明月光，疑是地上霜。\n举头望明月，低头思故乡。', author:'李白', source:'《静夜思》' },
  { verse:'春眠不觉晓，处处闻啼鸟。\n夜来风雨声，花落知多少。', author:'孟浩然', source:'《春晓》' },
  { verse:'白日依山尽，黄河入海流。\n欲穷千里目，更上一层楼。', author:'王之涣', source:'《登鹳雀楼》' },
  { verse:'锄禾日当午，汗滴禾下土。\n谁知盘中餐，粒粒皆辛苦。', author:'李绅', source:'《悯农》' },
  { verse:'红豆生南国，春来发几枝。\n愿君多采撷，此物最相思。', author:'王维', source:'《相思》' },
  { verse:'朝辞白帝彩云间，千里江陵一日还。\n两岸猿声啼不住，轻舟已过万重山。', author:'李白', source:'《早发白帝城》' },
  { verse:'两个黄鹂鸣翠柳，一行白鹭上青天。\n窗含西岭千秋雪，门泊东吴万里船。', author:'杜甫', source:'《绝句》' },
  { verse:'远上寒山石径斜，白云生处有人家。\n停车坐爱枫林晚，霜叶红于二月花。', author:'杜牧', source:'《山行》' },
  { verse:'清明时节雨纷纷，路上行人欲断魂。\n借问酒家何处有？牧童遥指杏花村。', author:'杜牧', source:'《清明》' },
  { verse:'故人西辞黄鹤楼，烟花三月下扬州。\n孤帆远影碧空尽，唯见长江天际流。', author:'李白', source:'《黄鹤楼送孟浩然之广陵》' },
  { verse:'日照香炉生紫烟，遥看瀑布挂前川。\n飞流直下三千尺，疑是银河落九天。', author:'李白', source:'《望庐山瀑布》' },
  { verse:'独在异乡为异客，每逢佳节倍思亲。\n遥知兄弟登高处，遍插茱萸少一人。', author:'王维', source:'《九月九日忆山东兄弟》' },
  { verse:'好雨知时节，当春乃发生。\n随风潜入夜，润物细无声。', author:'杜甫', source:'《春夜喜雨》' },
  { verse:'千山鸟飞绝，万径人踪灭。\n孤舟蓑笠翁，独钓寒江雪。', author:'柳宗元', source:'《江雪》' },
  { verse:'众鸟高飞尽，孤云独去闲。\n相看两不厌，只有敬亭山。', author:'李白', source:'《独坐敬亭山》' },
  { verse:'月落乌啼霜满天，江枫渔火对愁眠。\n姑苏城外寒山寺，夜半钟声到客船。', author:'张继', source:'《枫桥夜泊》' },
  { verse:'离离原上草，一岁一枯荣。\n野火烧不尽，春风吹又生。', author:'白居易', source:'《赋得古原草送别》' },
  { verse:'空山不见人，但闻人语响。\n返景入深林，复照青苔上。', author:'王维', source:'《鹿柴》' },
  { verse:'墙角数枝梅，凌寒独自开。\n遥知不是雪，为有暗香来。', author:'王安石', source:'《梅花》' },
  { verse:'鹅鹅鹅，曲项向天歌。\n白毛浮绿水，红掌拨清波。', author:'骆宾王', source:'《咏鹅》' },
  { verse:'大漠孤烟直，长河落日圆。\n萧关逢候骑，都护在燕然。', author:'王维', source:'《使至塞上》' },
  { verse:'横看成岭侧成峰，远近高低各不同。\n不识庐山真面目，只缘身在此山中。', author:'苏轼', source:'《题西林壁》' },
  { verse:'水光潋滟晴方好，山色空蒙雨亦奇。\n欲把西湖比西子，淡妆浓抹总相宜。', author:'苏轼', source:'《饮湖上初晴后雨》' },
  { verse:'爆竹声中一岁除，春风送暖入屠苏。\n千门万户曈曈日，总把新桃换旧符。', author:'王安石', source:'《元日》' },
  { verse:'京口瓜洲一水间，钟山只隔数重山。\n春风又绿江南岸，明月何时照我还？', author:'王安石', source:'《泊船瓜洲》' },
  { verse:'泉眼无声惜细流，树阴照水爱晴柔。\n小荷才露尖尖角，早有蜻蜓立上头。', author:'杨万里', source:'《小池》' },
  { verse:'毕竟西湖六月中，风光不与四时同。\n接天莲叶无穷碧，映日荷花别样红。', author:'杨万里', source:'《晓出净慈寺送林子方》' },
  { verse:'死去元知万事空，但悲不见九州同。\n王师北定中原日，家祭无忘告乃翁。', author:'陆游', source:'《示儿》' },
  { verse:'莫笑农家腊酒浑，丰年留客足鸡豚。\n山重水复疑无路，柳暗花明又一村。', author:'陆游', source:'《游山西村》' },
  { verse:'醉里挑灯看剑，梦回吹角连营。\n八百里分麾下炙，五十弦翻塞外声。\n沙场秋点兵。', author:'辛弃疾', source:'《破阵子》' },
  { verse:'枯藤老树昏鸦，小桥流水人家，\n古道西风瘦马。夕阳西下，断肠人在天涯。', author:'马致远', source:'《天净沙·秋思》' },
  { verse:'曾经沧海难为水，除却巫山不是云。\n取次花丛懒回顾，半缘修道半缘君。', author:'元稹', source:'《离思》' },
  { verse:'人生若只如初见，何事秋风悲画扇。\n等闲变却故人心，却道故人心易变。', author:'纳兰性德', source:'《木兰花令》' },
];

export default function RandomPoem() {
  const [poem, setPoem] = useState<Poem>(POEMS[0]);

  const refresh = useCallback(() => {
    let idx: number;
    do { idx = Math.floor(Math.random() * POEMS.length); }
    while (POEMS.length > 1 && POEMS[idx].verse === poem.verse);
    setPoem(POEMS[idx]);
  }, [poem.verse]);

  const handleCopy = async () => {
    const text = `${poem.verse}\n——${poem.author} ${poem.source}`;
    try {
      await navigator.clipboard.writeText(text);
      showToast('已复制到剪贴板', 'success');
    } catch {
      showToast('复制失败', 'error');
    }
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={pageTitle}>随机一句诗词</h1>
        <p style={pageDesc}>随机展示中国古典诗词名句，附带作者、出处等信息</p>
      </div>
      <div style={cardStyle}>
        <div style={verseStyle}>{poem.verse}</div>
        <div style={authorStyle}>—— {poem.author}</div>
        <div style={sourceStyle}>{poem.source}</div>
      </div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <button style={btnStyle} onClick={refresh}>换一条</button>
        <button style={btnOutline} onClick={handleCopy}>复制</button>
      </div>
    </div>
  );
}
