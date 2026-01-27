import type { BadgeCategory, ProfileBadgeGroup } from "../types";

function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

export const BADGE_CATEGORY_LABELS: Record<
  BadgeCategory,
  { label: string; description: string }
> = {
  TENURE_COMMITMENT: {
    label: "Tenure & Commitment",
    description: "Time invested at Beyond and stability over the years.",
  },
  EXECUTION_DELIVERY: {
    label: "Execution & Delivery",
    description: "How reliably this person takes projects and tasks to the finish line.",
  },
  SKILLS_CERTIFICATIONS: {
    label: "Skills & Certifications",
    description: "Formal skills, training, and certifications recognised by Beyond.",
  },
  QUALITY_COMPLIANCE: {
    label: "Quality & Compliance",
    description: "Signals of safe, defect-free, and compliant delivery.",
  },
  CULTURE_LEADERSHIP: {
    label: "Culture & Leadership",
    description: "How this person contributes to teams, mentoring, and culture.",
  },
};

const ISSUER = "Beyond Alliance";

export const MOCK_PROFILE_BADGE_GROUPS: ProfileBadgeGroup[] = [
  {
    id: "TENURE_COMMITMENT",
    label: BADGE_CATEGORY_LABELS.TENURE_COMMITMENT.label,
    description: BADGE_CATEGORY_LABELS.TENURE_COMMITMENT.description,
    badges: [
      {
        id: "tenure-2-years",
        category: "TENURE_COMMITMENT",
        name: "2 Years at Beyond",
        subtitle: "Continuous service",
        description: "Recognises two years of continuous contribution at Beyond.",
        whyItMatters:
          "Tenure brings context, pattern recognition, and steadiness during complex project phases.",
        howEarned:
          "Automatically issued after completing 24 months of active employment.",
        earnedAt: isoDaysAgo(30),
        issuedBy: ISSUER,
        locked: false,
        isHero: true,
      },
      {
        id: "tenure-joined-as-fresher",
        category: "TENURE_COMMITMENT",
        name: "Grew with Beyond",
        subtitle: "Joined early, stayed through scale-up",
        description:
          "Started early in Beyond's journey and has stayed through multiple growth phases.",
        whyItMatters:
          "Shows loyalty and familiarity with how Beyond's operating model has evolved.",
        howEarned:
          "Joined in early cohorts and completed a minimum tenure threshold.",
        earnedAt: isoDaysAgo(180),
        issuedBy: ISSUER,
        locked: false,
      },
      {
        id: "tenure-5-years",
        category: "TENURE_COMMITMENT",
        name: "5 Years at Beyond",
        subtitle: "Long-term partner",
        description:
          "Recognises five years of uninterrupted service and responsibility.",
        whyItMatters:
          "Signals deep organisational knowledge and reliability for strategic client work.",
        howEarned:
          "Unlocked after completing 60 months of active employment.",
        earnedAt: isoDaysAgo(5),
        issuedBy: ISSUER,
        locked: true,
      },
    ],
  },
  {
    id: "EXECUTION_DELIVERY",
    label: BADGE_CATEGORY_LABELS.EXECUTION_DELIVERY.label,
    description: BADGE_CATEGORY_LABELS.EXECUTION_DELIVERY.description,
    badges: [
      {
        id: "execution-master-builder",
        category: "EXECUTION_DELIVERY",
        name: "Master Builder",
        subtitle: "Execution excellence",
        description:
          "Trusted to take complex scopes from planning to handover with minimal supervision.",
        whyItMatters:
          "Indicates this person can be the execution anchor on demanding projects.",
        howEarned:
          "Awarded after leading multiple projects to on-time, in-scope delivery.",
        earnedAt: isoDaysAgo(45),
        issuedBy: ISSUER,
        locked: false,
        isHero: true,
      },
      {
        id: "execution-parallel-sites",
        category: "EXECUTION_DELIVERY",
        name: "Multi-Site Lead",
        subtitle: "Handled parallel sites",
        description:
          "Coordinated work across more than three active sites in the same period.",
        whyItMatters:
          "Shows capacity to manage bandwidth, crews, and sequencing across projects.",
        howEarned:
          "Unlocked when task and project records show sustained multi-site responsibility.",
        earnedAt: isoDaysAgo(20),
        issuedBy: ISSUER,
        locked: false,
      },
      {
        id: "execution-handovers-5",
        category: "EXECUTION_DELIVERY",
        name: "5 Full Handovers Led",
        subtitle: "Client-facing delivery",
        description: "Has personally led five full client handovers end-to-end.",
        whyItMatters:
          "Indicates comfort in client rooms and ownership of last-mile delivery.",
        howEarned:
          "Recorded as handover owner on five completed projects.",
        earnedAt: isoDaysAgo(10),
        issuedBy: ISSUER,
        locked: false,
      },
    ],
  },
  {
    id: "SKILLS_CERTIFICATIONS",
    label: BADGE_CATEGORY_LABELS.SKILLS_CERTIFICATIONS.label,
    description: BADGE_CATEGORY_LABELS.SKILLS_CERTIFICATIONS.description,
    badges: [
      {
        id: "skills-knx-l2",
        category: "SKILLS_CERTIFICATIONS",
        name: "KNX Certified – Level 2",
        subtitle: "Controls & integration",
        description:
          "Completed KNX advanced training with a focus on real-world commissioning.",
        whyItMatters:
          "Useful for complex lighting, HVAC, and integration-heavy projects.",
        howEarned:
          "Completed KNX Level 2 training and passed the internal scenario assessment.",
        earnedAt: isoDaysAgo(60),
        issuedBy: ISSUER,
        locked: false,
        isHero: true,
      },
      {
        id: "skills-av-handover",
        category: "SKILLS_CERTIFICATIONS",
        name: "AV System Handover Certified",
        subtitle: "Structured UAT",
        description:
          "Able to run structured UAT and client handover for AV-heavy projects.",
        whyItMatters:
          "Gives confidence that client-facing AV experiences will be stable at go-live.",
        howEarned:
          "Completed AV handover runbook training and led supervised handovers.",
        earnedAt: isoDaysAgo(35),
        issuedBy: ISSUER,
        locked: false,
      },
      {
        id: "skills-bim-basic",
        category: "SKILLS_CERTIFICATIONS",
        name: "BIM Aware",
        subtitle: "Understands model coordination",
        description:
          "Familiar with reading BIM models and raising constructability issues early.",
        whyItMatters:
          "Improves coordination with design teams and reduces site surprises.",
        howEarned:
          "Completed internal BIM orientation module and case-study walkthroughs.",
        earnedAt: isoDaysAgo(5),
        issuedBy: ISSUER,
        locked: true,
      },
    ],
  },
  {
    id: "QUALITY_COMPLIANCE",
    label: BADGE_CATEGORY_LABELS.QUALITY_COMPLIANCE.label,
    description: BADGE_CATEGORY_LABELS.QUALITY_COMPLIANCE.description,
    badges: [
      {
        id: "quality-qc-clean-sheet",
        category: "QUALITY_COMPLIANCE",
        name: "QC Clean Sheet",
        subtitle: "Zero critical snags",
        description:
          "Delivered a project with no critical issues at QC close-out.",
        whyItMatters:
          "Signals disciplined execution and attention to detail at handover.",
        howEarned:
          "QC checklists closed with no open Category A items.",
        earnedAt: isoDaysAgo(25),
        issuedBy: ISSUER,
        locked: false,
        isHero: true,
      },
      {
        id: "quality-zero-missed-qc",
        category: "QUALITY_COMPLIANCE",
        name: "Zero Missed QC Checks",
        subtitle: "Reliable site discipline",
        description:
          "No missed QC visits scheduled under this person over a defined period.",
        whyItMatters:
          "Ensures quality is treated as a routine, not an exception.",
        howEarned:
          "All assigned QC visits marked as completed or formally rescheduled.",
        earnedAt: isoDaysAgo(12),
        issuedBy: ISSUER,
        locked: false,
      },
      {
        id: "quality-qc-gold",
        category: "QUALITY_COMPLIANCE",
        name: "QC Excellence – Gold",
        subtitle: "Consistently high QC scores",
        description:
          "Maintained high QC scores across multiple audits.",
        whyItMatters:
          "Shows a repeatable pattern of high-quality delivery.",
        howEarned:
          "Average QC score above the internal gold band over recent audits.",
        earnedAt: isoDaysAgo(8),
        issuedBy: ISSUER,
        locked: true,
      },
    ],
  },
  {
    id: "CULTURE_LEADERSHIP",
    label: BADGE_CATEGORY_LABELS.CULTURE_LEADERSHIP.label,
    description: BADGE_CATEGORY_LABELS.CULTURE_LEADERSHIP.description,
    badges: [
      {
        id: "culture-crew-mentor",
        category: "CULTURE_LEADERSHIP",
        name: "Crew Mentor",
        subtitle: "Helps new team members ramp up",
        description:
          "Regularly mentors newer team members on process, safety, and client handling.",
        whyItMatters:
          "Indicates this person builds capacity beyond their own tasks.",
        howEarned:
          "Nominated by leads based on mentoring feedback and observation.",
        earnedAt: isoDaysAgo(40),
        issuedBy: ISSUER,
        locked: false,
      },
      {
        id: "culture-client-appreciation",
        category: "CULTURE_LEADERSHIP",
        name: "Client Appreciation Received",
        subtitle: "Documented appreciation",
        description:
          "Received formal appreciation from a client or consultant.",
        whyItMatters:
          "Shows that behaviour on site and in meetings builds trust.",
        howEarned:
          "Client appreciation email or letter attached to a project record.",
        earnedAt: isoDaysAgo(90),
        issuedBy: ISSUER,
        locked: false,
      },
      {
        id: "culture-safety-champion",
        category: "CULTURE_LEADERSHIP",
        name: "Safety Champion",
        subtitle: "Promotes safe practices",
        description:
          "Consistently flags unsafe practices and helps close safety actions.",
        whyItMatters:
          "Reinforces Beyond's duty of care on every site.",
        howEarned:
          "Recognised by safety lead after repeated positive actions.",
        earnedAt: isoDaysAgo(3),
        issuedBy: ISSUER,
        locked: true,
      },
    ],
  },
];
