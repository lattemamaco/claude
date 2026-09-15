export type PillarId = 'quiet' | 'faith' | 'coming' | 'real';
export type PostType = 'Reel' | 'Carousel' | 'Story' | 'Post';
export type StatusId = 'idea' | 'drafted' | 'scheduled' | 'posted';
export type ViewId = 'month' | 'week' | 'day' | 'ideas';

export interface Post {
  id: string;
  user_id: string;
  date: string | null; // 'YYYY-MM-DD'
  time: string; // 'HH:MM'
  type: PostType;
  pillar: PillarId;
  status: StatusId;
  title: string;
  caption: string;
  hashtags: string;
  cta: string;
  thumb_url: string | null;
  created_at: string;
  updated_at: string;
}

export type NewPost = Omit<Post, 'id' | 'user_id' | 'created_at' | 'updated_at'>;

export type EditingDraft = NewPost & { id: string; _isNew: boolean };

export interface Pillar {
  id: PillarId;
  name: string;
  short: string;
  color: string;
  tint: string;
}

export interface Status {
  id: StatusId;
  label: string;
  dot: string;
}

export interface TypeMeta {
  tint: string;
  accent: string;
}

export interface GenIdea {
  _id: string;
  _state: 'pending' | 'approved' | 'dismissed';
  title: string;
  caption: string;
  hashtags: string;
  cta: string;
  type: PostType;
  pillar: PillarId;
}

export interface PlannerSettings {
  user_id: string;
  banner_photos: (string | null)[];
  sidebar_photo: string | null;
}
