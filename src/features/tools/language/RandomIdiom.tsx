import React, { useState, useCallback } from 'react';
import { showToast } from '../../../components/ui/Toast';

const containerStyle: React.CSSProperties = { maxWidth: 900, margin: '0 auto' };
const headerStyle: React.CSSProperties = { marginBottom: 24 };
const pageTitle: React.CSSProperties = { fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', marginBottom: 8 };
const pageDesc: React.CSSProperties = { fontSize: 14, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', lineHeight: 1.6 };
const cardStyle: React.CSSProperties = { padding: '30px 28px', borderRadius: 16, border: '1px solid var(--border-light)', background: 'var(--bg-tool)', textAlign: 'center' as const, marginBottom: 20 };
const idiomStyle: React.CSSProperties = { fontSize: 36, fontWeight: 800, color: 'var(--color-pink)', fontFamily: 'var(--font-sans)', marginBottom: 8 };
const pyStyle: React.CSSProperties = { fontSize: 18, color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', marginBottom: 16 };
const meaningStyle: React.CSSProperties = { fontSize: 16, color: 'var(--text-primary)', lineHeight: 1.8, fontFamily: 'var(--font-sans)', marginBottom: 12 };
const exampleStyle: React.CSSProperties = { fontSize: 14, color: 'var(--text-muted)', fontStyle: 'italic', fontFamily: 'var(--font-sans)', lineHeight: 1.6 };
const btnStyle: React.CSSProperties = { padding: '10px 28px', borderRadius: 12, border: '1px solid var(--border-color)', background: 'var(--color-blue)', color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 2px 0 #6a7fd0' };
const btnOutline: React.CSSProperties = { ...btnStyle, background: 'var(--bg-card)', color: 'var(--text-primary)', borderColor: 'var(--border-color)', boxShadow: '0 2px 0 var(--border-color)' };

interface IdiomData { word: string; pinyin: string; meaning: string; example: string; }

const IDIOMS: IdiomData[] = [
  { word:'画蛇添足', pinyin:'huà shé tiān zú', meaning:'比喻做了多余的事，反而不好', example:'这篇文章已经很完美了，不需要再画蛇添足。' },
  { word:'守株待兔', pinyin:'shǒu zhū dài tù', meaning:'比喻死守经验，不知变通', example:'你不应该守株待兔，要主动去寻找机会。' },
  { word:'亡羊补牢', pinyin:'wáng yáng bǔ láo', meaning:'在受到损失后及时想办法补救', example:'虽然犯了错误，但亡羊补牢，为时未晚。' },
  { word:'掩耳盗铃', pinyin:'yǎn ěr dào líng', meaning:'比喻自己欺骗自己', example:'你这样做简直是掩耳盗铃，迟早会被人发现的。' },
  { word:'叶公好龙', pinyin:'yè gōng hào lóng', meaning:'比喻口头上说爱好某事物，实际上并不真的爱好', example:'他说喜欢读书，却从来不看书，真是叶公好龙。' },
  { word:'胸有成竹', pinyin:'xiōng yǒu chéng zhú', meaning:'比喻做事之前已经拿定主意', example:'他对这个项目胸有成竹，大家都相信他能做好。' },
  { word:'一鸣惊人', pinyin:'yī míng jīng rén', meaning:'比喻平时没有突出表现，一下子做出惊人成绩', example:'他这次比赛一鸣惊人，获得了全国冠军。' },
  { word:'画龙点睛', pinyin:'huà lóng diǎn jīng', meaning:'比喻在关键的地方用精辟的语句点明要旨', example:'你最后那段总结真是画龙点睛之笔。' },
  { word:'井底之蛙', pinyin:'jǐng dǐ zhī wā', meaning:'比喻目光短浅，见识狭隘的人', example:'不要做井底之蛙，要多出去看看外面的世界。' },
  { word:'愚公移山', pinyin:'yú gōng yí shān', meaning:'比喻有顽强的毅力和不屈不挠的精神', example:'只要我们发扬愚公移山的精神，就没有克服不了的困难。' },
  { word:'对牛弹琴', pinyin:'duì niú tán qín', meaning:'比喻对不讲道理的人讲道理', example:'跟他讲这些专业知识，简直是对牛弹琴。' },
  { word:'鹤立鸡群', pinyin:'hè lì jī qún', meaning:'比喻仪表或才能在周围人群中很突出', example:'他在这些学生中鹤立鸡群，成绩遥遥领先。' },
  { word:'刻舟求剑', pinyin:'kè zhōu qiú jiàn', meaning:'比喻办事刻板，拘泥而不知变通', example:'情况变了还按老办法，这不是刻舟求剑吗？' },
  { word:'杯弓蛇影', pinyin:'bēi gōng shé yǐng', meaning:'比喻因疑神疑鬼而自相惊扰', example:'你别杯弓蛇影了，那只是风吹动窗帘而已。' },
  { word:'狐假虎威', pinyin:'hú jiǎ hǔ wēi', meaning:'比喻依仗别人的势力来欺压人', example:'他不过是狐假虎威，靠他爸爸的权势罢了。' },
  { word:'买椟还珠', pinyin:'mǎi dú huán zhū', meaning:'比喻没有眼光，取舍不当', example:'放着核心技术不要，只拿走了包装，真是买椟还珠。' },
  { word:'塞翁失马', pinyin:'sài wēng shī mǎ', meaning:'比喻暂时的损失也许能带来好处', example:'这次没考上，塞翁失马焉知非福。' },
  { word:'望梅止渴', pinyin:'wàng méi zhǐ kě', meaning:'比喻用空想来安慰自己', example:'光靠空想不行动，不过是望梅止渴罢了。' },
  { word:'班门弄斧', pinyin:'bān mén nòng fǔ', meaning:'比喻在行家面前卖弄本领', example:'在专家面前讲这些，真是班门弄斧了。' },
  { word:'破釜沉舟', pinyin:'pò fǔ chén zhōu', meaning:'比喻下定决心，不顾一切干到底', example:'我们这次必须破釜沉舟，全力以赴。' },
  { word:'卧薪尝胆', pinyin:'wò xīn cháng dǎn', meaning:'形容忍辱负重，发愤图强', example:'他卧薪尝胆三年，终于考上了理想的大学。' },
  { word:'三顾茅庐', pinyin:'sān gù máo lú', meaning:'比喻诚心诚意地一再邀请', example:'老板三顾茅庐才请到他来公司任职。' },
  { word:'闻鸡起舞', pinyin:'wén jī qǐ wǔ', meaning:'比喻有志报国的人及时奋起', example:'他每天闻鸡起舞，坚持晨跑锻炼。' },
  { word:'精卫填海', pinyin:'jīng wèi tián hǎi', meaning:'比喻意志坚决、不畏艰难', example:'他以精卫填海的精神坚持学习，最终取得了进步。' },
];

export default function RandomIdiom() {
  const [idiom, setIdiom] = useState<IdiomData>(IDIOMS[0]);

  const refresh = useCallback(() => {
    let idx: number;
    do { idx = Math.floor(Math.random() * IDIOMS.length); }
    while (IDIOMS.length > 1 && IDIOMS[idx].word === idiom.word);
    setIdiom(IDIOMS[idx]);
  }, [idiom.word]);

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={pageTitle}>随机学成语</h1>
        <p style={pageDesc}>随机展示成语及其释义，帮助用户学习和积累成语知识</p>
      </div>
      <div style={cardStyle}>
        <div style={idiomStyle}>{idiom.word}</div>
        <div style={pyStyle}>{idiom.pinyin}</div>
        <div style={meaningStyle}>{idiom.meaning}</div>
        <div style={exampleStyle}>"{idiom.example}"</div>
      </div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <button style={btnStyle} onClick={refresh}>换一条</button>
      </div>
    </div>
  );
}
