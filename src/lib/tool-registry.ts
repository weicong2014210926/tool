import categoriesData from '../data/categories.json';
import toolsData from '../data/tools.json';

export type CategorySlug =
  | 'text' | 'language' | 'finance' | 'datetime'
  | 'convert' | 'image' | 'life' | 'devtools' | 'codec' | 'network';

export interface Category {
  slug: CategorySlug;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export interface ToolEntry {
  id: string;
  name: string;
  category: CategorySlug;
  description: string;
  keywords: string[];
  icon: string;
  isCore: boolean;
  popularity: number;
  componentPath: string;
}

export const CATEGORIES: Category[] = categoriesData as Category[];
export const TOOLS: ToolEntry[] = toolsData as ToolEntry[];

/** 按分类获取工具列表 */
export function getToolsByCategory(slug: CategorySlug): ToolEntry[] {
  return TOOLS.filter((t) => t.category === slug);
}

/** 按 ID 获取单个工具 */
export function getToolById(id: string): ToolEntry | undefined {
  return TOOLS.find((t) => t.id === id);
}

/** 模糊搜索工具（支持名称、关键词、分类匹配） */
export function searchTools(query: string): ToolEntry[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase().trim();
  const results = TOOLS.filter((t) => {
    if (t.name.toLowerCase().includes(q)) return true;
    if (t.keywords.some((k) => k.toLowerCase().includes(q))) return true;
    const cat = CATEGORIES.find((c) => c.slug === t.category);
    if (cat?.name.includes(q)) return true;
    return false;
  });
  return results.sort((a, b) => b.popularity - a.popularity);
}

/** 自动补全式搜索建议：仅匹配名称以 query 开头的工具 */
export function searchSuggestions(query: string, limit = 5): ToolEntry[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase().trim();
  return TOOLS
    .filter((t) => t.name.toLowerCase().startsWith(q))
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
}

/** 获取热门工具 Top N */
export function getPopularTools(limit = 12): ToolEntry[] {
  return [...TOOLS].sort((a, b) => b.popularity - a.popularity).slice(0, limit);
}

/** 获取核心工具 */
export function getCoreTools(): ToolEntry[] {
  return TOOLS.filter((t) => t.isCore);
}

/** 根据工具获取分类信息 */
export function getCategoryByTool(tool: ToolEntry): Category | undefined {
  return CATEGORIES.find((c) => c.slug === tool.category);
}

/** 获取相关工具推荐（同分类的 top 4） */
export function getRelatedTools(toolId: string, limit = 4): ToolEntry[] {
  const tool = getToolById(toolId);
  if (!tool) return [];
  return getToolsByCategory(tool.category)
    .filter((t) => t.id !== toolId)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
}
