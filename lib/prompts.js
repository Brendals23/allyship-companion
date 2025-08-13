// lib/prompts.js
// 60 paired prompts (reflection + action), categorised and theme-tagged.
// Uses “centre voice” language and includes explicit anti-racism, accessibility and psych safety coverage.

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

export const PROMPT_PAIRS = {
  // ---------- DAILY (30) ----------
  daily: [
    {
      themes: ["Visibility","Belonging"],
      reflection: "Whose voice was missing in conversations today, and why?",
      action: "Invite that person to share their view tomorrow or DM them asking for their input."
    },
    {
      themes: ["Psych Safety","Inclusion"],
      reflection: "Did anyone get talked over or interrupted today? How did I respond?",
      action: "Next meeting, pause and say: “Let’s hear X finish their point.”"
    },
    {
      themes: ["Bias"],
      reflection: "What assumption did I make about someone today, and how did it shape my interaction?",
      action: "Ask one open question before your next decision to test that assumption."
    },
    {
      themes: ["Visibility","Advocacy"],
      reflection: "How did I centre the voice of someone from a marginalised group today?",
      action: "Share their contribution (with credit) in a space where it will be heard."
    },
    {
      themes: ["Anti-Racism","Psych Safety"],
      reflection: "Did I notice racism today? What did I do in the moment or afterwards?",
      action: "Use a gentle interrupter next time (“What do you mean by that?”) and check in with the impacted person."
    },
    {
      themes: ["Wellbeing","Belonging"],
      reflection: "Who did I make feel seen or valued today? What made a difference?",
      action: "Send a specific thank-you to someone whose work hasn’t been recognised."
    },
    {
      themes: ["Inclusion","Bias"],
      reflection: "What inclusive language did I use today? Where did I slip?",
      action: "Swap one phrase for a more inclusive alternative in your next message."
    },
    {
      themes: ["Inclusion","Visibility"],
      reflection: "Did I create space for diverse perspectives today? How?",
      action: "Ask someone who hasn’t spoken yet: “What’s your take on this?”"
    },
    {
      themes: ["Wellbeing","Psych Safety"],
      reflection: "How did I respond when someone shared a lived experience today?",
      action: "Thank them for trusting you and ask: “What support would help most?”"
    },
    {
      themes: ["Bias","Psych Safety"],
      reflection: "Did I witness a microaggression today? How did I handle it?",
      action: "Address it with a curious question or follow up privately and check in with the person impacted."
    },
    {
      themes: ["Accessibility","Inclusion"],
      reflection: "What did I do to reduce a barrier for someone today?",
      action: "Offer one accommodation (format, timing, captions, alt text) to improve access."
    },
    {
      themes: ["Trust/Feedback","Psych Safety"],
      reflection: "Did I ask for consent before sharing someone’s story today?",
      action: "Model consent: ask before forwarding or repeating someone’s words."
    },
    {
      themes: ["Bias","Power/Influence"],
      reflection: "Where did bias (mine or others’) show up in a decision today?",
      action: "Name the risk next time: “Let’s check our assumptions before we decide.”"
    },
    {
      themes: ["Advocacy","Power/Influence"],
      reflection: "Who did I advocate for today, and why did it matter?",
      action: "Recommend someone for an opportunity or invite them into a relevant conversation."
    },
    {
      themes: ["Wellbeing"],
      reflection: "How did I support someone’s wellbeing today?",
      action: "Do a quick check-in with someone who may appreciate it."
    },
    {
      themes: ["Psych Safety","Trust/Feedback"],
      reflection: "Who did I listen to without judgment today?",
      action: "In your next conversation, summarise what you heard before responding."
    },
    {
      themes: ["Bias","Inclusion"],
      reflection: "What stereotype or generalisation did I challenge today?",
      action: "Share a counter-example or ask a perspective-widening question next time."
    },
    {
      themes: ["Psych Safety"],
      reflection: "How did I make it safe for someone to speak up today?",
      action: "Invite dissent: “What might we be missing?” or “What’s the risk here?”"
    },
    {
      themes: ["Advocacy"],
      reflection: "What action did I take to be an ally today?",
      action: "Choose one small ally action for tomorrow (introduce, endorse, credit, include)."
    },
    {
      themes: ["Anti-Racism","Visibility"],
      reflection: "When did I centre voices from racialised communities today?",
      action: "Share a resource from a racialised creator and credit them by name."
    },
    {
      themes: ["Accessibility"],
      reflection: "What did I do to support accessibility today?",
      action: "Make one artefact more accessible: headings, alt text, contrast, captions."
    },
    {
      themes: ["Psych Safety","Bias"],
      reflection: "Where did I feel discomfort today, and what did it teach me?",
      action: "Stay curious for one extra question next time discomfort shows up."
    },
    {
      themes: ["Power/Influence"],
      reflection: "When did I use power or influence today? Who was affected?",
      action: "Use your influence once tomorrow to open a door for someone underrepresented."
    },
    {
      themes: ["Inclusion"],
      reflection: "What exclusion did I notice in a process or space today?",
      action: "Flag one improvement to the owner or capture it to raise at the next opportunity."
    },
    {
      themes: ["Wellbeing","Psych Safety"],
      reflection: "Where did I practise empathy under pressure today?",
      action: "Slow one decision by 30 seconds to ask: “How will this land for X group?”"
    },
    {
      themes: ["Trust/Feedback"],
      reflection: "How did I honour someone’s boundaries today?",
      action: "Ask for consent before sharing or re-using their words or work."
    },
    {
      themes: ["Belonging","Visibility"],
      reflection: "What joy or celebration of difference did I notice today?",
      action: "Share or spotlight that moment so others can see it too."
    },
    {
      themes: ["Advocacy","Trust/Feedback"],
      reflection: "What will I do differently tomorrow based on today?",
      action: "Write a one-line commitment and add a reminder to your calendar."
    },
    {
      themes: ["Inclusion","Psych Safety"],
      reflection: "Which meeting or interaction felt most inclusive today—and why?",
      action: "Repeat one thing that made it inclusive (e.g., round-robins, chat contributions)."
    },
    {
      themes: ["Trust/Feedback","Psych Safety"],
      reflection: "Where did I fall short of my allyship intentions today?",
      action: "Repair within 24 hours: acknowledge impact, apologise, or take one corrective step."
    }
  ],

  // ---------- PAST FEW DAYS (20) ----------
  fewDays: [
    {
      themes: ["Visibility","Belonging"],
      reflection: "Over the past few days, whose input have I relied on—and whose have I overlooked?",
      action: "Ask someone new for their perspective before your next decision."
    },
    {
      themes: ["Psych Safety","Inclusion"],
      reflection: "Have speaking turns been fairly shared in recent meetings?",
      action: "Track talk time next meeting and invite quieter voices first."
    },
    {
      themes: ["Inclusion"],
      reflection: "What patterns of exclusion have I noticed lately?",
      action: "Raise one pattern with a concrete suggestion for change."
    },
    {
      themes: ["Wellbeing"],
      reflection: "How have I shown empathy in the last few days?",
      action: "Follow up with someone who shared a concern to see how they’re going."
    },
    {
      themes: ["Bias"],
      reflection: "What bias keeps showing up for me or my team lately?",
      action: "Share a short resource that challenges that bias and discuss one takeaway."
    },
    {
      themes: ["Accessibility"],
      reflection: "How have I supported accessibility in the past few days?",
      action: "Fix one barrier you control (captions, keyboard nav, plain-language summary)."
    },
    {
      themes: ["Anti-Racism","Psych Safety"],
      reflection: "When I’ve seen racism recently, how have I responded?",
      action: "Practise a response line and use it next time you hear something harmful."
    },
    {
      themes: ["Visibility","Belonging"],
      reflection: "Whose achievements have I celebrated lately? Who’s missing?",
      action: "Publicly recognise one under-acknowledged contribution."
    },
    {
      themes: ["Psych Safety"],
      reflection: "How have I contributed to psychological safety recently?",
      action: "Open your next meeting with a check-in or invite ‘half-ideas’.",
    },
    {
      themes: ["Wellbeing","Advocacy"],
      reflection: "How have I shown up for someone in need over the last few days?",
      action: "Offer help proactively to one person who might benefit."
    },
    {
      themes: ["Trust/Feedback"],
      reflection: "What lived experiences have colleagues trusted me with recently?",
      action: "Protect confidentiality; ask how (or if) they want you to follow up."
    },
    {
      themes: ["Bias","Inclusion"],
      reflection: "What stereotype have I heard or felt pressure to conform to recently?",
      action: "Name the stereotype and suggest a more accurate framing in your next discussion."
    },
    {
      themes: ["Inclusion","Power/Influence"],
      reflection: "Where have decisions moved too fast for inclusion lately?",
      action: "Build a quick ‘pause for input’ step before the next decision."
    },
    {
      themes: ["Visibility","Advocacy"],
      reflection: "How have I used my networks to centre underrepresented voices lately?",
      action: "Introduce two people or share someone’s work with explicit credit."
    },
    {
      themes: ["Trust/Feedback"],
      reflection: "What feedback (received or given) has built trust recently?",
      action: "Offer one piece of specific, strengths-based feedback today."
    },
    {
      themes: ["Inclusion"],
      reflection: "Which processes have quietly excluded people in the last few days?",
      action: "Propose one small change (timezones, formats, options) to reduce friction."
    },
    {
      themes: ["Belonging","Visibility"],
      reflection: "What have I learned from someone with a different background recently?",
      action: "Share one learning (and its source) with your team or a peer."
    },
    {
      themes: ["Bias","Psych Safety"],
      reflection: "Where have I seen microaggressions repeat over recent days?",
      action: "Document examples (no names) and suggest team norms to prevent them."
    },
    {
      themes: ["Anti-Racism","Visibility"],
      reflection: "How often have I centred voices from racialised communities lately?",
      action: "Quote or reference a racialised creator/colleague in your next communication."
    },
    {
      themes: ["Accessibility","Inclusion"],
      reflection: "Which accommodations have helped people participate better recently?",
      action: "Standardise one of them (e.g., always share notes, alt text, recording)."
    }
  ],

  // ---------- PAST WEEK (10) ----------
  week: [
    {
      themes: ["Power/Influence","Advocacy"],
      reflection: "In the past week, how have I used my influence to support equity?",
      action: "Pick one decision or process where you can shift a rule toward fairness."
    },
    {
      themes: ["Trust/Feedback","Psych Safety"],
      reflection: "How have I built trust through feedback this week?",
      action: "Schedule a short feedback loop (ask and offer) with one person next week."
    },
    {
      themes: ["Belonging","Visibility"],
      reflection: "What have I done this week to learn about a community I’m not part of?",
      action: "Engage a resource from that community; note one insight that changes your practice."
    },
    {
      themes: ["Bias","Inclusion"],
      reflection: "How have I challenged stereotypes in the past week?",
      action: "Prepare one story/fact that counters a common stereotype in your context."
    },
    {
      themes: ["Inclusion"],
      reflection: "What inclusive practices have I modelled this week?",
      action: "Make one practice a default (agenda in advance, round-robins, captions)."
    },
    {
      themes: ["Power/Influence","Inclusion"],
      reflection: "How have I worked to remove systemic barriers this week?",
      action: "Pick one barrier you can influence; outline the first concrete step and owner."
    },
    {
      themes: ["Anti-Racism","Power/Influence"],
      reflection: "How have I addressed racism this week—personally and structurally?",
      action: "Propose a small structural change (policy wording, review step, accountability)."
    },
    {
      themes: ["Psych Safety"],
      reflection: "How have I fostered psychological safety at the team level this week?",
      action: "Add a standing norm (rotate facilitation, one-mic rule, no interruptions)."
    },
    {
      themes: ["Belonging","Visibility"],
      reflection: "Where have I centred joy and celebration of difference this week?",
      action: "Create or endorse one moment to celebrate a diverse contribution or tradition."
    },
    {
      themes: ["Trust/Feedback","Advocacy"],
      reflection: "What will I commit to changing next week based on this week’s patterns?",
      action: "Write a one-sentence commitment and add it to your calendar."
    }
  ]
};