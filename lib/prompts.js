// lib/prompts.js
// Data-only: themes + prompt pairs (reflection + action). No React imports.

export const THEMES = [
  "All",
  "Belonging",
  "Bias",
  "Visibility",
  "Inclusion",
  "Advocacy",
  "Anti-Racism",
  "Accessibility",
  "Psych Safety",
  "Wellbeing",
  "Trust/Feedback",
  "Power/Influence"
];

// helper to tag each item
const T = (...themes) => themes;

/* ---------------- DAILY (today-sized prompts) ---------------- */
const DAILY = [
  {
    reflection: "Whose voice wasn’t heard today?",
    action: "Personally invite that person to speak tomorrow, or follow up 1:1 to centre their voice.",
    themes: T("Belonging","Visibility")
  },
  {
    reflection: "Did I notice any exclusion? How did I respond?",
    action: "Name the exclusion kindly and suggest an alternative that opens the door.",
    themes: T("Inclusion","Belonging")
  },
  {
    reflection: "What assumption did I make today?",
    action: "Before your next decision, ask one clarifying question to test it.",
    themes: T("Bias","Trust/Feedback")
  },
  {
    reflection: "How did I centre someone’s voice today?",
    action: "Share their contribution and give credit in the next update.",
    themes: T("Visibility","Belonging")
  },
  {
    reflection: "Did I notice racism today—overt or subtle? What did I do?",
    action: "If safe, name what you noticed; if not, check in with the impacted person and plan a follow-up.",
    themes: T("Anti-Racism","Inclusion")
  },
];

/* --------------- FEW DAYS (3×/week — short deep dives) --------------- */
const FEW_DAYS = [
  {
    reflection: "When did I feel discomfort this week? What value was at stake?",
    action: "Choose one small step that honours the value and try it next time the discomfort shows up.",
    themes: T("Psych Safety","Wellbeing")
  },
  {
    reflection: "Whose perspective was missing from a decision in the last few days?",
    action: "Invite that perspective into the next review or share the decision for feedback first.",
    themes: T("Inclusion","Power/Influence")
  },
  {
    reflection: "What bias might have influenced recent decisions?",
    action: "Use a bias check: “What evidence would change my mind?” before your next decision.",
    themes: T("Bias","Trust/Feedback")
  },
  {
    reflection: "How have I used my influence to support equity this week?",
    action: "Sponsor someone concretely: open a door, share visibility, or advocate for resources.",
    themes: T("Advocacy","Power/Influence")
  },
];

/* ----------------------- WEEKLY (look back) ----------------------- */
const WEEK = [
  {
    reflection: "Where did I see patterns of bias or exclusion this week?",
    action: "Pick one pattern and write a specific counter-pattern you’ll try next week.",
    themes: T("Bias","Inclusion")
  },
  {
    reflection: "Whose growth did I actively support this week?",
    action: "Schedule a 15-min check-in to coach, sponsor, or give strengths-based feedback.",
    themes: T("Advocacy","Trust/Feedback")
  },
  {
    reflection: "How did I contribute to psychological safety this week?",
    action: "Open your next meeting with a quick check-in and a norm about turn-taking.",
    themes: T("Psych Safety","Wellbeing")
  },
];

export const PROMPT_PAIRS = {
  daily: DAILY,
  fewDays: FEW_DAYS,
  week: WEEK,
};