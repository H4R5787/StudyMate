export interface TutorResponse {
  topic: string;
  markdown: string;
}

export const TUTOR_TOPICS: Record<string, string> = {
  newton: "💡 **Newton's 3 Laws of Motion Explained:**\n\n1. **First Law (Inertia):** An object stays at rest or continues at constant velocity unless acted upon by a net external force.\n2. **Second Law (F = ma):** Net force equals mass multiplied by acceleration. If you double the force on an object, its acceleration doubles.\n3. **Third Law (Action-Reaction):** For every action force, there is an equal and opposite reaction force acting on a different body simultaneously.",

  chemistry_balance: "🧪 **How to Balance Chemical Equations:**\n\n1. Write out the unbalanced formula equation.\n2. Count the atoms of each element on both reactant and product sides.\n3. Adjust coefficients (the numbers in front), **NEVER** change the subscripts!\n4. Balance polyatomic ions as single units if they appear on both sides.\n5. Balance hydrogen and oxygen atoms last.\n6. Double check that total atoms on the left equal total atoms on the right!",

  mitosis: "🧬 **Mitosis vs Meiosis:**\n\n• **Mitosis:** Produces 2 genetically identical diploid daughter cells. Used for growth, tissue repair, and asexual reproduction. (Phases: Prophase, Metaphase, Anaphase, Telophase).\n• **Meiosis:** Produces 4 genetically diverse haploid gametes (sperm/egg cells) through two rounds of division with crossing over in Prophase I.",

  calculus: "📐 **Derivative & Calculus Help:**\n\nTo differentiate **f(x) = x² · sin(x)**, use the **Product Rule**:\n`d/dx [u · v] = u' · v + u · v'`\n\n1. Let `u = x²` ➔ `u' = 2x`\n2. Let `v = sin(x)` ➔ `v' = cos(x)`\n3. Combine: `f'(x) = 2x · sin(x) + x² · cos(x)`\n\nFactor out `x`: **f'(x) = x(2·sin(x) + x·cos(x))**.",

  energy: "⚡ **Kinetic & Potential Energy:**\n\n• **Kinetic Energy (KE):** `KE = ½ · m · v²` (where m is mass in kg, v is velocity in m/s). It quadruples if you double your speed!\n• **Gravitational Potential Energy (PE):** `PE = m · g · h` (where g ≈ 9.8 m/s², h is height in meters).\n• **Conservation:** In frictionless motion, `KE_initial + PE_initial = KE_final + PE_final`.",

  tips: "🎯 **Top StudyMate Learning Techniques:**\n\n1. **Feynman Technique:** Teach the concept out loud using simple, jargon-free analogies.\n2. **Active Recall:** Instead of passively re-reading notes, quiz yourself with flashcards and practice problems.\n3. **Spaced Repetition:** Review material after 1 day, 3 days, 7 days, and 14 days to lock it into long-term memory.\n4. **Pomodoro Intervals:** Study in 25-minute sprints followed by 5-minute restorative breaks.",
};

export function getOfflineTutorResponse(query: string): string {
  const lower = (query || '').toLowerCase().trim();

  if (!lower) {
    return "Please ask a question regarding your coursework, formulas, or study topics!";
  }

  if (
    lower.includes('newton') ||
    lower.includes('law of motion') ||
    lower.includes('inertia') ||
    lower.includes('f=ma')
  ) {
    return TUTOR_TOPICS.newton;
  }

  if (
    lower.includes('balance') ||
    lower.includes('chemical equation') ||
    lower.includes('stoichiometry')
  ) {
    return TUTOR_TOPICS.chemistry_balance;
  }

  if (
    lower.includes('mitosis') ||
    lower.includes('meiosis') ||
    lower.includes('cell division')
  ) {
    return TUTOR_TOPICS.mitosis;
  }

  if (
    lower.includes('derivative') ||
    lower.includes('calculus') ||
    lower.includes('product rule')
  ) {
    return TUTOR_TOPICS.calculus;
  }

  if (
    lower.includes('kinetic') ||
    lower.includes('energy') ||
    lower.includes('potential')
  ) {
    return TUTOR_TOPICS.energy;
  }

  if (
    lower.includes('tip') ||
    lower.includes('study') ||
    lower.includes('exam') ||
    lower.includes('pomodoro')
  ) {
    return TUTOR_TOPICS.tips;
  }

  return `🤖 **StudyMate Tutor Response:**\n\nGreat question regarding "${query}"!\n\nHere is how to approach mastering this concept:\n1. **Core Concept:** Break down the definition into your own words.\n2. **Identify Variables & Rules:** List the fundamental formulas, definitions, or principles that apply.\n3. **Practice Application:** Solve 2-3 standard problems from simple to complex.\n\n*Tip: You can configure your Google Gemini API key via the key icon above for full real-time AI capabilities!*`;
}
