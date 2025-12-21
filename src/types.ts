
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
  
  // Joined fields (optional as they might not be in every query)
  category_slug?: string; 
  keywords?: string[]; 
}

export interface Category {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
}

export interface Keyword {
  id: number;
  name: string;
}

export type EnvironmentType = 'Claude Code' | 'Claude.ai' | 'API';
