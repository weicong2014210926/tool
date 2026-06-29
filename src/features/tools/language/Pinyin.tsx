import React, { useState, useCallback } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

const btnStyle: React.CSSProperties = { padding: '8px 16px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 2px 0 var(--border-color)', transition: 'all 150ms ease' };
const activeBtn: React.CSSProperties = { ...btnStyle, background: 'var(--color-blue)', color: '#fff', borderColor: 'var(--color-blue)' };

type PinyinMode = 'tone' | 'notone' | 'initial';

const PINYIN_MAP: Record<string, string> = {
  '一':'yi1','乙':'yi3','二':'er4','十':'shi2','丁':'ding1','厂':'chang3','七':'qi1',
  '八':'ba1','九':'jiu3','几':'ji3','了':'le5','力':'li4','乃':'nai3','又':'you4',
  '三':'san1','于':'yu2','干':'gan4','大':'da4','万':'wan4','上':'shang4','小':'xiao3',
  '口':'kou3','山':'shan1','千':'qian1','川':'chuan1','个':'ge4','门':'men2','之':'zhi1',
  '子':'zi3','女':'nv3','飞':'fei1','马':'ma3','王':'wang2','开':'kai1','天':'tian1',
  '无':'wu2','元':'yuan2','云':'yun2','木':'mu4','五':'wu3','不':'bu4','太':'tai4',
  '区':'qu1','友':'you3','车':'che1','少':'shao3','日':'ri4','中':'zhong1','内':'nei4',
  '水':'shui3','见':'jian4','午':'wu3','牛':'niu2','手':'shou3','毛':'mao2','气':'qi4',
  '长':'chang2','片':'pian4','化':'hua4','反':'fan3','介':'jie4','父':'fu4','从':'cong2',
  '今':'jin1','分':'fen1','公':'gong1','月':'yue4','风':'feng1','文':'wen2','六':'liu4',
  '方':'fang1','火':'huo3','为':'wei4','斗':'dou4','心':'xin1','巴':'ba1','以':'yi3',
  '书':'shu1','去':'qu4','正':'zheng4','功':'gong1','世':'shi4','古':'gu3','本':'ben3',
  '可':'ke3','左':'zuo3','右':'you4','石':'shi2','龙':'long2','平':'ping2','东':'dong1',
  '北':'bei3','目':'mu4','电':'dian4','号':'hao4','田':'tian2','由':'you2','只':'zhi3',
  '四':'si4','生':'sheng1','白':'bai2','他':'ta1','用':'yong4','印':'yin4','乐':'le4',
  '句':'ju4','外':'wai4','处':'chu4','冬':'dong1','包':'bao1','主':'zhu3','市':'shi4',
  '立':'li4','半':'ban4','头':'tou2','宁':'ning2','写':'xie3','让':'rang4','必':'bi4',
  '永':'yong3','民':'min2','出':'chu1','加':'jia1','边':'bian1','发':'fa1','对':'dui4',
  '台':'tai2','母':'mu3','幼':'you4','动':'dong4','老':'lao3','地':'di4','耳':'er3',
  '共':'gong4','在':'zai4','有':'you3','而':'er2','百':'bai3','存':'cun2','死':'si3',
  '成':'cheng2','光':'guang1','当':'dang1','早':'zao3','同':'tong2','吃':'chi1','因':'yin1',
  '回':'hui2','刚':'gang1','肉':'rou4','年':'nian2','先':'xian1','休':'xiu1','件':'jian4',
  '任':'ren4','伤':'shang1','价':'jia4','份':'fen4','自':'zi4','血':'xue4','向':'xiang4',
  '后':'hou4','行':'xing2','全':'quan2','会':'hui4','合':'he2','众':'zhong4','各':'ge4',
  '名':'ming2','多':'duo1','色':'se4','壮':'zhuang4','冲':'chong1','冰':'bing1','交':'jiao1',
  '衣':'yi1','产':'chan3','关':'guan1','米':'mi3','灯':'deng1','江':'jiang1','字':'zi4',
  '安':'an1','军':'jun1','许':'xu3','那':'na4','收':'shou1','好':'hao3','她':'ta1',
  '买':'mai3','红':'hong2','进':'jin4','远':'yuan3','运':'yun4','找':'zhao3','走':'zou3',
  '把':'ba3','花':'hua1','严':'yan2','克':'ke4','两':'liang3','还':'hai2','来':'lai2',
  '连':'lian2','时':'shi2','里':'li3','男':'nan2','别':'bie2','财':'cai2','针':'zhen1',
  '我':'wo3','乱':'luan4','体':'ti3','何':'he2','但':'dan4','你':'ni3','住':'zhu4',
  '位':'wei4','身':'shen1','近':'jin4','坐':'zuo4','饭':'fan4','言':'yan2','这':'zhe4',
  '间':'jian1','没':'mei2','快':'kuai4','完':'wan2','社':'she4','识':'shi2','层':'ceng2',
  '改':'gai3','张':'zhang1','纯':'chun2','纸':'zhi3','现':'xian4','表':'biao3','画':'hua4',
  '事':'shi4','转':'zhuan3','国':'guo2','明':'ming2','知':'zhi1','和':'he2','使':'shi3',
  '的':'de5','往':'wang3','金':'jin1','受':'shou4','变':'bian4','放':'fang4','学':'xue2',
  '定':'ding4','空':'kong1','实':'shi2','话':'hua4','建':'jian4','居':'ju1','组':'zu3',
  '经':'jing1','春':'chun1','帮':'bang1','相':'xiang1','面':'mian4','战':'zhan4','点':'dian3',
  '是':'shi4','看':'kan4','重':'zhong4','信':'xin4','追':'zhui1','食':'shi2','将':'jiang1',
  '前':'qian2','总':'zong3','洗':'xi3','觉':'jue2','神':'shen2','说':'shuo1','给':'gei3',
  '孩':'hai2','起':'qi3','都':'dou1','真':'zhen1','原':'yuan2','致':'zhi4','啊':'a5',
  '钱':'qian2','笑':'xiao4','爱':'ai4','高':'gao1','家':'jia1','请':'qing3','读':'du2',
  '谁':'shei2','能':'neng2','难':'nan2','球':'qiu2','教':'jiao1','眼':'yan3','第':'di4',
  '做':'zuo4','停':'ting2','得':'de2','猜':'cai1','减':'jian3','鹿':'lu4','绿':'lv4',
  '想':'xiang3','感':'gan3','新':'xin1','意':'yi4','数':'shu4','满':'man3','福':'fu2',
  '群':'qun2','路':'lu4','跟':'gen1','解':'jie3','影':'ying3','颜':'yan2','海':'hai3',
  '药':'yao4','黄':'huang2','铁':'tie3','特':'te4','拿':'na2','脑':'nao3','留':'liu2',
  '离':'li2','病':'bing4','剧':'ju4','通':'tong1','娘':'niang2','理':'li3','接':'jie1',
  '雪':'xue3','常':'chang2','唱':'chang4','盒':'he2','彩':'cai3','脸':'lian3','象':'xiang4',
  '麻':'ma2','望':'wang4','最':'zui4','景':'jing3','跑':'pao3','黑':'hei1','程':'cheng2',
  '等':'deng3','答':'da2','短':'duan3','然':'ran2','就':'jiu4','童':'tong2','曾':'ceng2',
  '富':'fu4','谢':'xie4','强':'qiang2','蓝':'lan2','搞':'gao3','照':'zhao4','跳':'tiao4',
  '错':'cuo4','简':'jian3','像':'xiang4','微':'wei1','需':'xu1','算':'suan4','管':'guan3',
  '舞':'wu3','慢':'man4','赛':'sai4','歌':'ge1','静':'jing4','鲜':'xian1','懂':'dong3',
  '戴':'dai4','翻':'fan1','警':'jing3','赢':'ying2','爆':'bao4','魔':'mo2','失':'shi1',
  '问':'wen4','工':'gong1','才':'cai2','与':'yu3','乡':'xiang1','义':'yi4','凡':'fan2',
  '匹':'pi3','旧':'jiu4','农':'nong2','异':'yi4','戏':'xi4','欢':'huan1','约':'yue1',
  '寿':'shou4','坏':'huai4','却':'que4','劳':'lao2','极':'ji2','丽':'li4','串':'chuan4',
  '条':'tiao2','系':'xi4','究':'jiu1','证':'zheng4','词':'ci2','灵':'ling2','劲':'jin4',
  '鸡':'ji1','环':'huan2','范':'fan4','矿':'kuang4','码':'ma3','态':'tai4','齿':'chi3',
  '贤':'xian2','败':'bai4','购':'gou4','牧':'mu4','质':'zhi4','征':'zheng1','贪':'tan1',
  '肤':'fu1','肿':'zhong3','昏':'hun1','鱼':'yu2','饱':'bao3','剂':'ji4','废':'fei4',
  '净':'jing4','浅':'qian3','法':'fa3','泪':'lei4','怜':'lian2','波':'bo1','宝':'bao3',
  '试':'shi4','肩':'jian1','视':'shi4','询':'xun2','肃':'su4','练':'lian4','项':'xiang4',
  '赵':'zhao4','指':'zhi3','挤':'ji3','标':'biao1','树':'shu4','砖':'zhuan1','厚':'hou4',
  '残':'can2','览':'lan3','尝':'chang2','显':'xian3','虾':'xia1','品':'pin3','骂':'ma4',
  '钟':'zhong1','钢':'gang1','选':'xuan3','香':'xiang1','俩':'liang3','顺':'shun4','皇':'huang2',
  '鬼':'gui3','胜':'sheng4','独':'du2','饺':'jiao3','奖':'jiang3','帝':'di4','闻':'wen2',
  '美':'mei3','类':'lei4','逆':'ni4','炼':'lian4','洲':'zhou1','举':'ju3','客':'ke4',
  '误':'wu4','退':'tui4','费':'fei4','除':'chu2','险':'xian3','绕':'rao4','艳':'yan4',
  '蚕':'can2','赶':'gan3','捡':'jian3','获':'huo4','顾':'gu4','眠':'mian2','恩':'en1',
  '笔':'bi3','债':'zhai4','借':'jie4','息':'xi1','席':'xi2','准':'zhun3','粉':'fen3',
  '烦':'fan2','烟':'yan1','酒':'jiu3','润':'run4','宾':'bin1','袜':'wa4','课':'ke4',
  '谈':'tan2','展':'zhan3','验':'yan4','捧':'peng3','描':'miao2','萝':'luo2','梦':'meng4',
  '检':'jian3','盛':'sheng4','虚':'xu1','蛇':'she2','银':'yin2','笼':'long2','笛':'di2',
  '脚':'jiao3','馆':'guan3','痒':'yang3','盗':'dao4','清':'qing1','深':'shen1','粗':'cu1',
  '断':'duan4','联':'lian2','期':'qi1','棋':'qi2','棉':'mian2','散':'san4','落':'luo4',
  '敬':'jing4','朝':'chao2','棒':'bang4','硬':'ying4','确':'que4','提':'ti2','插':'cha1',
  '搜':'sou1','悲':'bei1','赏':'shang3','晴':'qing2','喝':'he1','喂':'wei4','帽':'mao4',
  '幅':'fu2','鹅':'e2','牌':'pai2','释':'shi4','腊':'la4','善':'shan4','道':'dao4',
  '温':'wen1','游':'you2','窗':'chuang1','隔':'ge2','骗':'pian4','编':'bian1','填':'tian2',
  '楼':'lou2','概':'gai4','碗':'wan3','零':'ling2','输':'shu1','龄':'ling2','跪':'gui4',
  '罪':'zui4','傻':'sha3','腿':'tui3','量':'liang4','鼠':'shu3','催':'cui1','躲':'duo3',
  '超':'chao1','旗':'qi2','蜜':'mi4','演':'yan3','熊':'xiong2','缩':'suo1','横':'heng2',
  '踢':'ti1','踏':'ta4','镇':'zhen4','飘':'piao1','蔬':'shu1','聪':'cong1','鞋':'xie2',
  '箭':'jian4','躺':'tang3','德':'de2','熟':'shu2','摩':'mo2','糊':'hu2','整':'zheng3',
  '醒':'xing3','餐':'can1','嘴':'zui3','篮':'lan2','镜':'jing4','糖':'tang2','燃':'ran2',
  '澡':'zao3','糕':'gao1','壁':'bi4','避':'bi4','瞧':'qiao2','繁':'fan2','糟':'zao1',
  '注':'zhu4','治':'zhi4','器':'qi4','优':'you1','努':'nu3','效':'xiao4','较':'jiao4',
  '初':'chu1'
};

const TONE_MARKS: Record<string, string> = {
  'a1':'a','a2':'a','a3':'ǎ','a4':'a','a5':'a',
  'e1':'e','e2':'e','e3':'ě','e4':'e','e5':'e',
  'i1':'i','i2':'i','i3':'ǐ','i4':'i','i5':'i',
  'o1':'o','o2':'o','o3':'ǒ','o4':'o','o5':'o',
  'u1':'u','u2':'u','u3':'ǔ','u4':'u','u5':'u',
};

function applyTone(pinyin: string): string {
  const tone = pinyin.slice(-1);
  const base = pinyin.slice(0, -1);
  if (tone === '5') return base;
  const vowels = ['a','e','i','o','u'];
  for (const v of vowels) {
    const idx = base.indexOf(v);
    if (idx >= 0) {
      const t = v + tone;
      const marked: Record<string,string>={'a1':'a','a2':'a','a3':'ǎ','a4':'a',
        'e1':'e','e2':'e','e3':'ě','e4':'e',
        'i1':'i','i2':'i','i3':'ǐ','i4':'i',
        'o1':'o','o2':'o','o3':'ǒ','o4':'o',
        'u1':'u','u2':'u','u3':'ǔ','u4':'u'};
      return base.slice(0, idx) + (marked[t] || v) + base.slice(idx + 1);
    }
  }
  return base;
}

function toPinyin(text: string, mode: PinyinMode): string {
  return text.split('\n').map(line =>
    [...line].map(ch => {
      const py = PINYIN_MAP[ch];
      if (!py) return ch;
      if (mode === 'initial') return py.charAt(0).toUpperCase();
      if (mode === 'notone') return py.slice(0, -1);
      return applyTone(py);
    }).join(' ')
  ).join('\n');
}

export default function Pinyin() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<PinyinMode>('tone');

  const handleInput = useCallback((value: string) => {
    setInput(value);
    setOutput(toPinyin(value, mode));
  }, [mode]);

  const modes: { key: PinyinMode; label: string }[] = [
    { key: 'tone', label: '带声调' },
    { key: 'notone', label: '无声调' },
    { key: 'initial', label: '首字母' },
  ];

  return (
    <ToolLayout
      toolId="lang-pinyin"
      title="汉语拼音转换"
      description="将中文汉字转换为汉语拼音，支持带声调、无声调和首字母三种输出格式"
      inputValue={input}
      onInputChange={handleInput}
      outputValue={output}
      inputPlaceholder="在此输入中文汉字..."
      extraActions={
        <>
          {modes.map(m => (
            <button
              key={m.key}
              style={mode === m.key ? activeBtn : btnStyle}
              onClick={() => { setMode(m.key); if(input) setOutput(toPinyin(input, m.key)); }}
            >
              {m.label}
            </button>
          ))}
        </>
      }
    />
  );
}
