import React, { useState, useCallback } from 'react';
import { showToast } from '../../../components/ui/Toast';

const emojiCategories: Record<string, string[]> = {
  '笑脸': ['\u{1F600}','\u{1F601}','\u{1F602}','\u{1F603}','\u{1F604}','\u{1F605}','\u{1F606}','\u{1F607}','\u{1F608}','\u{1F609}','\u{1F60A}','\u{1F60B}','\u{1F60C}','\u{1F60D}','\u{1F60E}','\u{1F60F}','\u{1F610}','\u{1F611}','\u{1F612}','\u{1F613}','\u{1F614}','\u{1F615}','\u{1F616}','\u{1F617}','\u{1F618}','\u{1F619}','\u{1F61A}','\u{1F61B}','\u{1F61C}','\u{1F61D}','\u{1F61E}','\u{1F61F}','\u{1F620}','\u{1F621}','\u{1F622}','\u{1F623}','\u{1F624}','\u{1F625}','\u{1F626}','\u{1F627}','\u{1F628}','\u{1F629}','\u{1F62A}','\u{1F62B}','\u{1F62C}','\u{1F62D}','\u{1F62E}','\u{1F62F}','\u{1F630}','\u{1F631}','\u{1F632}','\u{1F633}','\u{1F634}','\u{1F635}','\u{1F636}','\u{1F637}','\u{1F642}','\u{1F643}','\u{1F911}','\u{1F912}','\u{1F913}','\u{1F914}','\u{1F915}','\u{1F917}','\u{1F920}','\u{1F921}','\u{1F922}','\u{1F923}','\u{1F924}','\u{1F925}'],
  '动物': ['\u{1F400}','\u{1F401}','\u{1F402}','\u{1F403}','\u{1F404}','\u{1F405}','\u{1F406}','\u{1F407}','\u{1F408}','\u{1F409}','\u{1F40A}','\u{1F40B}','\u{1F40C}','\u{1F40D}','\u{1F40E}','\u{1F40F}','\u{1F410}','\u{1F411}','\u{1F412}','\u{1F413}','\u{1F414}','\u{1F415}','\u{1F416}','\u{1F417}','\u{1F418}','\u{1F419}','\u{1F41A}','\u{1F41B}','\u{1F41C}','\u{1F41D}','\u{1F41E}','\u{1F41F}','\u{1F420}','\u{1F421}','\u{1F422}','\u{1F423}','\u{1F424}','\u{1F425}','\u{1F426}','\u{1F427}','\u{1F428}','\u{1F429}','\u{1F42A}','\u{1F42B}','\u{1F42C}','\u{1F42D}','\u{1F42E}','\u{1F42F}','\u{1F430}','\u{1F431}','\u{1F432}','\u{1F433}','\u{1F434}','\u{1F435}','\u{1F436}','\u{1F437}','\u{1F438}','\u{1F439}','\u{1F43A}','\u{1F43B}','\u{1F43C}','\u{1F43D}','\u{1F43E}','\u{1F43F}','\u{1F980}','\u{1F981}','\u{1F982}','\u{1F983}','\u{1F984}','\u{1F985}','\u{1F986}','\u{1F987}','\u{1F988}','\u{1F989}','\u{1F98A}','\u{1F98B}','\u{1F98C}','\u{1F98D}','\u{1F98E}','\u{1F98F}','\u{1F990}','\u{1F991}','\u{1F992}','\u{1F993}','\u{1F994}'],
  '食物': ['\u{1F32D}','\u{1F32E}','\u{1F32F}','\u{1F330}','\u{1F331}','\u{1F332}','\u{1F333}','\u{1F334}','\u{1F335}','\u{1F336}','\u{1F337}','\u{1F338}','\u{1F339}','\u{1F33A}','\u{1F33B}','\u{1F33C}','\u{1F33D}','\u{1F33E}','\u{1F33F}','\u{1F340}','\u{1F341}','\u{1F342}','\u{1F343}','\u{1F344}','\u{1F345}','\u{1F346}','\u{1F347}','\u{1F348}','\u{1F349}','\u{1F34A}','\u{1F34B}','\u{1F34C}','\u{1F34D}','\u{1F34E}','\u{1F34F}','\u{1F350}','\u{1F351}','\u{1F352}','\u{1F353}','\u{1F354}','\u{1F355}','\u{1F356}','\u{1F357}','\u{1F358}','\u{1F359}','\u{1F35A}','\u{1F35B}','\u{1F35C}','\u{1F35D}','\u{1F35E}','\u{1F35F}','\u{1F360}','\u{1F361}','\u{1F362}','\u{1F363}','\u{1F364}','\u{1F365}','\u{1F366}','\u{1F367}','\u{1F368}','\u{1F369}','\u{1F36A}','\u{1F36B}','\u{1F36C}','\u{1F36D}','\u{1F36E}','\u{1F36F}','\u{1F370}','\u{1F371}','\u{1F372}','\u{1F373}','\u{1F374}','\u{1F375}','\u{1F376}','\u{1F377}'],
  '旅行': ['\u{1F680}','\u{1F681}','\u{1F682}','\u{1F683}','\u{1F684}','\u{1F685}','\u{1F686}','\u{1F687}','\u{1F688}','\u{1F689}','\u{1F68A}','\u{1F68B}','\u{1F68C}','\u{1F68D}','\u{1F68E}','\u{1F68F}','\u{1F690}','\u{1F691}','\u{1F692}','\u{1F693}','\u{1F694}','\u{1F695}','\u{1F696}','\u{1F697}','\u{1F698}','\u{1F699}','\u{1F69A}','\u{1F69B}','\u{1F69C}','\u{1F69D}','\u{1F69E}','\u{1F69F}','\u{1F6A0}','\u{1F6A1}','\u{1F6A2}','\u{1F6A3}','\u{1F6A4}','\u{1F6A5}','\u{1F6A6}','\u{1F6A7}','\u{1F6A8}','\u{1F6A9}','\u{1F6AA}','\u{1F6AB}','\u{1F6AC}','\u{1F6AD}','\u{1F6AE}','\u{1F6AF}','\u{1F6B0}','\u{1F6B1}','\u{1F6B2}','\u{1F6B3}','\u{1F6B4}','\u{1F6B5}','\u{1F6B6}','\u{1F6B7}','\u{1F6B8}','\u{1F6B9}','\u{1F6BA}','\u{1F6BB}','\u{1F6BC}','\u{1F6BD}','\u{1F6BE}','\u{1F6BF}','\u{1F6C0}'],
  '活动': ['\u{1F3A8}','\u{1F3A9}','\u{1F3AA}','\u{1F3AB}','\u{1F3AC}','\u{1F3AD}','\u{1F3AE}','\u{1F3AF}','\u{1F3B0}','\u{1F3B1}','\u{1F3B2}','\u{1F3B3}','\u{1F3B4}','\u{1F3B5}','\u{1F3B6}','\u{1F3B7}','\u{1F3B8}','\u{1F3B9}','\u{1F3BA}','\u{1F3BB}','\u{1F3BC}','\u{1F3BD}','\u{1F3BE}','\u{1F3BF}','\u{1F3C0}','\u{1F3C1}','\u{1F3C2}','\u{1F3C3}','\u{1F3C4}','\u{1F3C5}','\u{1F3C6}','\u{1F3C7}','\u{1F3C8}','\u{1F3C9}','\u{1F3CA}','\u{1F3CB}','\u{1F3CC}','\u{1F3CD}','\u{1F3CE}','\u{1F3CF}','\u{1F3D0}','\u{1F3D1}','\u{1F3D2}','\u{1F3D3}','\u{1F3D4}','\u{1F3D5}','\u{1F3D6}','\u{1F3D7}','\u{1F3D8}','\u{1F3D9}','\u{1F3DA}','\u{1F3DB}','\u{1F3DC}','\u{1F3DD}','\u{1F3DE}','\u{1F3DF}','\u{1F3E0}','\u{1F3E1}','\u{1F3E2}','\u{1F3E3}','\u{1F3E4}','\u{1F3E5}','\u{1F3E6}','\u{1F3E7}','\u{1F3E8}','\u{1F3E9}','\u{1F3EA}','\u{1F3EB}','\u{1F3EC}','\u{1F3ED}','\u{1F3EE}','\u{1F3EF}'],
  '物品': ['\u{1F4F1}','\u{1F4F2}','\u{1F4F3}','\u{1F4F4}','\u{1F4F5}','\u{1F4F6}','\u{1F4F7}','\u{1F4F8}','\u{1F4F9}','\u{1F4FA}','\u{1F4FB}','\u{1F4FC}','\u{1F4FD}','\u{1F4FE}','\u{1F4FF}','\u{1F500}','\u{1F501}','\u{1F502}','\u{1F503}','\u{1F504}','\u{1F505}','\u{1F506}','\u{1F507}','\u{1F508}','\u{1F509}','\u{1F50A}','\u{1F50B}','\u{1F50C}','\u{1F50D}','\u{1F50E}','\u{1F50F}','\u{1F510}','\u{1F511}','\u{1F512}','\u{1F513}','\u{1F514}','\u{1F515}','\u{1F516}','\u{1F517}','\u{1F518}','\u{1F519}','\u{1F51A}','\u{1F51B}','\u{1F51C}','\u{1F51D}','\u{1F51E}','\u{1F51F}','\u{1F520}','\u{1F521}','\u{1F522}','\u{1F523}','\u{1F524}','\u{1F525}','\u{1F526}','\u{1F527}','\u{1F528}','\u{1F529}','\u{1F52A}','\u{1F52B}','\u{1F52C}','\u{1F52D}','\u{1F52E}','\u{1F52F}','\u{1F530}'],
  '符号': ['\u{2764}','\u{2763}','\u{2665}','\u{2661}','\u{2702}','\u{2705}','\u{2708}','\u{2709}','\u{270A}','\u{270B}','\u{270C}','\u{270D}','\u{270E}','\u{270F}','\u{2712}','\u{2714}','\u{2716}','\u{2728}','\u{2733}','\u{2734}','\u{2744}','\u{2747}','\u{274C}','\u{274E}','\u{2753}','\u{2754}','\u{2755}','\u{2757}','\u{2764}','\u{2795}','\u{2796}','\u{2797}','\u{27A1}','\u{27B0}','\u{27BF}','\u{2934}','\u{2935}','\u{2B05}','\u{2B06}','\u{2B07}','\u{2B1B}','\u{2B1C}','\u{2B50}','\u{2B55}','\u{3030}','\u{303D}','\u{3297}','\u{3299}','\u{00A9}','\u{00AE}','\u{2122}'],
  '旗帜': ['\u{1F3F3}','\u{1F3F4}','\u{1F3C1}','\u{1F6A9}','\u{1F38C}','\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}','\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E006F}\u{E0074}\u{E007F}','\u{1F3F4}\u{E0067}\u{E0062}\u{E0077}\u{E006C}\u{E0073}\u{E007F}','\u{1F1E8}\u{1F1F3}','\u{1F1FA}\u{1F1F8}','\u{1F1EC}\u{1F1E7}','\u{1F1EB}\u{1F1F7}','\u{1F1E9}\u{1F1EA}','\u{1F1EE}\u{1F1F9}','\u{1F1EF}\u{1F1F5}','\u{1F1F0}\u{1F1F7}','\u{1F1EB}\u{1F1F4}','\u{1F1F5}\u{1F1ED}','\u{1F1E6}\u{1F1FA}','\u{1F1E6}\u{1F1F9}','\u{1F1E8}\u{1F1E6}','\u{1F1F3}\u{1F1FF}','\u{1F1F3}\u{1F1F1}','\u{1F1F8}\u{1F1EC}','\u{1F1F7}\u{1F1F8}','\u{1F1F9}\u{1F1FC}','\u{1F1FA}\u{1F1E6}','\u{1F1E8}\u{1F1ED}','\u{1F1F5}\u{1F1EA}','\u{1F1F9}\u{1F1ED}','\u{1F1F0}\u{1F1F5}','\u{1F1F8}\u{1F1E6}','\u{1F1F8}\u{1F1F9}','\u{1F1F2}\u{1F1FD}','\u{1F1E6}\u{1F1F7}','\u{1F1F2}\u{1F1E6}','\u{1F1F3}\u{1F1EC}','\u{1F1E7}\u{1F1F7}','\u{1F1F7}\u{1F1FA}','\u{1F1F0}\u{1F1EA}','\u{1F1E6}\u{1F1F2}','\u{1F1E9}\u{1F1F7}','\u{1F1F5}\u{1F1F1}','\u{1F1E6}\u{1F1F1}','\u{1F1F2}\u{1F1E8}','\u{1F1F2}\u{1F1F7}','\u{1F1E6}\u{1F1EE}','\u{1F1EA}\u{1F1E6}','\u{1F1E7}\u{1F1FE}','\u{1F1F5}\u{1F1E6}','\u{1F1FA}\u{1F1F2}','\u{1F1F8}\u{1F1E8}'],
};

const pageStyle: React.CSSProperties = {
  maxWidth: 900, margin: '0 auto',
};

const headerStyle: React.CSSProperties = {
  marginBottom: 24,
};

const titleStyle: React.CSSProperties = {
  fontSize: 28, fontWeight: 800, color: 'var(--text-primary)',
  fontFamily: 'var(--font-sans)', marginBottom: 8,
};

const descStyle: React.CSSProperties = {
  fontSize: 14, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', lineHeight: 1.6,
};

const searchStyle: React.CSSProperties = {
  width: '100%', padding: '10px 16px', borderRadius: 12,
  border: '1px solid var(--border-color)', background: 'var(--bg-card)',
  color: 'var(--text-primary)', fontSize: 14, fontFamily: 'var(--font-sans)',
  outline: 'none', marginBottom: 20,
};

const catTitleStyle: React.CSSProperties = {
  fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)',
  fontFamily: 'var(--font-sans)', marginBottom: 8, marginTop: 16,
  textTransform: 'uppercase',
};

const gridStyle: React.CSSProperties = {
  display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(48px, 1fr))',
  gap: 6, marginBottom: 12,
};

const emojiBtn: React.CSSProperties = {
  padding: '8px 4px', borderRadius: 8, border: '1px solid var(--border-light)',
  background: 'var(--bg-card)', fontSize: 22, cursor: 'pointer',
  transition: 'all 150ms ease', textAlign: 'center',
};

export default function Emoji() {
  const [search, setSearch] = useState('');
  const searchLower = search.toLowerCase();

  const copyEmoji = useCallback(async (emoji: string) => {
    try {
      await navigator.clipboard.writeText(emoji);
      showToast(`已复制: ${emoji}`, 'success');
    } catch {
      showToast('复制失败', 'error');
    }
  }, []);

  const filtered = Object.entries(emojiCategories).reduce<Record<string, string[]>>((acc, [cat, emojis]) => {
    if (!searchLower) { acc[cat] = emojis; return acc; }
    const filteredEmojis = emojis.filter((e) => cat.toLowerCase().includes(searchLower));
    if (filteredEmojis.length > 0) acc[cat] = filteredEmojis;
    return acc;
  }, {});

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Emoji表情大全</h1>
        <p style={descStyle}>提供完整的Emoji表情列表，支持按类别浏览和快速复制使用</p>
      </div>
      <input
        style={searchStyle}
        placeholder="搜索分类..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {Object.entries(filtered).map(([cat, emojis]) => (
        <div key={cat}>
          <div style={catTitleStyle}>{cat}</div>
          <div style={gridStyle}>
            {emojis.map((e, i) => (
              <button key={i} style={emojiBtn}
                onClick={() => copyEmoji(e)}
                onMouseEnter={(ev) => { (ev.target as HTMLElement).style.background = 'var(--color-yellow)'; }}
                onMouseLeave={(ev) => { (ev.target as HTMLElement).style.background = 'var(--bg-card)'; }}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
