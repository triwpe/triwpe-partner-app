export interface GuideProps {
  id: string;
  title: string;
  location?: GuideLocationProps;
  description?: string;
  duration?: number;
  price?: number;
  language?: string;
  status: string;
  author_id: string;
  created_at: Date;
  updated_at?: Date;
}

export interface GuideLocationProps {
  id: string;
  place_name: string;
  country: string;
  latitude: number;
  longitude: number;
  place_type: string;
}