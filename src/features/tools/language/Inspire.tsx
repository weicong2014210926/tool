import React, { useState, useCallback } from 'react';
import { showToast } from '../../../components/ui/Toast';

const containerStyle: React.CSSProperties = { maxWidth: 900, margin: '0 auto' };
const headerStyle: React.CSSProperties = { marginBottom: 24 };
const pageTitle: React.CSSProperties = { fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', marginBottom: 8 };
const pageDesc: React.CSSProperties = { fontSize: 14, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', lineHeight: 1.6 };
const cardStyle: React.CSSProperties = { padding: '40px 36px', borderRadius: 20, border: '1px solid var(--border-light)', background: 'linear-gradient(135deg, var(--bg-tool), #fef9e7)', textAlign: 'center' as const, marginBottom: 20 };
const cnStyle: React.CSSProperties = { fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', fontFamily: '"Noto Sans SC", var(--font-sans)', lineHeight: 2, marginBottom: 8 };
const enStyle: React.CSSProperties = { fontSize: 16, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', fontStyle: 'italic', lineHeight: 1.8 };
const btnStyle: React.CSSProperties = { padding: '10px 28px', borderRadius: 12, border: '1px solid var(--border-color)', background: 'var(--color-blue)', color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 2px 0 #6a7fd0' };
const btnOutline: React.CSSProperties = { ...btnStyle, background: 'var(--bg-card)', color: 'var(--text-primary)', borderColor: 'var(--border-color)', boxShadow: '0 2px 0 var(--border-color)' };

const QUOTES: { cn: string; en: string }[] = [
  { cn:'天行健，君子以自强不息。', en:'"As heaven maintains vigor through movement, a gentleman should constantly strive for self-perfection."' },
  { cn:'路漫漫其修远兮，吾将上下而求索。', en:'"The road ahead is long and winding, I will search high and low."' },
  { cn:'千里之行，始于足下。', en:'"A journey of a thousand miles begins with a single step."' },
  { cn:'不积跬步，无以至千里。', en:'"Without accumulating small steps, one cannot reach a thousand miles."' },
  { cn:'有志者事竟成。', en:'"Where there is a will, there is a way."' },
  { cn:'学而不思则罔，思而不学则殆。', en:'"Learning without thinking leads to confusion; thinking without learning leads to danger."' },
  { cn:'温故而知新，可以为师矣。', en:'"Review the old to learn the new, and you can be a teacher."' },
  { cn:'三人行，必有我师焉。', en:'"When three walk together, there must be one who can be my teacher."' },
  { cn:'学而时习之，不亦说乎？', en:'"Is it not a pleasure to learn and practice what you have learned?"' },
  { cn:'富贵不能淫，贫贱不能移，威武不能屈。', en:'"Neither riches nor honors can corrupt him, neither poverty nor humbleness can make him swerve, neither threats nor force can bend him."' },
  { cn:'宝剑锋从磨砺出，梅花香自苦寒来。', en:'"A sharp sword comes from grinding; plum blossom fragrance comes from bitter cold."' },
  { cn:'书山有路勤为径，学海无涯苦作舟。', en:'"Diligence is the path to the mountain of knowledge; hard work is the boat across the endless sea of learning."' },
  { cn:'天生我材必有用。', en:'"Heaven has made us talents; we\'re not made in vain."' },
  { cn:'长风破浪会有时，直挂云帆济沧海。', en:'"A time will come to ride the wind and cleave the waves; I\'ll set my cloudlike sail to cross the sea."' },
  { cn:'业精于勤，荒于嬉。', en:'"Achievements are accomplished through diligence and lost through idleness."' },
  { cn:'锲而不舍，金石可镂。', en:'"If you keep chipping away, even metal and stone can be carved."' },
  { cn:'少壮不努力，老大徒伤悲。', en:'"If one does not work hard in youth, one will regret in old age."' },
  { cn:'读书破万卷，下笔如有神。', en:'"Having read ten thousand volumes, one writes as if inspired."' },
  { cn:'纸上得来终觉浅，绝知此事要躬行。', en:'"What is learned from paper is shallow; true knowledge comes from practice."' },
  { cn:'山重水复疑无路，柳暗花明又一村。', en:'"Where hills bend and streams curve, one doubts there is a path; yet beyond the willows, flowers bloom in another village."' },
  { cn:'会当凌绝顶，一览众山小。', en:'"I will ascend the mountain\'s crest; it dwarfs all peaks under my feet."' },
  { cn:'海阔凭鱼跃，天高任鸟飞。', en:'"The wide sea allows fish to leap; the high sky allows birds to fly."' },
  { cn:'不以物喜，不以己悲。', en:'"Do not be elated by external gains, nor saddened by personal losses."' },
  { cn:'先天下之忧而忧，后天下之乐而乐。', en:'"Be the first to bear the world\'s troubles, and the last to enjoy its pleasures."' },
  { cn:'天下兴亡，匹夫有责。', en:'"The rise and fall of the nation concerns every common man."' },
  { cn:'滴水穿石，非一日之功。', en:'"Dripping water can penetrate stone — it is not the work of a single day."' },
  { cn:'失败是成功之母。', en:'"Failure is the mother of success."' },
  { cn:'机不可失，时不再来。', en:'"Opportunity knocks but once."' },
  { cn:'世上无难事，只要肯登攀。', en:'"Nothing in the world is difficult for one who sets his mind to it."' },
  { cn:'青出于蓝而胜于蓝。', en:'"Blue comes from indigo but is bluer than indigo itself — the student surpasses the master."' },
];

export default function Inspire() {
  const [quote, setQuote] = useState(QUOTES[0]);

  const refresh = useCallback(() => {
    let idx: number;
    do { idx = Math.floor(Math.random() * QUOTES.length); }
    while (QUOTES.length > 1 && QUOTES[idx].cn === quote.cn);
    setQuote(QUOTES[idx]);
  }, [quote.cn]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(quote.cn + '\n' + quote.en);
      showToast('已复制到剪贴板', 'success');
    } catch {
      showToast('复制失败', 'error');
    }
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={pageTitle}>励志句子生成</h1>
        <p style={pageDesc}>随机生成励志、正能量语句，提供精神鼓励和积极心态引导</p>
      </div>
      <div style={cardStyle}>
        <div style={cnStyle}>{quote.cn}</div>
        <div style={enStyle}>{quote.en}</div>
      </div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <button style={btnStyle} onClick={refresh}>换一条</button>
        <button style={btnOutline} onClick={handleCopy}>复制</button>
      </div>
    </div>
  );
}
