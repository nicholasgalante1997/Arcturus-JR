export interface V2AboutViewProps {
  // Static page - no queries needed
}

export interface SkillItem {
  name: string;
  category: string;
  proficiency?: 'expert' | 'advanced' | 'intermediate';
}

export interface TimelineItem {
  year: string;
  title: string;
  organization: string;
  description: string;
  current?: boolean;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: React.ReactNode;
}
