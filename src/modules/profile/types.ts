export type BadgeCategory =
  | "TENURE_COMMITMENT"
  | "EXECUTION_DELIVERY"
  | "SKILLS_CERTIFICATIONS"
  | "QUALITY_COMPLIANCE"
  | "CULTURE_LEADERSHIP";

export interface ProfileBadge {
  id: string;
  category: BadgeCategory;
  name: string;
  /** Short line shown under the badge name in tiles / hero */
  subtitle: string;
  /** What this badge represents in plain language */
  description: string;
  /** Why this matters for staffing / client confidence */
  whyItMatters: string;
  /** How the badge is earned in terms of criteria */
  howEarned: string;
  /** When it was earned (ISO date string for now) */
  earnedAt: string;
  /** Who issued this badge (e.g. "Beyond Alliance") */
  issuedBy: string;
  /** Whether this badge is currently locked for the user */
  locked: boolean;
  /** Whether this badge should be surfaced as a hero badge */
  isHero?: boolean;
}

export interface ProfileBadgeGroup {
  id: BadgeCategory;
  label: string;
  description: string;
  badges: ProfileBadge[];
}
