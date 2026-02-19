export interface SiteContent {
  site: SiteSection;
  home: HomeSection;
  about: AboutSection;
  gallery: GallerySection;
  videos: VideosSection;
  social: SocialSection;
  contact: ContactSection;
}

export interface SiteSection {
  name: string;
  tagline: string;
  description: string;
  copyright: string;
}

export interface HomeSection {
  heroImage: string;
  introText: string;
  quoteText: string;
  quoteImage: string;
  storyTitle: string;
  storyParagraphs: string[];
  imageStrip: string[];
}

export interface AboutSection {
  heroImage: string;
  bioParagraphs: string[];
  pullQuotes: string[];
  midImage: string;
}

export interface GallerySection {
  images: GalleryImage[];
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface VideosSection {
  items: VideoItem[];
}

export interface VideoItem {
  id: string;
  title: string;
  duration: string;
  src?: string;
  thumbnail?: string;
  venue?: string;
  musicians?: string;
}

export interface SocialSection {
  links: SocialLink[];
}

export interface SocialLink {
  label: string;
  href: string;
  icon: string;
}

export interface ContactSection {
  heroImage: string;
  heading: string;
  introText: string;
  email: string;
}

export type SectionKey = keyof SiteContent;
