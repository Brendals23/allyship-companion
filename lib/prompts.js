// lib/prompts.js
// 60 paired prompts (reflection + action), categorised for cadence.
// Language uses “centre voice” (not “amplify”) and includes explicit anti-racism coverage.

export const PROMPT_PAIRS = {
  daily: [
    // 1
    {
      reflection: "Whose voice was missing in conversations today, and why?",
      action: "Personally invite that person to share their view in your next chat or send a message asking for their input."
    },
    // 2
    {
      reflection: "Did I notice anyone being talked over or interrupted today? How did I respond?",
      action: "In your next meeting, pause the discussion and say, “Let’s hear X finish their point.”"
    },
    // 3
    {
      reflection: "What assumption did I make about someone today, and how did it shape my interaction?",
      action: "Before your next decision, ask one open-ended question to test your assumption."
    },
    // 4
    {
      reflection: "How did I centre the voice of someone from a marginalised group today?",
      action: "Share their contribution (with credit) in a space where it will be heard and valued."
    },
    // 5
    {
      reflection: "Did I notice racism today? What did I do in the moment or afterward?",
      action: "Use a gentle interrupter next time: “What do you mean by that?” or “Let’s not go there.” Then check in with the impacted person."
    },
    // 6
    {
      reflection: "Who did I make feel seen or valued today? What did I do that worked?",
      action: "Send a short, specific note of appreciation to someone whose effort hasn’t been recognised."
    },
    // 7
    {
      reflection: "What inclusive language did I use today? Where did I slip?",
      action: "Swap one phrase for a more inclusive alternative in your next message or meeting."
    },
    // 8
    {
      reflection: "Did I create space for different perspectives today? How?",
      action: "Ask someone who hasn’t spoken yet: “What’s your take on this?”"
    },
    // 9
    {
      reflection: "How did I respond when someone shared a lived experience today?",
      action: "Thank them for trusting you and ask: “What support would be most useful right now?”"
    },
    // 10
    {
      reflection: "Did I witness a microaggression today? How did I handle it?",
      action: "Address it in the moment if safe (curious question), or follow up with the person impacted to check in."
    },
    // 11
    {
      reflection: "What did I do to reduce a barrier for someone today?",
      action: "Offer one specific accommodation (timing, format, access) to help someone participate fully."
    },
    // 12
    {
      reflection: "Did I ask for consent before sharing someone’s story or experience today?",
      action: "Check with them directly before repeating their story; model consent in your team."
    },
    // 13
    {
      reflection: "Where did bias (mine or others’) show up in a decision today?",
      action: "Name the risk out loud next time: “Let’s check our assumptions before we decide.”"
    },
    // 14
    {
      reflection: "Who did I advocate for today, and why did it matter?",
      action: "Recommend someone for an opportunity or invite them into a relevant conversation."
    },
    // 15
    {
      reflection: "How did I support someone’s wellbeing today?",
      action: "Do a quick check-in with someone who might appreciate it, even if they haven’t asked."
    },
    // 16
    {
      reflection: "Who did I listen to without judgment today?",
      action: "In your next conversation, summarise what you heard before responding."
    },
    // 17
    {
      reflection: "What stereotype or generalisation did I challenge today?",
      action: "Share a counter-example or ask a perspective-widening question in your next discussion."
    },
    // 18
    {
      reflection: "How did I make it safe for someone to speak up today?",
      action: "Explicitly invite dissent: “What might we be missing? What’s the risk here?”"
    },
    // 19
    {
      reflection: "What action did I take to be an ally today?",
      action: "Choose one small ally action for tomorrow (introduce, endorse, credit, include)."
    },
    // 20
    {
      reflection: "When did I centre voices from racialised communities today?",
      action: "Share a resource or insight created by a racialised colleague/creator and credit them by name."
    },
    // 21
    {
      reflection: "What did I do to support accessibility today?",
      action: "Make one artefact (doc, slide, message) more accessible: headings, alt text, contrast, captions."
    },
    // 22
    {
      reflection: "Where did I feel discomfort today, and what did it teach me?",
      action: "Lean back in tomorrow: stay curious for one more question when discomfort shows up."
    },
    // 23
    {
      reflection: "When did I use power or influence today? Who was affected?",
      action: "Use your influence once tomorrow to open a door for someone underrepresented."
    },
    // 24
    {
      reflection: "What exclusion did I notice in a process or space today?",
      action: "Flag one improvement to the owner (or capture it to raise at the next opportunity)."
    },
    // 25
    {
      reflection: "Where did I practise empathy under pressure today?",
      action: "Slow one decision tomorrow by 30 seconds to ask, “How will this land for X group?”"
    },
    // 26
    {
      reflection: "How did I honour someone’s boundaries today?",
      action: "Ask for consent before forwarding or sharing someone’s words."
    },
    // 27
    {
      reflection: "What joy or celebration of difference did I notice today?",
      action: "Share or spotlight that moment so others can see it too."
    },
    // 28
    {
      reflection: "What will I do differently tomorrow based on today?",
      action: "Write a one-line commitment and schedule a reminder."
    },
    // 29
    {
      reflection: "Which meeting or interaction felt most inclusive today—and why?",
      action: "Repeat one thing that made it inclusive (e.g., round-robins, chat contributions)."
    },
    // 30
    {
      reflection: "Where did I fall short of my allyship intentions today?",
      action: "Repair: apologise, acknowledge impact, or take one corrective step within 24 hours."
    }
  ],

  fewDays: [
    // 1 (31)
    {
      reflection: "Over the past few days, whose input have I relied on—and whose have I overlooked?",
      action: "Ask someone new for their perspective before your next decision."
    },
    // 2 (32)
    {
      reflection: "Have speaking turns been fairly shared in recent meetings?",
      action: "Track talk time next meeting and invite quieter voices first."
    },
    // 3 (33)
    {
      reflection: "What patterns of exclusion have I noticed lately?",
      action: "Raise one pattern with a concrete suggestion for change."
    },
    // 4 (34)
    {
      reflection: "How have I shown empathy in the last few days?",
      action: "Follow up with someone who shared a concern to see how they’re going."
    },
    // 5 (35)
    {
      reflection: "What bias keeps showing up for me or my team lately?",
      action: "Share a short resource that challenges that bias and discuss one takeaway."
    },
    // 6 (36)
    {
      reflection: "How have I supported accessibility in the past few days?",
      action: "Fix one barrier you control (captions, keyboard nav, plain-language summary)."
    },
    // 7 (37)
    {
      reflection: "When I’ve seen racism recently, how have I responded?",
      action: "Practise a response line and use it the next time you hear something harmful."
    },
    // 8 (38)
    {
      reflection: "Whose achievements have I celebrated lately? Who’s missing?",
      action: "Publicly recognise one under-acknowledged contribution."
    },
    // 9 (39)
    {
      reflection: "How have I contributed to psychological safety recently?",
      action: "Open your next meeting with a check-in or invite risks and ‘half-ideas’."
    },
    // 10 (40)
    {
      reflection: "How have I shown up for someone in need over the last few days?",
      action: "Offer help proactively to one person who might benefit."
    },
    // 11 (41)
    {
      reflection: "What lived experiences have colleagues trusted me with recently?",
      action: "Protect confidentiality; ask how (or if) they want you to follow up."
    },
    // 12 (42)
    {
      reflection: "What stereotype have I heard or felt pressure to conform to recently?",
      action: "Name the stereotype and suggest a more accurate framing in your next discussion."
    },
    // 13 (43)
    {
      reflection: "Where have decisions moved too fast for inclusion lately?",
      action: "Build in a quick ‘pause for input’ step before the next decision."
    },
    // 14 (44)
    {
      reflection: "How have I used my networks to centre underrepresented voices lately?",
      action: "Introduce two people or share someone’s work with explicit credit."
    },
    // 15 (45)
    {
      reflection: "What feedback (received or given) has built trust recently?",
      action: "Offer one piece of specific, strengths-based feedback today."
    },
    // 16 (46)
    {
      reflection: "Which processes have quietly excluded people in the last few days?",
      action: "Propose one small change (timezones, formats, options) to reduce friction."
    },
    // 17 (47)
    {
      reflection: "What have I learned from someone with a different background recently?",
      action: "Share one learning (and its source) with your team or peer."
    },
    // 18 (48)
    {
      reflection: "Where have I seen microaggressions repeat over recent days?",
      action: "Document examples (no names) and suggest team norms that prevent them."
    },
    // 19 (49)
    {
      reflection: "How often have I centred voices from racialised communities lately?",
      action: "Quote or reference a racialised creator/colleague in your next communication."
    },
    // 20 (50)
    {
      reflection: "Which accommodations have helped people participate better recently?",
      action: "Standardise one of them (e.g., always share notes, alt text, recording)."
    }
  ],

  week: [
    // 1 (51)
    {
      reflection: "In the past week, how have I used my influence to support equity?",
      action: "Identify one decision or process where you can shift a rule or norm toward fairness."
    },
    // 2 (52)
    {
      reflection: "How have I built trust through feedback this week?",
      action: "Schedule a short feedback loop (ask and offer) with one person next week."
    },
    // 3 (53)
    {
      reflection: "What have I done to learn about a community I’m not part of this week?",
      action: "Engage a resource from that community; write one insight and how it changes your practice."
    },
    // 4 (54)
    {
      reflection: "How have I challenged stereotypes in the past week?",
      action: "Prepare one fact/story that counters a common stereotype in your context."
    },
    // 5 (55)
    {
      reflection: "What inclusive practices have I modelled this week?",
      action: "Make one practice a default (e.g., agenda in advance, round-robins, captions)."
    },
    // 6 (56)
    {
      reflection: "How have I worked to remove systemic barriers this week?",
      action: "Pick one barrier you can influence; plan the first concrete step and owner."
    },
    // 7 (57)
    {
      reflection: "How have I addressed racism this week—personally and structurally?",
      action: "Propose a small, structural anti-racism change (policy, review step, accountability)."
    },
    // 8 (58)
    {
      reflection: "How have I fostered psychological safety at the team level this week?",
      action: "Add a standing norm (no interruptions, rotate facilitation, ‘one mic’ rule)."
    },
    // 9 (59)
    {
      reflection: "Where have I centred joy and the celebration of difference this week?",
      action: "Create or endorse one moment to celebrate a diverse contribution or tradition."
    },
    // 10 (60)
    {
      reflection: "What will I commit to changing next week based on this week’s patterns?",
      action: "Write a one-sentence commitment; add it to your calendar as a reminder."
    }
  ]
};