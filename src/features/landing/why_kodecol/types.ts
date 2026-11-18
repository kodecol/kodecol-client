export interface Differentiator {
  title: string;
  description: string;
}

export interface WhyKodecolContent {
  eyebrow: string;
  title_lead: string;
  title_accent: string;
  subtitle: string;
  differentiators: readonly Differentiator[];
}
