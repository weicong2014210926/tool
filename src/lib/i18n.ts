import { useEffect, useState } from 'react';
import { useAppStore } from './store';

type Lang = 'zh' | 'en';

const translations: Record<string, Record<Lang, string>> = {
  'search.placeholder': { zh: '搜索工具...', en: 'Search tools...' },
  'search.popular': { zh: '热门推荐', en: 'Popular' },
  'search.trending': { zh: '热门关键词', en: 'Trending' },
  'search.noResults': { zh: '未找到相关工具', en: 'No results found' },
  'home.title': { zh: '实用工具', en: 'Utility Tools' },
  'home.subtitle': { zh: '一站式综合在线效率工具平台。10 大分类，110+ 工具，无需下载安装，打开即用。', en: 'All-in-one online utility platform. 10 categories, 110+ tools, ready to use.' },
  'home.categories': { zh: '工具分类', en: 'Categories' },
  'home.popular': { zh: '热门工具', en: 'Popular Tools' },
  'home.recent': { zh: '最近使用', en: 'Recently Used' },
  'home.favorites': { zh: '我的收藏', en: 'My Favorites' },
  'home.clearHistory': { zh: '清空记录', en: 'Clear History' },
  'toast.copied': { zh: '已复制到剪贴板', en: 'Copied to clipboard' },
  'toast.copyFailed': { zh: '复制失败，请手动复制', en: 'Copy failed, please copy manually' },
  'toast.favorited': { zh: '已加入收藏', en: 'Added to favorites' },
  'toast.unfavorited': { zh: '已取消收藏', en: 'Removed from favorites' },
  'toast.historyCleared': { zh: '历史记录已清空', en: 'History cleared' },
};

function detectBrowserLang(): Lang {
  if (typeof navigator === 'undefined') return 'zh';
  const lang = navigator.language.toLowerCase();
  return lang.startsWith('zh') ? 'zh' : 'en';
}

export function useI18n() {
  const storeLang = useAppStore((s) => s.lang);
  const [browserLang] = useState<Lang>(detectBrowserLang);

  const currentLang: Lang = storeLang || browserLang;

  const t = (key: string, fallback?: string): string => {
    const entry = translations[key];
    if (!entry) return fallback || key;
    return entry[currentLang] || entry.zh || fallback || key;
  };

  return { t, lang: currentLang };
}

export { detectBrowserLang };
