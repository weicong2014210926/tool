import React, { useState, useMemo } from 'react';
import { showToast } from '../../../components/ui/Toast';

const containerStyle: React.CSSProperties = { maxWidth: 900, margin: '0 auto' };
const headerStyle: React.CSSProperties = { marginBottom: 24 };
const pageTitle: React.CSSProperties = { fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', marginBottom: 8 };
const pageDesc: React.CSSProperties = { fontSize: 14, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', lineHeight: 1.6 };
const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%', marginBottom: 16, boxSizing: 'border-box' };
const gridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 };
const cardStyle: React.CSSProperties = { padding: '16px', borderRadius: 14, border: '1px solid var(--border-light)', background: 'var(--bg-tool)', cursor: 'pointer', transition: 'all 150ms' };
const quoteStyle: React.CSSProperties = { fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', lineHeight: 1.6, marginBottom: 8 };
const movieStyle: React.CSSProperties = { fontSize: 12, color: 'var(--color-pink)', fontWeight: 600, fontFamily: 'var(--font-sans)' };

interface MovieQuote { quote: string; movie: string; year: string; }

const MOVIE_QUOTES: MovieQuote[] = [
  { quote:'人生就像一盒巧克力，你永远不知道下一颗是什么味道。', movie:'阿甘正传', year:'1994' },
  { quote:'做人如果没有梦想，那跟咸鱼有什么区别？', movie:'少林足球', year:'2001' },
  { quote:'如果非要在这份爱上加一个期限的话，我希望是一万年。', movie:'大话西游', year:'1995' },
  { quote:'我命由我不由天！', movie:'哪吒之魔童降世', year:'2019' },
  { quote:'说的是一辈子，差一年，一个月，一天，一个时辰，都不算一辈子。', movie:'霸王别姬', year:'1993' },
  { quote:'Hope is a good thing, maybe the best of things.', movie:'The Shawshank Redemption', year:'1994' },
  { quote:'With great power comes great responsibility.', movie:'Spider-Man', year:'2002' },
  { quote:'I\'m going to make him an offer he can\'t refuse.', movie:'The Godfather', year:'1972' },
  { quote:'May the Force be with you.', movie:'Star Wars', year:'1977' },
  { quote:'Here\'s looking at you, kid.', movie:'Casablanca', year:'1942' },
  { quote:'You can\'t handle the truth!', movie:'A Few Good Men', year:'1992' },
  { quote:'I\'ll be back.', movie:'The Terminator', year:'1984' },
  { quote:'Why so serious?', movie:'The Dark Knight', year:'2008' },
  { quote:'To infinity and beyond!', movie:'Toy Story', year:'1995' },
  { quote:'Just keep swimming.', movie:'Finding Nemo', year:'2003' },
  { quote:'Hakuna Matata! It means no worries.', movie:'The Lion King', year:'1994' },
  { quote:'After all, tomorrow is another day!', movie:'Gone with the Wind', year:'1939' },
  { quote:'You jump, I jump.', movie:'Titanic', year:'1997' },
  { quote:'There\'s no place like home.', movie:'The Wizard of Oz', year:'1939' },
  { quote:'Carpe diem. Seize the day, boys.', movie:'Dead Poets Society', year:'1989' },
  { quote:'My precious.', movie:'The Lord of the Rings', year:'2001' },
  { quote:'E.T. phone home.', movie:'E.T.', year:'1982' },
  { quote:'Elementary, my dear Watson.', movie:'Sherlock Holmes', year:'2009' },
  { quote:'I see dead people.', movie:'The Sixth Sense', year:'1999' },
  { quote:'Keep your friends close, but your enemies closer.', movie:'The Godfather II', year:'1974' },
  { quote:'Bond. James Bond.', movie:'Dr. No', year:'1962' },
  { quote:'I am Iron Man.', movie:'Iron Man', year:'2008' },
  { quote:'Avengers, assemble!', movie:'Avengers: Endgame', year:'2019' },
  { quote:'I am your father.', movie:'Star Wars: The Empire Strikes Back', year:'1980' },
  { quote:'Houston, we have a problem.', movie:'Apollo 13', year:'1995' },
  { quote:'Mama always said life was like a box of chocolates.', movie:'Forrest Gump', year:'1994' },
  { quote:'You had me at hello.', movie:'Jerry Maguire', year:'1996' },
  { quote:'Nobody puts Baby in a corner.', movie:'Dirty Dancing', year:'1987' },
  { quote:'Wax on, wax off.', movie:'The Karate Kid', year:'1984' },
  { quote:'I\'m the king of the world!', movie:'Titanic', year:'1997' },
  { quote:'You talking to me?', movie:'Taxi Driver', year:'1976' },
  { quote:'I feel the need — the need for speed!', movie:'Top Gun', year:'1986' },
  { quote:'Go ahead, make my day.', movie:'Sudden Impact', year:'1983' },
  { quote:'Say hello to my little friend!', movie:'Scarface', year:'1983' },
  { quote:'Inconceivable!', movie:'The Princess Bride', year:'1987' },
  { quote:'As you wish.', movie:'The Princess Bride', year:'1987' },
  { quote:'I love the smell of napalm in the morning.', movie:'Apocalypse Now', year:'1979' },
  { quote:'They call it a Royale with cheese.', movie:'Pulp Fiction', year:'1994' },
  { quote:'I have a dream.', movie:'The King\'s Speech', year:'2010' },
];

export default function MovieQuotes() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return MOVIE_QUOTES;
    const s = search.toLowerCase();
    return MOVIE_QUOTES.filter(mq => mq.movie.toLowerCase().includes(s) || mq.quote.toLowerCase().includes(s));
  }, [search]);

  const handleCopy = async (q: MovieQuote) => {
    try {
      await navigator.clipboard.writeText(`"${q.quote}"\n——《${q.movie}》(${q.year})`);
      showToast('已复制到剪贴板', 'success');
    } catch {
      showToast('复制失败', 'error');
    }
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={pageTitle}>经典影视台词</h1>
        <p style={pageDesc}>收录经典电影、电视剧中的知名台词和经典对白，点击即可复制</p>
      </div>
      <input
        style={inputStyle}
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="搜索电影名称或台词..."
      />
      <div style={gridStyle}>
        {filtered.map((q, i) => (
          <div
            key={i}
            style={cardStyle}
            onClick={() => handleCopy(q)}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
          >
            <div style={quoteStyle}>"{q.quote}"</div>
            <div style={movieStyle}>{q.movie} ({q.year})</div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontSize: 14, fontFamily: 'var(--font-sans)' }}>
          没有找到匹配的台词
        </div>
      )}
    </div>
  );
}
