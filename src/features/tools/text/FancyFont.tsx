import React, { useState, useCallback } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

type FontStyle = 'bold-script' | 'double-struck' | 'monospace' | 'sans-serif' | 'cursive' | 'small-caps' | 'bubble';

const fontLabels: Record<FontStyle, string> = {
  'bold-script': '粗体花式',
  'double-struck': '双线体',
  'monospace': '等宽',
  'sans-serif': '无衬线',
  'cursive': '草书',
  'small-caps': '小型大写',
  'bubble': '气泡',
};

const UNICODE_MAPS: Record<FontStyle, Record<string, string>> = {
  'bold-script': {
    A:'\u{1D4D0}',B:'\u{1D4D1}',C:'\u{1D4D2}',D:'\u{1D4D3}',E:'\u{1D4D4}',F:'\u{1D4D5}',G:'\u{1D4D6}',H:'\u{1D4D7}',
    I:'\u{1D4D8}',J:'\u{1D4D9}',K:'\u{1D4DA}',L:'\u{1D4DB}',M:'\u{1D4DC}',N:'\u{1D4DD}',O:'\u{1D4DE}',P:'\u{1D4DF}',
    Q:'\u{1D4E0}',R:'\u{1D4E1}',S:'\u{1D4E2}',T:'\u{1D4E3}',U:'\u{1D4E4}',V:'\u{1D4E5}',W:'\u{1D4E6}',X:'\u{1D4E7}',
    Y:'\u{1D4E8}',Z:'\u{1D4E9}',
    a:'\u{1D4EA}',b:'\u{1D4EB}',c:'\u{1D4EC}',d:'\u{1D4ED}',e:'\u{1D4EE}',f:'\u{1D4EF}',g:'\u{1D4F0}',h:'\u{1D4F1}',
    i:'\u{1D4F2}',j:'\u{1D4F3}',k:'\u{1D4F4}',l:'\u{1D4F5}',m:'\u{1D4F6}',n:'\u{1D4F7}',o:'\u{1D4F8}',p:'\u{1D4F9}',
    q:'\u{1D4FA}',r:'\u{1D4FB}',s:'\u{1D4FC}',t:'\u{1D4FD}',u:'\u{1D4FE}',v:'\u{1D4FF}',w:'\u{1D500}',x:'\u{1D501}',
    y:'\u{1D502}',z:'\u{1D503}',
  },
  'double-struck': {
    A:'\u{1D538}',B:'\u{1D539}',C:'\u2102',D:'\u{1D53B}',E:'\u{1D53C}',F:'\u{1D53D}',G:'\u{1D53E}',H:'\u210D',
    I:'\u{1D540}',J:'\u{1D541}',K:'\u{1D542}',L:'\u{1D543}',M:'\u{1D544}',N:'\u2115',O:'\u{1D546}',P:'\u2119',
    Q:'\u211A',R:'\u211D',S:'\u{1D54A}',T:'\u{1D54B}',U:'\u{1D54C}',V:'\u{1D54D}',W:'\u{1D54E}',X:'\u{1D54F}',
    Y:'\u{1D550}',Z:'\u2124',
    a:'\u{1D552}',b:'\u{1D553}',c:'\u{1D554}',d:'\u{1D555}',e:'\u{1D556}',f:'\u{1D557}',g:'\u{1D558}',h:'\u{1D559}',
    i:'\u{1D55A}',j:'\u{1D55B}',k:'\u{1D55C}',l:'\u{1D55D}',m:'\u{1D55E}',n:'\u{1D55F}',o:'\u{1D560}',p:'\u{1D561}',
    q:'\u{1D562}',r:'\u{1D563}',s:'\u{1D564}',t:'\u{1D565}',u:'\u{1D566}',v:'\u{1D567}',w:'\u{1D568}',x:'\u{1D569}',
    y:'\u{1D56A}',z:'\u{1D56B}',
  },
  'monospace': {
    A:'\u{1D670}',B:'\u{1D671}',C:'\u{1D672}',D:'\u{1D673}',E:'\u{1D674}',F:'\u{1D675}',G:'\u{1D676}',H:'\u{1D677}',
    I:'\u{1D678}',J:'\u{1D679}',K:'\u{1D67A}',L:'\u{1D67B}',M:'\u{1D67C}',N:'\u{1D67D}',O:'\u{1D67E}',P:'\u{1D67F}',
    Q:'\u{1D680}',R:'\u{1D681}',S:'\u{1D682}',T:'\u{1D683}',U:'\u{1D684}',V:'\u{1D685}',W:'\u{1D686}',X:'\u{1D687}',
    Y:'\u{1D688}',Z:'\u{1D689}',
    a:'\u{1D68A}',b:'\u{1D68B}',c:'\u{1D68C}',d:'\u{1D68D}',e:'\u{1D68E}',f:'\u{1D68F}',g:'\u{1D690}',h:'\u{1D691}',
    i:'\u{1D692}',j:'\u{1D693}',k:'\u{1D694}',l:'\u{1D695}',m:'\u{1D696}',n:'\u{1D697}',o:'\u{1D698}',p:'\u{1D699}',
    q:'\u{1D69A}',r:'\u{1D69B}',s:'\u{1D69C}',t:'\u{1D69D}',u:'\u{1D69E}',v:'\u{1D69F}',w:'\u{1D6A0}',x:'\u{1D6A1}',
    y:'\u{1D6A2}',z:'\u{1D6A3}',
  },
  'sans-serif': {
    A:'\u{1D5E0}',B:'\u{1D5E1}',C:'\u{1D5E2}',D:'\u{1D5E3}',E:'\u{1D5E4}',F:'\u{1D5E5}',G:'\u{1D5E6}',H:'\u{1D5E7}',
    I:'\u{1D5E8}',J:'\u{1D5E9}',K:'\u{1D5EA}',L:'\u{1D5EB}',M:'\u{1D5EC}',N:'\u{1D5ED}',O:'\u{1D5EE}',P:'\u{1D5EF}',
    Q:'\u{1D5F0}',R:'\u{1D5F1}',S:'\u{1D5F2}',T:'\u{1D5F3}',U:'\u{1D5F4}',V:'\u{1D5F5}',W:'\u{1D5F6}',X:'\u{1D5F7}',
    Y:'\u{1D5F8}',Z:'\u{1D5F9}',
    a:'\u{1D5FA}',b:'\u{1D5FB}',c:'\u{1D5FC}',d:'\u{1D5FD}',e:'\u{1D5FE}',f:'\u{1D5FF}',g:'\u{1D600}',h:'\u{1D601}',
    i:'\u{1D602}',j:'\u{1D603}',k:'\u{1D604}',l:'\u{1D605}',m:'\u{1D606}',n:'\u{1D607}',o:'\u{1D608}',p:'\u{1D609}',
    q:'\u{1D60A}',r:'\u{1D60B}',s:'\u{1D60C}',t:'\u{1D60D}',u:'\u{1D60E}',v:'\u{1D60F}',w:'\u{1D610}',x:'\u{1D611}',
    y:'\u{1D612}',z:'\u{1D613}',
  },
  'cursive': {
    A:'\u{1D49C}',B:'\u{1D435}',C:'\u{1D49E}',D:'\u{1D49F}',E:'\u{1D438}',F:'\u{1D4A1}',G:'\u{1D4A2}',H:'\u{1D4A3}',
    I:'\u{1D4A4}',J:'\u{1D4A5}',K:'\u{1D4A6}',L:'\u{1D4A7}',M:'\u{1D4A8}',N:'\u{1D4A9}',O:'\u{1D4AA}',P:'\u{1D4AB}',
    Q:'\u{1D4AC}',R:'\u{1D4AD}',S:'\u{1D4AE}',T:'\u{1D4AF}',U:'\u{1D4B0}',V:'\u{1D4B1}',W:'\u{1D4B2}',X:'\u{1D4B3}',
    Y:'\u{1D4B4}',Z:'\u{1D4B5}',
    a:'\u{1D4B6}',b:'\u{1D4B7}',c:'\u{1D4B8}',d:'\u{1D4B9}',e:'\u{1D4BA}',f:'\u{1D4BB}',g:'\u{1D4BC}',h:'\u{1D4BD}',
    i:'\u{1D4BE}',j:'\u{1D4BF}',k:'\u{1D4C0}',l:'\u{1D4C1}',m:'\u{1D4C2}',n:'\u{1D4C3}',o:'\u{1D4C4}',p:'\u{1D4C5}',
    q:'\u{1D4C6}',r:'\u{1D4C7}',s:'\u{1D4C8}',t:'\u{1D4C9}',u:'\u{1D4CA}',v:'\u{1D4CB}',w:'\u{1D4CC}',x:'\u{1D4CD}',
    y:'\u{1D4CE}',z:'\u{1D4CF}',
  },
  'small-caps': {
    A:'\u1D00',B:'\u0299',C:'\u1D04',D:'\u1D05',E:'\u1D07',F:'\uA730',G:'\u0262',H:'\u029C',
    I:'\u026A',J:'\u1D0A',K:'\u1D0B',L:'\u029F',M:'\u1D0D',N:'\u0274',O:'\u1D0F',P:'\u1D18',
    Q:'\uA7AF',R:'\u0280',S:'\uA731',T:'\u1D1B',U:'\u1D1C',V:'\u1D20',W:'\u1D21',X:'\u02E3',
    Y:'\u028F',Z:'\u1D22',
    a:'\u1D00',b:'\u0299',c:'\u1D04',d:'\u1D05',e:'\u1D07',f:'\uA730',g:'\u0262',h:'\u029C',
    i:'\u026A',j:'\u1D0A',k:'\u1D0B',l:'\u029F',m:'\u1D0D',n:'\u0274',o:'\u1D0F',p:'\u1D18',
    q:'\uA7AF',r:'\u0280',s:'\uA731',t:'\u1D1B',u:'\u1D1C',v:'\u1D20',w:'\u1D21',x:'\u02E3',
    y:'\u028F',z:'\u1D22',
  },
  'bubble': {
    A:'\u{1F150}',B:'\u{1F151}',C:'\u{1F152}',D:'\u{1F153}',E:'\u{1F154}',F:'\u{1F155}',G:'\u{1F156}',H:'\u{1F157}',
    I:'\u{1F158}',J:'\u{1F159}',K:'\u{1F15A}',L:'\u{1F15B}',M:'\u{1F15C}',N:'\u{1F15D}',O:'\u{1F15E}',P:'\u{1F15F}',
    Q:'\u{1F160}',R:'\u{1F161}',S:'\u{1F162}',T:'\u{1F163}',U:'\u{1F164}',V:'\u{1F165}',W:'\u{1F166}',X:'\u{1F167}',
    Y:'\u{1F168}',Z:'\u{1F169}',
    a:'\u{1F130}',b:'\u{1F131}',c:'\u{1F132}',d:'\u{1F133}',e:'\u{1F134}',f:'\u{1F135}',g:'\u{1F136}',h:'\u{1F137}',
    i:'\u{1F138}',j:'\u{1F139}',k:'\u{1F13A}',l:'\u{1F13B}',m:'\u{1F13C}',n:'\u{1F13D}',o:'\u{1F13E}',p:'\u{1F13F}',
    q:'\u{1F140}',r:'\u{1F141}',s:'\u{1F142}',t:'\u{1F143}',u:'\u{1F144}',v:'\u{1F145}',w:'\u{1F146}',x:'\u{1F147}',
    y:'\u{1F148}',z:'\u{1F149}',
  },
};

const btnBase: React.CSSProperties = {
  padding: '8px 16px', borderRadius: 10, border: '1px solid var(--border-color)',
  background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13,
  fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)',
  boxShadow: '0 2px 0 var(--border-color)', transition: 'all 150ms ease',
};

const btnActive: React.CSSProperties = {
  ...btnBase, background: 'var(--color-blue)', color: '#fff',
  borderColor: 'var(--color-blue)',
};

export default function FancyFont() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [activeFont, setActiveFont] = useState<FontStyle | null>(null);

  const transform = useCallback((text: string, font: FontStyle) => {
    if (!text) return '';
    const map = UNICODE_MAPS[font];
    return text.split('').map((ch) => map[ch] || ch).join('');
  }, []);

  const handleFont = (font: FontStyle) => {
    setActiveFont(font);
    setOutput(transform(input, font));
  };

  const handleInput = (value: string) => {
    setInput(value);
    if (activeFont) setOutput(transform(value, activeFont));
  };

  const extraActions = (
    <>
      {Object.entries(fontLabels).map(([font, label]) => (
        <button key={font} style={activeFont === font ? btnActive : btnBase}
          onClick={() => handleFont(font as FontStyle)}>
          {label}
        </button>
      ))}
    </>
  );

  return (
    <ToolLayout
      toolId="text-fancy-font"
      title="花体英文转换器"
      description="将普通英文文本转换为多种花体、艺术字体样式，适用于社交媒体装饰"
      inputValue={input}
      onInputChange={handleInput}
      outputValue={output}
      inputPlaceholder="在此输入英文文本..."
      extraActions={extraActions}
    />
  );
}
