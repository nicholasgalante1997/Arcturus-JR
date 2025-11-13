export interface V2ContactViewProps {
  // Static page - no queries needed
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactFormProps {}

export interface ContactInfoProps {
  email: string;
  socialLinks: SocialLinkItem[];
}

export interface SocialLinkItem {
  name: string;
  url: string;
  icon: React.ReactNode;
  username: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}
