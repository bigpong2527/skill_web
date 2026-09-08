export type AuthorType = 'Official' | 'Partner' | 'Community';
export type Complexity = 'Basic' | 'Intermediate' | 'Advanced';
export type SkillStatus = 'pending' | 'approved' | 'rejected';

export interface Skill {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  source_url?: string | null;
  r2_zip_key: string;
  author_name: string;
  author_type: AuthorType;
  version: string;
  complexity: Complexity;
  dependencies?: string | null;
  components?: string | null;
  downloads: number;
  card_clicks: number;
  weekly_downloads: number;
  weekly_card_clicks: number;
  rating: number;
  ratings_count: number;
  hotness_score: number;
  status: SkillStatus;
  created_at: string;
  updated_at: string;

  request?: string | null;
  faq_json?: string | null;
  related_ids?: string | null;
  stars?: number | null;
  forks?: number | null;
  repo_created_at?: string | null;

  author_website?: string | null;
  author_twitter?: string | null;
  author_avatar?: string | null;
  author_display_name?: string | null;

  category_slug?: string;
  keywords?: string[];
}

export interface AuthorFAQ {
  question: string;
  answer: string;
}

export interface Author {
  id: number;
  login: string;
  name: string | null;
  website: string | null;
  twitter: string | null;
  email: string | null;
  location: string | null;
  bio: string | null;
  avatar_url: string | null;
  public_repos: number;
  followers: number;
  author_type: AuthorType;
  is_404: number;
  updated_at: string;

  // ✅ 严格对齐 D1 云端真实的 4 个物理列
  headline?: string | null;
  primary_domain?: string | null;
  capability_breakdown?: Record<string, number> | null;
  faqs?: AuthorFAQ[] | null;
  skills_count?: number; // ✅ 新增：支持 authors 表物理列
}

export interface RepositoryGroup {
  repo_name: string;
  repo_url: string;
  skill_count: number;
  stars: number;
  forks: number;
  tagline?: string | null;       // ✅ 新增：防塌陷 Slogan
  has_internal_page?: boolean;   // ✅ 新增：标记是否收录在 repositories 精选表
}

export interface Category {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  featured_skill_ids?: string | null;
}

export interface Keyword {
  id: number;
  name: string;
}

export type EnvironmentType = 'Claude Code' | 'Claude.ai' | 'API';

export interface GuideItem {
  file_name: string;
  relative_path: string;
}

export interface RepositorySuite {
  id: number;
  author_id?: number | null;
  owner: string;
  name: string;
  repo_url: string;
  primary_category_id: number;
  author_type: AuthorType;
  stars: number;
  forks: number;
  skills_count: number;
  tagline: string;
  description: string;
  available_guides: string; // JSON: GuideItem[]
  guide_summary?: string | null;
  skill_ids: string;        // 逗号分隔 ID: "1,2,10"
  faqs: string;             // JSON: Array<{question: string; answer: string}>
  created_at: string;
  updated_at: string;
}