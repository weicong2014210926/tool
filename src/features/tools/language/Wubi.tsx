import React, { useState } from 'react';

const containerStyle: React.CSSProperties = { maxWidth: 900, margin: '0 auto' };
const headerStyle: React.CSSProperties = { marginBottom: 24 };
const pageTitle: React.CSSProperties = { fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', marginBottom: 8 };
const pageDesc: React.CSSProperties = { fontSize: 14, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', lineHeight: 1.6 };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-sans)' };
const btnStyle: React.CSSProperties = { padding: '8px 20px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--color-blue)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 2px 0 #6a7fd0' };
const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 14, fontFamily: 'var(--font-sans)', outline: 'none', flex: 1 };
const resultCard: React.CSSProperties = { padding: '12px 16px', borderRadius: 10, border: '1px solid var(--border-light)', background: 'var(--bg-tool)', marginBottom: 8 };
const tableHeader: React.CSSProperties = { display: 'grid', gridTemplateColumns: '80px 1fr 1fr 1fr', gap: 12, padding: '8px 16px', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', borderBottom: '2px solid var(--border-color)', marginBottom: 8 };

// Wubi codes: [char, 86 version, 98 version, root decomposition]
const WUBI_DATA: [string, string, string, string][] = [
  ['一','g','g','一(GGLL)'],['二','fg','fg','二(FGG)'],['三','dg','dg','三(DGGG)'],
  ['四','lh','lh','四(LHNG)'],['五','gg','gg','五(GGHG)'],['六','uy','uy','六(UYGY)'],
  ['七','ag','ag','七(AGN)'],['八','wty','wty','八(WTY)'],['九','vt','vt','九(VTN)'],
  ['十','fgh','fgh','十(FGH)'],['百','dj','dj','百(DJF)'],['千','tfk','tfk','千(TFK)'],
  ['万','dnv','gqe','万(DNV)'],['亿','wn','wn','亿(WNN)'],['零','fwyc','fwyc','零(FWYC)'],
  ['我','q','trny','手戈(TRNT)'],['你','wq','wqiy','亻小(WQIY)'],
  ['他','wb','wb','亻也(WBN)'],['们','wu','wu','亻门(WUN)'],['是','j','j','日一(JGHU)'],
  ['的','r','r','白勺(RQYY)'],['不','i','dhi','一小(GII)'],['了','b','b','了(BNH)'],
  ['在','d','d','丨土(DHFD)'],['有','e','e','月(DEF)'],['和','t','t','禾口(TKG)'],
  ['人','w','w','人(WWWW)'],['这','p','ypi','文辶(YPI)'],['中','k','k','口丨(KHK)'],
  ['大','dd','dd','大(DDDD)'],['为','o','ytly','丶力(YLYI)'],['上','h','h','上(HHGG)'],
  ['个','wh','wh','人丨(WHJ)'],['国','l','l','囗王(LGYI)'],
  ['以','c','c','人(NYWY)'],['到','gc','gc','一土(GCFJ)'],['说','yu','yu','讠口儿(YUKQ)'],
  ['时','jf','jf','日寸(JFY)'],['小','ih','ih','小(IHTY)'],['就','yi','yi','亠小(YIDN)'],
  ['要','s','s','西女(SVF)'],['出','bm','bm','凵山(BMK)'],['会','wf','wfc','人二ム(WFCU)'],
  ['可','sk','sk','丁口(SKD)'],['主','y','y','丶王(YGD)'],['用','et','et','用(ETNH)'],
  ['年','rh','tg','丨(TGJ)'],['能','ce','ce','ム月匕(CEXX)'],['发','v','ntcy','乙又(V)'],
  ['工','a','a','工(AAAA)'],['生','tg','tgd','丿丰(TGD)'],['对','cf','cf','又寸(CFY)'],
  ['于','gf','gf','一十(GFK)'],['学','ip','ipb','小冖子(IPBF)'],['下','gh','gh','一卜(GHI)'],
  ['级','xe','xby','纟乃(XEYY)'],['义','yq','yr','丶乂(YQI)'],['后','rg','rg','口(RGKD)'],
  ['自','thd','thd','丿目(THD)'],['己','nn','nn','己(NNGN)'],['家','pe','pge','宀豕(PEU)'],
  ['开','ga','ga','一廾(GAK)'],['法','if','ifc','氵土ム(IFCY)'],['天','gd','gd','一大(GDI)'],
  ['里','jfd','jfd','日土(JFD)'],['面','dm','dl','丆口(DMJD)'],['方','yy','yy','方(YYGN)'],
  ['心','ny','ny','心(NYNY)'],['前','ue','uej','丷月刂(UEJJ)'],['点','hko','hko','卜口灬(HKOU)'],
  ['而','dmj','dmj','丆口(DMJJ)'],['事','gk','gkvh','一口彐(GKVH)'],
  ['月','eee','eee','月(EEEE)'],['火','ooo','ooo','火(OOOO)'],['水','ii','ii','水(IIII)'],
  ['木','ssss','ssss','木(SSSS)'],['金','qqqq','qqqq','金(QQQQ)'],['土','ffff','ffff','土(FFFF)'],
  ['日','jjjj','jjjj','日(JJJJ)'],['王','ggg','ggg','王(GGGG)'],['田','lll','lll','田(LLLL)'],
  ['山','mmm','mmm','山(MMMM)'],['禾','ttt','ttt','禾(TTTT)'],['白','rrr','rrr','白(RRRR)'],
  ['立','uu','uuu','立(UUUU)'],['言','yyy','yyy','言(YYYY)'],
  ['女','vvv','vvv','女(VVVV)'],['子','bb','bb','子(BBBB)'],
  ['之','pp','pp','之(PPPP)'],['文','yygy','yygy','文(YYGY)'],['见','mqb','mqb','冂儿(MQB)'],
  ['又','ccc','ccc','又(CCCC)'],['石','dddg','dddg','石(DDDG)'],['车','lg','lg','车(LGNH)'],
  ['东','ai','ai','七小(AII)'],['西','sghg','sghg','西(SGHG)'],['南','fm','fm','十冂(FMUF)'],
  ['北','ux','ux','爿匕(UXX)'],['左','da','da','工(DAF)'],['右','dk','dk','口(DKF)'],
  ['风','mq','wr','几乂(MQI)'],['云','fcu','fcu','二ム(FCU)'],['雨','fghy','fghy','雨(FGHY)'],
  ['雪','fv','fv','雨彐(FVF)'],['雷','flf','flf','雨田(FLF)'],['电','jn','jn','日乚(JNV)'],
  ['春','dw','dwj','三人日(DWJF)'],['夏','dht','dht','目(DHTU)'],['秋','to','to','禾火(TOY)'],
  ['冬','tuu','tuu','夂(TUU)'],['男','ll','le','田力(LLB)'],['女','vvv','vvv','女(VVVV)'],
  ['父','wqu','wru','八乂(WQU)'],['母','xgu','xnn','母(XGUI)'],['兄','kqb','kqb','口儿(KQB)'],
  ['弟','uxh','uxh','丷弓丨(UXHT)'],['姐','veg','veg','女且(VEGG)'],['妹','vfi','vf','女未(VFIY)'],
  ['红','xa','xa','纟工(XAG)'],['绿','xv','xvi','纟彐水(XVIY)'],['黄','amw','amw','黄(AMWU)'],
  ['蓝','ajt','ajt','艹(AJTL)'],['白','rrr','rrr','白(RRRR)'],['黑','lfo','lfo','黑土(LFOU)'],
  ['好','vb','vb','女子(VBG)'],['坏','fgi','fd','土不(FGIY)'],['美','ugdu','ugdu','丷大(UGDU)'],
  ['丑','nfd','nhg','乙十(NFD)'],['新','usr','usr','立木斤(USRH)'],['旧','hj','hj','丨日(HJG)'],
  ['快','nnw','nnw','丶人(NNWY)'],['慢','nj','njlc','曰又(NJLC)'],['爱','ep','epd','心(EPDC)'],
  ['恨','nv','nvy','丶艮(NVEY)'],['想','shn','shn','木目心(SHNU)'],['知','td','td','大ロ(TDKG)'],
  ['道','uthp','uthp','丷目辶(UTHP)'],['路','kht','kht','口止(KHTK)'],['球','gfi','ggi','王十(GFIY)'],
  ['花','awx','awx','艹亻匕(AWXB)'],['草','ajj','ajj','艹早(AJJ)'],['树','scf','scf','木又寸(SCFY)'],
  ['叶','kf','kf','口十(KFH)'],['根','sve','sv','木艮(SVEY)'],['果','js','js','日本(JSI)'],
  ['茶','aws','aws','艹人木(AWSU)'],['米','oy','oyt','米(OYTY)'],['饭','qnr','qnr','食反(QNRC)'],
  ['菜','ae','aes','艹木(AESU)'],['肉','mww','mww','门人人(MWWI)'],['酒','isgg','isgg','氵酉(ISGG)'],
  ['猫','qtal','qtal','犭艹田(QTAL)'],['狗','qtq','qtq','犭句(QTQK)'],['鸟','qyng','qgd','鸟(QYNG)'],
  ['鱼','qgf','qgf','鱼(QGF)'],['虫','jhny','jhny','虫(JHNY)'],['龙','dx','dxy','龙(DXV)'],
  ['虎','ha','hwv','七几(HAM)'],['马','cn','cgd','马(CNNG)'],['牛','rhk','tgk','丨(RHK)'],
  ['羊','udj','uyth','丷(UDJ)'],['猪','qtfj','qtfj','犭土日(QTFJ)'],['鸡','cqy','cqgg','又鸟(CQYG)'],
  ['鸭','lqy','lqgg','甲鸟(LQYG)'],['鹅','trng','trng','鸟(TRNG)'],
  ['书','nnh','nnh','乙(NNHY)'],['笔','tt','teb','竹毛(TTFN)'],['纸','xqa','xqa','纟七(XQAN)'],
  ['字','pb','pb','宀子(PBF)'],['画','gl','gl','一田山(GLBJ)'],['歌','sksw','sksw','丁口人(SKSW)'],
  ['舞','rlg','tgl','一(RLGH)'],['唱','kjj','kjj','口日(KJJG)'],['听','kr','kr','口斤(KRH)'],
  ['看','rhf','rhf','目(RHF)'],['说','yu','yukq','讠口儿(YUKQ)'],['读','yfn','yfn','讠十乙(YFND)'],
  ['写','pgn','pgn','宀一(PGNG)'],['教','ftbt','ftbt','土子攵(FTBT)'],['学','ip','ipb','小冖子(IPBF)'],
  ['医','atd','atd','匚大(ATDI)'],['药','ax','axq','艹纟(AXQY)'],['病','ugm','ugm','疒一冂(UGMW)'],
  ['钱','qg','qga','钅(QGT)'],['买','nudu','nudu','乛大(NUDU)'],['卖','fnud','fnud','十乛大(FNUD)'],
  ['贵','khgm','khgm','口丨贝(KHGM)'],['穷','pwl','pwe','宀八力(PWLB)'],['富','pgk','pgk','宀一口(PGKL)'],
  ['战','hka','hka','卜口戈(HKAT)'],['争','qv','qvhj','勹(QVHJ)'],['胜','etg','etg','月生(ETGG)'],
  ['败','mty','mty','贝攵(MTY)'],['武','gah','gah','一弋止(GAHD)'],['文','yygy','yygy','文(YYGY)'],
  ['体','wsg','wsg','亻本(WSGG)'],['脑','eyb','eyb','月文(EYBH)'],['手','rt','rt','手(RTGH)'],
  ['脚','efcb','efcb','月土(EFCB)'],['头','udi','udi','大(UDI)'],['眼','hv','hve','目艮(HVEY)'],
  ['耳','bgh','bgh','耳(BGHG)'],['口','kkkk','kkkk','口(KKKK)'],['鼻','thl','thl','丿目(THLJ)'],
  ['吃','ktn','ktn','口干(KTNN)'],['喝','kjq','kjq','口日(KJQN)'],['睡','ht','htg','目(HGF)'],
  ['跑','khq','khq','口止(KHQN)'],['走','fhu','fhu','土(FHU)'],['飞','nui','nui','乙(NUI)'],
  ['笑','ttd','ttd','竹大(TTDU)'],['哭','kkdu','kkdu','口口犬(KKDU)'],['喜','fku','fku','士口(FKUK)'],
  ['怒','vcn','vcn','女又心(VCNU)'],['哀','yeu','yeu','衣(YEU)'],['乐','qi','tni','小(QII)'],
];

export default function Wubi() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<typeof WUBI_DATA>([]);
  const [error, setError] = useState('');

  const handleSearch = () => {
    const chars = input.replace(/\s/g, '');
    if (!chars) { setError('请输入要查询的汉字'); setResults([]); return; }
    const found: typeof WUBI_DATA = [];
    for (const ch of chars) {
      const item = WUBI_DATA.find(d => d[0] === ch);
      if (item) found.push(item);
      else found.push([ch, '-', '-', '暂无数据']);
    }
    setResults(found);
    setError('');
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={pageTitle}>五笔编码查询</h1>
        <p style={pageDesc}>查询汉字的五笔字型编码，支持86版和98版五笔编码查询</p>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <input
          style={inputStyle}
          value={input}
          onChange={e => { setInput(e.target.value); setError(''); }}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          placeholder="输入汉字查询五笔编码..."
        />
        <button style={btnStyle} onClick={handleSearch}>查询</button>
      </div>
      {error && <div style={{ color: 'var(--color-red)', fontSize: 13, marginBottom: 12, fontFamily: 'var(--font-sans)' }}>{error}</div>}
      {results.length > 0 && (
        <div>
          <div style={tableHeader}>
            <span>汉字</span><span>86版</span><span>98版</span><span>字根分解</span>
          </div>
          {results.map((r, i) => (
            <div key={i} style={{ ...resultCard, display: 'grid', gridTemplateColumns: '80px 1fr 1fr 1fr', gap: 12, fontSize: 14 }}>
              <span style={{ fontWeight: 700, color: 'var(--color-pink)' }}>{r[0]}</span>
              <span style={{ fontFamily: '"Fira Code", monospace' }}>{r[1]}</span>
              <span style={{ fontFamily: '"Fira Code", monospace' }}>{r[2]}</span>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{r[3]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
