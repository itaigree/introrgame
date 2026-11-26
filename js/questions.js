/*
 * Question bank: 7 lab stations (course weeks 1–7), 63 questions (21 easy, 21 medium, 21 hard).
 * A station run draws some of each level (questionsPerRun in js/config.js), the ones not yet answered right first.
 * Written from the course material in the style of the exam. None of the exam's questions are used.
 * To check that every answer matches what R really prints, run:  node tools/check-answers.mjs
 * (needs Node and R installed)
 *
 * Fields of a question:
 *   id          unique and stable (progress is saved by id, so don't rename after release)
 *   station     the id of a station from js/config.js
 *   level       1 = קל, 2 = בינוני, 3 = קשה
 *   prompt      optional question line; default "מה יהיה הפלט?" (for example "מה יודפס?")
 *   context     optional short Hebrew line shown above the code
 *   code        the R code (use \n for new lines)
 *   options     4 answers, written like the exam (without the [1]). An option with Hebrew letters is shown as
 *               right-to-left text, for example 'שגיאה (Error)'. If the right answer is an error, its option must
 *               contain the word Error.
 *   answer      index of the right option: 0 = a, 1 = b, 2 = c, 3 = d
 *   hint        a Hebrew hint
 *   explanation the step-by-step explanation shown after answering (see below)
 *   whyWrong    for each WRONG option index: why it's tempting and why it's wrong
 *   manual      optional, true = the checker runs the code but doesn't compare (only for a Hebrew-text right answer)
 *
 * Text formatting inside prompt / context / options / hint / explanation / whyWrong:
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
  // ===== שבוע 1: משתנים וסוגי נתונים =====
  {
    id: 'basics-mod-racks',
    station: 'basics',
    level: 1,
    context: 'יש 23 מבחנות, ובכל מעמד יש מקום ל-4 מבחנות:',
    code: 'tubes <- 23\ntubes %% 4',
    options: ['5', '3', '5.75', '0.75'],
    answer: 1,
    hint: 'ב-R יש כמה סוגי חילוק: `/`, `%/%` ו-`%%`. נסו להיזכר מה כל אחד מהם מחזיר, ובמיוחד מה `%%` עושה עם מה שלא מתחלק בדיוק.',
    explanation: [
      {
        text: '`%%` מחזיר את **השארית** של החילוק. קודם בודקים כמה פעמים 4 נכנס ב-23 בשלמות: `4 * 5 = 20`, כלומר 5 מעמדים מלאים.'
      },
      {
        text: 'מה שנשאר בחוץ הוא `23 - 20 = 3`. זאת השארית:',
        output: '[1] 3'
      }
    ],
    whyWrong: {
      0: '`5` הוא מספר המעמדים **המלאים**, כלומר מה ש-`23 %/% 4` מדפיס (חילוק שלם). `%%` מחזיר את מה שנשאר אחרי שממלאים אותם: 3 מבחנות.',
      2: '`5.75` הוא מה ש-`23 / 4` מדפיס, חילוק רגיל. `%%` הוא לא חילוק רגיל: הוא מחזיר את השארית.',
      3: 'השארית היא לא החלק שאחרי הנקודה ב-`5.75`. השארית היא כמה מבחנות **נשארו** בחוץ: `23 - 4 * 5 = 3`. (`0.75` הוא בעצם `3 / 4`, השארית מחולקת ב-4.)'
    }
  },

  {
    id: 'basics-class-compare',
    station: 'basics',
    level: 1,
    context: 'במקרר יש 12 דגימות. בודקים אם יש יותר מ-9:',
    code: 'samples <- 12\nmany <- samples > 9\nclass(many)',
    options: ['"numeric"', 'TRUE', '"character"', '"logical"'],
    answer: 3,
    hint: 'קודם חשבו מה נשמר ב-`many`: מספר, טקסט, או משהו אחר? ואז זכרו מה `class()` מחזיר.',
    explanation: [
      {
        text: '`samples > 9` היא השוואה: האם 12 גדול מ-9? התשובה היא `TRUE`, והיא נשמרת ב-`many`.'
      },
      {
        text: '`TRUE` ו-`FALSE` הם ערכים **לוגיים**. `class()` לא מדפיס את הערך עצמו, אלא את **הסוג** שלו:',
        output: '[1] "logical"'
      }
    ],
    whyWrong: {
      0: 'נכון שבהשוואה יש מספרים (`12` ו-`9`), אבל התוצאה של השוואה היא `TRUE` או `FALSE`, לא מספר. לכן הסוג של `many` הוא `"logical"`. (`class(samples)` היה מדפיס `"numeric"`.)',
      1: '`TRUE` הוא **הערך** של `many`, כלומר מה שהשורה `many` לבדה הייתה מדפיסה. `class()` מחזיר את **הסוג** של הערך, ולכן מקבלים `"logical"`.',
      2: '`TRUE` כתוב בלי מרכאות, ולכן הוא לא טקסט: הוא ערך לוגי. רק `"TRUE"` עם מרכאות היה מסוג `"character"`.'
    }
  },

  {
    id: 'basics-sqrt-abs',
    station: 'basics',
    level: 1,
    context: 'ההפרש בין שתי מדידות יצא שלילי:',
    code: 'gap <- -36\nsqrt(abs(gap))',
    options: ['6', '-6', '18', 'שגיאה (Error)'],
    answer: 0,
    hint: 'כשפונקציה נמצאת בתוך פונקציה אחרת, איזו מהן R מריץ קודם?',
    explanation: [
      {
        text: 'R מתחיל מהפונקציה **הפנימית**: `abs(gap)` מחזיר את הערך המוחלט של `-36`, כלומר `36`.'
      },
      {
        text: 'עכשיו `sqrt()` מקבל `36` ומחזיר את השורש שלו. `6 * 6 = 36`, ולכן השורש הוא `6`:',
        output: '[1] 6'
      }
    ],
    whyWrong: {
      1: '`abs()` כבר הוריד את המינוס לפני ש-`sqrt()` רץ, ו-`sqrt()` של מספר חיובי מחזיר שורש חיובי. המינוס לא חוזר.',
      2: '`18` הוא `36 / 2`, כלומר חצי. אבל `sqrt()` מחזיר **שורש**: המספר שכפול עצמו נותן 36, וזה `6`.',
      3: 'שורש של מספר שלילי באמת לא עובד (`sqrt(-36)` מחזיר `NaN`, "לא מספר", עם אזהרה). אבל כאן `sqrt()` לא מקבל את `-36`: R מריץ קודם את `abs(gap)`, ולכן `sqrt()` מקבל `36`.'
    }
  },

  {
    id: 'basics-paste-calc',
    station: 'basics',
    level: 2,
    context: 'יוצרים שם לקבוצת ניסוי:',
    code: 'paste("Group", 3 + 4)',
    options: ['"Group 3 + 4"', '"Group7"', '"Group 7"', 'שגיאה (Error), כי אי אפשר לחבר טקסט ומספר'],
    answer: 2,
    hint: 'שימו לב ש-`3 + 4` כתוב בלי מרכאות. ומה `paste()` עושה כשהוא מחבר כמה חלקים?',
    explanation: [
      {
        text: '`3 + 4` כתוב בלי מרכאות, ולכן זה חישוב: R מחשב אותו קודם ומקבל `7`.'
      },
      {
        text: '`paste()` מחבר את `"Group"` ואת `7` לטקסט אחד. הוא יודע לחבר גם מספרים (הוא הופך אותם לטקסט), ובברירת המחדל הוא שם **רווח** בין החלקים:',
        output: '[1] "Group 7"'
      }
    ],
    whyWrong: {
      0: 'רק מה שבתוך מרכאות נשאר טקסט כמו שהוא. `3 + 4` כתוב בלי מרכאות, ולכן R מחשב אותו קודם, ו-`paste()` מקבל `7`. (`paste("Group", "3 + 4")`, עם מרכאות, היה מדפיס את זה.)',
      1: '`paste()` שם **רווח** בין החלקים שהוא מחבר (זאת ברירת המחדל), ולכן מקבלים `"Group 7"` עם רווח.',
      3: 'חשבון כמו `+` על טקסט אכן נותן שגיאה, אבל כאן `+` פועל רק על `3` ו-`4`, שהם מספרים. `paste()` לא מחשב: הוא **מחבר לטקסט אחד**, וממיר את `7` לטקסט בעצמו.'
    }
  },

  {
    id: 'basics-convert-not-saved',
    station: 'basics',
    level: 2,
    context: 'הגיל הגיע מטופס, ולכן נשמר כטקסט:',
    code: 'age <- "31"\nage_num <- as.numeric(age)\nage + 1',
    options: ['32', '"32"', '"311"', 'שגיאה (Error), כי `age` עדיין טקסט'],
    answer: 3,
    hint: 'בדקו כל שורה: מה נשמר ב-`age_num`? והאם `age` עצמו השתנה?',
    explanation: [
      {
        text: '`age` מקבל `"31"` עם מרכאות, ולכן הוא **טקסט** (`"character"`).'
      },
      {
        text: '`as.numeric(age)` מחזיר את המספר `31`, והתוצאה נשמרת במשתנה **חדש**, `age_num`. המשתנה `age` עצמו לא משתנה ונשאר טקסט.'
      },
      {
        text: 'בשורה האחרונה R מנסה לחבר טקסט ומספר: `"31" + 1`. אי אפשר לעשות חשבון על טקסט, ולכן R עוצר עם שגיאה:',
        output: 'Error in age + 1 : non-numeric argument to binary operator'
      }
    ],
    whyWrong: {
      0: '`32` הוא מה ש-`age_num + 1` היה מדפיס. אבל `as.numeric()` לא משנה את `age`: הוא רק מחזיר מספר, שנשמר ב-`age_num`. `age` נשאר `"31"`, טקסט.',
      1: 'חשבון ב-R לא מחזיר טקסט עם מרכאות, ו-`+` בכלל לא עובד על טקסט. כאן `age` עדיין `"31"` (טקסט), ולכן R עוצר עם שגיאה.',
      2: 'ב-R הסימן `+` לא מדביק טקסטים זה לזה (כמו שקורה בחלק משפות התכנות האחרות), והוא בכלל לא עובד על טקסט. לכן `"31" + 1` עוצר עם שגיאה. כדי לחבר טקסטים משתמשים ב-`paste()`.'
    }
  },

  {
    id: 'basics-floor-negative',
    station: 'basics',
    level: 2,
    context: 'השינוי במשקל של דגימה, בגרמים:',
    code: 'change <- 5.2 - 8.9\nfloor(change)',
    options: ['-4', '-3', '3', '-3.7'],
    answer: 0,
    hint: 'קודם חשבו את `change`. ואז: לאיזה כיוון `floor()` מעגל? שימו לב שהמספר שלילי.',
    explanation: [
      {
        text: '`5.2 - 8.9` הוא `-3.7`, וזה נשמר ב-`change`.'
      },
      {
        text: '`floor()` מעגל **למטה**, כלומר למספר השלם הקטן יותר. `-4` קטן מ-`-3.7` (הוא רחוק יותר מאפס בצד השלילי), ו-`-3` גדול ממנו:',
        vector: {
          values: ['-5', '-4', '-3.7', '-3', '-2'],
          marks: ['off', 'on', '', 'off', 'off'],
          labels: ['', 'floor', 'change', 'ceiling', '']
        }
      },
      {
        text: 'לכן `floor(-3.7)` הוא `-4`:',
        output: '[1] -4'
      }
    ],
    whyWrong: {
      1: '`-3` הוא מה ש-`ceiling(change)` מדפיס. `floor()` לא "מוחק" את מה שאחרי הנקודה: הוא מעגל **למטה**, ובמספרים שליליים למטה פירושו `-4`.',
      2: '`3` הוא מה ש-`floor(abs(change))` היה מדפיס: קודם מורידים את המינוס ואז מעגלים. אבל כאן אין `abs()`, ולכן המינוס נשאר.',
      3: '`-3.7` הוא הערך של `change`. אבל השורה האחרונה מפעילה עליו את `floor()`, שמעגל אותו למספר שלם.'
    }
  },

  {
    id: 'basics-copy-value',
    station: 'basics',
    level: 3,
    context: 'מעקב אחרי מלאי הכפפות במעבדה:',
    prompt: 'מה יודפס?',
    code: 'stock <- 20\nused <- 6\nleft <- stock - used\nused <- used + 4\nstock <- left - used\nstock',
    options: ['0', '20', '4', '8'],
    answer: 2,
    hint: 'עברו שורה-שורה ורשמו את הערך של כל משתנה אחרי כל שורה. שימו לב מתי כל ערך נשמר.',
    explanation: [
      {
        text: 'נעקוב אחרי הערכים אחרי כל שורה:',
        table: {
          columns: ['קוד', 'stock', 'used', 'left'],
          rows: [
            ['stock <- 20', '20', '', ''],
            ['used <- 6', '20', '6', ''],
            ['left <- stock - used', '20', '6', '14'],
            ['used <- used + 4', '20', '10', '14'],
            ['stock <- left - used', '4', '10', '14']
          ],
          rowNames: ['1', '2', '3', '4', '5'],
          highlightRows: [3, 4]
        }
      },
      {
        text: 'בשורה 3 `left` מקבל את **הערך** `20 - 6 = 14`. זה מספר שנשמר, לא נוסחה: כש-`used` גדל ל-10 בשורה 4, `left` נשאר `14`.'
      },
      {
        text: 'בשורה 5 מחשבים `14 - 10 = 4`, והערך הזה **מחליף** את ה-20 שהיה ב-`stock`:',
        output: '[1] 4'
      }
    ],
    whyWrong: {
      0: 'כאן חשבתם ש-`left` מתעדכן כש-`used` משתנה (`20 - 10 = 10`, ואז `10 - 10 = 0`). אבל `<-` שומר **ערך** ולא נוסחה: `left` קיבל `14` בשורה 3 ונשאר `14`.',
      1: '`<-` למשתנה שכבר קיים **מחליף** את הערך הקודם. בשורה 5 `stock` מקבל ערך חדש (`14 - 10 = 4`), וה-20 נמחק.',
      3: 'זה מה שיוצא אם `used` נשאר 6 (`14 - 6 = 8`). אבל `used <- used + 4` שומר את התוצאה בחזרה ב-`used`, ולכן מעכשיו `used` הוא 10.'
    }
  },

  {
    id: 'basics-middle-digit',
    station: 'basics',
    level: 3,
    context: 'לכל דגימה יש מספר מזהה בן שלוש ספרות:',
    code: 'id <- 472\na <- id %/% 10\na %% 10',
    options: ['2', '7', '47', '4'],
    answer: 1,
    hint: 'עשו את זה בשני שלבים: קודם מה נשמר ב-`a`, ואחר כך מה מחזירה השורה האחרונה. אל תתבלבלו בין `%/%` ל-`%%`.',
    explanation: [
      {
        text: '`%/%` הוא חילוק **שלם**: כמה פעמים 10 נכנס ב-472 בשלמות. `10 * 47 = 470`, ולכן `a` הוא `47` (השארית 2 נזרקת).'
      },
      {
        text: '`a %% 10` מחזיר את **השארית** של `47` חלקי 10: `10 * 4 = 40`, ונשאר `47 - 40 = 7`.'
      },
      {
        text: 'בעצם הקוד שולף את הספרה האמצעית של 472:',
        output: '[1] 7'
      }
    ],
    whyWrong: {
      0: '`2` הוא מה ש-`id %% 10` מדפיס: השארית של 472 עצמו. אבל בשורה 2 יש `%/%` (חילוק שלם), ולכן `a` הוא `47`, והשארית בשורה 3 מחושבת על `47`.',
      2: '`47` הוא הערך של `a`. אבל השורה האחרונה מחשבת עוד שלב: `a %% 10`, השארית של `47` חלקי 10, שהיא `7`.',
      3: '`4` הוא מה ש-`a %/% 10` היה מדפיס: חילוק שלם בלי השארית. בשורה האחרונה יש `%%`, שמחזיר את מה ש**נשאר**: `47 - 40 = 7`.'
    }
  },

  {
    id: 'basics-nchar-label',
    station: 'basics',
    level: 3,
    context: 'מכינים תווית למבחנה:',
    code: 'room <- "Lab"\navg <- round(10 / 3, digits = 2)\nlabel <- paste(room, avg)\nnchar(label)',
    options: ['7', '2', '6', '8'],
    answer: 3,
    hint: 'חשבו קודם מה נשמר ב-`avg`, ומה בדיוק נמצא בתוך `label`, תו אחרי תו. מה `nchar()` סופר?',
    explanation: [
      {
        text: '`10 / 3` הוא `3.333333`, ו-`round(..., digits = 2)` משאיר 2 ספרות אחרי הנקודה: `avg` הוא `3.33`.'
      },
      {
        text: '`paste()` מחבר את `"Lab"` ואת `3.33` עם רווח ביניהם, ולכן `label` הוא `"Lab 3.33"`. אלה התווים שבו:',
        vector: {
          values: ['L', 'a', 'b', '␣', '3', '.', '3', '3'],
          marks: ['on', 'on', 'on', 'on', 'on', 'on', 'on', 'on'],
          labels: ['', '', '', 'רווח', '', 'נקודה', '', ''],
          showIndex: true
        }
      },
      {
        text: '`nchar()` סופר **כל** תו בטקסט, כולל הרווח והנקודה:',
        output: '[1] 8'
      }
    ],
    whyWrong: {
      0: '`7` יוצא אם שוכחים את הרווח: זה מה ש-`nchar("Lab3.33")` מדפיס. אבל `paste()` שם רווח בין החלקים, ו-`nchar()` סופר גם אותו.',
      1: '`nchar()` לא סופר כמה חלקים חוברו או כמה מילים יש, אלא **תווים**. ב-`"Lab 3.33"` יש 8 תווים.',
      2: 'נראה שספרתם רק אותיות וספרות. `nchar()` סופר **כל** תו, וגם הרווח והנקודה הם תווים: `3 + 1 + 4 = 8`.'
    }
  },

  // ===== שבוע 2: וקטורים =====
  // ---------- level 1 ----------
  {
    id: 'vectors-add-two',
    station: 'vectors',
    level: 1,
    context: 'ספרנו מבקרים במרפאה בשלושה ימים, בבוקר ובערב:',
    code: 'morning <- c(5, 3, 8)\nevening <- c(2, 6, 1)\nmorning + evening',
    options: ['5 3 8 2 6 1', '7 9 9', '25', '16 9'],
    answer: 1,
    hint: 'בכל וקטור יש 3 מספרים. כמה מספרים יהיו בתוצאה, ואיך R מתאים בין שני הווקטורים?',
    explanation: [
      {
        text: 'יש שני וקטורים באותו אורך, 3 מספרים בכל אחד. כך נראה `morning`:',
        vector: { values: ['5', '3', '8'], marks: ['', '', ''], showIndex: true }
      },
      {
        text: '`+` בין שני וקטורים מחבר כל איבר עם האיבר **שבאותו מיקום** בווקטור השני:',
        vector: { values: ['7', '9', '9'], marks: ['on', 'on', 'on'], labels: ['5 + 2', '3 + 6', '8 + 1'] }
      },
      {
        text: 'התוצאה היא וקטור באותו אורך:',
        output: '[1] 7 9 9'
      }
    ],
    whyWrong: {
      0: '`5 3 8 2 6 1` הוא מה ש-`c(morning, evening)` מדפיס: `c()` מצרף וקטורים אחד אחרי השני. `+` לא מצרף, הוא מחבר מספרים: כל איבר עם האיבר שבאותו מיקום.',
      2: '`25` הוא סכום כל המספרים, כלומר `sum(morning + evening)`. בלי `sum()`, R לא סוכם הכול למספר אחד: הוא מחבר זוגות ומחזיר וקטור באותו אורך.',
      3: '`16 9` הם הסכומים של כל וקטור בנפרד, `sum(morning)` ו-`sum(evening)`. אבל `+` בין שני וקטורים מחבר ראשון עם ראשון, שני עם שני ושלישי עם שלישי.'
    }
  },

  {
    id: 'vectors-seq-by',
    station: 'vectors',
    level: 1,
    context: 'אלה מספרי המבחנות שנבדוק היום:',
    code: 'seq(2, 20, by = 6)',
    options: ['6 12 18', '2 8 14', '2 8 14 20', '8 14 20'],
    answer: 2,
    hint: 'כתבו את המספרים אחד-אחד: מאיזה מספר מתחילים, ובכמה גדלים בכל צעד?',
    explanation: [
      {
        text: 'ב-`seq(2, 20, by = 6)` מתחילים ב-`2`, מוסיפים `6` בכל צעד, ולא עוברים את `20`:',
        vector: { values: ['2', '8', '14', '20'], marks: ['on', 'on', 'on', 'on'], labels: ['התחלה', '2 + 6', '8 + 6', '14 + 6'] }
      },
      {
        text: '`20` נכנס לתוצאה כי הוא לא עובר את הגבול. הצעד הבא היה `26`, שכבר גדול מ-20, ולכן R עוצר:',
        output: '[1]  2  8 14 20'
      }
    ],
    whyWrong: {
      0: '`6 12 18` הם המספרים שמתחלקים ב-6 (זה מה ש-`seq(6, 18, by = 6)` מדפיס). אבל `by = 6` הוא גודל הצעד: מתחילים מהמספר הראשון, `2`, ומוסיפים 6 בכל פעם.',
      1: 'גם `20` נכנס: `seq()` עוצר רק כשהצעד הבא **עובר** את הגבול. מ-`14` הצעד הבא הוא בדיוק `20`, ולכן הוא חלק מהתוצאה.',
      3: 'המספר הראשון ב-`seq()` הוא נקודת ההתחלה, והוא עצמו נכנס לתוצאה. לכן הפלט מתחיל ב-`2`, ולא ב-`2 + 6`.'
    }
  },

  {
    id: 'vectors-length-colon',
    station: 'vectors',
    level: 1,
    context: 'מספרי זיהוי של מבחנות:',
    code: 'ids <- c(10:14, 20)\nlength(ids)',
    options: ['3', '5', '80', '6'],
    answer: 3,
    hint: 'כתבו את כל המספרים ש-`10:14` יוצר, ורק אחר כך ספרו.',
    explanation: [
      {
        text: '`10:14` יוצר את כל המספרים השלמים מ-10 עד 14, **כולל** שניהם. אלה 5 מספרים:',
        vector: { values: ['10', '11', '12', '13', '14'], marks: ['on', 'on', 'on', 'on', 'on'] }
      },
      {
        text: '`c()` מוסיף אחריהם גם את `20`, ולכן ב-`ids` יש:',
        vector: { values: ['10', '11', '12', '13', '14', '20'], marks: ['', '', '', '', '', ''], showIndex: true }
      },
      {
        text: '`length()` סופר כמה איברים יש בווקטור:',
        output: '[1] 6'
      }
    ],
    whyWrong: {
      0: '`10:14` הוא לא רק שני המספרים 10 ו-14, אלא כל המספרים מ-10 עד 14. `3` הוא מה ש-`length(c(10, 14, 20))` מדפיס.',
      1: 'קל לטעות כאן באחד: `10:14` כולל את שני הקצוות, ולכן יש בו 5 מספרים (ולא `14 - 10`, שזה 4). אחריהם בא גם `20`, כך שיש 6 איברים.',
      2: '`80` הוא סכום המספרים, כלומר `sum(ids)`. `length()` לא מחבר את הערכים: הוא סופר כמה איברים יש בווקטור.'
    }
  },

  // ---------- level 2 ----------
  {
    id: 'vectors-mixed-types',
    station: 'vectors',
    level: 2,
    context: 'שמרנו כמה פרטים על דגימה אחת בווקטור:',
    code: 'label <- c(12, TRUE, "tube")\nlabel',
    options: ['"12" "TRUE" "tube"', '12 TRUE "tube"', '"12" "1" "tube"', 'שגיאה (Error), כי אי אפשר לשים סוגים שונים באותו וקטור'],
    answer: 0,
    hint: 'בווקטור כל האיברים הם מאותו סוג. איזה סוג יכול להחזיק גם את `12`, גם את `TRUE` וגם את `"tube"`?',
    explanation: [
      {
        text: 'ב-`c()` יש שלושה סוגים שונים: מספר, ערך לוגי וטקסט.',
        vector: { values: ['12', 'TRUE', '"tube"'], marks: ['', '', ''], labels: ['numeric', 'logical', 'character'] }
      },
      {
        text: 'וקטור מחזיק רק סוג אחד. R לא עוצר בשגיאה: הוא הופך את כל האיברים לסוג שיכול להחזיק את כולם, כלומר לטקסט. כל ערך הופך לטקסט כפי שהוא כתוב:',
        vector: { values: ['"12"', '"TRUE"', '"tube"'], marks: ['on', 'on', 'on'], labels: ['character', 'character', 'character'] }
      },
      {
        text: 'R מדפיס טקסט עם מירכאות:',
        output: '[1] "12"   "TRUE" "tube"'
      }
    ],
    whyWrong: {
      1: 'בווקטור אחד אי אפשר שיהיו גם מספרים וגם טקסט. ברגע שיש `"tube"`, כל האיברים הופכים לטקסט, ולכן כולם מודפסים עם מירכאות.',
      2: 'זה מה ש-`c(c(12, TRUE), "tube")` מדפיס: שם נבנה קודם וקטור של מספרים, ובו `TRUE` הופך ל-`1`. אבל כאן שלושת הערכים נכנסים ל-`c()` יחד, ולכן `TRUE` הופך ישר לטקסט `"TRUE"`.',
      3: 'R לא נותן שגיאה כשמערבבים סוגים ב-`c()`. הוא הופך את כל האיברים לסוג אחד (כאן: טקסט) וממשיך.'
    }
  },

  {
    id: 'vectors-drop-ends',
    station: 'vectors',
    level: 2,
    context: 'מדדנו את הטמפרטורה בחדר 5 פעמים ביום:',
    code: 'temps <- c(18, 22, 25, 21, 19)\nmid <- temps[-c(1, 5)]\nmid - 20',
    options: ['-2 -1', '2 5 1', '2 25 21', '-2 2 5 1 -1'],
    answer: 1,
    hint: 'מה עושה המינוס **בתוך** הסוגריים המרובעים? ואחר כך: על אילו איברים פועל `- 20`?',
    explanation: [
      {
        text: 'מינוס בתוך `[ ]` **מוציא** מיקומים. `-c(1, 5)` מוציא את המיקום הראשון ואת המיקום החמישי:',
        vector: { values: ['18', '22', '25', '21', '19'], marks: ['drop', 'on', 'on', 'on', 'drop'], showIndex: true }
      },
      {
        text: 'ב-`mid` נשארים 3 מספרים, ו-`- 20` מחסיר 20 מ**כל** אחד מהם:',
        vector: { values: ['2', '5', '1'], marks: ['on', 'on', 'on'], labels: ['22 - 20', '25 - 20', '21 - 20'] }
      },
      {
        text: 'זה הפלט:',
        output: '[1] 2 5 1'
      }
    ],
    whyWrong: {
      0: 'זה מה ש-`temps[c(1, 5)] - 20` מדפיס: בלי מינוס, R **שולף** את מיקומים 1 ו-5. עם מינוס הוא **מוציא** אותם ושומר את כל השאר.',
      2: 'R לא מחסיר 20 רק מהאיבר הראשון: מספר בודד פועל על **כל** האיברים בווקטור. לכן גם `25` וגם `21` קטנים ב-20.',
      3: 'זה מה ש-`temps - 20` מדפיס, כאילו לא הוצאנו כלום. אבל `temps[-c(1, 5)]` מוציא את מיקומים 1 ו-5, ולכן ב-`mid` יש רק 3 מספרים.'
    }
  },

  {
    id: 'vectors-rep-mean',
    station: 'vectors',
    level: 2,
    context: 'מחירים בשקלים של מה שקנינו למעבדה:',
    code: 'prices <- rep(c(10, 40), c(3, 1))\nmean(prices)',
    options: ['17.5', '25', '70', '32.5'],
    answer: 0,
    hint: 'קודם כתבו את `prices` במלואו: כמה פעמים חוזר כל מספר? רק אחר כך חשבו את הממוצע.',
    explanation: [
      {
        text: 'הארגומנט השני של `rep()` (`times`) הוא כאן וקטור, ולכן כל איבר חוזר מספר פעמים משלו, לפי הסדר: `10` שלוש פעמים, ו-`40` פעם אחת:',
        vector: { values: ['10', '10', '10', '40'], marks: ['', '', '', ''], showIndex: true }
      },
      {
        text: '`mean()` מחבר את כל האיברים ומחלק במספר האיברים: `(10 + 10 + 10 + 40) / 4`, כלומר `70 / 4`.',
        output: '[1] 17.5'
      }
    ],
    whyWrong: {
      1: '`25` הוא מה ש-`mean(c(10, 40))` מדפיס, כאילו כל מחיר מופיע פעם אחת. אבל `rep()` יצר וקטור של 4 איברים, ו-`10` מופיע בו שלוש פעמים.',
      2: '`70` הוא הסכום, כלומר `sum(prices)`. `mean()` מחלק את הסכום במספר האיברים (4), ולכן מקבלים `17.5`.',
      3: 'זה מה ש-`mean(rep(c(10, 40), c(1, 3)))` מדפיס. המספרים ב-`c(3, 1)` מתאימים לפי הסדר: הראשון (`3`) שייך ל-`10`, והשני (`1`) שייך ל-`40`.'
    }
  },

  // ---------- level 3 ----------
  {
    id: 'vectors-trace-trays',
    station: 'vectors',
    level: 3,
    context: 'כמה דגימות יש בכל מגש:',
    code: 'trays <- c(6, 2, 9)\ntrays <- c(trays, 4)\ntrays[2] <- trays[1] + trays[4]\ntrays[-1]',
    options: ['5 9 4', '6 10 9', '10 9 4', '10 2 9 4'],
    answer: 2,
    hint: 'עקבו אחרי `trays` שורה אחרי שורה, וכתבו איך הוא נראה אחרי כל שורה.',
    explanation: [
      {
        text: 'שורה 2: `c(trays, 4)` מוסיף את `4` בסוף, והתוצאה נשמרת שוב ב-`trays`:',
        vector: { values: ['6', '2', '9', '4'], marks: ['', '', '', 'on'], showIndex: true }
      },
      {
        text: 'שורה 3: `trays[1]` הוא `6` ו-`trays[4]` הוא `4`. הסכום, `10`, **מחליף** את הערך שבמיקום 2:',
        vector: { values: ['6', '10', '9', '4'], marks: ['', 'on', '', ''], showIndex: true }
      },
      {
        text: 'שורה 4: `[-1]` מוציא את המיקום הראשון, ושאר האיברים מודפסים:',
        vector: { values: ['6', '10', '9', '4'], marks: ['drop', 'on', 'on', 'on'], showIndex: true }
      },
      {
        text: 'זה הפלט:',
        output: '[1] 10  9  4'
      }
    ],
    whyWrong: {
      0: 'בתוך `[ ]` המספרים `1` ו-`4` הם מיקומים, אבל `trays[1] + trays[4]` מחבר את **הערכים** שבמיקומים האלה: `6 + 4`, שזה `10`, ולא `1 + 4`.',
      1: 'זה מה ש-`trays[-4]` מדפיס. `[-1]` לא מוציא את האיבר האחרון, אלא את האיבר שב**מיקום 1**.',
      3: 'השמה למיקום שכבר קיים **מחליפה** את הערך שבו, ולא מוסיפה איבר חדש. לכן `trays` נשאר באורך 4: הערך `2` נמחק ובמקומו נכנס `10`.'
    }
  },

  {
    id: 'vectors-text-sum',
    station: 'vectors',
    level: 3,
    context: 'ספרנו מבחנות בארבעה מדפים, ואז תיקנו את הספירה האחרונה:',
    code: 'counts <- c(5, 12, 8, 6)\ncounts[4] <- "3"\nsum(counts)',
    prompt: 'מה יקרה כשנריץ את הקוד?',
    options: ['28', 'שגיאה (Error) כבר בשורה 2, כי אי אפשר לשים טקסט בווקטור של מספרים', '25', 'שגיאה (Error) בשורה 3, כי עכשיו כל הערכים ב-`counts` הם טקסט'],
    answer: 3,
    hint: 'דמיינו ש-R מדפיס את `counts` אחרי שורה 2. איך הוא ייראה?',
    explanation: [
      {
        text: 'שורה 2 עובדת בלי שגיאה: `"3"` נכנס למיקום 4. אבל `"3"` עם מירכאות הוא טקסט, ובווקטור כל האיברים חייבים להיות מאותו סוג, ולכן R הופך **את כולם** לטקסט:',
        vector: { values: ['"5"', '"12"', '"8"', '"3"'], marks: ['on', 'on', 'on', 'on'], labels: ['character', 'character', 'character', 'character'], showIndex: true }
      },
      {
        text: 'בשורה 3, `sum()` מקבל וקטור של טקסט. אי אפשר לחבר טקסט, גם אם הוא נראה כמו מספר, ולכן R עוצר עם שגיאה:',
        output: "Error in sum(counts) : invalid 'type' (character) of argument"
      }
    ],
    whyWrong: {
      0: '`28` הוא מה ש-`sum(as.numeric(counts))` מדפיס. בלי `as.numeric()`, `"3"` הוא טקסט ולא מספר, ובגללו גם `5`, `12` ו-`8` הפכו לטקסט.',
      1: 'שורה 2 דווקא עובדת: R לא עוצר כשמכניסים טקסט לווקטור של מספרים, אלא הופך את כל הווקטור לטקסט. השגיאה מגיעה רק בשורה 3, כשמנסים לחבר טקסט.',
      2: '`25` הוא מה ש-`sum(c(5, 12, 8))` מדפיס, כאילו `sum()` מדלג על הטקסט. אבל `sum()` לא מדלג: כל הווקטור הוא טקסט, ולכן מקבלים שגיאה.'
    }
  },

  {
    id: 'vectors-seq-last',
    station: 'vectors',
    level: 3,
    context: 'הדקות שבהן בודקים את המבחנות במהלך ניסוי:',
    code: 'minutes <- seq(3, 20, by = 5)\nminutes[length(minutes)] - minutes[1]',
    options: ['15', '17', '1', '20'],
    answer: 0,
    hint: 'קודם כתבו את כל האיברים של `minutes`, אחד-אחד. איזה ערך נמצא במיקום האחרון?',
    explanation: [
      {
        text: '`seq(3, 20, by = 5)` מתחיל ב-3 ומוסיף 5 בכל צעד. אחרי `18` הצעד הבא הוא `23`, שעובר את 20, ולכן R עוצר ב-`18`:',
        vector: { values: ['3', '8', '13', '18'], marks: ['', '', '', ''], showIndex: true }
      },
      {
        text: '`length(minutes)` הוא `4`, ולכן `minutes[length(minutes)]` הוא `minutes[4]`, כלומר `18`. ו-`minutes[1]` הוא `3`:',
        vector: { values: ['3', '8', '13', '18'], marks: ['on', 'off', 'off', 'on'], labels: ['minutes[1]', '', '', 'minutes[4]'], showIndex: true }
      },
      {
        text: 'ולבסוף R מחשב `18 - 3`:',
        output: '[1] 15'
      }
    ],
    whyWrong: {
      1: '`17` יוצא אם חושבים שהאיבר האחרון הוא `20`. אבל `seq()` לא תמיד מגיע בדיוק לגבול: מ-`18` הצעד הבא הוא `23`, שכבר גדול מ-20, ולכן הווקטור נגמר ב-`18`.',
      2: 'זה מה ש-`length(minutes) - minutes[1]` מדפיס (`4 - 3`). אבל `minutes[length(minutes)]` לא מחזיר את האורך: הוא משתמש באורך כ**מיקום** ושולף את הערך שבו, `18`.',
      3: '`20` יוצא אם חושבים שהאיבר האחרון הוא `23`. אבל `seq()` לא עובר את הגבול: הוא עוצר באיבר האחרון שלא גדול מ-20, כלומר `18`.'
    }
  },

  // ===== שבוע 3: שמות, סינון ו-NA =====
  // ---------- level 1 ----------
  {
    id: 'names-na-second-name',
    station: 'names-na',
    level: 1,
    context: 'המלאי במחסן של המעבדה:',
    code: 'stock <- c(gloves = 40, masks = 25, tubes = 60)\nnames(stock)[2]',
    options: ['25', '"masks"', '"tubes"', 'masks 25'],
    answer: 1,
    hint: 'קודם חשבו מה `names(stock)` מחזיר לבדו, ורק אחר כך מה `[2]` שולף ממנו.',
    explanation: [
      {
        text: 'ב-`stock` יש 3 איברים, ולכל איבר יש שם:',
        vector: { values: ['40', '25', '60'], marks: ['', '', ''], labels: ['gloves', 'masks', 'tubes'], showIndex: true }
      },
      {
        text: '`names(stock)` מחזיר וקטור של טקסט עם השמות בלבד, בלי המספרים. `[2]` שולף ממנו את המיקום השני:',
        vector: { values: ['"gloves"', '"masks"', '"tubes"'], marks: ['off', 'on', 'off'], showIndex: true }
      },
      {
        text: 'השם מודפס כטקסט, עם מירכאות:',
        output: '[1] "masks"'
      }
    ],
    whyWrong: {
      0: '`25` הוא ה**ערך** שבמיקום 2. אבל `names(stock)` מחזיר רק את השמות, ולכן `[2]` שולף את השם השני ולא את המספר.',
      2: 'ב-R ספירת המיקומים מתחילה מ-1, ולכן מיקום 2 הוא `"masks"`. `"tubes"` נמצא במיקום 3.',
      3: 'זה מה ש-`stock[2]` מדפיס: האיבר השני יחד עם השם שלו (R מדפיס את השם מעל המספר). כאן `stock` נמצא בתוך `names()`, ולכן מקבלים רק את השם, כטקסט במירכאות.'
    }
  },

  {
    id: 'names-na-count-missing',
    station: 'names-na',
    level: 1,
    context: 'מדדנו דופק ל-6 מטופלים. `NA` מסמן מדידה חסרה:',
    code: 'pulse <- c(72, NA, 80, 65, NA, NA)\nsum(is.na(pulse))',
    options: ['NA', 'FALSE TRUE FALSE FALSE TRUE TRUE', '217', '3'],
    answer: 3,
    hint: 'מה `is.na()` מחזיר לכל איבר? ואיך `sum()` מחבר ערכים כאלה?',
    explanation: [
      {
        text: '`is.na(pulse)` בודק כל איבר: `TRUE` אם הוא `NA`, ו-`FALSE` אם יש בו מספר:',
        vector: {
          values: ['72', 'NA', '80', '65', 'NA', 'NA'],
          marks: ['off', 'on', 'off', 'off', 'on', 'on'],
          labels: ['FALSE', 'TRUE', 'FALSE', 'FALSE', 'TRUE', 'TRUE']
        }
      },
      {
        text: '`sum()` סופר כל `TRUE` כ-1 וכל `FALSE` כ-0: `0 + 1 + 0 + 0 + 1 + 1`. כך מקבלים את מספר ה-`NA` בווקטור:',
        output: '[1] 3'
      }
    ],
    whyWrong: {
      0: '`NA` הוא מה ש-`sum(pulse)` מדפיס: כשיש `NA` בין המספרים, גם הסכום שלהם הוא `NA`. אבל כאן `sum()` מחבר את התוצאה של `is.na()`, ובה יש רק `TRUE` ו-`FALSE`, בלי אף `NA`.',
      1: 'זה מה ש-`is.na(pulse)` מדפיס לבד. כאן הוא נמצא בתוך `sum()`, שסופר את ה-`TRUE` ומחזיר מספר אחד.',
      2: '`217` הוא סכום הדופקים שנמדדו, כלומר `sum(pulse, na.rm = TRUE)`. אבל כאן לא מחברים את הדופקים עצמם: מחברים את ה-`TRUE` וה-`FALSE` ש-`is.na()` מחזיר, כלומר סופרים כמה מדידות חסרות.'
    }
  },

  {
    id: 'names-na-which-positions',
    station: 'names-na',
    level: 1,
    context: 'ציונים של 5 סטודנטים בבוחן:',
    code: 'scores <- c(55, 80, 92, 47, 80)\nwhich(scores == 80)',
    options: ['2 5', '80 80', 'FALSE TRUE FALSE FALSE TRUE', '2'],
    answer: 0,
    hint: 'קודם כתבו מה `scores == 80` מחזיר לכל ציון. ואז: מה `which()` עושה עם ה-`TRUE` שבתוצאה?',
    explanation: [
      {
        text: '`scores == 80` בודק כל ציון ומחזיר `TRUE` או `FALSE`:',
        vector: {
          values: ['55', '80', '92', '47', '80'],
          marks: ['off', 'on', 'off', 'off', 'on'],
          labels: ['FALSE', 'TRUE', 'FALSE', 'FALSE', 'TRUE'],
          showIndex: true
        }
      },
      {
        text: '`which()` מחזיר את ה**מיקומים** שבהם יש `TRUE`. את כולם, ולא רק את הראשון: מיקום 2 ומיקום 5.',
        output: '[1] 2 5'
      }
    ],
    whyWrong: {
      1: '`80 80` הוא מה ש-`scores[scores == 80]` מדפיס: הערכים עצמם. `which()` לא מחזיר ערכים, אלא את המיקומים שלהם בווקטור.',
      2: 'זה מה ש-`scores == 80` מדפיס לבד. `which()` עובר על הווקטור הזה ומחזיר רק את המיקומים שבהם יש `TRUE`.',
      3: '`which()` מחזיר את **כל** המיקומים שבהם התנאי נכון, ולא רק את הראשון. `80` מופיע פעמיים: במיקום 2 ובמיקום 5. (ו-`which()` גם לא סופר: את מספר ה-`TRUE` נותן `sum(scores == 80)`.)'
    }
  },

  // ---------- level 2 ----------
  {
    id: 'names-na-or-keeps-order',
    station: 'names-na',
    level: 2,
    context: 'גילים של אנשים שהגיעו לחיסון:',
    code: 'ages <- c(4, 15, 32, 70, 81, 9)\nages[ages < 12 | ages > 60]',
    options: ['numeric(0)', '15 32', '4 70 81 9', '4 9 70 81'],
    answer: 2,
    hint: 'בדקו כל גיל מול **שני** התנאים, משמאל לימין. מה `|` דורש כדי לתת `TRUE`?',
    explanation: [
      {
        text: 'לכל גיל R בודק את שני התנאים. `|` ("או") נותן `TRUE` אם **לפחות אחד** מהם נכון:',
        table: {
          columns: ['ages', 'ages < 12', 'ages > 60', '|'],
          rows: [
            ['4', 'TRUE', 'FALSE', 'TRUE'],
            ['15', 'FALSE', 'FALSE', 'FALSE'],
            ['32', 'FALSE', 'FALSE', 'FALSE'],
            ['70', 'FALSE', 'TRUE', 'TRUE'],
            ['81', 'FALSE', 'TRUE', 'TRUE'],
            ['9', 'TRUE', 'FALSE', 'TRUE']
          ],
          rowNames: ['1', '2', '3', '4', '5', '6'],
          highlightRows: [0, 3, 4, 5]
        }
      },
      {
        text: 'R שולף את הגילים שבמיקומים שבהם יש `TRUE`, **לפי הסדר שלהם בווקטור**:',
        vector: { values: ['4', '15', '32', '70', '81', '9'], marks: ['on', 'off', 'off', 'on', 'on', 'on'], showIndex: true }
      },
      {
        text: 'זה הפלט:',
        output: '[1]  4 70 81  9'
      }
    ],
    whyWrong: {
      0: '`numeric(0)` (וקטור ריק) הוא מה ש-`&` היה מדפיס: אין גיל שהוא גם קטן מ-12 וגם גדול מ-60. אבל `|` פירושו "או": מספיק שאחד התנאים נכון.',
      1: '`15 32` הם בדיוק הגילים ש**לא** עומדים באף אחד מהתנאים. R שולף את המיקומים שבהם יש `TRUE`, כלומר את כל השאר.',
      3: 'R לא מחזיר קודם את מי שעומד בתנאי הראשון ואחר כך את מי שעומד בשני. הוא עובר על הווקטור פעם אחת, משמאל לימין, ושומר על הסדר המקורי, ולכן `9` מופיע בסוף. (`4 9 70 81` הוא מה ש-`c(ages[ages < 12], ages[ages > 60])` מדפיס.)'
    }
  },

  {
    id: 'names-na-rev-names',
    station: 'names-na',
    level: 2,
    context: 'כמה דקות כל אחד חיכה בתור:',
    code: 'waiting <- c(Avi = 20, Hila = 35, Ron = 10)\nnames(rev(waiting))[1]',
    options: ['"Ron"', '"Avi"', '"Hila"', '10'],
    answer: 0,
    hint: 'כתבו את `rev(waiting)` במלואו, עם השמות. רק אחר כך הפעילו עליו את `names()`.',
    explanation: [
      {
        text: '`waiting` הוא וקטור עם שמות:',
        vector: { values: ['20', '35', '10'], marks: ['', '', ''], labels: ['Avi', 'Hila', 'Ron'], showIndex: true }
      },
      {
        text: '`rev()` הופך את סדר האיברים: האחרון הופך לראשון. כל שם צמוד לערך שלו, ולכן השמות זזים יחד עם המספרים:',
        vector: { values: ['10', '35', '20'], marks: ['on', '', ''], labels: ['Ron', 'Hila', 'Avi'], showIndex: true }
      },
      {
        text: '`names()` מחזיר את השמות לפי הסדר החדש, ו-`[1]` שולף את הראשון:',
        output: '[1] "Ron"'
      }
    ],
    whyWrong: {
      1: '`"Avi"` היה נכון אם `rev()` היה הופך רק את המספרים והשמות היו נשארים במקומם. אבל כל שם צמוד לערך שלו: `Ron` זז יחד עם `10` למיקום הראשון.',
      2: '`rev()` לא ממיין מהגדול לקטן: הוא רק הופך את הסדר. `Hila` הייתה ראשונה רק אם היינו ממיינים לפי זמן ההמתנה (`35` הוא הזמן הגדול ביותר).',
      3: '`10` הוא ה**ערך** הראשון אחרי ההיפוך (זה מה ש-`unname(rev(waiting))[1]` מדפיס). אבל `names()` מחזיר את השמות, ולא את המספרים.'
    }
  },

  {
    id: 'names-na-and-name-value',
    station: 'names-na',
    level: 2,
    context: 'מספר המבקרים במרפאה בכל יום:',
    code: 'visits <- c(sun = 12, mon = 30, tue = 8, wed = 25)\nsum(visits[names(visits) != "mon" & visits > 10])',
    options: ['67', '45', '75', '37'],
    answer: 3,
    hint: 'עברו יום-יום ובדקו את שני התנאים: אחד על השם ואחד על המספר. מה `&` דורש כדי שיום ייכנס לסכום?',
    explanation: [
      {
        text: 'לכל יום נבדקים שני תנאים: האם השם שלו שונה מ-`"mon"`, והאם הערך גדול מ-10. `&` ("וגם") נותן `TRUE` רק אם **שניהם** נכונים:',
        table: {
          columns: ['name', 'value', '!= "mon"', '> 10', '&'],
          rows: [
            ['sun', '12', 'TRUE', 'TRUE', 'TRUE'],
            ['mon', '30', 'FALSE', 'TRUE', 'FALSE'],
            ['tue', '8', 'TRUE', 'FALSE', 'FALSE'],
            ['wed', '25', 'TRUE', 'TRUE', 'TRUE']
          ],
          highlightRows: [0, 3]
        }
      },
      {
        text: 'בתוך `[ ]` נשארים רק `sun` ו-`wed`:',
        vector: { values: ['12', '30', '8', '25'], marks: ['on', 'off', 'off', 'on'], labels: ['sun', 'mon', 'tue', 'wed'] }
      },
      {
        text: '`sum()` מחבר אותם: `12 + 25`',
        output: '[1] 37'
      }
    ],
    whyWrong: {
      0: '`67` הוא מה ש-`sum(visits[visits > 10])` מדפיס, כלומר בלי התנאי על השם. אבל `&` דורש ששני התנאים יתקיימו, ולכן `mon` לא נכנס לסכום, למרות ש-30 גדול מ-10.',
      1: '`45` הוא מה ש-`sum(visits[names(visits) != "mon"])` מדפיס, כלומר בלי התנאי `visits > 10`. בגלל `&` גם `tue` נשאר בחוץ, כי 8 לא גדול מ-10.',
      2: '`75` הוא סכום כל הימים. זה מה שהיה יוצא עם `|` ("או"), כי כל יום עומד לפחות באחד התנאים. אבל `&` ("וגם") דורש ששניהם יתקיימו.'
    }
  },

  // ---------- level 3 ----------
  {
    id: 'names-na-not-keeps-na',
    station: 'names-na',
    level: 3,
    context: 'ספרנו פריטים בחמישה מגשים. בשני מגשים הספירה חסרה:',
    code: 'counts <- c(8, NA, 3, 12, NA)\ncounts[!(counts > 5)]',
    options: ['3', 'NA 3 NA', '8 NA 12 NA', 'FALSE NA TRUE FALSE NA'],
    answer: 1,
    hint: 'האם R יכול לדעת אם `NA` גדול מ-5? ומה קורה כשמפעילים `!` על התשובה שלו?',
    explanation: [
      {
        text: '`counts > 5` בודק כל איבר. על `NA` אי אפשר לדעת אם הוא גדול מ-5, ולכן גם התשובה שם היא `NA`:',
        vector: {
          values: ['8', 'NA', '3', '12', 'NA'],
          marks: ['', '', '', '', ''],
          labels: ['TRUE', 'NA', 'FALSE', 'TRUE', 'NA'],
          showIndex: true
        }
      },
      {
        text: '`!` הופך `TRUE` ל-`FALSE` ו-`FALSE` ל-`TRUE`, אבל `NA` נשאר `NA`:',
        vector: {
          values: ['8', 'NA', '3', '12', 'NA'],
          marks: ['off', 'on', 'on', 'off', 'on'],
          labels: ['FALSE', 'NA', 'TRUE', 'FALSE', 'NA'],
          showIndex: true
        }
      },
      {
        text: 'בתוך `[ ]`, R מחזיר את הערך בכל מיקום שבו יש `TRUE`, ו-`NA` בכל מיקום שבו יש `NA`. לכן ה-`NA` נשארים בתוצאה:',
        output: '[1] NA  3 NA'
      }
    ],
    whyWrong: {
      0: 'ה-`NA` לא נעלמים מעצמם: `!(counts > 5)` נותן `NA` במיקומים 2 ו-5, ו-R מחזיר `NA` בכל מיקום כזה. כדי לקבל רק `3` צריך להוציא את ה-`NA` במפורש, למשל עם `counts[!(counts > 5) & !is.na(counts)]`.',
      2: 'זה מה ש-`counts[counts > 5]` מדפיס, כלומר בלי ה-`!`. `!` הופך את התנאי, ולכן נבחר המספר ש**לא** גדול מ-5, כלומר `3`. ה-`NA` נשארים בשני המקרים.',
      3: 'זה מה ש-`!(counts > 5)` מדפיס לבד. כשהוא בתוך `counts[ ]`, R לא מדפיס את ה-`TRUE` וה-`FALSE`, אלא שולף את הערכים מ-`counts`.'
    }
  },

  {
    id: 'names-na-diff-narm',
    station: 'names-na',
    level: 3,
    context: 'שקלנו 4 חולים לפני טיפול ואחריו. חלק מהמדידות חסרות:',
    code: 'before <- c(70, 82, NA, 65)\nafter <- c(68, NA, 74, 66)\nchange <- after - before\nsum(change, na.rm = TRUE)',
    options: ['NA', '-9', '-1', '-2 NA NA 1'],
    answer: 2,
    hint: 'קודם כתבו את `change` איבר-איבר. מה יוצא כשאחד משני המספרים בחיסור הוא `NA`?',
    explanation: [
      {
        text: 'החיסור נעשה איבר מול איבר. בכל מקום שבו אחד המספרים הוא `NA`, גם התוצאה היא `NA`:',
        vector: {
          values: ['-2', 'NA', 'NA', '1'],
          marks: ['on', 'off', 'off', 'on'],
          labels: ['68 - 70', 'NA - 82', '74 - NA', '66 - 65'],
          showIndex: true
        }
      },
      {
        text: '`na.rm = TRUE` אומר ל-`sum()` לדלג על ה-`NA`, ולכן מחברים רק את מה שנשאר: `-2 + 1`',
        output: '[1] -1'
      }
    ],
    whyWrong: {
      0: '`NA` הוא מה ש-`sum(change)` מדפיס, בלי `na.rm = TRUE`. כאן `na.rm = TRUE` מדלג על ה-`NA`, ולכן מקבלים מספר.',
      1: '`-9` יוצא אם מתייחסים ל-`NA` כאילו הוא `0` (למשל `74 - 0`, שזה `74`). זה גם מה ש-`sum(after, na.rm = TRUE) - sum(before, na.rm = TRUE)` מדפיס. אבל `NA` הוא ערך חסר ולא אפס: `74 - NA` הוא `NA`, ו-`na.rm = TRUE` מוציא אותו מהסכום.',
      3: 'זה הערך של `change`. השורה האחרונה מחברת אותו עם `sum()`, ולכן מודפס מספר אחד.'
    }
  },

  {
    id: 'names-na-replace-which',
    station: 'names-na',
    level: 3,
    context: 'מקומות פנויים בשלושה חדרים, לפי צבע החדר:',
    code: 'seats <- c(red = 3, blue = 0, green = 5)\nseats["blue"] <- seats["red"] + 2\nnames(seats)[which(seats == 5)]',
    options: ['"green"', '2 3', '"red" "green"', '"blue" "green"'],
    answer: 3,
    hint: 'עקבו אחרי `seats` שורה אחרי שורה, וכתבו איך הוא נראה אחרי שורה 2.',
    explanation: [
      {
        text: 'שורה 2: `seats["red"]` הוא `3`, ו-`3 + 2` הוא `5`. התוצאה נשמרת באיבר ששמו `blue`, כי הוא כתוב משמאל ל-`<-`:',
        vector: { values: ['3', '5', '5'], marks: ['', 'on', ''], labels: ['red', 'blue', 'green'], showIndex: true }
      },
      {
        text: 'שורה 3: `seats == 5` נכון עכשיו בשני מקומות, ו-`which()` מחזיר את שני המיקומים: `2` ו-`3`.',
        vector: { values: ['3', '5', '5'], marks: ['off', 'on', 'on'], labels: ['FALSE', 'TRUE', 'TRUE'], showIndex: true }
      },
      {
        text: '`names(seats)` הוא `"red" "blue" "green"`, ו-R שולף ממנו את השמות שבמיקומים 2 ו-3:',
        output: '[1] "blue"  "green"'
      }
    ],
    whyWrong: {
      0: '`"green"` הוא מה שהיה יוצא בלי שורה 2. אבל שורה 2 שינתה את `blue` ל-`5`, ולכן גם הוא עונה על התנאי `seats == 5`.',
      1: '`2 3` הם המיקומים ש-`which()` מחזיר. אבל הם נמצאים בתוך `names(seats)[ ]`, ולכן R שולף את **השמות** שבמיקומים האלה.',
      2: '`seats["red"] + 2` רק **קורא** את הערך של `red` ומוסיף לו 2. התוצאה נשמרת במה שכתוב משמאל ל-`<-`, כלומר ב-`blue`, ו-`red` נשאר `3`.'
    }
  },

  // ===== שבוע 4: מטריצות וטבלאות =====
  // ---------- level 1 ----------
  {
    id: 'tables-colnames',
    station: 'tables',
    level: 1,
    context: 'שלוש חיות מחמד הגיעו היום למרפאה:',
    code: 'pets <- data.frame(\n  name = c("Rex", "Luna", "Tom"),\n  age = c(3, 7, 2)\n)\ncolnames(pets)',
    options: ['"Rex" "Luna" "Tom"', '"name" "age"', '"1" "2" "3"', '2'],
    answer: 1,
    hint: 'ציירו את הטבלה על דף: מה כתוב בשורה העליונה, מה כתוב בצד, ומה יש בתוך התאים?',
    explanation: [
      {
        text: '`data.frame()` בונה טבלה: כל וקטור הופך לעמודה, והשם שכתוב לפניו (`name`, `age`) הופך לשם של העמודה. השורות מקבלות מספרים באופן אוטומטי:',
        table: {
          columns: ['name', 'age'],
          rows: [['Rex', '3'], ['Luna', '7'], ['Tom', '2']],
          rowNames: ['1', '2', '3']
        }
      },
      {
        text: '`colnames()` מחזיר רק את **שמות העמודות**, כווקטור של טקסט (ולכן עם מירכאות):',
        output: '[1] "name" "age"'
      }
    ],
    whyWrong: {
      0: '`"Rex" "Luna" "Tom"` הם הערכים שבתוך העמודה `name`, כלומר מה ש-`pets$name` מדפיס. `colnames()` לא מחזיר את מה שיש בתוך העמודות, אלא את השמות שלהן.',
      2: '`"1" "2" "3"` הם שמות **השורות**, כלומר מה ש-`rownames(pets)` מדפיס. `col` ב-`colnames` הוא קיצור של column, עמודה.',
      3: '`2` הוא **מספר** העמודות, כלומר מה ש-`ncol(pets)` מדפיס. `colnames()` לא סופר את העמודות, אלא מחזיר את השמות שלהן.'
    }
  },

  {
    id: 'tables-cell-index',
    station: 'tables',
    level: 1,
    context: 'גובה הצמחים בגינה (בס"מ), וכמה פעמים בשבוע משקים אותם:',
    code: 'plants <- data.frame(\n  name = c("mint", "basil", "sage", "thyme"),\n  height = c(12, 30, 25, 18),\n  water = c(4, 7, 5, 6)\n)\nplants[3, 2]',
    options: ['7', '30', '5', '25'],
    answer: 3,
    hint: 'בתוך `[ , ]` יש שני מספרים. איזה מהם בוחר שורה ואיזה בוחר עמודה? ומאיפה מתחילים לספור?',
    explanation: [
      {
        text: 'ב-`[3, 2]` המספר **הראשון** הוא השורה. שורת הכותרות לא נספרת, ולכן שורה 3 היא השורה של `sage`:',
        table: {
          columns: ['name', 'height', 'water'],
          rows: [['mint', '12', '4'], ['basil', '30', '7'], ['sage', '25', '5'], ['thyme', '18', '6']],
          rowNames: ['1', '2', '3', '4'],
          highlightRows: [2]
        }
      },
      {
        text: 'המספר **השני** הוא העמודה. גם `name` היא עמודה, והיא הראשונה, ולכן העמודה השנייה היא `height`. בשורה 3 שלה יש `25`:',
        output: '[1] 25'
      }
    ],
    whyWrong: {
      0: '`7` הוא מה ש-`plants[2, 3]` מדפיס: שורה 2, עמודה 3. הסדר בתוך הסוגריים קבוע: קודם שורה, ואחר כך עמודה.',
      1: '`30` יוצא אם סופרים את שורת הכותרות (`name height water`) כשורה 1, כמו באקסל. ב-R הכותרות לא נספרות: שורה 1 היא `mint`, ולכן שורה 3 היא `sage`. (`30` הוא מה ש-`plants[2, 2]` מדפיס.)',
      2: '`5` יוצא אם לא סופרים את `name` כעמודה. אבל גם `name` היא עמודה בטבלה, והיא הראשונה, ולכן העמודה השנייה היא `height`. (`5` הוא מה ש-`plants[3, 3]` מדפיס.)'
    }
  },

  {
    id: 'tables-cbind-nrow',
    station: 'tables',
    level: 1,
    context: 'מכירות בקפיטריה בשני שבועות:',
    code: 'week1 <- c(4, 7, 2)\nweek2 <- c(5, 1, 8)\nsales <- cbind(week1, week2)\nnrow(sales)',
    options: ['3', '2', '6', '3 2'],
    answer: 0,
    hint: 'ציירו את `sales` על דף: האם כל וקטור נכנס אליה כשורה או כעמודה?',
    explanation: [
      {
        text: '`cbind()` מחבר וקטורים **כעמודות** (c הוא קיצור של column). כל וקטור הופך לעמודה, והשם שלו הופך לשם העמודה:',
        table: {
          columns: ['week1', 'week2'],
          rows: [['4', '5'], ['7', '1'], ['2', '8']],
          rowNames: ['[1,]', '[2,]', '[3,]']
        }
      },
      {
        text: 'בכל עמודה יש 3 מספרים, ולכן ב-`sales` יש 3 שורות ו-2 עמודות. `nrow()` מחזיר את מספר השורות:',
        output: '[1] 3'
      }
    ],
    whyWrong: {
      1: '`2` הוא מספר העמודות (`ncol(sales)`). הוא היה מספר השורות אילו השתמשנו ב-`rbind()`, שמחבר וקטורים כשורות. אבל `cbind()` מחבר אותם כעמודות, ולכן יש 2 עמודות ו-3 שורות.',
      2: '`6` הוא מספר כל הערכים במטריצה, כלומר מה ש-`length(sales)` מדפיס. `nrow()` סופר רק את השורות.',
      3: '`3 2` הוא מה ש-`dim(sales)` מדפיס: מספר השורות ומספר העמודות יחד. `nrow()` מחזיר רק מספר אחד, את מספר השורות.'
    }
  },

  // ---------- level 2 ----------
  {
    id: 'tables-byrow-column',
    station: 'tables',
    level: 2,
    context: 'כמה מבחנות יש בכל תא במקרר. יש 2 מדפים, ובכל מדף 3 תאים:',
    code: 'fridge <- matrix(c(5, 2, 7, 4, 9, 1), nrow = 2, byrow = TRUE)\nfridge[, 3]',
    options: ['9 1', '7', '7 1', 'שגיאה (Error), כי במטריצה יש רק 2 שורות'],
    answer: 2,
    hint: 'מה משנה `byrow = TRUE` בסדר שבו המספרים נכנסים למטריצה? ומה אומר המקום הריק לפני הפסיק?',
    explanation: [
      {
        text: 'בלי `byrow`, R ממלא מטריצה עמודה אחרי עמודה. `byrow = TRUE` משנה את זה: R ממלא **שורה אחרי שורה**. 3 המספרים הראשונים נכנסים לשורה 1, ו-3 הבאים לשורה 2:',
        table: {
          columns: ['[,1]', '[,2]', '[,3]'],
          rows: [['5', '2', '7'], ['4', '9', '1']],
          rowNames: ['[1,]', '[2,]']
        }
      },
      {
        text: 'ב-`[, 3]` המקום שלפני הפסיק ריק, וזה אומר "כל השורות". אחרי הפסיק כתוב `3`, כלומר עמודה 3. מכל שורה R לוקח את המספר שבעמודה השלישית:',
        vector: { values: ['7', '1'], marks: ['on', 'on'], labels: ['שורה 1', 'שורה 2'] }
      },
      {
        text: 'זה הפלט:',
        output: '[1] 7 1'
      }
    ],
    whyWrong: {
      0: '`9 1` היא העמודה השלישית אם ממלאים את המטריצה עמודה אחרי עמודה, כמו ש-`matrix(c(5, 2, 7, 4, 9, 1), nrow = 2)` עושה. אבל כאן כתוב `byrow = TRUE`, ולכן R ממלא שורה אחרי שורה.',
      1: '`7` הוא מה ש-`fridge[1, 3]` מדפיס: רק שורה 1. כשהמקום שלפני הפסיק ריק, R לוקח את **כל** השורות, ולכן מקבלים את שני המספרים שבעמודה 3.',
      3: 'המספר `3` בא **אחרי** הפסיק, ולכן הוא מספר של עמודה ולא של שורה. במטריצה יש 3 עמודות, כך שאין שגיאה. (שגיאה הייתה מגיעה מ-`fridge[3, ]`, כי אין שורה 3.)'
    }
  },

  {
    id: 'tables-filter-names',
    station: 'tables',
    level: 2,
    context: 'משקל הכלבים בפנסיון, בק"ג:',
    code: 'dogs <- data.frame(\n  name = c("Max", "Bella", "Rocky", "Daisy"),\n  weight = c(12, 30, 8, 25)\n)\ndogs[dogs$weight > 20, "name"]',
    options: ['"Bella" "Daisy"', 'FALSE TRUE FALSE TRUE', '30 25', '2 4'],
    answer: 0,
    hint: 'בתוך `[ , ]` יש שני חלקים: מה שלפני הפסיק בוחר שורות, ומה שאחריו בוחר עמודות. מה בוחר כל חלק כאן?',
    explanation: [
      {
        text: '`dogs$weight > 20` בודק כל משקל ומחזיר `TRUE` או `FALSE`, אחד לכל שורה:',
        vector: { values: ['12', '30', '8', '25'], marks: ['off', 'on', 'off', 'on'], labels: ['FALSE', 'TRUE', 'FALSE', 'TRUE'] }
      },
      {
        text: 'הווקטור הזה נמצא **לפני** הפסיק, ולכן הוא בוחר שורות: נשארות רק השורות שבהן יש `TRUE`:',
        table: {
          columns: ['name', 'weight'],
          rows: [['Max', '12'], ['Bella', '30'], ['Rocky', '8'], ['Daisy', '25']],
          rowNames: ['1', '2', '3', '4'],
          highlightRows: [1, 3]
        }
      },
      {
        text: 'אחרי הפסיק כתוב `"name"`, ולכן מהשורות האלה R מחזיר רק את עמודת השמות:',
        output: '[1] "Bella" "Daisy"'
      }
    ],
    whyWrong: {
      1: 'זה מה ש-`dogs$weight > 20` לבד מדפיס. כאן התנאי נמצא בתוך `[ , ]` לפני הפסיק, ושם הוא רק **בוחר** שורות: R מחזיר את הערכים מהשורות שבהן יש `TRUE`, ולא את `TRUE` ו-`FALSE` עצמם.',
      2: 'אלה המשקלים של הכלבים שנבחרו, כלומר מה ש-`dogs[dogs$weight > 20, "weight"]` מדפיס. אבל אחרי הפסיק כתוב `"name"`, ולכן R מחזיר את השמות.',
      3: '`2 4` הם **מספרי השורות** שבהן יש `TRUE`, כלומר מה ש-`which(dogs$weight > 20)` מדפיס. אבל `[ , ]` לא מחזיר מיקומים: הוא מחזיר את הערכים שבשורות האלה.'
    }
  },

  {
    id: 'tables-complete-cases',
    station: 'tables',
    level: 2,
    context: 'כמה מבוגרים וכמה ילדים ביקרו בספרייה בכל יום. איפה ששכחו לספור, כתוב `NA`:',
    code: 'visits <- data.frame(\n  day = c("Sun", "Mon", "Tue", "Wed"),\n  adults = c(12, NA, 9, 15),\n  kids = c(4, 6, NA, 3)\n)\ncomplete.cases(visits)',
    options: ['FALSE TRUE TRUE FALSE', '"Sun" "Wed"', '2', 'TRUE FALSE FALSE TRUE'],
    answer: 3,
    hint: '`complete.cases()` עובר על הטבלה שורה אחרי שורה. מתי שורה נחשבת "שלמה"?',
    explanation: [
      {
        text: '`complete.cases()` בודק כל שורה. שורה "שלמה" היא שורה שאין בה אף `NA`, באף עמודה. ביום שני חסר מספר המבוגרים, וביום שלישי חסר מספר הילדים:',
        table: {
          columns: ['day', 'adults', 'kids'],
          rows: [['Sun', '12', '4'], ['Mon', 'NA', '6'], ['Tue', '9', 'NA'], ['Wed', '15', '3']],
          rowNames: ['1', '2', '3', '4'],
          highlightRows: [0, 3]
        }
      },
      {
        text: 'הפונקציה לא מוחקת שורות ולא סופרת אותן. היא מחזירה תשובה לכל שורה: `TRUE` לשורה שלמה, ו-`FALSE` לשורה שיש בה `NA`:',
        output: '[1]  TRUE FALSE FALSE  TRUE'
      }
    ],
    whyWrong: {
      0: 'זה הפוך: `complete.cases()` מחזיר `TRUE` לשורות **השלמות**, אלה שאין בהן `NA`. (`FALSE TRUE TRUE FALSE` הוא מה ש-`!complete.cases(visits)` מדפיס.)',
      1: '`complete.cases()` לא שולף את השורות השלמות (את זה עושה `na.omit()`), אלא מחזיר `TRUE` או `FALSE` לכל שורה. `"Sun" "Wed"` הוא מה ש-`visits$day[complete.cases(visits)]` מדפיס.',
      2: '`2` הוא **מספר** השורות השלמות, כלומר מה ש-`sum(complete.cases(visits))` מדפיס. בלי `sum()`, R מחזיר `TRUE` או `FALSE` לכל אחת מ-4 השורות.'
    }
  },

  // ---------- level 3 ----------
  {
    id: 'tables-matrix-by-column',
    station: 'tables',
    level: 3,
    context: 'רשמנו בטבלה כמה כוסות מים שתו ילדים בקייטנה:',
    code: 'cups <- matrix(c(3, 8, 1, 6, 4, 9), ncol = 2)\ncups[2, ]',
    options: ['1 6', '8 4', '8 6 9', '6 4 9'],
    answer: 1,
    hint: 'קודם בדקו כמה שורות וכמה עמודות יש במטריצה. אחר כך מלאו אותה במספרים, בסדר ש-R ממלא כשלא כתוב `byrow`.',
    explanation: [
      {
        text: '`ncol = 2` קובע 2 **עמודות**. יש 6 מספרים, ולכן יש 3 שורות. בלי `byrow = TRUE`, R ממלא **עמודה אחרי עמודה**: 3 המספרים הראשונים נכנסים לעמודה 1 (מלמעלה למטה), ו-3 הבאים לעמודה 2:',
        table: {
          columns: ['[,1]', '[,2]'],
          rows: [['3', '6'], ['8', '4'], ['1', '9']],
          rowNames: ['[1,]', '[2,]', '[3,]'],
          highlightRows: [1]
        }
      },
      {
        text: 'ב-`[2, ]` המספר שלפני הפסיק הוא השורה, והמקום הריק אחרי הפסיק אומר "כל העמודות". לכן R מחזיר את כל שורה 2:',
        output: '[1] 8 4'
      }
    ],
    whyWrong: {
      0: '`1 6` היא שורה 2 אם ממלאים את המטריצה שורה אחרי שורה, כמו ש-`matrix(c(3, 8, 1, 6, 4, 9), ncol = 2, byrow = TRUE)` עושה. בלי `byrow = TRUE`, R ממלא עמודה אחרי עמודה, ולכן `3`, `8` ו-`1` נכנסים כולם לעמודה הראשונה.',
      2: '`8 6 9` יוצא אם קוראים את `ncol = 2` כאילו כתוב `nrow = 2`, כלומר 2 שורות ו-3 עמודות (זה מה ש-`matrix(c(3, 8, 1, 6, 4, 9), nrow = 2)[2, ]` מדפיס). אבל `ncol` קובע את מספר ה**עמודות**, ולכן יש 2 עמודות ו-3 שורות.',
      3: '`6 4 9` היא העמודה השנייה, כלומר מה ש-`cups[, 2]` מדפיס. ב-`[2, ]` המספר `2` בא **לפני** הפסיק, ולכן הוא מספר של שורה.'
    }
  },

  {
    id: 'tables-na-omit-position',
    station: 'tables',
    level: 3,
    context: 'יומן ריצה: כמה ק"מ רצנו וכמה דקות זה לקח. חלק מהמדידות חסרות:',
    code: 'runs <- data.frame(\n  km = c(5, NA, 3, 10),\n  minutes = c(30, 45, NA, 55)\n)\nclean <- na.omit(runs)\nclean[2, "km"]',
    options: ['3', 'NA', '10', 'שגיאה (Error), כי שורה 2 נמחקה'],
    answer: 2,
    hint: 'כתבו איך נראית `clean` אחרי `na.omit()`: אילו שורות נשארו בה, ואיך R ממספר אותן?',
    explanation: [
      {
        text: '`na.omit()` מוחק כל שורה שיש בה `NA`, גם אם ה-`NA` נמצא רק באחת העמודות. לכן נמחקות גם שורה 2 (חסר `km`) וגם שורה 3 (חסר `minutes`):',
        table: {
          columns: ['km', 'minutes'],
          rows: [['5', '30'], ['NA', '45'], ['3', 'NA'], ['10', '55']],
          rowNames: ['1', '2', '3', '4'],
          highlightRows: [0, 3]
        }
      },
      {
        text: 'ב-`clean` נשארו 2 שורות. R שומר את **השמות** המקוריים שלהן, `1` ו-`4`, ולכן כך הוא מדפיס את `clean`:',
        table: {
          columns: ['km', 'minutes'],
          rows: [['5', '30'], ['10', '55']],
          rowNames: ['1', '4'],
          highlightRows: [1]
        }
      },
      {
        text: 'אבל מספר בלי מירכאות בתוך `[ , ]` הוא **מיקום**, ולא שם של שורה. `[2, "km"]` לוקח את השורה **השנייה** ב-`clean` (זו ששמה `4`), מהעמודה `km`:',
        output: '[1] 10'
      }
    ],
    whyWrong: {
      0: '`3` יוצא אם חושבים ש-`na.omit()` מוחק רק את התא שבו יש `NA`, ואז בעמודה `km` נשאר `5 3 10`. אבל `na.omit()` מוחק **שורות שלמות**: גם שורה 3 נמחקה, כי חסר בה `minutes`.',
      1: '`NA` הוא מה ש-`runs[2, "km"]` מדפיס: השורה השנייה בטבלה **המקורית**. אבל `clean` היא טבלה אחרת, ושורה 2 של `runs` כבר לא נמצאת בה. השורה השנייה ב-`clean` היא השורה ששמה `4`.',
      3: 'נכון ששורה 2 נמחקה, אבל `[2, ]` לא מחפש שורה ש**שמה** 2. מספר בתוך `[ , ]` הוא מיקום, ולכן R לוקח את השורה השנייה שנשארה ב-`clean`, בלי שגיאה.'
    }
  },

  {
    id: 'tables-rbind-text',
    station: 'tables',
    level: 3,
    context: 'טבלת השערים של שחקני הקבוצה. מוסיפים שחקן חדש:',
    code: 'team <- data.frame(\n  name = c("Lior", "Gal"),\n  goals = c(3, 5)\n)\nteam <- rbind(team, c("Ido", 4))\nclass(team$goals)',
    options: ['"character"', '"numeric"', '"data.frame"', 'שגיאה (Error), כי בשורה החדשה יש גם טקסט וגם מספר'],
    answer: 0,
    hint: 'לפני ש-`rbind()` מוסיף את השורה, R בונה את הווקטור `c("Ido", 4)`. מאיזה סוג יהיו האיברים בווקטור הזה?',
    explanation: [
      {
        text: 'קודם R בונה את הווקטור `c("Ido", 4)`. בווקטור כל האיברים מאותו סוג, ולכן `4` הופך לטקסט, `"4"`:',
        vector: { values: ['"Ido"', '"4"'], marks: ['', 'on'], labels: ['character', 'character'] }
      },
      {
        text: '`rbind()` מוסיף את הווקטור כשורה חדשה: `"Ido"` נכנס לעמודה `name`, ו-`"4"` לעמודה `goals`. גם בעמודה של טבלה כל הערכים מאותו סוג, ולכן `3` ו-`5` הופכים גם הם לטקסט:',
        table: {
          columns: ['name', 'goals'],
          rows: [['Lior', '"3"'], ['Gal', '"5"'], ['Ido', '"4"']],
          rowNames: ['1', '2', '3'],
          highlightRows: [2]
        }
      },
      {
        text: 'שימו לב: כש-R מדפיס טבלה הוא לא מראה מירכאות, ולכן `goals` **נראית** כמו עמודה של מספרים. אבל `class()` מגלה את הסוג האמיתי:',
        output: '[1] "character"'
      }
    ],
    whyWrong: {
      1: '`"numeric"` הוא מה ש-`class(team$goals)` היה מדפיס **לפני** `rbind()`. אבל `c("Ido", 4)` הפך את `4` לטקסט, וכשהוא נכנס לעמודה `goals`, כל העמודה הפכה לטקסט. כדי להחזיר אותה למספרים צריך `as.numeric()`.',
      2: '`"data.frame"` הוא מה ש-`class(team)` מדפיס: הסוג של הטבלה כולה. אבל `team$goals` היא עמודה אחת, ו-`class()` מחזיר את הסוג של הערכים שבה.',
      3: 'R לא עוצר בשגיאה כשמערבבים טקסט ומספרים: הוא הופך את המספרים לטקסט וממשיך. לכן `rbind()` מוסיף את השורה בלי בעיה, והעמודה `goals` הופכת לטקסט.'
    }
  },

  // ===== שבוע 5: apply ו-paste =====
  // ---------- level 1 ----------
  {
    id: 'apply-paste-sep',
    station: 'apply',
    level: 1,
    context: 'מדפיסים תווית למבחנה:',
    code: 'paste("sample", 7, "B", sep = "_")',
    options: ['"sample 7 B"', '"sample_7_B"', '"sample7B"', '"sample" "7" "B"'],
    answer: 1,
    hint: 'כמה טקסטים יוצאים מ-`paste()` כאן? ומה `sep` קובע?',
    explanation: [
      {
        text: '`paste()` מקבל 3 חלקים ומחבר אותם לטקסט **אחד**. את המספר `7` הוא הופך לטקסט בעצמו:',
        vector: { values: ['"sample"', '7', '"B"'], marks: ['', '', ''] }
      },
      {
        text: '`sep = "_"` קובע מה יבוא **בין** החלקים. בלי `sep` היה בא רווח, וכאן בא קו תחתון:',
        output: '[1] "sample_7_B"'
      }
    ],
    whyWrong: {
      0: 'זה מה ש-`paste("sample", 7, "B")` מדפיס, בלי `sep`. רווח הוא רק ברירת המחדל: כשכותבים `sep = "_"`, R שם קו תחתון במקום הרווח.',
      2: 'זה מה ש-`sep = ""` היה נותן, כלומר שום דבר בין החלקים. כאן `sep = "_"`, ולכן יש קו תחתון בין כל שני חלקים.',
      3: 'שלושה טקסטים נפרדים הם מה ש-`c("sample", 7, "B")` נותן. `paste()` **מדביק** את החלקים לטקסט אחד, ולכן בפלט יש רק זוג מירכאות אחד.'
    }
  },

  {
    id: 'apply-row-sum',
    station: 'apply',
    level: 1,
    context: 'כמה כוסות תה וקפה שתו שלושה אנשים ביום אחד:',
    code: 'drinks <- data.frame(\n  tea = c(3, 5, 2),\n  coffee = c(4, 1, 6)\n)\napply(drinks, 1, sum)',
    options: ['10 11', '21', '7 6 8', '10'],
    answer: 2,
    hint: 'ב-`apply()` המספר האמצעי קובע איך עוברים על הטבלה. מה פירוש `1`, ומה פירוש `2`?',
    explanation: [
      {
        text: 'כך נראית הטבלה. כל שורה היא אדם אחד:',
        table: {
          columns: ['tea', 'coffee'],
          rows: [['3', '4'], ['5', '1'], ['2', '6']],
          rowNames: ['1', '2', '3']
        }
      },
      {
        text: 'ב-`apply()` המספר `1` אומר "עבור על **השורות**" (`2` היה אומר "על העמודות"). על כל שורה R מפעיל את `sum()`:',
        vector: { values: ['7', '6', '8'], marks: ['on', 'on', 'on'], labels: ['3 + 4', '5 + 1', '2 + 6'] }
      },
      {
        text: 'יוצא סכום אחד לכל אדם:',
        output: '[1] 7 6 8'
      }
    ],
    whyWrong: {
      0: 'אלה הסכומים של **העמודות** (`3 + 5 + 2` ו-`4 + 1 + 6`), כלומר מה ש-`apply(drinks, 2, sum)` מחשב. ב-`apply()` הספרה `1` פירושה שורות ו-`2` פירושה עמודות.',
      1: 'זה הסכום של כל המספרים בטבלה, כלומר מה ש-`sum(drinks)` מדפיס. `apply()` לא מחבר הכל יחד: הוא מפעיל את `sum()` על כל שורה בנפרד ומחזיר תוצאה לכל שורה.',
      3: '`10` הוא הסכום של העמודה הראשונה, כלומר מה ש-`sum(drinks[, 1])` מדפיס. ה-`1` ב-`apply()` הוא לא מספר של עמודה: הוא אומר "לפי שורות", ולכן R מחשב סכום לכל אחת מ-3 השורות.'
    }
  },

  {
    id: 'apply-lapply-column',
    station: 'apply',
    level: 1,
    context: 'כמה תפוחים ואגסים מכרנו בשלושה ימים:',
    code: 'sold <- data.frame(\n  apples = c(4, 6, 5),\n  pears = c(3, 9, 2)\n)\nres <- lapply(sold, max)\nres$pears',
    options: ['9', '6', '4 9 5', '3 9 2'],
    answer: 0,
    hint: 'על מה `lapply()` עובר: על השורות או על העמודות? ומה נשמר ב-`res`?',
    explanation: [
      {
        text: 'כך נראית הטבלה:',
        table: {
          columns: ['apples', 'pears'],
          rows: [['4', '3'], ['6', '9'], ['5', '2']],
          rowNames: ['1', '2', '3']
        }
      },
      {
        text: '`lapply()` עובר רק על **העמודות**, ומפעיל את `max()` על כל עמודה בנפרד. התוצאה היא רשימה (list) עם תוצאה אחת לכל עמודה, ולכל תוצאה יש את השם של העמודה שלה:',
        vector: { values: ['6', '9'], marks: ['', 'on'], labels: ['apples', 'pears'] }
      },
      {
        text: '`res$pears` שולף מהרשימה את התוצאה של העמודה `pears`:',
        output: '[1] 9'
      }
    ],
    whyWrong: {
      1: '`6` הוא המקסימום של העמודה `apples`, כלומר מה ש-`res$apples` מדפיס. `$pears` שולף את התוצאה של העמודה `pears`.',
      2: 'אלה המקסימום של כל **שורה**, כלומר מה ש-`apply(sold, 1, max)` מדפיס. `lapply()` עובר רק על עמודות, אף פעם לא על שורות.',
      3: 'זו העמודה `pears` עצמה, כלומר מה ש-`sold$pears` מדפיס. אבל `res` היא לא הטבלה: יש בה את התוצאה של `max()` על כל עמודה, ולכן ב-`res$pears` יש מספר אחד.'
    }
  },

  // ---------- level 2 ----------
  {
    id: 'apply-paste-collapse-pairs',
    station: 'apply',
    level: 2,
    context: 'כמה מיטות פנויות יש בכל חדר:',
    code: 'rooms <- c("A", "B", "C")\nbeds <- c(2, 4, 1)\npaste(rooms, beds, sep = ":", collapse = "; ")',
    options: ['"A:2" "B:4" "C:1"', '"A; 2:B; 4:C; 1"', '"A B C:2 4 1"', '"A:2; B:4; C:1"'],
    answer: 3,
    hint: 'כמה טקסטים יש אחרי ש-`paste()` מחבר את `rooms` עם `beds`? ומה `collapse` עושה איתם?',
    explanation: [
      {
        text: 'כש-`paste()` מקבל שני וקטורים, הוא מחבר אותם **איבר עם איבר**: הראשון עם הראשון, השני עם השני, וכך הלאה. `sep = ":"` הוא מה שבא בתוך כל זוג. יוצאים 3 טקסטים:',
        vector: { values: ['"A:2"', '"B:4"', '"C:1"'], marks: ['', '', ''], showIndex: true }
      },
      {
        text: '`collapse = "; "` מדביק את 3 הטקסטים לטקסט **אחד**, ושם `"; "` בין כל שניים:',
        output: '[1] "A:2; B:4; C:1"'
      }
    ],
    whyWrong: {
      0: 'זה מה ש-`paste(rooms, beds, sep = ":")` מדפיס, בלי `collapse`. כאן יש גם `collapse = "; "`, והוא מדביק את 3 הטקסטים לטקסט אחד.',
      1: 'כאן התפקידים של `sep` ושל `collapse` התחלפו: זה מה ש-`paste(rooms, beds, sep = "; ", collapse = ":")` מדפיס. `sep` בא **בתוך** כל זוג (בין `"A"` ל-`2`), ו-`collapse` בא **בין** הזוגות.',
      2: '`paste()` לא הופך קודם כל וקטור לטקסט אחד. הוא מחבר את הווקטורים איבר עם איבר: `"A"` עם `2`, `"B"` עם `4` ו-`"C"` עם `1`. (`"A B C:2 4 1"` יוצא מ-`paste(paste(rooms, collapse = " "), paste(beds, collapse = " "), sep = ":")`.)'
    }
  },

  {
    id: 'apply-row-mean-narm',
    station: 'apply',
    level: 2,
    context: 'הציונים של שלושה תלמידים בשלושה בחנים. שני תלמידים לא הגיעו לאחד הבחנים:',
    code: 'quiz <- data.frame(\n  q1 = c(80, NA, 70),\n  q2 = c(90, 60, NA),\n  q3 = c(70, 90, 100)\n)\napply(quiz, 1, mean, na.rm = TRUE)',
    options: ['80 75 85', '80 NA NA', '75 75 86.66667', '80 50 56.66667'],
    answer: 0,
    hint: 'על מה `1` עובר: על התלמידים או על הבחנים? ומה `na.rm = TRUE`, שכתוב אחרי `mean`, עושה לציון שחסר?',
    explanation: [
      {
        text: 'כך נראית הטבלה. כל שורה היא תלמיד:',
        table: {
          columns: ['q1', 'q2', 'q3'],
          rows: [['80', '90', '70'], ['NA', '60', '90'], ['70', 'NA', '100']],
          rowNames: ['1', '2', '3']
        }
      },
      {
        text: '`1` אומר "לפי שורות", ולכן R מחשב ממוצע לכל תלמיד. מה שכתוב אחרי `mean` (כאן `na.rm = TRUE`) עובר אל `mean()`, ולכן ה-`NA` לא נכנס לחישוב. בשורה עם `NA` מחלקים רק במספר הציונים שקיימים:',
        vector: { values: ['80', '75', '85'], marks: ['on', 'on', 'on'], labels: ['(80+90+70)/3', '(60+90)/2', '(70+100)/2'] }
      },
      {
        text: 'יוצא ממוצע אחד לכל תלמיד:',
        output: '[1] 80 75 85'
      }
    ],
    whyWrong: {
      1: 'זה מה ש-`apply(quiz, 1, mean)` מדפיס, **בלי** `na.rm = TRUE`: כל `NA` הופך את הממוצע של השורה שלו ל-`NA`. אבל כאן `na.rm = TRUE` עובר אל `mean()`, וה-`NA` פשוט לא נכנס לחישוב.',
      2: 'אלה הממוצעים של **העמודות**, כלומר של כל בוחן, וזה מה ש-`apply(quiz, 2, mean, na.rm = TRUE)` מחשב. `1` פירושו שורות, ולכן מקבלים ממוצע לכל תלמיד.',
      3: 'כך יוצא אם סופרים את ה-`NA` כ-0 ומחלקים ב-3: `(0 + 60 + 90) / 3 = 50`. אבל `na.rm = TRUE` **מוציא** את ה-`NA` מהחישוב, ולכן מחלקים רק ב-2: `(60 + 90) / 2 = 75`.'
    }
  },

  {
    id: 'apply-order-rows',
    station: 'apply',
    level: 2,
    context: 'זמני הריצה (בדקות) של ארבעה רצים:',
    prompt: 'אילו שמות יודפסו?',
    code: 'race <- data.frame(\n  runner = c("Tal", "Shir", "Ido", "Mor"),\n  minutes = c(42, 35, 51, 38)\n)\nfast <- race[order(race$minutes), ]\nfast$runner[1:2]',
    options: ['"Tal" "Shir"', '"Shir" "Mor"', '35 38', '"Ido" "Tal"'],
    answer: 1,
    hint: 'מה `order(race$minutes)` מחזיר? ואילו שורות יהיו ראשונות ב-`fast`?',
    explanation: [
      {
        text: '`order(race$minutes)` מחזיר את **המיקומים** של השורות, מהזמן הקטן לגדול: קודם שורה 2 (`35`), אחריה שורה 4 (`38`), שורה 1 (`42`) ושורה 3 (`51`):',
        vector: { values: ['2', '4', '1', '3'], marks: ['on', 'on', '', ''], labels: ['35', '38', '42', '51'] }
      },
      {
        text: 'כשהמיקומים האלה עומדים לפני הפסיק ב-`race[ , ]`, R מסדר לפיהם את **השורות**. כך נראית `fast`:',
        table: {
          columns: ['runner', 'minutes'],
          rows: [['Shir', '35'], ['Mor', '38'], ['Tal', '42'], ['Ido', '51']],
          rowNames: ['2', '4', '1', '3'],
          highlightRows: [0, 1]
        }
      },
      {
        text: '`fast$runner[1:2]` לוקח את שני השמות הראשונים בעמודה `runner` של `fast`, כלומר את שני הרצים המהירים:',
        output: '[1] "Shir" "Mor"'
      }
    ],
    whyWrong: {
      0: 'אלה שתי השורות הראשונות בטבלה **המקורית**, כלומר מה ש-`race$runner[1:2]` מדפיס. אבל כאן לוקחים מ-`fast`, ושם השורות כבר מסודרות לפי הזמן.',
      2: 'אלה שני הזמנים הקצרים ביותר, כלומר מה ש-`fast$minutes[1:2]` מדפיס. `$runner` שולף את עמודת השמות, לא את עמודת הזמנים.',
      3: 'אלה שני הרצים **האיטיים** ביותר, כלומר מה שהיה יוצא עם `order(race$minutes, decreasing = TRUE)`. בלי `decreasing = TRUE`, `order()` מסדר מהקטן לגדול, ולכן הזמן הקצר ביותר בא ראשון.'
    }
  },

  // ---------- level 3 ----------
  {
    id: 'apply-order-positions',
    station: 'apply',
    level: 3,
    context: 'כמה עמודים קראו חמישה ילדים השבוע:',
    code: 'pages <- c(18, 25, 9, 31, 14)\norder(pages, decreasing = TRUE)',
    options: ['31 25 18 14 9', '3 2 5 1 4', '4 2 1 5 3', '3 5 1 2 4'],
    answer: 2,
    hint: 'מה `order()` מחזיר: את המספרים עצמם, או משהו אחר? ומאיפה מתחילים כשכתוב `decreasing = TRUE`?',
    explanation: [
      {
        text: 'זה הווקטור, עם המיקום של כל מספר:',
        vector: { values: ['18', '25', '9', '31', '14'], marks: ['', '', '', '', ''], showIndex: true }
      },
      {
        text: '`order()` לא מחזיר את המספרים, אלא את **המיקומים** שלהם, בסדר שבו צריך לקחת אותם. עם `decreasing = TRUE` מתחילים מהגדול: `31` נמצא במיקום 4, אחריו `25` במיקום 2, `18` במיקום 1, `14` במיקום 5 ו-`9` במיקום 3:',
        vector: { values: ['4', '2', '1', '5', '3'], marks: ['on', 'on', 'on', 'on', 'on'], labels: ['31', '25', '18', '14', '9'] }
      },
      {
        text: 'R מדפיס את המיקומים:',
        output: '[1] 4 2 1 5 3'
      }
    ],
    whyWrong: {
      0: 'אלה המספרים עצמם מהגדול לקטן, כלומר מה ש-`pages[order(pages, decreasing = TRUE)]` מדפיס. `order()` לבד מחזיר רק **מיקומים**, לא ערכים.',
      1: 'זה **הדירוג** של כל מספר: `18` הוא השלישי בגודלו, `25` השני, `9` החמישי, וכן הלאה. `order()` עונה על שאלה אחרת: באיזה מיקום נמצא המספר שבא ראשון, באיזה נמצא השני, וכן הלאה. המספר הגדול ביותר, `31`, נמצא במיקום 4, ולכן הפלט מתחיל ב-`4`.',
      3: 'זה מה ש-`order(pages)` מדפיס, בלי `decreasing = TRUE`: מיקומים מהקטן לגדול (קודם `9`, שנמצא במיקום 3). כאן כתוב `decreasing = TRUE`, ולכן מתחילים מהגדול.'
    }
  },

  {
    id: 'apply-matrix-row-max',
    station: 'apply',
    level: 3,
    context: 'כמה מבקרים הגיעו לשני דוכנים (השורות) בשלושה ימים (העמודות):',
    code: 'visitors <- matrix(c(4, 9, 7, 2, 5, 8), nrow = 2)\napply(visitors, 1, max)',
    options: ['9 7 8', '9', '9 8', '7 9'],
    answer: 3,
    hint: 'קודם ציירו את המטריצה: איך R ממלא אותה כשלא כתוב `byrow`? אחר כך בדקו על מה `1` ב-`apply()` עובר.',
    explanation: [
      {
        text: '`nrow = 2` קובע 2 שורות, ולכן יש 3 עמודות. בלי `byrow = TRUE`, R ממלא את המטריצה **עמודה אחרי עמודה**: `4` ו-`9` בעמודה 1, `7` ו-`2` בעמודה 2, `5` ו-`8` בעמודה 3:',
        table: {
          columns: ['[,1]', '[,2]', '[,3]'],
          rows: [['4', '7', '5'], ['9', '2', '8']],
          rowNames: ['[1,]', '[2,]']
        }
      },
      {
        text: '`1` ב-`apply()` אומר "לפי שורות", ולכן R מחשב `max()` לכל שורה. בשורה 1 (`4 7 5`) המקסימום הוא `7`, ובשורה 2 (`9 2 8`) הוא `9`:',
        output: '[1] 7 9'
      }
    ],
    whyWrong: {
      0: 'אלה המקסימום של כל **עמודה**, כלומר מה ש-`apply(visitors, 2, max)` מדפיס. `1` פירושו שורות, ולכן יש רק 2 תוצאות, אחת לכל שורה.',
      1: '`9` הוא המספר הגדול ביותר בכל המטריצה, כלומר מה ש-`max(visitors)` מדפיס. `apply()` מחשב `max()` לכל שורה בנפרד ומחזיר תוצאה לכל שורה.',
      2: 'זה מה שיוצא אם ממלאים את המטריצה שורה אחרי שורה, עם `byrow = TRUE`: אז השורות הן `4 9 7` ו-`2 5 8`. בלי `byrow = TRUE`, R ממלא עמודה אחרי עמודה, ולכן השורה הראשונה היא `4 7 5`.'
    }
  },

  {
    id: 'apply-mixed-to-text',
    station: 'apply',
    level: 3,
    context: 'טבלה של מבחנות: התווית של כל מבחנה, וכמה מ"ל יש בה:',
    code: 'tubes <- data.frame(\n  label = c("A1", "B2", "C3"),\n  ml = c(12, 30, 18)\n)\nlow <- apply(tubes, 2, min)\nlow["ml"] + 1',
    options: ['שגיאה (Error)', '13', '"121"', 'NA'],
    answer: 0,
    hint: 'מה `apply()` עושה לטבלה לפני שהוא מתחיל לעבוד? ומה זה אומר על הערכים בעמודה `ml`?',
    explanation: [
      {
        text: '`apply()` הופך את הטבלה ל**מטריצה** לפני שהוא מתחיל. במטריצה כל הערכים מאותו סוג, ויש כאן עמודה של טקסט, ולכן גם המספרים הופכים לטקסט:',
        table: {
          columns: ['label', 'ml'],
          rows: [['"A1"', '"12"'], ['"B2"', '"30"'], ['"C3"', '"18"']],
          rowNames: ['[1,]', '[2,]', '[3,]']
        }
      },
      {
        text: '`min()` רץ על כל עמודה (על טקסט הוא בוחר לפי סדר האלף-בית). בעמודה `ml` הוא מחזיר `"12"`, אבל כטקסט, עם מירכאות. כך נראה `low`:',
        vector: { values: ['"A1"', '"12"'], marks: ['', 'on'], labels: ['label', 'ml'] }
      },
      {
        text: '`low["ml"]` הוא הטקסט `"12"`, ואי אפשר לחבר מספר לטקסט. לכן R עוצר עם שגיאה:',
        output: 'Error in low["ml"] + 1 : non-numeric argument to binary operator'
      }
    ],
    whyWrong: {
      1: '`13` יוצא אם `ml` נשארת עמודה של מספרים, כמו ב-`lapply(tubes, min)$ml + 1` (`lapply()` לא הופך את הטבלה למטריצה). אבל `apply()` כן הופך אותה למטריצה, ובגלל העמודה `label` כל הערכים הופכים לטקסט, גם המספרים.',
      2: 'ב-R הסימן `+` לא מדביק טקסטים זה לזה (כמו שקורה בחלק משפות התכנות האחרות). כדי להדביק משתמשים ב-`paste()`. `"12" + 1` הוא חשבון על טקסט, ולכן R עוצר עם שגיאה.',
      3: 'נכון שכשמפעילים `apply()` עם `mean()` על טבלה עם טקסט מקבלים `NA` (ואזהרה), אבל `min()` עובד גם על טקסט ומחזיר `"12"`. הבעיה מגיעה רק בשורה האחרונה: `"12" + 1` הוא חשבון על טקסט, וזו שגיאה.'
    }
  },

  // ===== שבוע 6: תנאים =====
  // ---------- level 1 ----------
  {
    id: 'conditions-if-mean',
    station: 'conditions',
    level: 1,
    context: 'ציונים של סטודנטית בשלוש עבודות:',
    code: 'grades <- c(66, 90, 63)\nif (mean(grades) > 75) {\n  print("bonus")\n} else {\n  print("no bonus")\n}',
    options: ['"bonus"', '"no bonus"', '"no bonus" "bonus" "no bonus"', 'שגיאה (Error), כי `grades` הוא וקטור'],
    answer: 1,
    hint: 'מה התנאי בודק: כל ציון בנפרד, או מספר אחד שמחושב מכל הציונים?',
    explanation: [
      {
        text: '`mean(grades)` מחשב את הממוצע של שלושת הציונים: `(66 + 90 + 63) / 3`, וזה `73`. כלומר התנאי הוא על מספר **אחד**.',
        vector: { values: ['66', '90', '63'], marks: ['', '', ''], showIndex: true }
      },
      {
        text: '`73 > 75` הוא `FALSE`, ולכן R מדלג על הבלוק של `if` ומריץ רק את הבלוק של `else`:',
        output: '[1] "no bonus"'
      }
    ],
    whyWrong: {
      0: 'נכון ש-`90` גדול מ-75, אבל התנאי לא בודק ציון בודד: הוא בודק את הממוצע, `73`, והוא לא גדול מ-75.',
      2: 'זה מה ש-`ifelse(grades > 75, "bonus", "no bonus")` מדפיס: תשובה לכל ציון. אבל כאן התנאי של `if` הוא מספר אחד (הממוצע), ו-R מריץ רק אחד משני הבלוקים, פעם אחת.',
      3: 'נכון ש-`if` צריך ערך אחד, `TRUE` או `FALSE`. אבל כאן הוא באמת מקבל ערך אחד: `mean()` הופך את שלושת הציונים למספר אחד. שגיאה הייתה מתקבלת עם `if (grades > 75)`, כי שם התנאי נותן שלושה ערכים.'
    }
  },

  {
    id: 'conditions-all-battery',
    station: 'conditions',
    level: 1,
    context: 'אחוזי הסוללה בארבעה טלפונים:',
    code: 'battery <- c(45, 80, 15, 60)\nall(battery > 20)',
    options: ['TRUE', '3', 'TRUE TRUE FALSE TRUE', 'FALSE'],
    answer: 3,
    hint: 'בדקו כל טלפון מול התנאי. כמה מהטלפונים צריכים לעמוד בו כדי ש-`all()` יחזיר `TRUE`?',
    explanation: [
      {
        text: '`battery > 20` בודק כל טלפון ומחזיר `TRUE` או `FALSE`:',
        vector: {
          values: ['45', '80', '15', '60'],
          marks: ['on', 'on', 'off', 'on'],
          labels: ['TRUE', 'TRUE', 'FALSE', 'TRUE']
        }
      },
      {
        text: '`all()` מחזיר `TRUE` רק אם **כל** הערכים הם `TRUE`. מספיק `FALSE` אחד (`15` לא גדול מ-20), והתשובה היא `FALSE` אחד:',
        output: '[1] FALSE'
      }
    ],
    whyWrong: {
      0: '`TRUE` הוא מה ש-`any(battery > 20)` מדפיס: ל-`any()` מספיק טלפון אחד שעומד בתנאי. `all()` דורש שכולם יעמדו בו, ו-`15` לא גדול מ-20.',
      1: '`3` הוא מה ש-`sum(battery > 20)` מדפיס: כמה טלפונים עומדים בתנאי. `all()` לא סופר: הוא עונה כן או לא, כלומר `TRUE` או `FALSE`.',
      2: 'זה מה ש-`battery > 20` מדפיס לבד: תשובה לכל טלפון. `all()` מקבל את כל התשובות האלה ומחזיר ערך **אחד** בלבד.'
    }
  },

  {
    id: 'conditions-ifelse-survey',
    station: 'conditions',
    level: 1,
    context: 'תשובות של ארבעה אנשים בסקר:',
    code: 'answers <- c("yes", "no", "yes", "yes")\nifelse(answers == "yes", 1, 0)',
    options: ['1 0 1 1', 'TRUE FALSE TRUE TRUE', '"1" "0" "1" "1"', '3'],
    answer: 0,
    hint: 'קודם כתבו מה `answers == "yes"` מחזיר. ואז: מה `ifelse()` עושה עם כל אחד מהערכים האלה?',
    explanation: [
      {
        text: '`answers == "yes"` בודק כל תשובה:',
        vector: {
          values: ['"yes"', '"no"', '"yes"', '"yes"'],
          marks: ['on', 'off', 'on', 'on'],
          labels: ['TRUE', 'FALSE', 'TRUE', 'TRUE'],
          showIndex: true
        }
      },
      {
        text: '`ifelse()` שם `1` (הערך השני בסוגריים) בכל מקום שבו יש `TRUE`, ו-`0` (הערך השלישי) בכל מקום שבו יש `FALSE`. התוצאה היא וקטור של מספרים, באורך 4:',
        vector: { values: ['1', '0', '1', '1'], marks: ['on', 'off', 'on', 'on'], showIndex: true }
      },
      {
        text: 'זה הפלט:',
        output: '[1] 1 0 1 1'
      }
    ],
    whyWrong: {
      1: 'זה מה ש-`answers == "yes"` מדפיס לבד. `ifelse()` לא מחזיר את ה-`TRUE` וה-`FALSE`: הוא שם `1` במקום כל `TRUE` ו-`0` במקום כל `FALSE`.',
      2: 'זה מה ש-`ifelse(answers == "yes", "1", "0")` מדפיס. סוג הפלט נקבע לפי הערכים ש-`ifelse()` מחזיר, ולא לפי `answers`. כאן `1` ו-`0` כתובים בלי מירכאות, ולכן הם מספרים.',
      3: '`3` הוא מה ש-`sum(ifelse(answers == "yes", 1, 0))` מדפיס. `ifelse()` לבד לא מחבר כלום: הוא מחזיר וקטור עם תשובה לכל איבר.'
    }
  },

  // ---------- level 2 ----------
  {
    id: 'conditions-first-true-wins',
    station: 'conditions',
    level: 2,
    context: 'המהירויות (בקמ"ש) של ארבע מכוניות שעברו ליד מצלמה:',
    code: 'speeds <- c(72, 95, 60, 118)\nif (any(speeds > 90)) {\n  print("fast")\n} else if (any(speeds > 110)) {\n  print("very fast")\n} else {\n  print("slow")\n}',
    options: ['"very fast"', '"fast" "very fast"', '"fast"', '"slow"'],
    answer: 2,
    hint: 'כמה מהתנאים כאן נכונים? ובאיזה סדר R בודק אותם?',
    explanation: [
      {
        text: 'R בודק את התנאים לפי הסדר, מלמעלה למטה. הראשון הוא `any(speeds > 90)`, ו-`speeds > 90` נותן:',
        vector: {
          values: ['72', '95', '60', '118'],
          marks: ['off', 'on', 'off', 'on'],
          labels: ['FALSE', 'TRUE', 'FALSE', 'TRUE']
        }
      },
      {
        text: 'יש לפחות `TRUE` אחד, ולכן `any(speeds > 90)` הוא `TRUE`. R מריץ את הבלוק הראשון ו**מדלג על כל השאר**: הוא בכלל לא בודק את `any(speeds > 110)`, ולא מגיע ל-`else`.',
        output: '[1] "fast"'
      }
    ],
    whyWrong: {
      0: 'נכון ש-`any(speeds > 110)` הוא `TRUE` (בגלל `118`), אבל R לא מגיע לבדוק אותו. R לא מחפש את התנאי המתאים ביותר, אלא מריץ את **הראשון** שנכון. (`"very fast"` היה מודפס אם `any(speeds > 110)` היה כתוב ראשון.)',
      1: 'בשרשרת של `if`, `else if` ו-`else` רץ **בלוק אחד בלבד**: הראשון שהתנאי שלו `TRUE`. אחריו R מדלג על כל השאר, גם כשהתנאים שלהם נכונים.',
      3: '`"slow"` היה מודפס עם `all()` במקום `any()`, כי לא כל המכוניות נסעו מהר יותר מ-90. אבל ל-`any()` מספיקה מכונית אחת, ו-`95` ו-`118` גדולים מ-90.'
    }
  },

  {
    id: 'conditions-and-or-fee',
    station: 'conditions',
    level: 2,
    context: 'דמי משלוח של הזמנה בחנות אינטרנט:',
    code: 'items <- 3\ntotal <- 180\nfee <- 30\nif (items >= 5 & total >= 150) {\n  fee <- 0\n} else if (items >= 5 | total >= 150) {\n  fee <- fee / 2\n}\nfee',
    prompt: 'מה יהיה הערך של `fee` בסוף הקוד?',
    options: ['15', '0', '30', 'שגיאה (Error), כי אין `else`'],
    answer: 0,
    hint: 'חשבו כל השוואה לבד: `TRUE` או `FALSE`? ואז שאלו: מה `&` דורש, ומה `|` דורש?',
    explanation: [
      {
        text: 'קודם כל השוואה לבד (`items` הוא `3` ו-`total` הוא `180`), ואז מה `&` ו-`|` עושים עם שתי התוצאות:',
        table: {
          columns: ['items >= 5', 'total >= 150', '&', '|'],
          rows: [['FALSE', 'TRUE', 'FALSE', 'TRUE']]
        }
      },
      {
        text: 'התנאי של `if` משתמש ב-`&` ("וגם"), שדורש ששני הצדדים יהיו `TRUE`. כאן התוצאה `FALSE`, ולכן R עובר ל-`else if`.'
      },
      {
        text: 'התנאי של `else if` משתמש ב-`|` ("או"), שמספיק לו צד אחד. כאן התוצאה `TRUE`, ולכן `fee` הופך ל-`30 / 2`:',
        output: '[1] 15'
      }
    ],
    whyWrong: {
      1: '`0` יוצא אם קוראים את `&` כמו "או". אבל `&` נותן `TRUE` רק כששני הצדדים `TRUE`, ו-`items >= 5` הוא `FALSE` (יש רק 3 פריטים).',
      2: '`30` יוצא אם קוראים את `|` כמו "וגם": אז אף תנאי לא נכון, ו-`fee` לא משתנה. אבל ל-`|` מספיק צד אחד נכון, ו-`total >= 150` הוא `TRUE`.',
      3: '`else` הוא לא חובה. בלי `else`, אם אף תנאי לא נכון, R פשוט לא מריץ אף בלוק וממשיך הלאה. ובכל מקרה, כאן התנאי של `else if` נכון, ולכן `fee` הופך ל-`15`.'
    }
  },

  {
    id: 'conditions-ifelse-discount',
    station: 'conditions',
    level: 2,
    context: 'מחירים של ארבעה מוצרים. מוצר שעולה יותר מ-100 מקבל הנחה של 20:',
    code: 'prices <- c(40, 120, 75, 200)\nfinal <- ifelse(prices > 100, prices - 20, prices)\nsum(final)',
    options: ['355', '435', '40 100 75 180', '395'],
    answer: 3,
    hint: 'כתבו את `final` מיקום אחרי מיקום: בכל מיקום, מאיזה וקטור `ifelse()` לוקח את הערך?',
    explanation: [
      {
        text: '`prices - 20` הוא התשובה ל-`TRUE`, ו-`prices` הוא התשובה ל-`FALSE`. בכל מיקום `ifelse()` בודק את `prices > 100` ולוקח את הערך מהווקטור המתאים:',
        table: {
          columns: ['prices', 'prices > 100', 'prices - 20', 'final'],
          rows: [
            ['40', 'FALSE', '20', '40'],
            ['120', 'TRUE', '100', '100'],
            ['75', 'FALSE', '55', '75'],
            ['200', 'TRUE', '180', '180']
          ],
          rowNames: ['1', '2', '3', '4'],
          highlightRows: [1, 3]
        }
      },
      {
        text: '`sum(final)` מחבר: `40 + 100 + 75 + 180`',
        output: '[1] 395'
      }
    ],
    whyWrong: {
      0: '`355` הוא מה ש-`sum(prices - 20)` מדפיס: הנחה לכל המוצרים. נכון ש-`prices - 20` מחושב לכל הווקטור, אבל `ifelse()` לוקח ממנו רק את המיקומים שבהם `prices > 100` הוא `TRUE`.',
      1: '`435` הוא סכום המחירים בלי שום הנחה, כאילו `ifelse()` בחר תשובה אחת לכל הווקטור. אבל `ifelse()` בוחר לכל מיקום בנפרד, ולכן `120` ו-`200` מקבלים הנחה.',
      2: 'זה הערך של `final`. אבל השורה האחרונה היא `sum(final)`, ולכן מודפס מספר אחד: הסכום.'
    }
  },

  // ---------- level 3 ----------
  {
    id: 'conditions-if-vector-error',
    station: 'conditions',
    level: 3,
    context: 'מספר האנשים בתור בשלוש קופות:',
    code: 'queue <- c(12, 3, 7)\nif (queue > 5) {\n  print("open another")\n} else {\n  print("ok")\n}',
    prompt: 'מה יקרה כשנריץ את הקוד?',
    options: ['"open another"', 'שגיאה (Error), כי בתנאי של `if` יש יותר מערך אחד', '"open another" "ok" "open another"', '"ok"'],
    answer: 1,
    hint: 'כתבו מה `queue > 5` מחזיר. איך `if` יכול להחליט לפי התוצאה הזאת?',
    explanation: [
      {
        text: '`queue > 5` בודק כל קופה ומחזיר **שלושה** ערכים:',
        vector: {
          values: ['12', '3', '7'],
          marks: ['on', 'off', 'on'],
          labels: ['TRUE', 'FALSE', 'TRUE'],
          showIndex: true
        }
      },
      {
        text: '`if` מחליט אם להריץ בלוק אחד, ולכן הוא צריך ערך **אחד** בלבד: `TRUE` או `FALSE`. (כדי לשאול שאלה על כל הווקטור כותבים בתוך ה-`if` את `any()` או את `all()`. כדי לקבל תשובה לכל איבר משתמשים ב-`ifelse()`.)'
      },
      {
        text: 'כאן `if` מקבל שלושה ערכים, ולכן R עוצר עם שגיאה:',
        output: 'Error in if (queue > 5) { : the condition has length > 1'
      }
    ],
    whyWrong: {
      0: 'R לא בודק רק את האיבר הראשון: `if` צריך ערך אחד, ו-`queue > 5` נותן שלושה, ולכן R עוצר. (בגרסאות ישנות של R זה אכן היה הפלט, יחד עם אזהרה. היום זו שגיאה.)',
      2: 'זה מה ש-`ifelse(queue > 5, "open another", "ok")` מדפיס. `ifelse()` נותן תשובה לכל איבר, אבל `if` לא עובר על הווקטור איבר אחרי איבר: הוא צריך תשובה אחת.',
      3: '`"ok"` היה מודפס עם `if (all(queue > 5))`, כי לא בכל הקופות יש יותר מ-5 אנשים. אבל `if` לא מפעיל את `all()` בשבילכם: כשהתנאי שלו הוא וקטור, R עוצר עם שגיאה.'
    }
  },

  {
    id: 'conditions-ifelse-na-sum',
    station: 'conditions',
    level: 3,
    context: 'משקלים (בקילוגרמים) של ארבע חבילות. המשקל של אחת מהן לא נרשם:',
    code: 'weights <- c(3.1, NA, 4.6, 2.2)\nsize <- ifelse(weights > 3, "heavy", "light")\nsum(size == "light")',
    options: ['1', '2', 'NA', '"heavy" NA "heavy" "light"'],
    answer: 2,
    hint: 'מה `weights > 3` נותן במקום שבו יש `NA`? ומה `ifelse()` שם במקום הזה?',
    explanation: [
      {
        text: '`weights > 3` בודק כל משקל. על `NA` אי אפשר לדעת אם הוא גדול מ-3, ולכן גם התשובה שם היא `NA`:',
        vector: {
          values: ['3.1', 'NA', '4.6', '2.2'],
          marks: ['', '', '', ''],
          labels: ['TRUE', 'NA', 'TRUE', 'FALSE'],
          showIndex: true
        }
      },
      {
        text: '`ifelse()` שם `"heavy"` במקום כל `TRUE` ו-`"light"` במקום כל `FALSE`. במקום `NA` הוא לא בוחר אף אחד מהם, אלא משאיר `NA`:',
        vector: { values: ['"heavy"', 'NA', '"heavy"', '"light"'], marks: ['', 'on', '', ''], showIndex: true }
      },
      {
        text: '`size == "light"` נותן `FALSE NA FALSE TRUE`. כשיש `NA` בין הערכים, גם `sum()` שלהם הוא `NA`:',
        output: '[1] NA'
      }
    ],
    whyWrong: {
      0: '`1` הוא מה ש-`sum(size == "light", na.rm = TRUE)` מדפיס. בלי `na.rm = TRUE`, `sum()` לא מדלג על ה-`NA`, והוא מתפשט לתוצאה.',
      1: '`2` יוצא אם חושבים ש-`ifelse()` שם `"light"` גם במקום ה-`NA`, כי `NA > 3` "לא נכון". אבל `NA > 3` הוא לא `FALSE`: הוא `NA`, ו-`ifelse()` מחזיר `NA` באותו מקום.',
      3: 'זה הערך של `size`. השורה האחרונה משווה אותו ל-`"light"` ומחברת את התוצאה עם `sum()`, ולכן מודפס ערך אחד.'
    }
  },

  {
    id: 'conditions-chain-then-if',
    station: 'conditions',
    level: 3,
    context: 'הניקוד של שחקן במשחק:',
    code: 'points <- 40\nif (points < 50) {\n  points <- points + 20\n} else if (points < 70) {\n  points <- points + 5\n}\nif (points >= 60) points <- points * 2\npoints',
    prompt: 'מה יהיה הערך של `points` בסוף הקוד?',
    options: ['130', '60', '45', '120'],
    answer: 3,
    hint: 'עקבו אחרי `points` שורה אחרי שורה. אחרי ש-`points` משתנה, אילו תנאים R עוד בודק?',
    explanation: [
      {
        text: 'התנאי הראשון, `40 < 50`, הוא `TRUE`, ולכן `points` הופך ל-`40 + 20`, כלומר `60`.'
      },
      {
        text: 'עכשיו `60 < 70`, אבל R **לא** חוזר לבדוק את `else if`: בשרשרת של `if` ו-`else if` רץ רק הבלוק הראשון שנכון, ו-R מדלג על כל השאר.'
      },
      {
        text: 'ה-`if` בשורה שאחרי השרשרת הוא `if` חדש ונפרד, ולכן R בודק אותו, עם הערך **העדכני**: `60 >= 60` הוא `TRUE`, ו-`points` הופך ל-`60 * 2`:',
        output: '[1] 120'
      }
    ],
    whyWrong: {
      0: '`130` יוצא אם חושבים שאחרי הבלוק הראשון R בודק גם את `else if` (`60 < 70`) ומוסיף עוד 5. אבל בשרשרת של `if` ו-`else if` רץ בלוק אחד בלבד: אחרי שהראשון רץ, R מדלג על השאר.',
      1: '`60` יוצא אם מדלגים על `if (points >= 60)`. אבל הוא לא שייך לשרשרת שלפניו: זה `if` נפרד, ו-R בודק אותו. הערך העדכני הוא `60`, ו-`60 >= 60` הוא `TRUE` (`>=` כולל גם את השוויון).',
      2: '`45` יוצא אם רק הבלוק של `else if` רץ. אבל R בודק את התנאים לפי הסדר ומריץ את הראשון שנכון: `40 < 50` כבר `TRUE`, ולכן רץ הבלוק הראשון. (וגם `45 >= 60` הוא `FALSE`, כך ש-`45` לא היה מוכפל.)'
    }
  },

  // ===== שבוע 7: לולאות =====
  // ---------- level 1 ----------
  {
    id: 'loops-for-values',
    station: 'loops',
    level: 1,
    context: 'מספר המחברות בכל חבילה. כל מחברת עולה 10 שקלים:',
    code: 'packs <- c(4, 9, 6)\nfor (p in packs) {\n  print(p * 10)\n}',
    prompt: 'אילו מספרים יודפסו?',
    options: ['10 20 30', '40 90 60', '60', '190'],
    answer: 1,
    hint: 'איזה ערך מקבל `p` בכל סיבוב? ובכמה סיבובים רץ `print()`?',
    explanation: [
      {
        text: '`for (p in packs)` עובר על **הערכים** שבתוך `packs`, אחד בכל סיבוב: קודם `p` הוא `4`, אחר כך `9`, ואז `6`.',
        vector: { values: ['4', '9', '6'], marks: ['on', 'on', 'on'], showIndex: true }
      },
      {
        text: '`print(p * 10)` נמצא בתוך הלולאה, ולכן בכל סיבוב הוא מדפיס שורה משלו:',
        vector: { values: ['40', '90', '60'], marks: ['on', 'on', 'on'], labels: ['4 × 10', '9 × 10', '6 × 10'] }
      },
      {
        text: 'שלושה סיבובים, שלוש הדפסות:',
        output: '[1] 40\n[1] 90\n[1] 60'
      }
    ],
    whyWrong: {
      0: 'זה מה שהיה מודפס אם `p` היה מקבל את **המיקומים** 1, 2, 3, כמו ב-`for (p in 1:3)`. אבל `for (p in packs)` נותן ל-`p` את **הערכים** שבתוך הווקטור: `4`, `9` ו-`6`.',
      2: '`print()` נמצא **בתוך** הלולאה, ולכן הוא רץ בכל אחד משלושת הסיבובים. `60` הוא רק מה שמודפס בסיבוב האחרון.',
      3: '`190` הוא סכום החבילות כפול 10, כלומר `sum(packs) * 10`. הלולאה לא מחברת את המספרים: בכל סיבוב היא מכפילה מספר אחד ומדפיסה אותו.'
    }
  },

  {
    id: 'loops-count-rounds',
    station: 'loops',
    level: 1,
    context: 'סופרים כמה פעמים הלולאה רצה:',
    code: 'rounds <- 0\nfor (i in 4:9) {\n  rounds <- rounds + 1\n}\nrounds',
    options: ['5', '9', '39', '6'],
    answer: 3,
    hint: 'כמה פעמים רצה הלולאה? ומה בדיוק מוסיפים ל-`rounds` בכל סיבוב?',
    explanation: [
      {
        text: '`4:9` הוא וקטור של כל המספרים השלמים מ-4 עד 9, **כולל** שניהם. יש בו 6 מספרים, ולכן הלולאה עושה 6 סיבובים:',
        vector: { values: ['4', '5', '6', '7', '8', '9'], marks: ['on', 'on', 'on', 'on', 'on', 'on'], showIndex: true }
      },
      {
        text: 'בכל סיבוב `rounds` גדל ב-1. הערך של `i` לא משתתף בחישוב:',
        table: {
          columns: ['i', 'rounds'],
          rows: [['4', '1'], ['5', '2'], ['6', '3'], ['7', '4'], ['8', '5'], ['9', '6']],
          highlightRows: [5]
        }
      },
      {
        text: 'אחרי הלולאה השורה `rounds` מדפיסה:',
        output: '[1] 6'
      }
    ],
    whyWrong: {
      0: '`9 - 4` הוא 5, אבל `4:9` כולל **גם** את 4 **וגם** את 9: `4 5 6 7 8 9`. אלה 6 מספרים, ולכן יש 6 סיבובים.',
      1: '`9` הוא הערך של `i` בסיבוב האחרון. אבל הקוד מדפיס את `rounds`, שגדל ב-1 בכל סיבוב בלי קשר לערך של `i`.',
      2: '`39` הוא הסכום `4 + 5 + 6 + 7 + 8 + 9`, וזה מה שהיה יוצא עם `rounds <- rounds + i`. כאן מוסיפים בכל סיבוב `1`, ולא את `i`.'
    }
  },

  {
    id: 'loops-replace-not-add',
    station: 'loops',
    level: 1,
    context: 'טמפרטורות בשלושה ימים:',
    code: 'temps <- c(21, 25, 18)\nfor (d in temps) {\n  res <- d + 10\n}\nres',
    options: ['28', '31 35 28', '31', '94'],
    answer: 0,
    hint: 'עקבו אחרי `res` סיבוב אחרי סיבוב. מה קורה לערך שהיה בו לפני כן?',
    explanation: [
      {
        text: 'בכל סיבוב `res <- d + 10` שם ב-`res` ערך **חדש**, והערך הקודם נמחק:',
        table: {
          columns: ['d', 'res'],
          rows: [['21', '31'], ['25', '35'], ['18', '28']],
          rowNames: ['1', '2', '3'],
          highlightRows: [2]
        }
      },
      {
        text: 'אחרי הלולאה נשאר ב-`res` רק הערך מהסיבוב האחרון:',
        output: '[1] 28'
      }
    ],
    whyWrong: {
      1: 'ב-`res` לא נאספים כל הערכים: בכל סיבוב השורה `res <- d + 10` **מחליפה** את הערך הקודם. לכן אחרי הלולאה נשאר בו מספר אחד, מהסיבוב האחרון.',
      2: '`31` הוא הערך של `res` אחרי הסיבוב **הראשון**. הלולאה ממשיכה עוד שני סיבובים, ובכל אחד מהם `res` מקבל ערך חדש.',
      3: '`94` הוא `31 + 35 + 28`. כדי לצבור סכום צריך להתחיל מ-`res <- 0` ולכתוב `res <- res + d + 10`. כאן `res` לא מופיע בצד ימין של החץ, ולכן כל סיבוב רק כותב ערך חדש.'
    }
  },

  // ---------- level 2 ----------
  {
    id: 'loops-grow-vector',
    station: 'loops',
    level: 2,
    context: 'אוספים רק את המספרים הגדולים מ-5:',
    code: 'nums <- c(7, 2, 9, 4)\nbig <- 0\nfor (x in nums) {\n  if (x > 5) {\n    big <- c(big, x)\n  }\n}\nbig',
    options: ['7 9', '9 7 0', '0 7 9', '2'],
    answer: 2,
    hint: 'מה יש ב-`big` לפני הסיבוב הראשון? ובאיזה צד `c(big, x)` מוסיף את `x`?',
    explanation: [
      {
        text: 'בכל סיבוב `if` בודק אם `x > 5`. רק `7` ו-`9` עוברים:',
        vector: { values: ['7', '2', '9', '4'], marks: ['on', 'off', 'on', 'off'], labels: ['TRUE', 'FALSE', 'TRUE', 'FALSE'] }
      },
      {
        text: '`big` מתחיל כ-`0`. `c(big, x)` שומר את כל מה שכבר יש ב-`big` ומוסיף את `x` **בסוף**:',
        table: {
          columns: ['x', 'x > 5', 'big'],
          rows: [['7', 'TRUE', '0 7'], ['2', 'FALSE', '0 7'], ['9', 'TRUE', '0 7 9'], ['4', 'FALSE', '0 7 9']],
          highlightRows: [0, 2]
        }
      },
      {
        text: 'ה-`0` מההתחלה נשאר ראשון:',
        output: '[1] 0 7 9'
      }
    ],
    whyWrong: {
      0: 'הלולאה לא מתחילה מווקטור ריק: היא מתחילה מ-`big <- 0`. `c(big, x)` שומר את מה שכבר היה ב-`big`, ולכן ה-`0` נשאר בתחילת הווקטור.',
      1: '`c(big, x)` שם את `x` **אחרי** `big`, כלומר בסוף. הסדר `9 7 0` היה יוצא מ-`c(x, big)`, שמוסיף כל מספר חדש בהתחלה.',
      3: '`2` הוא **מספר** המספרים שגדולים מ-5, כלומר `sum(nums > 5)`. הלולאה לא סופרת: היא אוספת את המספרים עצמם לתוך `big`.'
    }
  },

  {
    id: 'loops-nrow-menu',
    station: 'loops',
    level: 2,
    context: 'תפריט של מסעדה, עם המחיר של כל מנה והאם היא חריפה:',
    code: 'menu <- data.frame(\n  price = c(18, 25, 42, 15),\n  spicy = c("yes", "no", "yes", "no")\n)\ntotal <- 0\nfor (i in 1:nrow(menu)) {\n  if (menu$spicy[i] == "no") {\n    total <- total + menu$price[i]\n  }\n}\ntotal',
    options: ['40', '100', '60', '2'],
    answer: 0,
    hint: 'אילו ערכים מקבל `i`? ובאילו סיבובים התנאי שב-`if` נותן `TRUE`?',
    explanation: [
      {
        text: 'בטבלה יש 4 שורות, ולכן `1:nrow(menu)` הוא `1:4`: `i` עובר על **מספרי השורות**.',
        table: {
          columns: ['price', 'spicy'],
          rows: [['18', 'yes'], ['25', 'no'], ['42', 'yes'], ['15', 'no']],
          rowNames: ['1', '2', '3', '4'],
          highlightRows: [1, 3]
        }
      },
      {
        text: 'רק בשורות שבהן `spicy` הוא `"no"` (שורה 2 ושורה 4) המחיר נוסף ל-`total`:',
        vector: { values: ['18', '25', '42', '15'], marks: ['off', 'on', 'off', 'on'], labels: ['"yes"', '"no"', '"yes"', '"no"'], showIndex: true }
      },
      {
        text: 'סך הכול `0 + 25 + 15`:',
        output: '[1] 40'
      }
    ],
    whyWrong: {
      1: '`100` הוא סכום **כל** המחירים, כלומר `sum(menu$price)`. אבל `total` גדל רק בסיבובים שבהם `menu$spicy[i] == "no"` נותן `TRUE`: בשורה 2 ובשורה 4.',
      2: '`60` הוא `18 + 42`, המחירים של המנות **החריפות**. התנאי בודק `== "no"`, ולכן נכנסות רק המנות שאינן חריפות.',
      3: '`2` הוא **מספר** המנות שאינן חריפות. אבל ל-`total` מוסיפים את `menu$price[i]`, כלומר את המחיר, ולא `1`.'
    }
  },

  {
    id: 'loops-while-halving',
    station: 'loops',
    level: 2,
    context: 'בכל יום נשאר במיכל חצי מהמים:',
    code: 'water <- 100\ndays <- 0\nwhile (water > 10) {\n  water <- water / 2\n  days <- days + 1\n}\ndays',
    options: ['3', '5', '6.25', '4'],
    answer: 3,
    hint: 'רשמו טבלה: מה הערך של `water` בכל בדיקה של התנאי, ומה הערך של `days` אחרי כל סיבוב.',
    explanation: [
      {
        text: 'בתחילת **כל** סיבוב R בודק את `water > 10`. אם התשובה `TRUE`, הוא מחלק את `water` ב-2 ומוסיף 1 ל-`days`. כל שורה בטבלה היא בדיקה אחת: הערך של `water` בזמן הבדיקה, והערך של `days` אחרי הסיבוב:',
        table: {
          columns: ['water', 'water > 10', 'days'],
          rows: [['100', 'TRUE', '1'], ['50', 'TRUE', '2'], ['25', 'TRUE', '3'], ['12.5', 'TRUE', '4'], ['6.25', 'FALSE', '4']],
          rowNames: ['1', '2', '3', '4', '5'],
          highlightRows: [3]
        }
      },
      {
        text: '`12.5` עדיין גדול מ-10, ולכן יש סיבוב רביעי. בבדיקה החמישית `water` הוא `6.25`, התנאי `FALSE` והלולאה נגמרת:',
        output: '[1] 4'
      }
    ],
    whyWrong: {
      0: '`3` הוא מה ש-`while (water / 2 > 10)` היה נותן: כאילו R בודק מראש אם המים **יירדו** מתחת ל-10. אבל R בודק את `water` כפי שהוא עכשיו: ב-`12.5` התנאי עדיין `TRUE`, ולכן יש סיבוב רביעי.',
      1: '`5` הוא מספר **הבדיקות** של התנאי: 4 בדיקות שנתנו `TRUE` ועוד בדיקה אחת שנתנה `FALSE`. אחרי הבדיקה האחרונה R יוצא מהלולאה בלי להריץ את הגוף, ולכן `days` לא גדל בפעם החמישית.',
      2: '`6.25` הוא הערך של `water` בסוף. אבל השורה האחרונה מדפיסה את `days`, כלומר את מספר הסיבובים.'
    }
  },

  // ---------- level 3 ----------
  {
    id: 'loops-while-overshoot',
    station: 'loops',
    level: 3,
    context: 'קופצים קדימה בקפיצות של 7:',
    code: 'x <- 2\nwhile (x < 20) {\n  x <- x + 7\n  print(x)\n}',
    prompt: 'אילו מספרים יודפסו?',
    options: ['9 16', '9 16 23', '2 9 16', '23'],
    answer: 1,
    hint: 'שימו לב לסדר השורות בתוך הלולאה, ולרגע שבו R בודק את התנאי.',
    explanation: [
      {
        text: 'R בודק את `x < 20` רק **בתחילת** כל סיבוב. בתוך הסיבוב הוא קודם מגדיל את `x` ורק אז מדפיס. כל שורה בטבלה היא בדיקה אחת: הערך של `x` בזמן הבדיקה, ומה מודפס באותו סיבוב:',
        table: {
          columns: ['x', 'x < 20', 'print(x)'],
          rows: [['2', 'TRUE', '9'], ['9', 'TRUE', '16'], ['16', 'TRUE', '23'], ['23', 'FALSE', '-']],
          rowNames: ['1', '2', '3', '4'],
          highlightRows: [2]
        }
      },
      {
        text: 'בסיבוב השלישי `x` היה `16` בזמן הבדיקה, ולכן R נכנס, הגדיל ל-`23` והדפיס. רק בבדיקה הבאה הלולאה נעצרת:',
        output: '[1] 9\n[1] 16\n[1] 23'
      }
    ],
    whyWrong: {
      0: 'הלולאה לא נעצרת באמצע סיבוב ברגע ש-`x` עובר את 20. התנאי נבדק רק בתחילת הסיבוב: בתחילת הסיבוב השלישי `x` הוא `16`, ולכן R מגדיל אותו ל-`23` **ומדפיס** אותו, ורק אחר כך עוצר.',
      2: 'זה מה שהיה מודפס אם `print(x)` היה בא **לפני** `x <- x + 7`. כאן R קודם מגדיל את `x` ורק אז מדפיס, ולכן `2` לא מודפס אף פעם.',
      3: '`23` הוא הערך של `x` אחרי הלולאה. אבל `print(x)` נמצא בתוך הלולאה, ולכן הוא מדפיס בכל אחד משלושת הסיבובים.'
    }
  },

  {
    id: 'loops-next-skip',
    station: 'loops',
    level: 3,
    context: 'קריאות של חיישן. מספר שלילי הוא תקלה:',
    code: 'readings <- c(5, -2, 3, 8, -1, 4)\ntotal <- 0\nfor (r in readings) {\n  if (r < 0) {\n    next\n  }\n  total <- total + r\n}\ntotal',
    options: ['17', '5', '20', '-3'],
    answer: 2,
    hint: 'מה ההבדל בין `next` ל-`break`? עברו על הקריאות אחת-אחת.',
    explanation: [
      {
        text: 'כש-`r` שלילי, `next` מדלג על **שאר הסיבוב** (כלומר על `total <- total + r`) ועובר מיד לקריאה הבאה. הלולאה עצמה ממשיכה:',
        vector: {
          values: ['5', '-2', '3', '8', '-1', '4'],
          marks: ['on', 'drop', 'on', 'on', 'drop', 'on'],
          labels: ['+5', 'next', '+3', '+8', 'next', '+4']
        }
      },
      {
        text: 'הלולאה עוברת על כל 6 הקריאות, ומחברת רק את החיוביות: `5 + 3 + 8 + 4`',
        output: '[1] 20'
      }
    ],
    whyWrong: {
      0: '`17` הוא הסכום של **כל** הקריאות, כולל השליליות, כלומר `sum(readings)`. אבל כש-`r` שלילי, `next` מדלג על השורה `total <- total + r`, ולכן השליליות לא נוספות.',
      1: '`5` הוא מה שהיה יוצא עם `break`: הלולאה הייתה נעצרת לגמרי בקריאה השלילית הראשונה. `next` לא עוצר את הלולאה, הוא רק מדלג לסיבוב הבא.',
      3: '`-3` הוא הסכום של הקריאות השליליות בלבד (`-2 + -1`). `next` לא אומר "המשיכו לשורה הבאה": הוא אומר "דלגו לסיבוב הבא", ולכן דווקא השליליות **לא** נוספות.'
    }
  },

  {
    id: 'loops-break-before-print',
    station: 'loops',
    level: 3,
    context: 'מעמיסים שקיות על עגלה שמחזיקה עד 10 קילו:',
    code: 'bags <- c(3, 5, 4, 6, 2)\nload <- 0\nfor (w in bags) {\n  load <- load + w\n  if (load > 10) {\n    break\n  }\n  print(load)\n}',
    prompt: 'אילו מספרים יודפסו?',
    options: ['3 8 12', '3 8 12 18 20', '12', '3 8'],
    answer: 3,
    hint: 'עקבו אחרי `load` בכל סיבוב. מה קורה לשורות שבאות **אחרי** `break`?',
    explanation: [
      {
        text: 'בכל סיבוב קודם מוסיפים את `w` ל-`load`, ואחר כך בודקים אם `load > 10`:',
        table: {
          columns: ['w', 'load', 'load > 10', 'print(load)'],
          rows: [['3', '3', 'FALSE', '3'], ['5', '8', 'FALSE', '8'], ['4', '12', 'TRUE', '-']],
          rowNames: ['1', '2', '3'],
          highlightRows: [2]
        }
      },
      {
        text: '`break` יוצא מהלולאה **מיד**, לפני `print(load)`. השקיות `6` ו-`2` לא נבדקות בכלל:',
        output: '[1] 3\n[1] 8'
      }
    ],
    whyWrong: {
      0: 'בסיבוב השלישי `load` הופך ל-`12` והתנאי `TRUE`. `break` יוצא מהלולאה **מיד**, ולכן `print(load)`, שבא אחריו, לא רץ בסיבוב הזה.',
      1: '`break` לא יוצא רק מה-`if`: הוא עוצר את **כל** הלולאה. `3 8 12 18 20` הוא מה שהקוד היה מדפיס בלי ה-`if` וה-`break`.',
      2: '`12` הוא הערך של `load` כשהלולאה נעצרת, ואותו הייתם רואים אם הייתם כותבים `load` בשורה נפרדת אחרי הלולאה. אבל `print(load)` נמצא בתוך הלולאה, והוא מספיק לרוץ פעמיים לפני ה-`break`.'
    }
  }
];
