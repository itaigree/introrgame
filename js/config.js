/*
 * Game settings and lab stations.
 * The questions themselves live in js/questions.js.
 *
 * Every station needs a unique `id`. Questions point to a station by this id.
 * Stations are played in the order they appear here (the order of the course weeks).
 */
window.GAME_CONFIG = {
  // false: every station is open from the start and students practise whatever they want.
  // true: a station opens only after the one before it is cleared (and the mock exam after all of them).
  lockStations: false,

  // Samples (lives) per station run.
  livesPerRun: 3,

  // How many questions of each level (1 = easy, 2 = medium, 3 = hard) one station run draws.
  // Questions the student hasn't answered right yet come first, so every run is different.
  questionsPerRun: { 1: 3, 2: 3, 3: 3 },

  // "מצב זמן" (time mode) for the station questions. Students turn it on or off in the settings sheet.
  // defaultOn: whether it starts on for a new player.
  // When it's on, each station question has a countdown by level (1 = easy, 2 = medium, 3 = hard)
  // and running out of time counts as a wrong answer.
  timer: {
    defaultOn: false,
    secondsByLevel: { 1: 90, 2: 120, 3: 150 }
  },

  // The mock exam ("מכינים את התרופה"): questions from every station, in station order.
  // timedByDefault: the exam has one clock (secondsPerQuestion x the number of questions) unless the
  // student turns "מבחן הדמה על זמן" off in the settings sheet.
  exam: {
    maxQuestions: 20,
    secondsPerQuestion: 90,
    timedByDefault: true
  },

  // The outbreak story numbers (only for fun, they don't affect the score).
  outbreak: {
    startCases: 1200,
    casesPerWrong: [60, 120], // range added on a wrong answer
    casesPerRight: [20, 60]   // range removed on a right answer
  },

  // The story that ties the stations together (shown in the "איך משחקים?" sheet).
  story: 'נגיף מסתורי מתפשט בעיר, ואתם צוות המעבדה שמכין את התרופה. כל תחנה היא שלב בדרך: נרשמים למעבדה, אוספים דגימות, בודקים אותן במיקרוסקופ, שומרים אותן במקפיא, מפעילים את הרובוט ואת מכונת הבדיקות, ובסוף מייצרים את התרופה.',

  // Icons: clipboard, tube, microscope, table, robot, machine, loop
  // story.intro is shown when a station is opened for the first time in a round; story.done when it is completed.
  stations: [
    {
      id: 'basics',
      story: {
        intro: 'יום ראשון במעבדה! לפני שמתחילים לעבוד צריך להירשם: מספר עובד, חדר, ארונית וקוד לדלת. המחשב של המעבדה מדבר רק R, אז כל פרט נשמר במשתנה.',
        done: 'נרשמתם! יש לכם כרטיס עובד ומפתח לארונית. עכשיו יוצאים לאסוף דגימות.'
      },
      name: 'קבלה למעבדה',
      topic: 'משתנים וסוגי נתונים',
      topicCode: 'class()',
      icon: 'clipboard'
    },
    {
      id: 'vectors',
      story: {
        intro: 'הנגיף התגלה בכמה שכונות בעיר. יוצאים עם הרכב של המעבדה וארגז מבחנות, אוספים דגימות בכל שכונה ורושמים כמה מבחנות מילאתם בכל עצירה.',
        done: 'הארגזים מלאים! הדגימות בדרך למיקרוסקופ.'
      },
      name: 'איסוף דגימות',
      topic: 'וקטורים',
      topicCode: 'c() seq() rep()',
      icon: 'tube'
    },
    {
      id: 'names-na',
      story: {
        intro: 'כל דגימה מקבלת שם ונבדקת במיקרוסקופ: כמה נקודות של הנגיף רואים בה? חלק מהשקופיות נשברו בדרך, ושם אין מדידה (`NA`).',
        done: 'מצאתם את הדגימות הכי חשודות. עכשיו צריך לשמור אותן במקפיא.'
      },
      name: 'מיקרוסקופ',
      topic: 'שמות, סינון ו-NA',
      topicCode: 'which() is.na()',
      icon: 'microscope'
    },
    {
      id: 'tables',
      story: {
        intro: 'את הדגימות שומרים במקפיא הגדול. כל מדף הוא מתקן של מבחנות בשורות ובעמודות, ולידו רשימת מלאי: מה יש, כמה ובאיזה מדף.',
        done: 'המקפיא מסודר. הרובוט יכול להתחיל לעבוד.'
      },
      name: 'מקפיא הדגימות',
      topic: 'מטריצות וטבלאות',
      topicCode: 'matrix() df$col',
      icon: 'table'
    },
    {
      id: 'apply',
      story: {
        intro: 'רובוט המעבדה עובר על כל המדפים והרשימות: מסכם שורות ועמודות, מדפיס תוויות למבחנות וממיין אותן לפי הסדר.',
        done: 'כל המבחנות מתויגות וממוינות. הן מוכנות למכונת הבדיקות.'
      },
      name: 'רובוט המעבדה',
      topic: 'apply ו-paste',
      topicCode: 'apply() paste()',
      icon: 'robot'
    },
    {
      id: 'conditions',
      story: {
        intro: 'מכונת הבדיקות מקבלת כל דגימה ומחליטה: חיובית או שלילית, להמשיך או לעצור. לפי התוצאה היא מדליקה נורה ירוקה, צהובה או אדומה.',
        done: 'כל הדגימות נבדקו, ויש מספיק מידע כדי לייצר את התרופה!'
      },
      name: 'מכונת הבדיקות',
      topic: 'תנאים',
      topicCode: 'if ifelse()',
      icon: 'machine'
    },
    {
      id: 'loops',
      story: {
        intro: 'התרופה עוברת לייצור! פס הייצור ממלא בקבוקונים אחד אחרי השני, סופר מנות, מדלג על בקבוקון סדוק ועוצר כשהמיכל מתרוקן.',
        done: 'הבקבוקונים מוכנים. נשאר להוכיח שאתם מוכנים: מבחן הדמה!'
      },
      name: 'פס הייצור',
      topic: 'לולאות',
      topicCode: 'for while',
      icon: 'loop'
    }
  ]
};
