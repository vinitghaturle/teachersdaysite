// Question Bank with all 20 questions from Teachers_Day_Question_Bank (4).docx

export const WELCOME_LINES = [
  "Ready, Sir/Ma'am? Let's see how well your students actually paid attention.",
  "Happy Teachers' Day! Time to find out how well we know you — no pressure.",
  "Grab a seat. This one's basically a report card, except this time it's for us.",
  "Fair warning: we're about to attempt describing you in exactly the right words.",
  "Five questions. One compliment. Let's build it together.",
];

export const RESULT_MESSAGES = {
  5: {
    score: '5 / 5',
    label: 'Certified Icon',
    message: "Five for five. Either we know you too well, or you've made a real impression — probably both.",
    badge: '🏆',
  },
  4: {
    score: '4 / 5',
    label: 'Lowkey Iconic',
    message: 'So close to a clean sweep. One question stumped us, the rest was easy.',
    badge: '🌟',
  },
  3: {
    score: '3 / 5',
    label: 'Kinda Slaps',
    message: 'A solid guess rate. We know you well — just not psychic-level well.',
    badge: '✨',
  },
  2: {
    score: '2 / 5',
    label: 'Mid, Ngl',
    message: 'A few lucky guesses in there. Might be time you told us more about yourself.',
    badge: '☕',
  },
  1: {
    score: '1 / 5',
    label: "It's Giving Stranger",
    message: 'Rough round. Might be time for that long-overdue chai and catch-up.',
    badge: '👀',
  },
  0: {
    score: '0 / 5',
    label: "It's Giving Stranger",
    message: 'Rough round. Might be time for that long-overdue chai and catch-up.',
    badge: '👀',
  },
};

export const ALL_QUESTIONS = [
  {
    id: 1,
    difficulty: 'Easy',
    scenario: 'On the first day of class, you made sure every student felt ___.',
    options: [
      { text: 'included and comfortable in the classroom environment', isCorrect: false },
      { text: 'part of a supportive learning space', isCorrect: false },
      { text: 'acknowledged as an individual', isCorrect: false },
      { text: 'seen, fr', isCorrect: true },
    ],
  },
  {
    id: 2,
    difficulty: 'Easy',
    scenario: 'When a student got a bad grade, you reminded them that ___.',
    options: [
      { text: 'academic performance does not define their overall potential', isCorrect: false },
      { text: 'growth is a continuous and ongoing process', isCorrect: false },
      { text: 'setbacks are a normal part of the learning journey', isCorrect: false },
      { text: "it's not that deep, they'll bounce back", isCorrect: true },
    ],
  },
  {
    id: 3,
    difficulty: 'Easy',
    scenario: 'Before a big exam, you told the class to ___.',
    options: [
      { text: 'maintain composure and focus on the task at hand', isCorrect: false },
      { text: 'approach each question with careful consideration', isCorrect: false },
      { text: 'trust in their level of preparedness', isCorrect: false },
      { text: 'just breathe and lock in', isCorrect: true },
    ],
  },
  {
    id: 4,
    difficulty: 'Easy',
    scenario: 'When someone forgot their notebook, you ___.',
    options: [
      { text: 'addressed the situation without drawing unnecessary attention', isCorrect: false },
      { text: 'ensured the student was not disadvantaged', isCorrect: false },
      { text: 'handled it in a calm and professional manner', isCorrect: false },
      { text: 'said "it happens, no stress" and moved on', isCorrect: true },
    ],
  },
  {
    id: 5,
    difficulty: 'Easy',
    scenario: 'A student asked a question that felt "too basic" to ask. You made sure they knew ___.',
    options: [
      { text: 'there is no hierarchy of valid questions in a learning environment', isCorrect: false },
      { text: 'every question contributes meaningfully to the discussion', isCorrect: false },
      { text: 'clarification is a productive use of classroom time', isCorrect: false },
      { text: "there's no such thing as a dumb question, fr", isCorrect: true },
    ],
  },
  {
    id: 6,
    difficulty: 'Easy',
    scenario: 'When the class got a tough topic wrong on the first try, you simply ___.',
    options: [
      { text: 're-evaluated the instructional approach accordingly', isCorrect: false },
      { text: 'provided an alternative method of explanation', isCorrect: false },
      { text: 'allowed additional time for conceptual understanding', isCorrect: false },
      { text: 'said "let\'s run it back" and tried again', isCorrect: true },
    ],
  },
  {
    id: 7,
    difficulty: 'Easy',
    scenario: 'On a rainy day when everyone seemed low-energy, you ___.',
    options: [
      { text: 'adjusted the lesson plan to accommodate the mood', isCorrect: false },
      { text: 'reduced the pace of instruction accordingly', isCorrect: false },
      { text: 'maintained a calm and steady classroom atmosphere', isCorrect: false },
      { text: "said \"mood's off today, let's keep it chill\"", isCorrect: true },
    ],
  },
  {
    id: 8,
    difficulty: 'Easy',
    scenario: 'When two students got into a small disagreement, you ___.',
    options: [
      { text: 'facilitated a resolution through open dialogue', isCorrect: false },
      { text: 'ensured both parties felt heard and respected', isCorrect: false },
      { text: 'mediated the situation in a fair and balanced manner', isCorrect: false },
      { text: 'said "let\'s squash this" and got them talking it out', isCorrect: true },
    ],
  },
  {
    id: 9,
    difficulty: 'Easy',
    scenario: 'A student who usually struggles finally passed a tough assignment. You made sure to ___.',
    options: [
      { text: 'formally recognize their improvement and effort', isCorrect: false },
      { text: 'provide constructive reinforcement of their progress', isCorrect: false },
      { text: 'acknowledge the significance of their achievement', isCorrect: false },
      { text: 'hype them up, no cap deserved', isCorrect: true },
    ],
  },
  {
    id: 10,
    difficulty: 'Easy',
    scenario: 'When the class was distracted before a holiday, you ___.',
    options: [
      { text: 'restructured the session to maintain engagement', isCorrect: false },
      { text: 'implemented a shorter, more focused lesson', isCorrect: false },
      { text: 'acknowledged the shift in classroom energy', isCorrect: false },
      { text: 'said "I see you, holiday brain" and rolled with it', isCorrect: true },
    ],
  },
  {
    id: 11,
    difficulty: 'Easy',
    scenario: "A student admitted they didn't understand the homework at all. You responded by ___.",
    options: [
      { text: 'providing a detailed step-by-step explanation', isCorrect: false },
      { text: 'reassuring them that confusion is a normal part of learning', isCorrect: false },
      { text: 'offering additional support outside of class time', isCorrect: false },
      { text: 'saying "say less, let\'s fix this" and pulling up a chair', isCorrect: true },
    ],
  },
  {
    id: 12,
    difficulty: 'Easy',
    scenario: 'When someone finally spoke confidently in front of the class for the first time, you gave them ___.',
    options: [
      { text: 'constructive and specific feedback', isCorrect: false },
      { text: 'a formal acknowledgment of their progress', isCorrect: false },
      { text: 'genuine encouragement to continue', isCorrect: false },
      { text: 'certified main character energy', isCorrect: true },
    ],
  },
  {
    id: 13,
    difficulty: 'Hard',
    scenario: "A student turned in an assignment two days late with zero explanation. You didn't yell, you just gave them ___.",
    options: [
      { text: 'an opportunity to explain the delay', isCorrect: false },
      { text: 'a formal warning regarding the deadline', isCorrect: false },
      { text: 'additional time to complete the submission', isCorrect: false },
      { text: "a little grace, that's it", isCorrect: true },
    ],
  },
  {
    id: 14,
    difficulty: 'Hard',
    scenario: 'Someone in the back row dozed off mid-lecture. Instead of embarrassing them, you ___.',
    options: [
      { text: 'allowed them to rest without interruption', isCorrect: false },
      { text: 'addressed the situation privately after class', isCorrect: false },
      { text: 'gently brought their attention back to the lesson', isCorrect: false },
      { text: 'hit them with a lowkey nudge, no cap', isCorrect: true },
    ],
  },
  {
    id: 15,
    difficulty: 'Hard',
    scenario: "A student finally cracked a concept they'd been stuck on for weeks. Your reaction was ___.",
    options: [
      { text: 'an expression of professional satisfaction', isCorrect: false },
      { text: 'validation of their sustained effort', isCorrect: false },
      { text: 'acknowledgment of their academic growth', isCorrect: false },
      { text: 'pure "let\'s gooo" energy', isCorrect: true },
    ],
  },
  {
    id: 16,
    difficulty: 'Hard',
    scenario: 'During group work, one student was clearly carrying the whole team. You noticed and ___.',
    options: [
      { text: 'documented the imbalance in contribution', isCorrect: false },
      { text: "addressed it during the group's evaluation", isCorrect: false },
      { text: 'ensured credit was fairly distributed', isCorrect: false },
      { text: 'knew exactly who the real MVP was, no cap', isCorrect: true },
    ],
  },
  {
    id: 17,
    difficulty: 'Hard',
    scenario: 'A student panicked mid-presentation and froze. You stepped in and ___.',
    options: [
      { text: 'offered a supportive verbal prompt', isCorrect: false },
      { text: 'redirected the discussion to ease the pressure', isCorrect: false },
      { text: 'allowed a brief pause to regain composure', isCorrect: false },
      { text: 'said "you got this, let\'s go" and hyped them back up', isCorrect: true },
    ],
  },
  {
    id: 18,
    difficulty: 'Hard',
    scenario: 'Someone submitted work that was clearly copy-pasted. You called it out by ___.',
    options: [
      { text: 'requesting a formal resubmission', isCorrect: false },
      { text: 'addressing the academic integrity policy directly', isCorrect: false },
      { text: 'having a private conversation about it', isCorrect: false },
      { text: 'saying "we saw that plot twist coming"', isCorrect: true },
    ],
  },
  {
    id: 19,
    difficulty: 'Hard',
    scenario: 'A quiet student spoke up in class for the first time all semester. You made sure to ___.',
    options: [
      { text: 'formally note the shift in participation', isCorrect: false },
      { text: 'encourage continued engagement moving forward', isCorrect: false },
      { text: 'acknowledge the moment without overemphasis', isCorrect: false },
      { text: 'hype it up like a plot twist nobody saw coming', isCorrect: true },
    ],
  },
  {
    id: 20,
    difficulty: 'Hard',
    scenario: 'A student asked for an extension right before the deadline, again. You ___.',
    options: [
      { text: 'explained the policy regarding repeated extensions', isCorrect: false },
      { text: 'granted a final extension with clear conditions', isCorrect: false },
      { text: 'addressed the pattern directly and firmly', isCorrect: false },
      { text: 'said "not this time, bestie" and stood firm', isCorrect: true },
    ],
  },
];

/**
 * Utility to randomly select `count` items from an array without mutating
 */
export function getRandomQuestions(count = 5) {
  const shuffled = [...ALL_QUESTIONS].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);

  // Also shuffle the 4 options for each question so correct option is randomized
  return selected.map((q) => {
    const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5);
    return {
      ...q,
      options: shuffledOptions,
    };
  });
}
