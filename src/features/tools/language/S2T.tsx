import React, { useState, useCallback } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const btnStyle: React.CSSProperties = { padding: '8px 16px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 2px 0 var(--border-color)', transition: 'all 150ms ease' };
const activeBtn: React.CSSProperties = { ...btnStyle, background: 'var(--color-pink)', color: '#fff', borderColor: 'var(--color-pink)' };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };
const sideBySide: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 };
const blockStyle: React.CSSProperties = { width: '100%', minHeight: 160, padding: 16, borderRadius: 16, background: 'var(--bg-tool)', border: '1px solid var(--border-light)', color: 'var(--text-primary)', fontSize: 14, fontFamily: '"Fira Code", "Noto Sans SC", var(--font-sans)', lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflow: 'auto', maxHeight: 500 };

type Variant = 'tw' | 'hk' | 's';
const variantLabels: Record<Variant, string> = { tw: '简体→繁体', hk: '简体→繁体(香港)', s: '繁体→简体' };

// Comprehensive simplified→traditional pairs (Taiwan standard, only S≠T mappings)
const S2T: Record<string, string> = {
  厂:'廠',几:'幾',干:'乾',亏:'虧',与:'與',万:'萬',亿:'億',个:'個',么:'麼',广:'廣',
  门:'門',义:'義',卫:'衛',飞:'飛',习:'習',马:'馬',乡:'鄉',丰:'豐',开:'開',无:'無',
  专:'專',云:'雲',扎:'紮',艺:'藝',厅:'廳',区:'區',历:'歷',车:'車',冈:'岡',贝:'貝',
  见:'見',气:'氣',长:'長',仆:'僕',币:'幣',仅:'僅',从:'從',凶:'兇',仓:'倉',风:'風',
  乌:'烏',凤:'鳳',为:'為',斗:'鬥',忆:'憶',订:'訂',计:'計',认:'認',丑:'醜',队:'隊',
  办:'辦',劝:'勸',双:'雙',书:'書',击:'擊',节:'節',术:'術',厉:'厲',龙:'龍',灭:'滅',
  轧:'軋',东:'東',占:'佔',业:'業',旧:'舊',帅:'帥',归:'歸',叶:'葉',号:'號',电:'電',
  叹:'嘆',们:'們',仪:'儀',丛:'叢',乐:'樂',处:'處',鸟:'鳥',务:'務',饥:'飢',闪:'閃',
  兰:'蘭',汇:'匯',头:'頭',汉:'漢',宁:'寧',讨:'討',写:'寫',让:'讓',礼:'禮',训:'訓',
  议:'議',讯:'訊',记:'記',辽:'遼',边:'邊',发:'發',圣:'聖',对:'對',纠:'糾',丝:'絲',
  动:'動',执:'執',巩:'鞏',扩:'擴',扫:'掃',扬:'揚',场:'場',亚:'亞',朴:'樸',机:'機',
  权:'權',过:'過',协:'協',压:'壓',厌:'厭',页:'頁',夸:'誇',夺:'奪',达:'達',夹:'夾',
  轨:'軌',划:'劃',迈:'邁',毕:'畢',贞:'貞',师:'師',尘:'塵',当:'當',吓:'嚇',虫:'蟲',
  团:'團',吗:'嗎',屿:'嶼',岁:'歲',岂:'豈',刚:'剛',则:'則',网:'網',丢:'丟',迁:'遷',
  乔:'喬',伟:'偉',传:'傳',优:'優',伤:'傷',价:'價',华:'華',伙:'夥',伪:'偽',后:'後',
  会:'會',杀:'殺',众:'眾',爷:'爺',伞:'傘',创:'創',杂:'雜',争:'爭',壮:'壯',冲:'衝',
  庄:'莊',庆:'慶',刘:'劉',齐:'齊',产:'產',决:'決',闭:'閉',问:'問',闯:'闖',并:'並',
  关:'關',灯:'燈',汤:'湯',兴:'興',讲:'講',军:'軍',许:'許',论:'論',农:'農',讽:'諷',
  设:'設',访:'訪',寻:'尋',尽:'盡',导:'導',异:'異',孙:'孫',阵:'陣',阳:'陽',阶:'階',
  阴:'陰',妇:'婦',妈:'媽',戏:'戲',观:'觀',欢:'歡',买:'買',红:'紅',纤:'纖',级:'級',
  约:'約',纪:'紀',驰:'馳',寿:'壽',麦:'麥',进:'進',远:'遠',违:'違',运:'運',抚:'撫',
  坛:'壇',坏:'壞',扰:'擾',坝:'壩',贡:'貢',抢:'搶',坟:'墳',护:'護',壳:'殼',块:'塊',
  声:'聲',报:'報',却:'卻',苍:'蒼',严:'嚴',芦:'蘆',劳:'勞',苏:'蘇',杆:'桿',杠:'槓',
  极:'極',杨:'楊',两:'兩',丽:'麗',医:'醫',励:'勵',还:'還',歼:'殲',来:'來',连:'連',
  坚:'堅',时:'時',吴:'吳',县:'縣',里:'裡',园:'園',旷:'曠',围:'圍',吨:'噸',邮:'郵',
  员:'員',听:'聽',呜:'嗚',别:'別',岗:'崗',帐:'帳',财:'財',针:'針',钉:'釘',乱:'亂',
  秃:'禿',体:'體',佣:'傭',彻:'徹',余:'餘',邻:'鄰',肠:'腸',龟:'龜',犹:'猶',删:'刪',
  条:'條',岛:'島',饭:'飯',饮:'飲',冻:'凍',状:'狀',亩:'畝',况:'況',库:'庫',疗:'療',
  应:'應',这:'這',闲:'閒',间:'間',闷:'悶',灿:'燦',沟:'溝',没:'沒',怀:'懷',忧:'憂',
  穷:'窮',灾:'災',证:'證',启:'啟',评:'評',补:'補',识:'識',诉:'訴',诊:'診',词:'詞',
  译:'譯',灵:'靈',层:'層',迟:'遲',张:'張',际:'際',陆:'陸',陈:'陳',劲:'勁',鸡:'雞',
  驱:'驅',纯:'純',纱:'紗',纳:'納',纲:'綱',驳:'駁',纵:'縱',纷:'紛',纸:'紙',纹:'紋',
  纺:'紡',驴:'驢',纽:'紐',责:'責',现:'現',规:'規',顶:'頂',轮:'輪',软:'軟',齿:'齒',
  虏:'虜',肾:'腎',贤:'賢',国:'國',畅:'暢',鸣:'鳴',咏:'詠',罗:'羅',败:'敗',账:'賬',
  贩:'販',购:'購',凯:'凱',图:'圖',钓:'釣',制:'製',刮:'颳',侠:'俠',侦:'偵',侧:'側',
  凭:'憑',货:'貨',径:'徑',质:'質',贪:'貪',贫:'貧',肤:'膚',肿:'腫',胀:'脹',鱼:'魚',
  备:'備',饲:'飼',变:'變',庞:'龐',庙:'廟',废:'廢',闸:'閘',闹:'鬧',郑:'鄭',卷:'捲',
  单:'單',浅:'淺',怜:'憐',学:'學',实:'實',衬:'襯',视:'視',话:'話',诞:'誕',询:'詢',
  该:'該',详:'詳',肃:'肅',录:'錄',隶:'隸',驾:'駕',艰:'艱',线:'線',练:'練',组:'組',
  细:'細',织:'織',终:'終',绍:'紹',经:'經',贯:'貫',帮:'幫',标:'標',栈:'棧',栋:'棟',
  栏:'欄',树:'樹',咸:'鹹',砖:'磚',砚:'硯',面:'麵',牵:'牽',鸦:'鴉',战:'戰',点:'點',
  临:'臨',尝:'嘗',显:'顯',贵:'貴',虾:'蝦',蚁:'蟻',蚂:'螞',虽:'雖',贴:'貼',闰:'閏',
  阀:'閥',阁:'閣',养:'養',举:'舉',觉:'覺',语:'語',误:'誤',诱:'誘',说:'說',诵:'誦',
  垦:'墾',费:'費',逊:'遜',险:'險',贺:'賀',绒:'絨',结:'結',绘:'繪',给:'給',络:'絡',
  绝:'絕',绞:'絞',统:'統',艳:'艷',蚕:'蠶',顽:'頑',捞:'撈',赶:'趕',载:'載',盐:'鹽',
  桥:'橋',壶:'壺',恶:'惡',档:'檔',毙:'斃',热:'熱',虑:'慮',监:'監',紧:'緊',党:'黨',
  晒:'曬',晓:'曉',鸭:'鴨',罢:'罷',圆:'圓',贼:'賊',赂:'賂',赃:'贓',钱:'錢',钻:'鑽',
  铁:'鐵',铃:'鈴',铅:'鉛',积:'積',称:'稱',秘:'祕',笔:'筆',债:'債',倾:'傾',赁:'賃',
  顺:'順',饿:'餓',脏:'臟',脑:'腦',皱:'皺',恋:'戀',浆:'漿',桨:'槳',读:'讀',谁:'誰',
  调:'調',谅:'諒',谈:'談',谊:'誼',恳:'懇',剧:'劇',绣:'繡',验:'驗',继:'繼',绢:'絹',
  职:'職',欧:'歐',轰:'轟',转:'轉',环:'環',矿:'礦',码:'碼',态:'態',范:'範',奋:'奮',
  斩:'斬',顷:'頃',岭:'嶺',贬:'貶',贮:'貯',鉴:'鑑',签:'簽',简:'簡',毁:'毀',惩:'懲',
  释:'釋',滨:'濱',粮:'糧',触:'觸',叠:'疊',缝:'縫',缠:'纏',墙:'牆',酿:'釀',锹:'鍬',
  稳:'穩',鲜:'鮮',审:'審',宪:'憲',帘:'簾',弯:'彎',奖:'獎',疮:'瘡',疯:'瘋',迹:'跡',
  洒:'灑',洁:'潔',涌:'湧',烫:'燙',涧:'澗',涨:'漲',
  渊:'淵',渔:'漁',渗:'滲',惭:'慚',惯:'慣',弹:'彈',堕:'墮',随:'隨',隐:'隱',
  绩:'績',绪:'緒',续:'續',绳:'繩',维:'維',绵:'綿',绷:'繃',综:'綜',绽:'綻',绿:'綠',
  缀:'綴',趋:'趨',揽:'攬',搂:'摟',搅:'攪',顿:'頓',
  献:'獻',赖:'賴',碍:'礙',频:'頻',龄:'齡',错:'錯',锡:'錫',锣:'鑼',锤:'錘',锦:'錦',
  键:'鍵',锯:'鋸',锰:'錳',辞:'辭',颓:'頹',筹:'籌',愈:'癒',
  腻:'膩',颖:'穎',酱:'醬',韵:'韻',数:'數',满:'滿',
  滤:'濾',滔:'滔',静:'靜',蔑:'衊',熏:'薰',
};

// HK variant differences from TW
const HK_DIFF: Record<string, string> = {
  卫:'衞',着:'著',线:'線',汇:'匯',里:'裏',历:'歷',复:'復',
};

function s2t(text: string, variant: 'tw' | 'hk'): string {
  let result = '';
  for (const ch of text) {
    let t = S2T[ch];
    if (!t) t = ch;
    if (variant === 'hk' && HK_DIFF[ch]) t = HK_DIFF[ch];
    result += t;
  }
  return result;
}

function t2s(text: string): string {
  const reverseMap: Record<string, string> = {};
  for (const [k, v] of Object.entries(S2T)) {
    // If multiple S map to same T, keep the first (or most common)
    if (!(v in reverseMap)) reverseMap[v] = k;
  }
  let result = '';
  for (const ch of text) {
    result += reverseMap[ch] || ch;
  }
  return result;
}

export default function S2TTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [variant, setVariant] = useState<Variant>('tw');

  const handleInput = useCallback((value: string) => {
    setInput(value);
    if (variant === 's') {
      setOutput(t2s(value));
    } else {
      setOutput(s2t(value, variant));
    }
  }, [variant]);

  const handleVariant = (v: Variant) => {
    setVariant(v);
    if (!input) return;
    if (v === 's') {
      setOutput(t2s(input));
    } else {
      setOutput(s2t(input, v));
    }
  };

  const extraActions = (
    <>
      {(Object.entries(variantLabels) as [Variant, string][]).map(([v, label]) => (
        <button
          key={v}
          style={variant === v ? activeBtn : btnStyle}
          onClick={() => handleVariant(v)}
        >
          {label}
        </button>
      ))}
    </>
  );

  return (
    <ToolLayout
      toolId="lang-s2t"
      title="简体繁体转换"
      description="实现中文简体字和繁体字之间的相互转换，支持台湾繁体、香港繁体"
      inputValue={input}
      onInputChange={handleInput}
      outputValue=""
      inputPlaceholder="在此输入中文..."
      extraActions={extraActions}
    >
      {output && (
        <div style={{ marginBottom: 20 }}>
          <div style={labelStyle}>转换结果</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 16, alignItems: 'start' }}>
            <div style={blockStyle}>{input}</div>
            <div style={{ alignSelf: 'center', fontWeight: 700, fontSize: 20, color: 'var(--color-pink)' }}>→</div>
            <div style={blockStyle}>{output}</div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
