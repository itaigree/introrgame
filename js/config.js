/*
 * Game settings and lab stations.
 * The questions themselves live in js/questions.js.
 *
 * Every station needs a unique `id`. Questions point to a station by this id.
 * Stations are played in the order they appear here.
 */
window.GAME_CONFIG = {
  // true: a station opens only after the one before it is cleared.
  lockStations: true,

  // Samples (lives) per station run.
  livesPerRun: 3,

  // Time per question in a station run, by level (1 = easy, 2 = medium, 3 = hard).
  // When the time runs out the question counts as wrong. Set enabled: false to turn it off.
  timer: {
    enabled: true,
    secondsByLevel: { 1: 90, 2: 120, 3: 150 }
  },

  // The mock exam ("מכינים את התרופה"): random questions from every station, one shared clock.
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

  stations: [
    {
      id: 'vectors',
      name: 'איסוף דגימות',
      topic: 'וקטורים',
      topicCode: 'c()',
      icon: 'tube'
    },
    {
      id: 'indexing',
      name: 'מיקרוסקופ',
      topic: 'שליפה לפי מיקום',
      topicCode: 'x[ ]',
      icon: 'microscope'
    },
    {
      id: 'logic',
      name: 'מכונת הבדיקות',
      topic: 'תנאים',
      topicCode: '> == & |',
      icon: 'machine'
    },
    {
      id: 'dataframes',
      name: 'טבלת החולים',
      topic: 'טבלאות',
      topicCode: 'df$col',
      icon: 'table'
    },
    {
      id: 'loops',
      name: 'פס הייצור',
      topic: 'לולאות ו-if',
      topicCode: 'for / if',
      icon: 'loop'
    }
  ]
};
