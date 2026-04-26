import { Share2, Search, MousePointerClick, Globe, Mail, Bot } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// ─────────────────────────────────────────────
// DEV GUARD — warns if any TODO: strings slip into production
// ─────────────────────────────────────────────
function warnTodos(obj: unknown, path = ''): void {
  if (typeof obj === 'string' && obj.startsWith('TODO:')) {
    console.warn(`[VMA] TODO found in public-site content at "${path}": ${obj}`)
  } else if (typeof obj === 'object' && obj !== null) {
    for (const [key, value] of Object.entries(obj)) {
      warnTodos(value, path ? `${path}.${key}` : key)
    }
  }
}

export const SITE_METRICS = [
  { value: 50, suffix: '+', label: 'Clients Served' },
  { value: 3, suffix: '', label: 'Countries' },
  { value: 2, suffix: 'M+', prefix: '$', label: 'Revenue Generated' },
  { value: 97, suffix: '%', label: 'Client Retention' },
] as const

export const TESTIMONIALS = [
  {
    id: '1',
    name: 'TODO: Client Name',
    company: 'TODO: Company',
    role: 'TODO: Role (e.g. CEO, Owner)',
    rating: 5,
    quote: 'TODO: Paste real testimonial here.',
  },
  {
    id: '2',
    name: 'TODO: Client Name',
    company: 'TODO: Company',
    role: 'TODO: Role',
    rating: 5,
    quote: 'TODO: Paste real testimonial here.',
  },
] as const

export type ServiceSlug = 'social' | 'seo' | 'paid' | 'web' | 'email' | 'ai'

export interface ServiceDefinition {
  slug: ServiceSlug
  icon: LucideIcon
  title: string
  description: string
  included: readonly string[]
  caseStudyResult: string
  priceRange: string
  longDescription: readonly string[]
}

export const SERVICES: readonly ServiceDefinition[] = [
  {
    slug: 'social',
    icon: Share2,
    title: 'Social Media Management',
    description:
      'Strategic content creation, community management, and growth campaigns across all major platforms.',
    included: [
      'Multi-platform content calendar',
      'Daily posting & scheduling',
      'Community engagement & DMs',
      'Monthly analytics reporting',
      'Paid social campaign management',
    ],
    caseStudyResult: '+340% follower growth in 90 days',
    priceRange: '$1,500–$4,000/mo',
    longDescription: [
      'Your social media presence is often the first impression a potential customer has of your brand. We engineer content systems that build authentic audiences and convert followers into paying customers.',
      'From platform-native creative to community-building strategies, every post is intentional — crafted to align with your brand voice, engage your ideal audience, and move the needle on business metrics that matter.',
    ],
  },
  {
    slug: 'seo',
    icon: Search,
    title: 'SEO & Content',
    description:
      'Technical SEO audits, keyword strategy, and content that ranks — built for long-term organic dominance.',
    included: [
      'Full technical SEO audit',
      'Keyword research & mapping',
      'On-page optimization',
      'Authority link building',
      'Monthly content publishing',
    ],
    caseStudyResult: 'Page 1 rankings for 47 target keywords',
    priceRange: '$2,000–$5,000/mo',
    longDescription: [
      'SEO is not a tactic — it is a compounding asset. We build search visibility that grows month over month, creating a sustainable pipeline of qualified traffic without relying on paid channels.',
      'Our technical-first approach ensures your site is structurally sound while our content team produces pieces that earn links naturally and answer the exact questions your buyers are searching for.',
    ],
  },
  {
    slug: 'paid',
    icon: MousePointerClick,
    title: 'Paid Media',
    description:
      'Google, Meta, and LinkedIn ad campaigns engineered for maximum ROAS — not vanity metrics.',
    included: [
      'Campaign strategy & architecture',
      'Ad creative production',
      'Audience research & targeting',
      'Weekly bid optimization',
      'Full-funnel attribution reporting',
    ],
    caseStudyResult: '4.8x ROAS on Meta campaigns',
    priceRange: '$2,500–$6,000/mo + ad spend',
    longDescription: [
      'Every dollar of your ad budget should have a clear job: reach the right person, at the right moment, with the right message. We build paid media systems that do exactly that — and we prove it with transparent reporting.',
      'From creative strategy to audience architecture to landing page optimization, we manage the full paid funnel so you can focus on closing the leads we deliver.',
    ],
  },
  {
    slug: 'web',
    icon: Globe,
    title: 'Web Design & Dev',
    description:
      'High-converting websites and landing pages. Design meets performance — built for results.',
    included: [
      'Custom UI/UX design',
      'Next.js / React development',
      'Performance optimization (Core Web Vitals)',
      'CMS integration',
      'Analytics & conversion tracking',
    ],
    caseStudyResult: '+62% conversion rate improvement',
    priceRange: '$5,000–$25,000 project',
    longDescription: [
      'A website should be your best-performing salesperson — working 24/7, converting visitors into leads. We design and build sites that look premium and are engineered to convert.',
      'Every project starts with conversion strategy before design. We understand your funnel, your buyer, and your goals — then craft an experience that guides visitors to take action.',
    ],
  },
  {
    slug: 'email',
    icon: Mail,
    title: 'Email Marketing & Automation',
    description:
      'Segmented campaigns, nurture sequences, and lifecycle automation that keeps customers engaged and buying.',
    included: [
      'Email strategy & segmentation',
      'Template design & copywriting',
      'Automated welcome & nurture flows',
      'A/B testing & optimization',
      'Deliverability monitoring',
    ],
    caseStudyResult: '42% open rate, 8.3% CTR average',
    priceRange: '$1,200–$3,500/mo',
    longDescription: [
      'Email remains the highest-ROI marketing channel when done right. We build email programs that feel personal at scale — the right message to the right segment at exactly the right moment in their journey.',
      'From welcome sequences to re-engagement campaigns to transactional triggers, we automate the touches that build trust and drive repeat revenue.',
    ],
  },
  {
    slug: 'ai',
    icon: Bot,
    title: 'AI Content & Strategy',
    description:
      'Leverage AI to produce 10x more content without sacrificing quality. Strategy, tools, and execution — handled.',
    included: [
      'AI content workflow design',
      'Brand voice training & guidelines',
      'AI-assisted content production',
      'Quality review & editing',
      'Performance tracking & iteration',
    ],
    caseStudyResult: '10x content output, 40% cost reduction',
    priceRange: '$2,000–$5,000/mo',
    longDescription: [
      'AI is not a replacement for strategy — it is a force multiplier. We design content systems that use AI to scale your brand voice without losing the authenticity that makes your audience trust you.',
      'From blog content to social copy to ad variations, our AI-augmented workflows let you publish more, test more, and learn faster — without ballooning your content budget.',
    ],
  },
]

export interface PricingTierDefinition {
  name: string
  range: string
  description: string
  included: readonly string[]
  highlight: boolean
}

export const PRICING_TIERS: readonly PricingTierDefinition[] = [
  {
    name: 'Starter',
    range: '$1,500 – $3,000/mo',
    description: 'For businesses establishing their digital presence and building a consistent marketing foundation.',
    included: [
      'Social media management (2 platforms)',
      'Monthly content creation (8 posts)',
      'Basic SEO health monitoring',
      'Monthly performance report',
    ],
    highlight: false,
  },
  {
    name: 'Growth',
    range: '$3,000 – $7,000/mo',
    description: 'For scaling businesses that need a full marketing engine — multiple channels working in concert.',
    included: [
      'Social media management (4 platforms)',
      'SEO & content marketing',
      'Paid media management (1 channel)',
      'Email marketing & automation',
      'Bi-weekly strategy calls',
    ],
    highlight: true,
  },
  {
    name: 'Scale',
    range: '$7,000+/mo',
    description: 'For ambitious companies that want total market domination — every channel, fully managed.',
    included: [
      'Full-channel social & content',
      'Advanced SEO & authority building',
      'Multi-channel paid media',
      'AI content production',
      'Dedicated account team',
    ],
    highlight: false,
  },
]

export interface PortfolioItem {
  id: string
  title: string
  client: string
  service: ServiceSlug
  serviceLabel: string
  result: string
  description: string
  gradient: string
}

export const PORTFOLIO_ITEMS: readonly PortfolioItem[] = [
  {
    id: '1',
    title: 'Full-Funnel Growth Campaign',
    client: 'TODO: Client Name',
    service: 'paid',
    serviceLabel: 'Paid Media',
    result: 'TODO: Key result metric',
    description: 'TODO: Brief case study description.',
    gradient: 'from-vma-violet/20 to-vma-blue/10',
  },
  {
    id: '2',
    title: 'Organic Search Domination',
    client: 'TODO: Client Name',
    service: 'seo',
    serviceLabel: 'SEO & Content',
    result: 'TODO: Key result metric',
    description: 'TODO: Brief case study description.',
    gradient: 'from-vma-magenta/20 to-vma-violet/10',
  },
  {
    id: '3',
    title: 'Brand Launch & Social Growth',
    client: 'TODO: Client Name',
    service: 'social',
    serviceLabel: 'Social Media',
    result: 'TODO: Key result metric',
    description: 'TODO: Brief case study description.',
    gradient: 'from-vma-blue/20 to-vma-cyan/10',
  },
  {
    id: '4',
    title: 'Conversion-First Website Rebuild',
    client: 'TODO: Client Name',
    service: 'web',
    serviceLabel: 'Web Design & Dev',
    result: 'TODO: Key result metric',
    description: 'TODO: Brief case study description.',
    gradient: 'from-vma-violet/20 to-vma-magenta/10',
  },
]

export const LOGO_MARQUEE_PHRASES = [
  'Social Media',
  'SEO & Content',
  'Paid Ads',
  'Web Design',
  'Email Marketing',
  'AI Content',
  'Analytics',
  'Strategy',
] as const

// Run TODO check in development
if (process.env.NODE_ENV === 'development') {
  warnTodos(TESTIMONIALS, 'TESTIMONIALS')
  warnTodos(PORTFOLIO_ITEMS, 'PORTFOLIO_ITEMS')
}
