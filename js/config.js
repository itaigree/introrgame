/*
 * Game settings and lab stations.
 * The questions themselves live in js/questions.js.
 *
 * Every station needs a unique `id`. Questions point to a station by this id.
 * Stations are played in the order they appear here (the order of the course weeks).
 */
window.GAME_CONFIG = {
  // true: a station opens only after the one before it is cleared.
  lockStations: true,

  // Samples (lives) per station run.
  livesPerRun: 3,

  // How many questions of each level (1 = easy, 2 = medium, 3 = hard) one station run draws.
  // Questions the student hasn't answered right yet come first, so every run is different.
  questionsPerRun: { 1: 3, 2: 3, 3: 3 },

  // "מצב זמן" (time mode). Students turn it on or off in the settings sheet.
  // defaultOn: whether it starts on for a new player.
  // When it's on, each station question has a countdown by level (1 = easy, 2 = medium, 3 = hard)
  // and running out of time counts as a wrong answer. The mock exam then gets one shared clock.
  timer: {
    defaultOn: false,
    secondsByLevel: { 1: 90, 2: 120, 3: 150 }
  },

  // The mock exam ("מכינים את התרופה"): questions from every station, in station order.
  exam: {
    maxQuestions: 20,
    secondsPerQuestion: 90
  },

  // The outbreak story numbers (only for fun, they don't affect the score).
  outbreak: {
    startCases: 1200,
    casesPerWrong: [60, 120], // range added on a wrong answer
    casesPerRight: [20, 60]   // range removed on a right answer
  },

  // Icons: clipboard, tube, microscope, table, robot, machine, loop
  stations: [
    {
      id: 'basics',
      name: 'קבלה למעבדה',
      topic: 'משתנים וסוגי נתונים',
      topicCode: 'class()',
      icon: 'clipboard'
    },
    {
      id: 'vectors',
      name: 'איסוף דגימות',
      topic: 'וקטורים',
      topicCode: 'c() seq() rep()',
      icon: 'tube'
    },
    {
      id: 'names-na',
      name: 'מיקרוסקופ',
      topic: 'שמות, סינון ו-NA',
      topicCode: 'which() is.na()',
      icon: 'microscope'
    },
    {
      id: 'tables',
      name: 'טבלת החולים',
      topic: 'מטריצות וטבלאות',
      topicCode: 'matrix() df$col',
      icon: 'table'
    },
    {
      id: 'apply',
      name: 'רובוט המעבדה',
      topic: 'apply ו-paste',
      topicCode: 'apply() paste()',
      icon: 'robot'
    },
    {
      id: 'conditions',
      name: 'מכונת הבדיקות',
      topic: 'תנאים',
      topicCode: 'if ifelse()',
      icon: 'machine'
    },
    {
      id: 'loops',
      name: 'פס הייצור',
      topic: 'לולאות',
      topicCode: 'for while',
      icon: 'loop'
    }
  ]
};
