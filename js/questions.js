/*
 * Question bank.
 *
 * These 5 questions are PLACEHOLDERS, one per station, from easy to hard.
 * Replace them with the real questions. To check that every answer matches what R
 * really prints, run:  node tools/check-answers.mjs   (needs Node and R installed)
 *
 * Fields of a question:
 *   id          unique and stable (progress is saved by id, so don't rename after release)
 *   station     the id of a station from js/config.js
 *   level       1 = קל, 2 = בינוני, 3 = קשה
 *   context     optional short Hebrew line shown above the code
 *   code        the R code (use \n for new lines, or a template string with backticks)
 *   options     4 answers, written like the exam (without the [1])
 *   answer      index of the right option: 0 = a, 1 = b, 2 = c, 3 = d
 *   hint        a Hebrew hint
 *   explanation the step-by-step explanation shown after answering (see below)
 *   whyWrong    for each WRONG option index: why it's tempting and why it's wrong
 *
 * Text formatting inside hint / explanation / whyWrong:
 *   `code`   shown as R code, left to right (use it for anything R: code, values, output)
 *   **bold** bold text
 *
 * An explanation step is { text } plus at most one visual:
 *   vector: { values: [...], marks: [...], labels: [...], showIndex: true }
 *           marks: 'on' (highlighted), 'off' (dimmed), 'drop' (crossed out), '' (plain)
 *           labels: optional small text under each cell (for example TRUE / FALSE)
 *           showIndex: show the positions 1, 2, 3... above the cells
 *   table:  { columns: [...], rows: [[...], ...], rowNames: [...], highlightRows: [0-based indexes] }
 *   output: 'exactly what R prints, for example [1] 2'
 */
window.GAME_QUESTIONS = [
  {
    id: 'vec-double',
    station: 'vectors',
    level: 1,
    context: 'ספרנו דגימות בשלוש מבחנות:',
    code: 'samples <- c(3, 7, 2)\nsamples * 2',
    options: ['3 7 2 2', '6 14 4', '24', '6 7 2'],
    answer: 1,
    hint: 'ב-R, פעולת חשבון על וקטור מתבצעת על כל איבר בנפרד.',
    explanation: [
      {
        text: '`samples` הוא וקטור עם 3 מספרים:',
        vector: { values: ['3', '7', '2'], marks: ['', '', ''], showIndex: true }
      },
      {
        text: '`* 2` מכפיל **כל** איבר בווקטור ב-2:',
        vector: { values: ['6', '14', '4'], marks: ['on', 'on', 'on'], labels: ['3 × 2', '7 × 2', '2 × 2'] }
      },
      {
        text: 'זה הפלט:',
        output: '[1]  6 14  4'
      }
    ],
    whyWrong: {
      0: '`3 7 2 2` הוא מה ש-`c(samples, 2)` היה מדפיס: הוספה של 2 לסוף הווקטור. אבל `*` הוא כפל, לא הוספה.',
      2: '`24` הוא סכום כל המספרים כפול 2, כלומר `sum(samples) * 2`. בלי `sum()` R לא מחבר את האיברים, אלא מכפיל כל אחד בנפרד.',
      3: 'הכפל לא חל רק על האיבר הראשון: R מכפיל **את כל** האיברים בווקטור.'
    }
  },

  {
    id: 'idx-positions',
    station: 'indexing',
    level: 1,
    context: 'מדדנו חום ל-5 חולים:',
    code: 'temp <- c(36.6, 38.2, 37.4, 39.1, 36.9)\ntemp[c(2, 4)]',
    options: ['37.4 36.9', '38.2 37.4 39.1', '38.2 39.1', '36.6 37.4 36.9'],
    answer: 2,
    hint: 'המספרים בתוך הסוגריים המרובעים הם **מיקומים** בווקטור, ו-R מתחיל לספור מ-1.',
    explanation: [
      {
        text: 'המספרים בתוך `[ ]` הם המיקומים שרוצים לשלוף: מיקום 2 ומיקום 4.',
        vector: {
          values: ['36.6', '38.2', '37.4', '39.1', '36.9'],
          marks: ['off', 'on', 'off', 'on', 'off'],
          showIndex: true
        }
      },
      {
        text: 'R מחזיר רק את הערכים שבמיקומים האלה, לפי הסדר:',
        output: '[1] 38.2 39.1'
      }
    ],
    whyWrong: {
      0: 'ב-R ספירת המיקומים מתחילה מ-**1** (ולא מ-0 כמו בשפות אחרות). מיקום 2 הוא `38.2`, לא `37.4`.',
      1: '`c(2, 4)` שולף רק את שני המיקומים האלה, לא את מה שביניהם. כדי לקבל את מיקומים 2 עד 4 כותבים `temp[2:4]`.',
      3: 'זה מה ש-`temp[-c(2, 4)]` היה מדפיס: מינוס **מוציא** את המיקומים. בלי מינוס, R **שולף** אותם.'
    }
  },

  {
    id: 'logic-fever-sum',
    station: 'logic',
    level: 2,
    context: 'מדדנו חום ל-5 חולים:',
    code: 'temp <- c(36.6, 38.2, 37.4, 39.1, 36.9)\nfever <- temp > 38\nsum(fever)',
    options: ['FALSE TRUE FALSE TRUE FALSE', '38.2 39.1', '3', '2'],
    answer: 3,
    hint: '`temp > 38` בודק כל איבר ומחזיר TRUE או FALSE. ומה `sum()` עושה עם TRUE ו-FALSE?',
    explanation: [
      {
        text: '`temp > 38` בודק כל מספר: האם הוא גדול מ-38? התוצאה נשמרת ב-`fever`.',
        vector: {
          values: ['36.6', '38.2', '37.4', '39.1', '36.9'],
          marks: ['off', 'on', 'off', 'on', 'off'],
          labels: ['FALSE', 'TRUE', 'FALSE', 'TRUE', 'FALSE']
        }
      },
      {
        text: '`sum()` סופר כל TRUE כ-1 וכל FALSE כ-0: `0 + 1 + 0 + 1 + 0`',
        output: '[1] 2'
      }
    ],
    whyWrong: {
      0: 'זה הערך של `fever`, אבל השורה האחרונה היא `sum(fever)`: R מחבר את ה-TRUE (כל TRUE שווה 1), ולכן מדפיס מספר אחד.',
      1: 'זה מה ש-`temp[temp > 38]` היה מדפיס: המספרים עצמם. אבל `temp > 38` לבד מחזיר רק TRUE / FALSE, ו-`sum()` סופר אותם.',
      2: 'שימו לב לכיוון הסימן: `>` פירושו "גדול מ". רק 2 מספרים גדולים מ-38. (3 הוא מספר החולים **בלי** חום.)'
    }
  },

  {
    id: 'df-smokers-age',
    station: 'dataframes',
    level: 2,
    context: 'טבלה של 4 חולים:',
    code: 'patients <- data.frame(\n  name = c("Dana", "Omer", "Noa", "Yoni"),\n  age = c(34, 52, 28, 45),\n  smoker = c(FALSE, TRUE, FALSE, TRUE)\n)\npatients$age[patients$smoker]',
    options: ['34 28', '"Omer" "Yoni"', '52 45', '2'],
    answer: 2,
    hint: '`patients$age` שולף את עמודת הגיל. ומה קורה כששמים וקטור של TRUE / FALSE בתוך `[ ]`?',
    explanation: [
      {
        text: 'כך נראית הטבלה:',
        table: {
          columns: ['name', 'age', 'smoker'],
          rows: [['Dana', '34', 'FALSE'], ['Omer', '52', 'TRUE'], ['Noa', '28', 'FALSE'], ['Yoni', '45', 'TRUE']],
          rowNames: ['1', '2', '3', '4'],
          highlightRows: [1, 3]
        }
      },
      {
        text: '`patients$age` שולף את עמודת הגיל, ו-`patients$smoker` הוא וקטור של TRUE / FALSE:',
        vector: {
          values: ['34', '52', '28', '45'],
          marks: ['off', 'on', 'off', 'on'],
          labels: ['FALSE', 'TRUE', 'FALSE', 'TRUE']
        }
      },
      {
        text: 'כששמים TRUE / FALSE בתוך `[ ]`, R שומר רק את המקומות שבהם יש TRUE:',
        output: '[1] 52 45'
      }
    ],
    whyWrong: {
      0: 'אלה הגילים של מי ש**לא** מעשן. `[ ]` עם TRUE / FALSE שומר את המקומות שבהם יש TRUE, כלומר את המעשנים.',
      1: 'המעשנים הם באמת עומר ויוני, אבל הקוד שולף מעמודת `age`, ולכן מקבלים את הגילים שלהם ולא את השמות.',
      3: '`2` הוא **מספר** המעשנים, כלומר `sum(patients$smoker)`. אבל כאן לא סופרים: שולפים את הערכים עצמם.'
    }
  },

  {
    id: 'loop-count-doses',
    station: 'loops',
    level: 3,
    context: 'מינונים של תרופה, במיליגרם:',
    code: 'doses <- c(10, 25, 5, 40)\ncount <- 0\nfor (d in doses) {\n  if (d >= 10) {\n    count <- count + 1\n  }\n}\ncount',
    options: ['3', '2', '4', '10 25 40'],
    answer: 0,
    hint: 'עברו על המינונים אחד-אחד, ורשמו כמה שווה `count` אחרי כל סיבוב. שימו לב ל-`>=`.',
    explanation: [
      {
        text: 'בכל סיבוב `d` מקבל מינון אחר, ו-`if` בודק אם `d >= 10`:',
        vector: {
          values: ['10', '25', '5', '40'],
          marks: ['on', 'on', 'off', 'on'],
          labels: ['TRUE', 'TRUE', 'FALSE', 'TRUE']
        }
      },
      {
        text: 'כל פעם שהתנאי נכון, `count` גדל ב-1:',
        table: {
          columns: ['d', 'd >= 10', 'count'],
          rows: [['10', 'TRUE', '1'], ['25', 'TRUE', '2'], ['5', 'FALSE', '2'], ['40', 'TRUE', '3']],
          rowNames: ['1', '2', '3', '4'],
          highlightRows: [3]
        }
      },
      {
        text: 'אחרי הלולאה, השורה `count` מדפיסה את הערך הסופי:',
        output: '[1] 3'
      }
    ],
    whyWrong: {
      1: '`>=` פירושו "גדול **או שווה**", ולכן גם `10` עובר את התנאי. רק `5` לא נספר.',
      2: 'לא כל המינונים נספרים: `5` קטן מ-10, ולכן בסיבוב שלו `count` לא משתנה.',
      3: 'אלה המינונים שעוברים את התנאי, אבל הלולאה לא שומרת אותם: היא רק מוסיפה 1 ל-`count`. השורה האחרונה מדפיסה את `count`, שהוא מספר אחד.'
    }
  }
];
