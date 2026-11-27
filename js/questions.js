/*
 * Question bank: 7 lab stations (course weeks 1–7), 203 questions (70 easy, 70 medium, 63 hard).
 * A station run draws some of each level (questionsPerRun in js/config.js), the ones not yet answered right first.
 * Written from the course material in the style of the exam. None of the exam's questions are used.
 * To check that every answer matches what R really prints, run:  node tools/check-answers.mjs
 * (needs Node 18+ and R; README.md explains how to run it on Windows, macOS and Linux)
 *
 * Fields of a question:
 *   id          a string in quotes, unique and stable (progress is saved by id, so don't rename after release)
 *   station     the id of a station from js/config.js
 *   level       1 = קל, 2 = בינוני, 3 = קשה
 *   prompt      optional question line; default "מה יהיה הפלט?" (for example "מה יודפס?")
 *   context     optional short Hebrew line shown above the code
 *   code        the R code (use \n for new lines)
 *   options     4 answers, each a non-empty string in quotes, written like the exam (without the [1]). An option
 *               with Hebrew letters is shown as right-to-left text, for example 'שגיאה (Error)'. If the right
 *               answer is an error, its option must contain the word Error (or set expectError), and the
 *               explanation needs an output step with R's exact error message.
 *   answer      index of the right option: 0 = a, 1 = b, 2 = c, 3 = d
 *   hint        a Hebrew hint
 *   explanation the step-by-step explanation shown after answering (see below)
 *   whyWrong    for each WRONG option index: why it's tempting and why it's wrong
 *   manual      optional, true = the checker runs the code but doesn't compare the options (only for a Hebrew-text
 *               right answer; R warnings and the output step are still checked)
 *   warning     optional, true = R may print a warning or message for this question (students see it too);
 *               a string = the same, but only a warning or message that contains this text is accepted
 *   expectError optional, true = the right answer is an R error even though its option has no word Error;
 *               false = the right answer is not an error even though its option contains the word Error
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
 *   output: 'exactly what R prints, for example [1] 2' (the checker compares the last output step with R;
 *           with a warning field it may also include R's warning lines). Without any output step the game
 *           shows "[1] " + the right option (or nothing for a Hebrew-text option), and the checker checks that.
 */
window.GAME_QUESTIONS = [
  // ===== שבוע 1: משתנים וסוגי נתונים =====
  {
    id: 'basics-mod-racks',
    station: 'basics',
    level: 1,
    context: 'ביום הראשון במעבדה קיבלתם 23 מבחנות חדשות. בכל קופסה נכנסות 4 מבחנות:',
    code: 'new_tubes <- 23\nnew_tubes %% 4',
    options: ['5', '3', '5.75', '0.75'],
    answer: 1,
    hint: 'ב-R יש כמה סוגי חילוק: `/`, `%/%` ו-`%%`. נסו להיזכר מה כל אחד מהם מחזיר, ובמיוחד מה `%%` עושה עם מה שלא מתחלק בדיוק.',
    explanation: [
      {
        text: '`%%` מחזיר את **השארית** של החילוק. קודם בודקים כמה פעמים 4 נכנס ב-23 בשלמות: `4 * 5 = 20`, כלומר 5 קופסאות מלאות.'
      },
      {
        text: 'מה שנשאר בחוץ הוא `23 - 20 = 3` מבחנות. זאת השארית:',
        output: '[1] 3'
      }
    ],
    whyWrong: {
      0: '`5` הוא מספר הקופסאות **המלאות**, כלומר מה ש-`23 %/% 4` מדפיס (חילוק שלם). `%%` מחזיר את מה שנשאר אחרי שממלאים אותן: 3 מבחנות.',
      2: '`5.75` הוא מה ש-`23 / 4` מדפיס, חילוק רגיל. `%%` הוא לא חילוק רגיל: הוא מחזיר את השארית.',
      3: 'השארית היא לא החלק שאחרי הנקודה ב-`5.75`. השארית היא כמה מבחנות **נשארו** בחוץ: `23 - 4 * 5 = 3`. (`0.75` הוא בעצם `3 / 4`, השארית מחולקת ב-4.)'
    }
  },

  {
    id: 'basics-class-compare',
    station: 'basics',
    level: 1,
    context: 'בארגז הציוד של הקבלה יש 12 משקפי מגן:',
    code: 'goggles <- 12\nmany <- goggles > 9\nclass(many)',
    options: ['"numeric"', 'TRUE', '"character"', '"logical"'],
    answer: 3,
    hint: 'קודם חשבו מה נשמר ב-`many`: מספר, טקסט, או משהו אחר? ואז זכרו מה `class()` מחזיר.',
    explanation: [
      {
        text: '`goggles > 9` היא השוואה: האם 12 גדול מ-9? התשובה היא `TRUE`, והיא נשמרת ב-`many`.'
      },
      {
        text: '`TRUE` ו-`FALSE` הם ערכים **לוגיים**. `class()` לא מדפיס את הערך עצמו, אלא את **הסוג** שלו:',
        output: '[1] "logical"'
      }
    ],
    whyWrong: {
      0: 'נכון שבהשוואה יש מספרים (`12` ו-`9`), אבל התוצאה של השוואה היא `TRUE` או `FALSE`, לא מספר. לכן הסוג של `many` הוא `"logical"`. (`class(goggles)` היה מדפיס `"numeric"`.)',
      1: '`TRUE` הוא **הערך** של `many`, כלומר מה שהשורה `many` לבדה הייתה מדפיסה. `class()` מחזיר את **הסוג** של הערך, ולכן מקבלים `"logical"`.',
      2: 'התוצאה של השוואה היא הערך הלוגי `TRUE`, בלי מרכאות, ולא הטקסט `"TRUE"`. רק טקסט בתוך מרכאות, כמו `"TRUE"`, הוא מסוג `"character"`.'
    }
  },

  {
    id: 'basics-sqrt-abs',
    station: 'basics',
    level: 1,
    context: 'על השלט שליד דלת המעבדה כתוב מספר שלילי:',
    code: 'clue <- -36\nsqrt(abs(clue))',
    options: ['6', '-6', '18', 'שגיאה (Error)'],
    answer: 0,
    hint: 'כשפונקציה נמצאת בתוך פונקציה אחרת, איזו מהן R מריץ קודם?',
    explanation: [
      {
        text: 'R מתחיל מהפונקציה **הפנימית**: `abs(clue)` מחזיר את הערך המוחלט של `-36`, כלומר `36`.'
      },
      {
        text: 'עכשיו `sqrt()` מקבל `36` ומחזיר את השורש שלו. `6 * 6 = 36`, ולכן השורש הוא `6`, וזה קוד הדלת:',
        output: '[1] 6'
      }
    ],
    whyWrong: {
      1: '`abs()` כבר הוריד את המינוס לפני ש-`sqrt()` רץ, ו-`sqrt()` של מספר חיובי מחזיר שורש חיובי. המינוס לא חוזר.',
      2: '`18` הוא `36 / 2`, כלומר חצי. אבל `sqrt()` מחזיר **שורש**: המספר שכפול עצמו נותן 36, וזה `6`.',
      3: 'שורש של מספר שלילי באמת לא עובד (`sqrt(-36)` מחזיר `NaN`, "לא מספר", עם אזהרה). אבל כאן `sqrt()` לא מקבל את `-36`: R מריץ קודם את `abs(clue)`, ולכן `sqrt()` מקבל `36`.'
    }
  },

  {
    id: 'basics-paste-calc',
    station: 'basics',
    level: 2,
    context: 'מכינים שלט לדלת של החדר שלכם:',
    code: 'paste("Room", 3 + 4)',
    options: ['"Room 3 + 4"', '"Room7"', '"Room 7"', 'שגיאה (Error), כי אי אפשר לחבר טקסט ומספר'],
    answer: 2,
    hint: 'שימו לב ש-`3 + 4` כתוב בלי מרכאות. ומה `paste()` עושה כשהוא מחבר כמה חלקים?',
    explanation: [
      {
        text: '`3 + 4` כתוב בלי מרכאות, ולכן זה חישוב: R מחשב אותו קודם ומקבל `7`.'
      },
      {
        text: '`paste()` מחבר את `"Room"` ואת `7` לטקסט אחד. הוא יודע לחבר גם מספרים (הוא הופך אותם לטקסט), ובברירת המחדל הוא שם **רווח** בין החלקים:',
        output: '[1] "Room 7"'
      }
    ],
    whyWrong: {
      0: 'רק מה שבתוך מרכאות נשאר טקסט כמו שהוא. `3 + 4` כתוב בלי מרכאות, ולכן R מחשב אותו קודם, ו-`paste()` מקבל `7`. (`paste("Room", "3 + 4")`, עם מרכאות, היה מדפיס את זה.)',
      1: '`paste()` שם **רווח** בין החלקים שהוא מחבר (זאת ברירת המחדל), ולכן מקבלים `"Room 7"` עם רווח.',
      3: 'חשבון כמו `+` על טקסט אכן נותן שגיאה, אבל כאן `+` פועל רק על `3` ו-`4`, שהם מספרים. `paste()` לא מחשב: הוא **מחבר לטקסט אחד**, וממיר את `7` לטקסט בעצמו.'
    }
  },

  {
    id: 'basics-convert-not-saved',
    station: 'basics',
    level: 2,
    context: 'בטופס הרישום מופיע מספר התג שלכם:',
    code: 'id_text <- "31"\nid_num <- as.numeric(id_text)\nid_text + 1',
    options: ['32', '"32"', '"311"', 'שגיאה (Error), כי `id_text` עדיין טקסט'],
    answer: 3,
    hint: 'עברו שורה-שורה: מה נשמר בכל משתנה, ובאיזה משתנה משתמשת השורה האחרונה?',
    explanation: [
      {
        text: '`id_text` מקבל `"31"` עם מרכאות, ולכן הוא **טקסט** (`"character"`).'
      },
      {
        text: '`as.numeric(id_text)` מחזיר את המספר `31`, והתוצאה נשמרת במשתנה **חדש**, `id_num`. המשתנה `id_text` עצמו לא משתנה ונשאר טקסט.'
      },
      {
        text: 'בשורה האחרונה R מנסה לחבר טקסט ומספר: `"31" + 1`. אי אפשר לעשות חשבון על טקסט, ולכן R עוצר עם שגיאה:',
        output: 'Error in id_text + 1 : non-numeric argument to binary operator'
      }
    ],
    whyWrong: {
      0: '`32` הוא מה ש-`id_num + 1` היה מדפיס. אבל `as.numeric()` לא משנה את `id_text`: הוא רק מחזיר מספר, שנשמר ב-`id_num`. `id_text` נשאר `"31"`, טקסט.',
      1: 'חשבון ב-R לא מחזיר טקסט עם מרכאות, ו-`+` בכלל לא עובד על טקסט. כאן `id_text` עדיין `"31"` (טקסט), ולכן R עוצר עם שגיאה.',
      2: 'ב-R הסימן `+` לא מדביק טקסטים זה לזה (כמו שקורה בחלק משפות התכנות האחרות), והוא בכלל לא עובד על טקסט. לכן `"31" + 1` עוצר עם שגיאה. כדי לחבר טקסטים משתמשים ב-`paste()`.'
    }
  },

  {
    id: 'basics-floor-negative',
    station: 'basics',
    level: 2,
    context: 'בכרטיס ההדפסה שלכם היו 5.2 שקלים, והדפסת טופס הרישום עלתה 8.9 שקלים:',
    code: 'balance <- 5.2 - 8.9\nfloor(balance)',
    options: ['-4', '-3', '3', '-3.7'],
    answer: 0,
    hint: 'קודם חשבו את `balance`. ואז: לאיזה כיוון `floor()` מעגל? שימו לב שהמספר שלילי.',
    explanation: [
      {
        text: '`5.2 - 8.9` הוא `-3.7`, וזה נשמר ב-`balance`.'
      },
      {
        text: '`floor()` מעגל **למטה**, כלומר למספר השלם הקטן יותר. `-4` קטן מ-`-3.7` (הוא רחוק יותר מאפס בצד השלילי), ו-`-3` גדול ממנו:',
        vector: {
          values: ['-5', '-4', '-3.7', '-3', '-2'],
          marks: ['off', 'on', '', 'off', 'off'],
          labels: ['', 'floor', 'balance', 'ceiling', '']
        }
      },
      {
        text: 'לכן `floor(-3.7)` הוא `-4`:',
        output: '[1] -4'
      }
    ],
    whyWrong: {
      1: '`-3` הוא מה ש-`ceiling(balance)` מדפיס. `floor()` לא "מוחק" את מה שאחרי הנקודה: הוא מעגל **למטה**, ובמספרים שליליים למטה פירושו `-4`.',
      2: '`3` הוא מה ש-`floor(abs(balance))` היה מדפיס: קודם מורידים את המינוס ואז מעגלים. אבל כאן אין `abs()`, ולכן המינוס נשאר.',
      3: '`-3.7` הוא הערך של `balance`. אבל השורה האחרונה מפעילה עליו את `floor()`, שמעגל אותו למספר שלם.'
    }
  },

  {
    id: 'basics-copy-value',
    station: 'basics',
    level: 3,
    context: 'בקבלה מחלקים חלוקי מעבדה למתמחים החדשים:',
    prompt: 'מה יודפס?',
    code: 'coats <- 20\ngiven <- 6\nleft <- coats - given\ngiven <- given + 4\ncoats <- left - given\ncoats',
    options: ['0', '20', '4', '8'],
    answer: 2,
    hint: 'עברו שורה-שורה ורשמו את הערך של כל משתנה אחרי כל שורה. שימו לב מתי כל ערך נשמר.',
    explanation: [
      {
        text: 'נעקוב אחרי הערכים אחרי כל שורה:',
        table: {
          columns: ['קוד', 'coats', 'given', 'left'],
          rows: [
            ['coats <- 20', '20', '', ''],
            ['given <- 6', '20', '6', ''],
            ['left <- coats - given', '20', '6', '14'],
            ['given <- given + 4', '20', '10', '14'],
            ['coats <- left - given', '4', '10', '14']
          ],
          rowNames: ['1', '2', '3', '4', '5'],
          highlightRows: [3, 4]
        }
      },
      {
        text: 'בשורה 3 `left` מקבל את **הערך** `20 - 6 = 14`. זה מספר שנשמר, לא נוסחה: כש-`given` גדל ל-10 בשורה 4, `left` נשאר `14`.'
      },
      {
        text: 'בשורה 5 מחשבים `14 - 10 = 4`, והערך הזה **מחליף** את ה-20 שהיה ב-`coats`:',
        output: '[1] 4'
      }
    ],
    whyWrong: {
      0: 'כאן חשבתם ש-`left` מתעדכן כש-`given` משתנה (`20 - 10 = 10`, ואז `10 - 10 = 0`). אבל `<-` שומר **ערך** ולא נוסחה: `left` קיבל `14` בשורה 3 ונשאר `14`.',
      1: '`<-` למשתנה שכבר קיים **מחליף** את הערך הקודם. בשורה 5 `coats` מקבל ערך חדש (`14 - 10 = 4`), וה-20 נמחק.',
      3: 'זה מה שיוצא אם `given` נשאר 6 (`14 - 6 = 8`). אבל `given <- given + 4` שומר את התוצאה בחזרה ב-`given`, ולכן מעכשיו `given` הוא 10.'
    }
  },

  {
    id: 'basics-middle-digit',
    station: 'basics',
    level: 3,
    context: 'קיבלתם תג כניסה למעבדה, ועליו מספר בן שלוש ספרות:',
    code: 'badge <- 472\na <- badge %/% 10\na %% 10',
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
        text: 'בעצם הקוד שולף את הספרה האמצעית של מספר התג:',
        output: '[1] 7'
      }
    ],
    whyWrong: {
      0: '`2` הוא מה ש-`badge %% 10` מדפיס: השארית של 472 עצמו. אבל בשורה 2 יש `%/%` (חילוק שלם), ולכן `a` הוא `47`, והשארית בשורה 3 מחושבת על `47`.',
      2: '`47` הוא הערך של `a`. אבל השורה האחרונה מחשבת עוד שלב: `a %% 10`, השארית של `47` חלקי 10, שהיא `7`.',
      3: '`4` הוא מה ש-`a %/% 10` היה מדפיס: חילוק שלם בלי השארית. בשורה האחרונה יש `%%`, שמחזיר את מה ש**נשאר**: `47 - 40 = 7`.'
    }
  },

  {
    id: 'basics-nchar-label',
    station: 'basics',
    level: 3,
    context: 'מכינים תווית ללוקר של טל:',
    code: 'name <- "Tal"\nper_day <- round(10 / 3, digits = 2)\nlabel <- paste(name, per_day)\nnchar(label)',
    options: ['7', '2', '6', '8'],
    answer: 3,
    hint: 'חשבו קודם מה נשמר ב-`per_day`, ומה בדיוק נמצא בתוך `label`, תו אחרי תו. מה `nchar()` סופר?',
    explanation: [
      {
        text: '`10 / 3` הוא `3.333333`, ו-`round(..., digits = 2)` משאיר 2 ספרות אחרי הנקודה: `per_day` הוא `3.33`.'
      },
      {
        text: '`paste()` מחבר את `"Tal"` ואת `3.33` עם רווח ביניהם, ולכן `label` הוא `"Tal 3.33"`. אלה התווים שבו:',
        vector: {
          values: ['T', 'a', 'l', '␣', '3', '.', '3', '3'],
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
      0: '`7` יוצא אם שוכחים את הרווח: זה מה ש-`nchar("Tal3.33")` מדפיס. אבל `paste()` שם רווח בין החלקים, ו-`nchar()` סופר גם אותו.',
      1: '`nchar()` לא סופר כמה חלקים חוברו או כמה מילים יש, אלא **תווים**. ב-`"Tal 3.33"` יש 8 תווים.',
      2: 'נראה שספרתם רק אותיות וספרות. `nchar()` סופר **כל** תו, וגם הרווח והנקודה הם תווים: `3 + 1 + 4 = 8`.'
    }
  },

  {
    id: 'basics-mean-no-parens',
    station: 'basics',
    level: 1,
    context: 'בשבוע הראשון במעבדה עבדתם 18 שעות, ובשבוע השני 24:',
    code: 'week1 <- 18\nweek2 <- 24\nweek1 + week2 / 2',
    options: ['21', '42', '30', '12'],
    answer: 2,
    hint: 'האם R מחשב תמיד משמאל לימין, או שיש פעולות שקודמות לאחרות? חשבו מה R עושה כאן קודם: את החיבור או את החילוק.',
    explanation: [
      {
        text: 'R מחשב **כפל וחילוק לפני חיבור וחיסור**, בדיוק כמו בחשבון. לכן הוא מתחיל מ-`week2 / 2`, כלומר `24 / 2 = 12`.'
      },
      {
        text: 'רק אחר כך R מחבר את `week1` לתוצאה: `18 + 12 = 30`:',
        output: '[1] 30'
      }
    ],
    whyWrong: {
      0: '`21` הוא הממוצע האמיתי, וזה מה ש-`(week1 + week2) / 2` מדפיס. בלי סוגריים R מחלק ב-2 רק את `week2`, ורק אחר כך מחבר את `week1`.',
      1: '`42` הוא `week1 + week2`, הסכום בלי החילוק. אבל החילוק לא נעלם: R מבצע אותו על `week2` לפני החיבור.',
      3: '`12` הוא רק `week2 / 2`, השלב הראשון בחישוב. אחריו R עוד מוסיף את `week1`, ולכן התוצאה היא `30`.'
    }
  },

  {
    id: 'basics-ceiling-vans',
    station: 'basics',
    level: 1,
    context: '26 מתמחים חדשים יורדים במעלית אל המעבדה שבמרתף. במעלית יש מקום ל-8 אנשים בכל נסיעה:',
    code: 'interns <- 26\nceiling(interns / 8)',
    options: ['4', '3', '3.25', '2'],
    answer: 0,
    hint: 'קודם חשבו את `interns / 8`. אחר כך: לאיזה כיוון `ceiling()` מעגל?',
    explanation: [
      {
        text: 'R מחשב קודם את מה שבתוך הסוגריים: `26 / 8 = 3.25`. כלומר 3 נסיעות מלאות, ועוד כמה מתמחים שנשארו למעלה.',
        vector: {
          values: ['3', '3.25', '4'],
          marks: ['off', '', 'on'],
          labels: ['floor', 'interns / 8', 'ceiling']
        }
      },
      {
        text: '`ceiling()` מעגל **למעלה**, למספר השלם הבא, גם כשהחלק שאחרי הנקודה קטן. לכן `3.25` הופך ל-`4`, וגם המתמחים שנשארו מגיעים למעבדה:',
        output: '[1] 4'
      }
    ],
    whyWrong: {
      1: '`3` הוא מה ש-`floor(interns / 8)` מדפיס (וגם `round(interns / 8)`, כי `3.25` קרוב יותר ל-3). אבל `ceiling()` תמיד מעגל **למעלה**.',
      2: '`3.25` הוא `interns / 8` לפני העיגול. `ceiling()` מקבל את המספר הזה ומחזיר מספר שלם.',
      3: '`2` הוא מספר המתמחים שנשארו למעלה אחרי 3 נסיעות מלאות, כלומר מה ש-`interns %% 8` מדפיס. הקוד כאן לא מחשב שארית: הוא מעגל את `3.25` למעלה.'
    }
  },

  {
    id: 'basics-case-object',
    station: 'basics',
    level: 1,
    context: 'הפיקדון על מפתח ללוקר הוא 25 שקלים, ולקחתם שני מפתחות:',
    code: 'Deposit <- 25\ndeposit * 2',
    options: ['50', 'שגיאה (Error), כי שם של משתנה לא יכול להתחיל באות גדולה', '0', 'שגיאה (Error), כי לא קיים משתנה בשם `deposit`'],
    answer: 3,
    hint: 'מה R עושה בכל אחת משתי השורות? קראו את הקוד אות אחרי אות.',
    explanation: [
      {
        text: 'בשורה הראשונה נוצר משתנה בשם `Deposit`, עם D **גדולה**. זה שם חוקי: שם של משתנה צריך להתחיל באות, ואות גדולה היא אות.'
      },
      {
        text: 'R מבחין בין אותיות גדולות לקטנות, ולכן `Deposit` ו-`deposit` הם שני שמות **שונים**. בשורה השנייה R מחפש משתנה בשם `deposit`, עם d קטנה, ולא מוצא אותו:',
        output: "Error: object 'deposit' not found"
      }
    ],
    whyWrong: {
      0: '`50` היה נכון אם R לא היה מבחין בין אותיות גדולות לקטנות. אבל בשביל R, `Deposit` ו-`deposit` הם שני משתנים שונים, ומשתנה בשם `deposit` לא נוצר אף פעם.',
      1: 'השורה הראשונה רצה בלי בעיה: מותר ששם של משתנה יתחיל באות גדולה. השגיאה מגיעה רק בשורה השנייה, כי שם כתוב `deposit` עם d קטנה, ומשתנה כזה לא קיים.',
      2: 'R לא נותן את הערך 0 למשתנה שלא נוצר. כשמשתמשים בשם שלא קיים, R עוצר עם השגיאה `object \'deposit\' not found`.'
    }
  },

  {
    id: 'basics-quoted-name',
    station: 'basics',
    level: 1,
    context: 'בטופס הרישום למעבדה שומרים את השם הפרטי של מתמחה חדשה:',
    code: 'name <- "Tamar"\nnchar("name")',
    options: ['5', '4', '6', 'שגיאה (Error)'],
    answer: 1,
    hint: 'מה ההבדל בין `name` לבין `"name"`? על מה בדיוק `nchar()` סופר כאן?',
    explanation: [
      {
        text: 'בשורה הראשונה נוצר משתנה בשם `name`, ובתוכו הטקסט `"Tamar"`.'
      },
      {
        text: 'בשורה השנייה `"name"` כתוב **בתוך מרכאות**, ולכן R לא מחפש משתנה: זה פשוט טקסט של 4 אותיות. המשתנה `name` לא משתתף בחישוב בכלל.',
        vector: {
          values: ['n', 'a', 'm', 'e'],
          marks: ['on', 'on', 'on', 'on'],
          showIndex: true
        }
      },
      {
        text: '`nchar()` סופר את התווים בטקסט הזה:',
        output: '[1] 4'
      }
    ],
    whyWrong: {
      0: '`5` הוא מספר האותיות ב-`"Tamar"`, כלומר מה ש-`nchar(name)` (בלי מרכאות) מדפיס. עם מרכאות R לא פונה למשתנה, אלא סופר את האותיות של המילה `"name"` עצמה.',
      2: 'המרכאות רק מסמנות ל-R איפה הטקסט מתחיל ואיפה הוא נגמר. הן לא חלק מהטקסט, ו-`nchar()` לא סופר אותן.',
      3: 'טקסט בתוך מרכאות הוא תמיד תקין, גם כשיש משתנה עם אותו שם. שגיאה הייתה מגיעה במקרה ההפוך: מילה **בלי** מרכאות שאין משתנה בשם הזה, למשל `nchar(surname)`.'
    }
  },

  {
    id: 'basics-mod-smaller',
    station: 'basics',
    level: 2,
    context: 'במשמרת הראשונה שלכם מילאתם 5 מבחנות, ובכל מגש נכנסות 8 מבחנות:',
    code: 'filled <- 5\nfilled %% 8',
    options: ['3', '0', '0.625', '5'],
    answer: 3,
    hint: 'מה בדיוק `%%` מחזיר? נסו לדמיין שאתם מסדרים את המבחנות במגשים.',
    explanation: [
      {
        text: '`%%` מחזיר את **השארית**: מה שנשאר אחרי שממלאים כמה שיותר מגשים שלמים. 8 לא נכנס ב-5 אפילו פעם אחת, ולכן אין אף מגש מלא (`filled %/% 8` הוא `0`).'
      },
      {
        text: 'אף מגש לא התמלא, ולכן כל 5 המבחנות נשארו בחוץ. כשהמספר קטן מהמספר שמחלקים בו, השארית היא המספר עצמו:',
        output: '[1] 5'
      }
    ],
    whyWrong: {
      0: '`3` הוא כמה מבחנות **חסרות** כדי למלא מגש אחד (`8 - 5`). `%%` לא מחשב כמה חסר, אלא כמה **נשאר**: אף מגש לא התמלא, ולכן נשארו כל 5 המבחנות.',
      1: '`0` הוא מספר המגשים המלאים, כלומר מה ש-`filled %/% 8` מדפיס. `%%` מחזיר את מה שנשאר אחרי שממלאים אותם, ונשארו כל 5 המבחנות.',
      2: '`0.625` הוא מה ש-`filled / 8` מדפיס, חילוק רגיל. `%%` מחזיר שארית, והשארית כאן היא `5`.'
    }
  },

  {
    id: 'basics-mod-divisible',
    station: 'basics',
    level: 2,
    context: 'בחדר ההדרכה של המעבדה יש 18 כיסאות, ומסדרים אותם בשורות של 6:',
    code: 'chairs <- 18\nchairs %% 6 == 0',
    options: ['TRUE', '0', 'FALSE', '3'],
    answer: 0,
    hint: 'בשורה השנייה יש שתי פעולות: חשבון והשוואה. מה יוצא מכל אחת מהן?',
    explanation: [
      {
        text: 'R מחשב קודם את `chairs %% 6`: 6 נכנס ב-18 בדיוק 3 פעמים (`6 * 3 = 18`), ולא נשאר כלום. השארית היא `0`.'
      },
      {
        text: 'עכשיו `0 == 0` בודק אם השארית שווה ל-0. היא שווה, ולכן התוצאה היא הערך הלוגי `TRUE`. כך בודקים ב-R אם מספר מתחלק במספר אחר בלי שארית:',
        output: '[1] TRUE'
      }
    ],
    whyWrong: {
      1: '`0` הוא השארית, כלומר מה ש-`chairs %% 6` לבד מדפיס. אבל השורה ממשיכה: `== 0` משווה את השארית ל-0, והתוצאה של השוואה היא `TRUE` או `FALSE`.',
      2: 'כאן חשבתם ש-`%%` מחזיר את מספר השורות, `3`, ואז `3 == 0` הוא `FALSE`. אבל את מספר השורות מחזיר `%/%`. `%%` מחזיר את השארית, והיא `0`.',
      3: '`3` הוא מספר השורות המלאות, כלומר מה ש-`chairs %/% 6` מדפיס. בקוד יש `%%` (שארית), ואחריו גם השוואה ל-0, ולכן התוצאה היא ערך לוגי.'
    }
  },

  {
    id: 'basics-swap-no-temp',
    station: 'basics',
    level: 2,
    context: 'בלוח המשמרות של השבוע הראשון רשומים שיר ועידו:',
    code: 'day_shift <- "Shir"\nnight_shift <- "Ido"\nday_shift <- night_shift\nnight_shift <- day_shift\npaste(day_shift, night_shift)',
    options: ['"Ido Shir"', '"Ido Ido"', '"Shir Ido"', '"Shir Shir"'],
    answer: 1,
    hint: 'עקבו אחרי שני המשתנים שורה אחרי שורה. מה שמור ב-`day_shift` ברגע ששורה 4 רצה?',
    explanation: [
      {
        text: 'נעקוב אחרי הערכים אחרי כל שורה:',
        table: {
          columns: ['קוד', 'day_shift', 'night_shift'],
          rows: [
            ['day_shift <- "Shir"', '"Shir"', ''],
            ['night_shift <- "Ido"', '"Shir"', '"Ido"'],
            ['day_shift <- night_shift', '"Ido"', '"Ido"'],
            ['night_shift <- day_shift', '"Ido"', '"Ido"']
          ],
          rowNames: ['1', '2', '3', '4'],
          highlightRows: [2, 3]
        }
      },
      {
        text: 'בשורה 3 `day_shift` מקבל את `"Ido"`, והערך `"Shir"` **נמחק**: הוא כבר לא שמור באף משתנה. לכן בשורה 4 `night_shift` מקבל את מה שיש עכשיו ב-`day_shift`, וזה שוב `"Ido"`.'
      },
      {
        text: 'כדי להחליף באמת צריך משתנה שלישי שישמור את הערך הישן לפני שהוא נמחק: `tmp <- day_shift`, אחר כך `day_shift <- night_shift`, ובסוף `night_shift <- tmp`. בקוד הזה אין משתנה כזה, ולכן:',
        output: '[1] "Ido Ido"'
      }
    ],
    whyWrong: {
      0: 'זאת התוצאה של החלפה אמיתית, אבל שתי השורות האלה לא מחליפות ערכים. אחרי שורה 3 השם `"Shir"` כבר לא שמור בשום מקום, ולכן שורה 4 מעתיקה ל-`night_shift` את `"Ido"`. בשביל החלפה צריך משתנה שלישי, כמו `tmp`.',
      2: 'כאן חשבתם ששתי השורות מבטלות זו את זו וחוזרים למצב ההתחלתי. אבל כל `<-` מחליף ערך: אחרי שורה 3 השם `"Shir"` נמחק, ושורה 4 רק מעתיקה את `"Ido"` פעם נוספת.',
      3: 'כך יוצא אם קוראים את החץ הפוך, כאילו `day_shift <- night_shift` מעתיק את `day_shift` לתוך `night_shift`. אבל החץ מצביע אל המשתנה שמקבל את הערך: המשתנה **משמאל** ל-`<-` מקבל את הערך שמימין.'
    }
  },

  {
    id: 'basics-round-carry',
    station: 'basics',
    level: 3,
    context: 'שעון הנוכחות של המעבדה רשם שבמשמרת הראשונה עבדתם 7.96 שעות:',
    code: 'worked <- 7.96\nround(worked, digits = 1) - floor(worked)',
    options: ['0.9', '1.0', '1', '0'],
    answer: 2,
    hint: 'חשבו כל אחד משני החלקים לבד, ואחר כך את ההפרש. לאיזה כיוון מעגלת כל פונקציה, ומה בדיוק R מדפיס בסוף?',
    explanation: [
      {
        text: '`round(worked, digits = 1)` משאיר ספרה **אחת** אחרי הנקודה, ומעגל לפי הספרה שאחריה. כאן זו `6`, ולכן מעגלים למעלה: `7.96` הופך ל-`8.0`. ה-9 עולה ב-1, ולכן משתנה גם הספרה שלפני הנקודה.'
      },
      {
        text: '`floor(worked)` מעגל **למטה** למספר שלם, ולכן הוא `7`:',
        vector: {
          values: ['7', '7.96', '8'],
          marks: ['on', '', 'on'],
          labels: ['floor', 'worked', 'round']
        }
      },
      {
        text: 'ההפרש הוא `8 - 7 = 1`. R לא מדפיס אפסים מיותרים בסוף מספר, ולכן מודפס `1` ולא `1.0`:',
        output: '[1] 1'
      }
    ],
    whyWrong: {
      0: 'כך יוצא אם `round()` היה **חותך** את מה שאחרי הספרה הראשונה (`7.9 - 7 = 0.9`). אבל `round()` מעגל לפי הספרה הבאה, `6`, ולכן `7.96` הופך ל-`8`.',
      1: 'נכון שהחישוב הוא `8.0 - 7`, אבל בשביל R `8.0` ו-`8` הם אותו מספר, והוא לא מדפיס אפסים מיותרים בסוף מספר. לכן ההפרש מודפס כ-`1`.',
      3: 'כך יוצא אם חושבים ש-`floor()` מעגל למספר השלם הקרוב, `8`. אבל `floor()` תמיד מעגל **למטה**: `floor(7.96)` הוא `7`.'
    }
  },

  {
    id: 'basics-power-minus',
    station: 'basics',
    level: 3,
    context: 'המעבדה נמצאת במרתף, בקומה מינוס 3:',
    code: 'lab_floor <- -3\npart1 <- lab_floor^2\npart2 <- -2^2\npart1 + part2',
    options: ['13', '5', '-13', '-5'],
    answer: 1,
    hint: 'השוו בין שורה 2 לשורה 3: בשתיהן יש מינוס וחזקה, אבל לא באותה צורה. מה R מחשב קודם בכל אחת מהן?',
    explanation: [
      {
        text: '`lab_floor` שומר את הערך `-3`, כולל המינוס. `lab_floor^2` מעלה בריבוע את כל הערך: `(-3) * (-3) = 9`. לכן `part1` הוא `9`.'
      },
      {
        text: 'ב-`-2^2` החזקה `^` מחושבת **לפני** המינוס, כמו בחשבון: קודם `2^2 = 4`, ורק אחר כך המינוס. לכן `part2` הוא `-4`. (כדי להעלות בריבוע את `-2` צריך סוגריים: `(-2)^2`.)'
      },
      {
        text: '`part1 + part2` הוא `9 + (-4)`:',
        output: '[1] 5'
      }
    ],
    whyWrong: {
      0: 'כאן חשבתם ש-`part2` הוא `4`, כאילו `-2^2` הוא `(-2)^2`. אבל `^` מחושב לפני המינוס, ולכן `-2^2` הוא `-(2^2) = -4`, ו-`9 + (-4) = 5`.',
      2: 'כאן חשבתם שגם `part1` שלילי, כאילו R מעתיק את הטקסט `-3` לתוך הקוד ומחשב `-3^2`. אבל `lab_floor` שומר **ערך**, `-3`, ו-`^2` פועל על כל הערך: `(-3)^2 = 9`.',
      3: 'כאן התחלפו שני הכללים. `lab_floor^2` הוא `9` (ריבוע של הערך `-3`), ו-`-2^2` הוא `-4` (החזקה לפני המינוס). לכן `part1 + part2` הוא `9 + (-4) = 5`, ולא `-9 + 4`.'
    }
  },

  {
    id: 'basics-print-not-saved',
    station: 'basics',
    level: 3,
    context: 'בקבלה סופרים כמה תגי כניסה מוכנים למתמחים החדשים:',
    prompt: 'מה יודפס?',
    code: 'badges <- 10\nbadges + 5\nbadges <- badges * 2\nbadges <- badges - 3\nbadges',
    options: ['17', '27', '15 27', '15 17'],
    answer: 3,
    hint: 'עברו שורה-שורה. באילו שורות יש `<-` ובאילו אין? מה קורה בכל אחד משני סוגי השורות?',
    explanation: [
      {
        text: 'נעקוב אחרי `badges` ואחרי מה שמודפס בכל שורה:',
        table: {
          columns: ['קוד', 'badges', 'מודפס'],
          rows: [
            ['badges <- 10', '10', ''],
            ['badges + 5', '10', '15'],
            ['badges <- badges * 2', '20', ''],
            ['badges <- badges - 3', '17', ''],
            ['badges', '17', '17']
          ],
          rowNames: ['1', '2', '3', '4', '5'],
          highlightRows: [1, 4]
        }
      },
      {
        text: 'בשורה 2 אין `<-`: R מחשב `10 + 5` ו**מדפיס** `15`, אבל לא שומר את התוצאה. `badges` נשאר `10`.'
      },
      {
        text: 'שורות 3 ו-4 שומרות בלי להדפיס: `10 * 2 = 20`, ואז `20 - 3 = 17`. השורה האחרונה מדפיסה את `badges`. בסך הכול R מדפיס שני מספרים:',
        output: '[1] 15\n[1] 17'
      }
    ],
    whyWrong: {
      0: '`17` הוא באמת הערך של `badges` בסוף, אבל הוא לא הדבר היחיד שמודפס. שורה בלי `<-`, כמו `badges + 5`, מדפיסה את התוצאה שלה, ולכן קודם מודפס `15`.',
      1: 'כאן הנחתם ש-`badges + 5` שומר את התוצאה ב-`badges` (ואז `15 * 2 - 3 = 27`) ולא מדפיס כלום. בפועל זה הפוך: השורה מדפיסה `15` ולא משנה את `badges`.',
      2: 'נכון ש-`badges + 5` מדפיס `15`, אבל הוא לא שומר את התוצאה: רק `<-` משנה משתנה. לכן `badges` נשאר `10`, ובסוף הוא `10 * 2 - 3 = 17`, ולא `27`.'
    }
  },

  {
    id: 'basics-nchar-times',
    station: 'basics',
    level: 1,
    context: 'השם של מתמחה חדשה נשמר בטופס הרישום:',
    code: 'intern <- "Yael"\nlen <- nchar(intern)\nlen * 3',
    options: ['4', '12', '"YaelYaelYael"', 'שגיאה (Error), כי אי אפשר לכפול טקסט'],
    answer: 1,
    hint: 'מה `nchar()` מחזיר: טקסט או מספר? ומה בעצם נשמר ב-`len`?',
    explanation: [
      {
        text: '`nchar(intern)` סופר כמה תווים יש בטקסט `"Yael"`: ארבע אותיות. התוצאה היא **המספר** `4`, והיא נשמרת ב-`len`.'
      },
      {
        text: 'מכיוון ש-`len` הוא מספר, אפשר לעשות איתו חשבון: `4 * 3 = 12`.',
        output: '[1] 12'
      }
    ],
    whyWrong: {
      0: '`4` הוא הערך של `len`, כלומר מה ש-`nchar(intern)` מדפיס. אבל השורה האחרונה כופלת אותו ב-3.',
      2: 'הכפל פועל על `len`, ולא על השם, ו-`len` הוא המספר `4`. וגם אילו כפלתם את הטקסט עצמו, `*` לא היה משכפל אותו: `intern * 3` עוצר עם שגיאה.',
      3: 'השם `"Yael"` הוא אכן טקסט, אבל כופלים את `len`, ולא את `intern`. `len` הוא התוצאה של `nchar()`, והיא **מספר**, ולכן אפשר לכפול אותו.'
    }
  },

  {
    id: 'basics-not-equal',
    station: 'basics',
    level: 1,
    context: 'במשמרת הבוקר יש 9 אנשי צוות, ובארון יש 12 חלוקי מעבדה:',
    code: 'team <- 9\ncoats <- 12\nteam != coats',
    options: ['FALSE', '-3', 'TRUE', '3'],
    answer: 2,
    hint: 'מה הסימן `!=` בודק? נסו לקרוא את השורה האחרונה במילים.',
    explanation: [
      {
        text: '`!=` פירושו **"לא שווה"**. R בודק: האם 9 שונה מ-12?'
      },
      {
        text: '9 ו-12 הם באמת מספרים שונים, ולכן הטענה "לא שווים" נכונה:',
        output: '[1] TRUE'
      }
    ],
    whyWrong: {
      0: '`FALSE` הוא מה ש-`team == coats` מדפיס: האם הם **שווים**? לא. אבל `!=` שואל את ההפך, האם הם **שונים**, והתשובה היא כן: `TRUE`.',
      1: '`-3` הוא מה ש-`team - coats` מדפיס, כלומר חיסור. `!=` לא מחשב הפרש: הוא משווה ומחזיר `TRUE` או `FALSE`.',
      3: '`3` הוא ההפרש `coats - team`. אבל `!=` לא מחשב: הוא בודק אם שני המספרים שונים, והתשובה היא ערך לוגי.'
    }
  },

  {
    id: 'basics-as-char-quotes',
    station: 'basics',
    level: 1,
    context: 'בקבלה רשמו את מספר החדר שלכם במעבדה:',
    code: 'room <- 14\nroom_text <- as.character(room)\nroom_text',
    options: ['"14"', '14', '"character"', '"room"'],
    answer: 0,
    hint: 'מה `as.character()` עושה לערך שהוא מקבל? ואיך R מדפיס טקסט?',
    explanation: [
      {
        text: '`room` הוא המספר `14`. `as.character(room)` לוקח את **הערך** שבתוך `room` ומחזיר אותו כטקסט, `"14"`. זה נשמר ב-`room_text`.'
      },
      {
        text: 'כש-R מדפיס טקסט, הוא מציג אותו **עם מרכאות**. כך רואים שזה טקסט ולא מספר:',
        output: '[1] "14"'
      }
    ],
    whyWrong: {
      1: '`14` בלי מרכאות הוא הצורה שבה R מדפיס **מספר**: זה מה ש-`room` מדפיס. אחרי `as.character()` הערך הוא טקסט, ו-R מדפיס טקסט עם מרכאות.',
      2: '`"character"` הוא **הסוג** של `room_text`, כלומר מה ש-`class(room_text)` מדפיס. כאן מדפיסים את המשתנה עצמו, ולכן רואים את הערך שלו.',
      3: '`as.character()` לא הופך את **השם** של המשתנה לטקסט, אלא את **הערך** שבתוכו. `room` כתוב בלי מרכאות, ולכן R משתמש בערך שלו, `14`.'
    }
  },

  {
    id: 'basics-type-follows-value',
    station: 'basics',
    level: 2,
    context: 'בטופס הרישום ממלאים את הפרטים של הלוקר שלכם:',
    code: 'locker <- "Blue"\nlocker <- 12\nclass(locker)',
    options: ['"character"', '12', 'שגיאה (Error), כי `locker` כבר נוצר כטקסט', '"numeric"'],
    answer: 3,
    hint: 'מה בדיוק שמור ב-`locker` כשמגיעים לשורה האחרונה? ומה `class()` מחזיר?',
    explanation: [
      {
        text: 'נעקוב אחרי `locker` ואחרי הסוג שלו אחרי כל שורה:',
        table: {
          columns: ['קוד', 'locker', 'class(locker)'],
          rows: [
            ['locker <- "Blue"', '"Blue"', '"character"'],
            ['locker <- 12', '12', '"numeric"']
          ],
          rowNames: ['1', '2'],
          highlightRows: [1]
        }
      },
      {
        text: 'בשורה השנייה `<-` **מחליף** את הערך: `"Blue"` נמחק, ו-`locker` מקבל את המספר `12`. למשתנה ב-R אין סוג קבוע: הסוג שלו הוא תמיד הסוג של הערך שנמצא בו עכשיו.'
      },
      {
        text: '`12` הוא מספר, ולכן:',
        output: '[1] "numeric"'
      }
    ],
    whyWrong: {
      0: '`"character"` הוא מה ש-`class(locker)` היה מחזיר **אחרי השורה הראשונה**. אבל משתנה לא "זוכר" את הסוג של הערך הראשון שלו: השורה השנייה מחליפה את הערך, ואיתו גם את הסוג.',
      1: '`12` הוא **הערך** של `locker`, כלומר מה שהשורה `locker` לבדה הייתה מדפיסה. `class()` לא מחזיר את הערך, אלא את **הסוג** שלו.',
      2: 'ב-R מותר לשמור כל ערך בכל משתנה, גם אם קודם היה בו ערך מסוג אחר. `<-` פשוט מחליף את מה שהיה שם, בלי שגיאה.'
    }
  },

  {
    id: 'basics-compare-not-assign',
    station: 'basics',
    level: 2,
    context: 'בשבוע הראשון עבדתם 40 שעות במעבדה:',
    prompt: 'מה יודפס?',
    code: 'hours <- 40\nfull <- hours == 45\nhours + 5',
    options: ['50', '45', 'FALSE', 'שגיאה (Error)'],
    answer: 1,
    hint: 'מה ההבדל בין `<-` ל-`==`? איזה מהם משנה את הערך של משתנה?',
    explanation: [
      {
        text: 'נעקוב אחרי הערכים אחרי כל שורה:',
        table: {
          columns: ['קוד', 'hours', 'full'],
          rows: [
            ['hours <- 40', '40', ''],
            ['full <- hours == 45', '40', 'FALSE']
          ],
          rowNames: ['1', '2'],
          highlightRows: [1]
        }
      },
      {
        text: '`hours == 45` רק **בודק** אם `hours` שווה ל-45. הוא לא משנה את `hours`. התשובה, `FALSE`, נשמרת במשתנה `full`.'
      },
      {
        text: '`hours` עדיין `40`, ולכן השורה האחרונה מחשבת `40 + 5`:',
        output: '[1] 45'
      }
    ],
    whyWrong: {
      0: 'כאן חשבתם ש-`==` שומר את 45 ב-`hours`. אבל `==` רק **משווה** ומחזיר `TRUE` או `FALSE`. מי ששומר ערך במשתנה הוא `<-`, ולכן `hours` נשאר `40`.',
      2: '`FALSE` הוא הערך של `full`, כלומר מה ש-`full` לבד היה מדפיס. השורה האחרונה לא מדפיסה את `full` אלא מחשבת `hours + 5`.',
      3: 'אפשר לשמור תוצאה של השוואה במשתנה, בדיוק כמו תוצאה של חשבון: `full` פשוט מקבל `FALSE`. אין כאן שגיאה.'
    }
  },

  {
    id: 'basics-text-case',
    station: 'basics',
    level: 2,
    context: 'מתמחה חדש מקליד קוד במקלדת שליד הדלת של חדר ההדרכה:',
    code: 'door_code <- "Lab7"\ntyped <- "lab7"\ndoor_code == typed',
    options: ['FALSE', 'TRUE', '"Lab7"', 'שגיאה (Error), כי אי אפשר להשוות טקסטים'],
    answer: 0,
    hint: 'מה `==` בודק כשמשווים שני טקסטים? הסתכלו היטב על כל תו.',
    explanation: [
      {
        text: '`==` בודק אם שני ערכים **זהים**. אפשר להשוות כך גם טקסטים: R משווה אותם תו אחרי תו.'
      },
      {
        text: 'R מבחין בין אות גדולה לאות קטנה (כמו שגם `a` ו-`A` הם שמות של שני משתנים שונים). לכן `L` ו-`l` הם תווים שונים:',
        vector: {
          values: ['L', 'a', 'b', '7'],
          marks: ['on', 'off', 'off', 'off'],
          labels: ['שונה', 'זהה', 'זהה', 'זהה']
        }
      },
      {
        text: 'מספיק שתו אחד שונה, והטקסטים כבר לא זהים. הדלת לא נפתחת:',
        output: '[1] FALSE'
      }
    ],
    whyWrong: {
      1: 'לעין זה אותו קוד, אבל R מבחין בין אותיות גדולות לקטנות: `"Lab7"` ו-`"lab7"` הם שני טקסטים שונים. רק אם שניהם היו כתובים בדיוק אותו דבר, `==` היה מחזיר `TRUE`.',
      2: '`==` לא מחזיר את אחד הערכים שהוא משווה. הוא עונה על השאלה "האם הם זהים?", ולכן מחזיר `TRUE` או `FALSE`.',
      3: 'אפשר להשוות טקסטים עם `==`: R בודק אם הם זהים תו אחרי תו. חשבון כמו `+` הוא מה שלא עובד על טקסט, אבל השוואה עובדת.'
    }
  },

  {
    id: 'basics-class-of-class',
    station: 'basics',
    level: 2,
    context: 'המחיר של קפה במכונה בחדר הצוות, בשקלים:',
    code: 'coffee <- 12.5\nkind <- class(coffee)\nclass(kind)',
    options: ['"numeric"', '12.5', '"character"', 'שגיאה (Error)'],
    answer: 2,
    hint: 'קודם חשבו מה בדיוק נשמר ב-`kind`, ואיך R היה מדפיס אותו. רק אחר כך שאלו מה הסוג שלו.',
    explanation: [
      {
        text: '`class(coffee)` מחזיר את הסוג של `12.5`, כלומר `"numeric"`. שימו לב למרכאות: מה ש-`class()` מחזיר הוא **טקסט**. הטקסט הזה נשמר ב-`kind`.'
      },
      {
        text: 'בשורה האחרונה שואלים מה הסוג של `kind`. ב-`kind` יש טקסט (המילה `"numeric"`), ולא מספר, ולכן:',
        output: '[1] "character"'
      }
    ],
    whyWrong: {
      0: '`"numeric"` הוא מה ש-`class(coffee)` מדפיס, וזה גם הערך של `kind`. אבל השורה האחרונה שואלת מה הסוג של `kind` עצמו, ובתוכו יש **טקסט**: המילה `"numeric"`.',
      1: '`12.5` הוא הערך של `coffee`. `class()` אף פעם לא מחזיר את הערך עצמו, אלא את השם של הסוג, כטקסט.',
      3: 'אפשר להפעיל `class()` על כל משתנה, גם על משתנה שבו נשמרה תוצאה של `class()`. אין כאן שגיאה: `kind` הוא פשוט טקסט.'
    }
  },

  {
    id: 'basics-paste-is-text',
    station: 'basics',
    level: 3,
    context: 'נרשמו 4 מתמחים למשמרת בוקר ו-6 למשמרת ערב:',
    code: 'morning <- 4\nevening <- 6\nnew_team <- paste(morning + evening)\nnew_team * 2',
    options: ['20', '"20"', '"10 10"', 'שגיאה (Error), כי `new_team` הוא טקסט'],
    answer: 3,
    hint: 'בדקו מה נשמר ב-`new_team`: מספר או טקסט? איך R היה מדפיס את `new_team`?',
    explanation: [
      {
        text: '`morning + evening` כתוב בלי מרכאות, ולכן R מחשב אותו קודם: `4 + 6 = 10`.'
      },
      {
        text: '`paste()` תמיד מחזיר **טקסט**, גם כשהוא מקבל רק מספר אחד. לכן `new_team` הוא `"10"` עם מרכאות, ולא המספר `10`.'
      },
      {
        text: 'בשורה האחרונה R מנסה לכפול טקסט במספר. אי אפשר לעשות חשבון על טקסט, ולכן R עוצר עם שגיאה:',
        output: 'Error in new_team * 2 : non-numeric argument to binary operator'
      }
    ],
    whyWrong: {
      0: '`20` היה יוצא אם `new_team` היה המספר `10`: זה מה ש-`(morning + evening) * 2` מדפיס, בלי `paste()`. אבל `paste()` מחזיר טקסט, ולכן `new_team` הוא `"10"`, ועל טקסט אי אפשר לעשות חשבון, גם אם הוא נראה כמו מספר.',
      1: 'חשבון ב-R לא מחזיר טקסט עם מרכאות, ו-R גם לא ממיר טקסט למספר בעצמו. `new_team` הוא `"10"`, ולכן `new_team * 2` עוצר עם שגיאה. (`as.numeric(new_team) * 2` היה מדפיס `20`, בלי מרכאות.)',
      2: 'הסימן `*` לא משכפל טקסט: `"10 10"` הוא מה ש-`paste(new_team, new_team)` מדפיס. `*` מנסה לעשות חשבון, ועל טקסט זה נגמר בשגיאה.'
    }
  },

  {
    id: 'basics-compare-checks',
    station: 'basics',
    level: 3,
    context: 'בטופס הרישום של שיר יש מספר תג ושם:',
    code: 'badge <- 30\nname <- "Shir"\nis.numeric(name) == is.character(badge)',
    options: ['FALSE', 'TRUE', 'FALSE FALSE', 'שגיאה (Error)'],
    answer: 1,
    hint: 'קודם חשבו מה מחזירה כל בדיקה לבד. אחר כך: מה `==` עושה עם שתי התשובות?',
    explanation: [
      {
        text: '`name` הוא טקסט, ולכן הוא לא מספר. `badge` הוא מספר, ולכן הוא לא טקסט. שתי הבדיקות מחזירות `FALSE`:',
        table: {
          columns: ['בדיקה', 'תוצאה'],
          rows: [
            ['is.numeric(name)', 'FALSE'],
            ['is.character(badge)', 'FALSE']
          ]
        }
      },
      {
        text: 'עכשיו `==` משווה את שתי התשובות: `FALSE == FALSE`. הוא שואל "האם הן **זהות**?", ולא "האם הן נכונות?".'
      },
      {
        text: 'שתי התשובות זהות (שתיהן `FALSE`), ולכן:',
        output: '[1] TRUE'
      }
    ],
    whyWrong: {
      0: '`FALSE` הוא מה שכל בדיקה מחזירה לבד (למשל `is.numeric(name)`). אבל `==` לא שואל אם הבדיקות הצליחו, אלא אם התשובות שלהן **זהות**. `FALSE` שווה ל-`FALSE`, ולכן התוצאה היא `TRUE`.',
      2: '`==` מחזיר תשובה **אחת**: האם מה שמשמאלו זהה למה שמימינו. הוא לא מדפיס את התוצאות של שתי הבדיקות, אלא רק את התוצאה של ההשוואה ביניהן.',
      3: '`==` יכול להשוות גם ערכים לוגיים, לא רק מספרים. כאן משווים `FALSE` ל-`FALSE`, וזה עובד בלי שגיאה.'
    }
  },

  {
    id: 'basics-true-as-text',
    station: 'basics',
    level: 3,
    context: 'השבוע נרשמתם ל-7 משמרות במעבדה:',
    prompt: 'מה יודפס?',
    code: 'shifts <- 7\nenough <- shifts > 5\nword <- as.character(enough)\nnchar(word)',
    options: ['1', '5', '4', '"TRUE"'],
    answer: 2,
    hint: 'עברו שורה-שורה: מה נשמר ב-`enough`? מה הוא הופך להיות אחרי `as.character()`? ורק אז ספרו.',
    explanation: [
      {
        text: '`shifts > 5` היא השוואה: 7 גדול מ-5, ולכן `enough` מקבל את הערך הלוגי `TRUE`.'
      },
      {
        text: '`as.character(enough)` הופך את `TRUE` לטקסט `"TRUE"`, כלומר ארבע אותיות. זה נשמר ב-`word`:',
        vector: {
          values: ['T', 'R', 'U', 'E'],
          marks: ['on', 'on', 'on', 'on'],
          showIndex: true
        }
      },
      {
        text: '`nchar()` סופר את התווים בטקסט:',
        output: '[1] 4'
      }
    ],
    whyWrong: {
      0: '`nchar()` לא סופר כמה ערכים יש ב-`word` (יש בו ערך אחד), אלא כמה **תווים** יש בטקסט. ב-`"TRUE"` יש 4 תווים.',
      1: '`5` הוא מספר האותיות ב-`"FALSE"`: זה מה ש-`nchar("FALSE")` מדפיס. אבל 7 **גדול** מ-5, ולכן `shifts > 5` הוא `TRUE`, ו-`word` הוא `"TRUE"`, עם 4 אותיות.',
      3: '`"TRUE"` הוא הערך של `word`, כלומר מה ש-`word` לבד היה מדפיס. השורה האחרונה מפעילה עליו את `nchar()`, שסופר כמה תווים יש בו.'
    }
  },

  // ===== שבוע 2: וקטורים =====
  // ---------- level 1 ----------
  {
    id: 'vectors-add-two',
    station: 'vectors',
    level: 1,
    context: 'הוואן עבר בשלוש שכונות פעמיים ביום. כמה מבחנות מילאתם בכל שכונה בסבב הראשון ובסבב השני:',
    code: 'round1 <- c(5, 3, 8)\nround2 <- c(2, 6, 1)\nround1 + round2',
    options: ['5 3 8 2 6 1', '7 9 9', '25', '16 9'],
    answer: 1,
    hint: 'מה `+` עושה כשבשני הצדדים שלו יש וקטורים, ולא מספרים בודדים?',
    explanation: [
      {
        text: 'יש שני וקטורים באותו אורך, 3 מספרים בכל אחד. כך נראה `round1`:',
        vector: { values: ['5', '3', '8'], marks: ['', '', ''], showIndex: true }
      },
      {
        text: '`+` בין שני וקטורים מחבר כל איבר עם האיבר **שבאותו מיקום** בווקטור השני, כלומר כל שכונה עם עצמה:',
        vector: { values: ['7', '9', '9'], marks: ['on', 'on', 'on'], labels: ['5 + 2', '3 + 6', '8 + 1'] }
      },
      {
        text: 'התוצאה היא וקטור באותו אורך, סך המבחנות בכל שכונה:',
        output: '[1] 7 9 9'
      }
    ],
    whyWrong: {
      0: '`5 3 8 2 6 1` הוא מה ש-`c(round1, round2)` מדפיס: `c()` מצרף וקטורים אחד אחרי השני. `+` לא מצרף, הוא מחבר מספרים: כל איבר עם האיבר שבאותו מיקום.',
      2: '`25` הוא סך כל המבחנות בשני הסבבים, כלומר `sum(round1 + round2)`. בלי `sum()`, R לא סוכם הכול למספר אחד: הוא מחבר זוגות ומחזיר וקטור באותו אורך.',
      3: '`16 9` הם הסכומים של כל סבב בנפרד, `sum(round1)` ו-`sum(round2)`. אבל `+` בין שני וקטורים מחבר ראשון עם ראשון, שני עם שני ושלישי עם שלישי.'
    }
  },

  {
    id: 'vectors-seq-by',
    station: 'vectors',
    level: 1,
    context: 'בוואן יש מתקן עם 20 מבחנות ממוספרות. בשכונת Port ממלאים רק חלק מהן:',
    code: 'port <- seq(2, 20, by = 6)\nport',
    options: ['6 12 18', '2 8 14', '2 8 14 20', '8 14 20'],
    answer: 2,
    hint: 'כתבו את המספרים אחד-אחד: מאיזה מספר מתחילים, ובכמה גדלים בכל צעד?',
    explanation: [
      {
        text: 'ב-`seq(2, 20, by = 6)` מתחילים במבחנה `2`, מוסיפים `6` בכל צעד, ולא עוברים את `20`:',
        vector: { values: ['2', '8', '14', '20'], marks: ['on', 'on', 'on', 'on'], labels: ['התחלה', '2 + 6', '8 + 6', '14 + 6'] }
      },
      {
        text: '`20` נכנס לתוצאה כי הוא לא עובר את הגבול. הצעד הבא היה `26`, שכבר גדול מ-20, ולכן R עוצר:',
        output: '[1]  2  8 14 20'
      }
    ],
    whyWrong: {
      0: '`6 12 18` הם המספרים שמתחלקים ב-6 (זה מה ש-`seq(6, 18, by = 6)` מדפיס). אבל `by = 6` הוא גודל הצעד: מתחילים מהמספר הראשון, `2`, ומוסיפים 6 בכל פעם.',
      1: 'גם `20` נכנס: `seq()` עוצר רק כשהצעד הבא **עובר** את הגבול. מ-`14` הצעד הבא הוא בדיוק `20`, ולכן גם המבחנה האחרונה במתקן היא חלק מהתוצאה.',
      3: 'המספר הראשון ב-`seq()` הוא נקודת ההתחלה, והוא עצמו נכנס לתוצאה. לכן הפלט מתחיל ב-`2`, ולא ב-`2 + 6`.'
    }
  },

  {
    id: 'vectors-length-colon',
    station: 'vectors',
    level: 1,
    context: 'מספרי המבחנות במתקן שלקחתם לשכונת Hills:',
    code: 'rack <- c(10:14, 20)\nlength(rack)',
    options: ['3', '5', '80', '6'],
    answer: 3,
    hint: 'כתבו את כל המספרים ש-`10:14` יוצר, ורק אחר כך ספרו.',
    explanation: [
      {
        text: '`10:14` יוצר את כל המספרים השלמים מ-10 עד 14, **כולל** שניהם. אלה 5 מספרים:',
        vector: { values: ['10', '11', '12', '13', '14'], marks: ['on', 'on', 'on', 'on', 'on'] }
      },
      {
        text: '`c()` מוסיף אחריהם גם את `20`, ולכן ב-`rack` יש:',
        vector: { values: ['10', '11', '12', '13', '14', '20'], marks: ['', '', '', '', '', ''], showIndex: true }
      },
      {
        text: '`length()` סופר כמה איברים יש בווקטור, כלומר כמה מבחנות יש במתקן:',
        output: '[1] 6'
      }
    ],
    whyWrong: {
      0: '`10:14` הוא לא רק שני המספרים 10 ו-14, אלא כל המספרים מ-10 עד 14. `3` הוא מה ש-`length(c(10, 14, 20))` מדפיס.',
      1: '`5` יוצא אם שוכחים את `20`, או אם חושבים שב-`10:14` יש רק 4 מספרים (`14 - 10`). אבל `10:14` כולל את שני הקצוות, כלומר 5 מספרים, ואחריהם בא גם `20`: בסך הכול 6 מבחנות.',
      2: '`80` הוא סכום מספרי המבחנות, כלומר `sum(rack)`. `length()` לא מחבר את הערכים: הוא סופר כמה איברים יש בווקטור.'
    }
  },

  // ---------- level 2 ----------
  {
    id: 'vectors-mixed-types',
    station: 'vectors',
    level: 2,
    context: 'בכל עצירה רושמים: כמה מבחנות מילאתם, אם המתקן מלא, ובאיזו שכונה עצרתם:',
    code: 'stop_info <- c(12, TRUE, "Port")\nstop_info',
    options: ['"12" "TRUE" "Port"', '12 TRUE "Port"', '"12" "1" "Port"', 'שגיאה (Error), כי אי אפשר לשים סוגים שונים באותו וקטור'],
    answer: 0,
    hint: 'בווקטור כל האיברים הם מאותו סוג. איזה סוג יכול להחזיק גם את `12`, גם את `TRUE` וגם את `"Port"`?',
    explanation: [
      {
        text: 'ב-`c()` יש שלושה סוגים שונים: מספר, ערך לוגי וטקסט.',
        vector: { values: ['12', 'TRUE', '"Port"'], marks: ['', '', ''], labels: ['numeric', 'logical', 'character'] }
      },
      {
        text: 'וקטור מחזיק רק סוג אחד. R לא עוצר בשגיאה: הוא הופך את כל האיברים לסוג שיכול להחזיק את כולם, כלומר לטקסט. כל ערך הופך לטקסט כפי שהוא כתוב:',
        vector: { values: ['"12"', '"TRUE"', '"Port"'], marks: ['on', 'on', 'on'], labels: ['character', 'character', 'character'] }
      },
      {
        text: 'R מדפיס טקסט עם מירכאות:',
        output: '[1] "12"   "TRUE" "Port"'
      }
    ],
    whyWrong: {
      1: 'בווקטור אחד אי אפשר שיהיו גם מספרים וגם טקסט. ברגע שיש `"Port"`, כל האיברים הופכים לטקסט, ולכן כולם מודפסים עם מירכאות.',
      2: 'זה מה ש-`c(c(12, TRUE), "Port")` מדפיס: שם נבנה קודם וקטור של מספרים, ובו `TRUE` הופך ל-`1`. אבל כאן שלושת הערכים נכנסים ל-`c()` יחד, ולכן `TRUE` הופך ישר לטקסט `"TRUE"`.',
      3: 'R לא נותן שגיאה כשמערבבים סוגים ב-`c()`. הוא הופך את כל האיברים לסוג אחד (כאן: טקסט) וממשיך.'
    }
  },

  {
    id: 'vectors-drop-ends',
    station: 'vectors',
    level: 2,
    context: 'כמה דקות נמשכה כל אחת מחמש העצירות בסבב:',
    code: 'minutes <- c(18, 22, 25, 21, 19)\nmid <- minutes[-c(1, 5)]\nmid - 20',
    options: ['-2 -1', '2 5 1', '2 25 21', '-2 2 5 1 -1'],
    answer: 1,
    hint: 'מה עושה המינוס **בתוך** הסוגריים המרובעים? ואחר כך: על אילו איברים פועל `- 20`?',
    explanation: [
      {
        text: 'מינוס בתוך `[ ]` **מוציא** מיקומים. `-c(1, 5)` מוציא את העצירה הראשונה ואת העצירה החמישית:',
        vector: { values: ['18', '22', '25', '21', '19'], marks: ['drop', 'on', 'on', 'on', 'drop'], showIndex: true }
      },
      {
        text: 'ב-`mid` נשארים 3 מספרים, ו-`- 20` מחסיר 20 מ**כל** אחד מהם:',
        vector: { values: ['2', '5', '1'], marks: ['on', 'on', 'on'], labels: ['22 - 20', '25 - 20', '21 - 20'] }
      },
      {
        text: 'זה הפלט, בכמה דקות כל עצירה שבאמצע חרגה מ-20 דקות:',
        output: '[1] 2 5 1'
      }
    ],
    whyWrong: {
      0: 'זה מה ש-`minutes[c(1, 5)] - 20` מדפיס: בלי מינוס, R **שולף** את מיקומים 1 ו-5. עם מינוס הוא **מוציא** אותם ושומר את כל השאר.',
      2: 'R לא מחסיר 20 רק מהאיבר הראשון: מספר בודד פועל על **כל** האיברים בווקטור. לכן גם `25` וגם `21` קטנים ב-20.',
      3: 'זה מה ש-`minutes - 20` מדפיס, כאילו לא הוצאנו כלום. אבל `minutes[-c(1, 5)]` מוציא את מיקומים 1 ו-5, ולכן ב-`mid` יש רק 3 מספרים.'
    }
  },

  {
    id: 'vectors-rep-mean',
    station: 'vectors',
    level: 2,
    context: 'כמה מבחנות נכנסו לכל ארגז שהעמסתם על הוואן:',
    code: 'boxes <- rep(c(10, 40), c(3, 1))\nmean(boxes)',
    options: ['17.5', '25', '70', '32.5'],
    answer: 0,
    hint: 'קודם כתבו את `boxes` במלואו: כמה פעמים חוזר כל מספר? רק אחר כך חשבו את הממוצע.',
    explanation: [
      {
        text: 'הארגומנט השני של `rep()` (`times`) הוא כאן וקטור, ולכן כל איבר חוזר מספר פעמים משלו, לפי הסדר: `10` שלוש פעמים, ו-`40` פעם אחת. כלומר שלושה ארגזים של 10 מבחנות וארגז אחד של 40:',
        vector: { values: ['10', '10', '10', '40'], marks: ['', '', '', ''], showIndex: true }
      },
      {
        text: '`mean()` מחבר את כל האיברים ומחלק במספר האיברים: `(10 + 10 + 10 + 40) / 4`, כלומר `70 / 4`.',
        output: '[1] 17.5'
      }
    ],
    whyWrong: {
      1: '`25` הוא מה ש-`mean(c(10, 40))` מדפיס, כאילו יש רק ארגז אחד מכל גודל. אבל `rep()` יצר וקטור של 4 ארגזים, ו-`10` מופיע בו שלוש פעמים.',
      2: '`70` הוא סך המבחנות, כלומר `sum(boxes)`. `mean()` מחלק את הסכום במספר האיברים (4 ארגזים), ולכן מקבלים `17.5`.',
      3: 'זה מה ש-`mean(rep(c(10, 40), c(1, 3)))` מדפיס. המספרים ב-`c(3, 1)` מתאימים לפי הסדר: הראשון (`3`) שייך ל-`10`, והשני (`1`) שייך ל-`40`.'
    }
  },

  // ---------- level 3 ----------
  {
    id: 'vectors-trace-trays',
    station: 'vectors',
    level: 3,
    context: 'כמה מבחנות יש בכל מגש על הוואן, ומה השתנה במהלך הסבב:',
    code: 'van_trays <- c(6, 2, 9)\nvan_trays <- c(van_trays, 4)\nvan_trays[2] <- van_trays[1] + van_trays[4]\nvan_trays[-1]',
    options: ['5 9 4', '6 10 9', '10 9 4', '10 2 9 4'],
    answer: 2,
    hint: 'עקבו אחרי `van_trays` שורה אחרי שורה, וכתבו איך הוא נראה אחרי כל שורה.',
    explanation: [
      {
        text: 'שורה 2: `c(van_trays, 4)` מוסיף מגש של 4 מבחנות בסוף, והתוצאה נשמרת שוב ב-`van_trays`:',
        vector: { values: ['6', '2', '9', '4'], marks: ['', '', '', 'on'], showIndex: true }
      },
      {
        text: 'שורה 3: `van_trays[1]` הוא `6` ו-`van_trays[4]` הוא `4`. הסכום, `10`, **מחליף** את הערך שבמיקום 2:',
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
      0: 'בתוך `[ ]` המספרים `1` ו-`4` הם מיקומים, אבל `van_trays[1] + van_trays[4]` מחבר את **הערכים** שבמיקומים האלה: `6 + 4`, שזה `10`, ולא `1 + 4`.',
      1: 'זה מה ש-`van_trays[-4]` מדפיס. `[-1]` לא מוציא את האיבר האחרון, אלא את האיבר שב**מיקום 1**.',
      3: 'השמה למיקום שכבר קיים **מחליפה** את הערך שבו, ולא מוסיפה מגש חדש. לכן `van_trays` נשאר באורך 4: הערך `2` נמחק ובמקומו נכנס `10`.'
    }
  },

  {
    id: 'vectors-text-sum',
    station: 'vectors',
    level: 3,
    context: 'כמה מבחנות מילאתם בכל אחת מארבע העצירות:',
    code: 'per_stop <- c(5, 12, 8, 6)\nper_stop[4] <- "3"\nsum(per_stop)',
    prompt: 'מה יקרה כשנריץ את הקוד?',
    options: ['28', 'שגיאה (Error) כבר בשורה 2, כי אי אפשר לשים טקסט בווקטור של מספרים', '25', 'שגיאה (Error) בשורה 3, כי עכשיו כל הערכים ב-`per_stop` הם טקסט'],
    answer: 3,
    hint: 'דמיינו ש-R מדפיס את `per_stop` אחרי שורה 2. איך הוא ייראה?',
    explanation: [
      {
        text: 'שורה 2 עובדת בלי שגיאה: `"3"` נכנס למיקום 4. אבל `"3"` עם מירכאות הוא טקסט, ובווקטור כל האיברים חייבים להיות מאותו סוג, ולכן R הופך **את כולם** לטקסט:',
        vector: { values: ['"5"', '"12"', '"8"', '"3"'], marks: ['on', 'on', 'on', 'on'], labels: ['character', 'character', 'character', 'character'], showIndex: true }
      },
      {
        text: 'בשורה 3, `sum()` מקבל וקטור של טקסט. אי אפשר לחבר טקסט, גם אם הוא נראה כמו מספר, ולכן R עוצר עם שגיאה:',
        output: "Error in sum(per_stop) : invalid 'type' (character) of argument"
      }
    ],
    whyWrong: {
      0: '`28` הוא מה ש-`sum(as.numeric(per_stop))` מדפיס. בלי `as.numeric()`, `"3"` הוא טקסט ולא מספר, ובגללו גם `5`, `12` ו-`8` הפכו לטקסט.',
      1: 'שורה 2 דווקא עובדת: R לא עוצר כשמכניסים טקסט לווקטור של מספרים, אלא הופך את כל הווקטור לטקסט. השגיאה מגיעה רק בשורה 3, כשמנסים לחבר טקסט.',
      2: '`25` הוא מה ש-`sum(c(5, 12, 8))` מדפיס, כאילו `sum()` מדלג על הטקסט. אבל `sum()` לא מדלג: כל הווקטור הוא טקסט, ולכן מקבלים שגיאה.'
    }
  },

  {
    id: 'vectors-seq-last',
    station: 'vectors',
    level: 3,
    context: 'בסבב בשכונת Market, אלה הדקות שבהן הוואן עוצר לאסוף מבחנות:',
    code: 'stops <- seq(3, 20, by = 5)\nstops[length(stops)] - stops[1]',
    options: ['15', '17', '1', '20'],
    answer: 0,
    hint: 'קודם כתבו את כל האיברים של `stops`, אחד-אחד. איזה ערך נמצא במיקום האחרון?',
    explanation: [
      {
        text: '`seq(3, 20, by = 5)` מתחיל ב-3 ומוסיף 5 בכל צעד. אחרי `18` הצעד הבא הוא `23`, שעובר את 20, ולכן R עוצר ב-`18`:',
        vector: { values: ['3', '8', '13', '18'], marks: ['', '', '', ''], showIndex: true }
      },
      {
        text: '`length(stops)` הוא `4`, ולכן `stops[length(stops)]` הוא `stops[4]`, כלומר `18`, העצירה האחרונה. ו-`stops[1]` הוא `3`:',
        vector: { values: ['3', '8', '13', '18'], marks: ['on', 'off', 'off', 'on'], labels: ['stops[1]', '', '', 'stops[4]'], showIndex: true }
      },
      {
        text: 'ולבסוף R מחשב `18 - 3`, כמה דקות עברו מהעצירה הראשונה עד האחרונה:',
        output: '[1] 15'
      }
    ],
    whyWrong: {
      1: '`17` יוצא אם חושבים שהעצירה האחרונה היא בדקה `20`. אבל `seq()` לא תמיד מגיע בדיוק לגבול: מ-`18` הצעד הבא הוא `23`, שכבר גדול מ-20, ולכן הווקטור נגמר ב-`18`.',
      2: 'זה מה ש-`length(stops) - stops[1]` מדפיס (`4 - 3`). אבל `stops[length(stops)]` לא מחזיר את האורך: הוא משתמש באורך כ**מיקום** ושולף את הערך שבו, `18`.',
      3: '`20` יוצא אם חושבים שהעצירה האחרונה היא בדקה `23`. אבל `seq()` לא עובר את הגבול: הוא עוצר באיבר האחרון שלא גדול מ-20, כלומר `18`.'
    }
  },

  // ---------- level 1 ----------
  {
    id: 'vectors-colon-countdown',
    station: 'vectors',
    level: 1,
    context: 'בבניין בשכונת Center יש קומות מעל הקרקע וקומות חניון מתחתיה:',
    code: 'route <- 2:-3\nroute',
    options: ['-3 -2 -1 0 1 2', '2 1 0 -1 -2', '2 1 0 -1 -2 -3', 'שגיאה (Error), כי המספר הראשון גדול מהשני'],
    answer: 2,
    hint: 'כתבו את הווקטור צעד אחרי צעד. מה `:` עושה כשהמספר שמשמאלו גדול מהמספר שמימינו?',
    explanation: [
      {
        text: '`:` מתחיל תמיד במספר **שמשמאלו**, כאן קומה `2`, ומתקדם בצעדים של 1 עד המספר שמימינו, `-3`. מכיוון ש-`-3` קטן מ-`2`, R סופר **למטה**, וממשיך גם אחרי `0`:',
        vector: { values: ['2', '1', '0', '-1', '-2', '-3'], marks: ['on', 'on', 'on', 'on', 'on', 'on'], showIndex: true }
      },
      {
        text: 'שני הקצוות, `2` ו-`-3`, נכנסים לווקטור. זה הפלט:',
        output: '[1]  2  1  0 -1 -2 -3'
      }
    ],
    whyWrong: {
      0: '`:` לא מסדר את המספרים מהקטן לגדול: הוא מתחיל במספר השמאלי ומתקדם לעבר הימני. `-3 -2 -1 0 1 2` הוא מה ש-`-3:2` מדפיס.',
      1: 'R לא עוצר לפני הקצה: המספר שמימין ל-`:` נכנס גם הוא לתוצאה, ולכן גם קומת החניון `-3` נכנסת. `2 1 0 -1 -2` הוא מה ש-`2:-2` מדפיס.',
      3: '`:` עובד גם כשהמספר הראשון גדול מהשני: הוא פשוט סופר למטה, צעד אחד בכל פעם. אין כאן שגיאה.'
    }
  },

  {
    id: 'vectors-seq-unnamed-by',
    station: 'vectors',
    level: 1,
    context: 'השעות שבהן הוואן יוצא מהמעבדה לסבב איסוף:',
    code: 'trips <- seq(6, 18, 3)\ntrips',
    options: ['6 12 18', '6 9 12 15 18', 'שגיאה (Error), כי חסר `by =`', '6 10 14 18'],
    answer: 1,
    hint: 'אילו שלושה ארגומנטים `seq()` מקבלת, ובאיזה סדר? מה R עושה כשלא כותבים את השמות שלהם?',
    explanation: [
      {
        text: '`seq()` מקבלת `from`, `to` ו-`by`, בסדר הזה. כשלא כותבים את השמות, R מתאים כל מספר לארגומנט לפי **המקום** שלו: `from = 6`, `to = 18`, `by = 3`. כלומר זה בדיוק `seq(6, 18, by = 3)`.'
      },
      {
        text: 'מתחילים ב-`6` ומוסיפים `3` בכל צעד, עד `18`: הוואן יוצא כל 3 שעות:',
        vector: { values: ['6', '9', '12', '15', '18'], marks: ['on', 'on', 'on', 'on', 'on'], labels: ['התחלה', '6 + 3', '9 + 3', '12 + 3', '15 + 3'] }
      },
      {
        text: 'זה הפלט:',
        output: '[1]  6  9 12 15 18'
      }
    ],
    whyWrong: {
      0: '`6 12 18` יוצא אם חושבים שהמספר השלישי אומר **כמה** יציאות יהיו. אבל המספר השלישי הוא גודל הצעד (`by`). `6 12 18` הוא מה ש-`seq(6, 18, 6)` מדפיס.',
      2: 'לא חייבים לכתוב `by =`. גם בלי השמות, R מתאים כל מספר לפי המקום שלו: הראשון הוא `from`, השני הוא `to` והשלישי הוא `by`.',
      3: '`6 10 14 18` הוא מה ש-`seq(6, 18, 4)` מדפיס: 3 קפיצות של 4. אבל המספר השלישי הוא לא מספר הקפיצות, אלא **הגודל** של כל קפיצה.'
    }
  },

  {
    id: 'vectors-zero-counts',
    station: 'vectors',
    level: 1,
    context: 'ליאור רשם כמה מבחנות מילא בכל עצירה בשכונת Park:',
    code: 'park <- c(2, 0, 7, 5, 1)\ntotal <- sum(park)\ntotal / length(park)',
    options: ['3.75', '15', '0.3333333', '3'],
    answer: 3,
    hint: 'חשבו בנפרד את `total` ואת `length(park)`, וספרו בזהירות את האיברים.',
    explanation: [
      {
        text: 'שורה 2: `sum(park)` מחבר את כל האיברים, `2 + 0 + 7 + 5 + 1`, כלומר `15`, והתוצאה נשמרת ב-`total`.'
      },
      {
        text: '`length(park)` סופר **כמה איברים** יש בווקטור. גם `0` הוא איבר (עצירה שבה ליאור לא מילא אף מבחנה), ולכן יש 5:',
        vector: { values: ['2', '0', '7', '5', '1'], marks: ['on', 'on', 'on', 'on', 'on'], showIndex: true }
      },
      {
        text: 'שורה 3 מחשבת `15 / 5` (זה בעצם הממוצע, כמו `mean(park)`):',
        output: '[1] 3'
      }
    ],
    whyWrong: {
      0: '`3.75` הוא `15 / 4`, כאילו העצירה עם `0` מבחנות לא נספרת. אבל `0` הוא ערך כמו כל ערך אחר, ו-`length(park)` סופר את כל 5 האיברים.',
      1: '`15` הוא הסכום שנשמר ב-`total`, כלומר מה ש-`total` לבד מדפיס. אבל השורה האחרונה ממשיכה ומחלקת את הסכום במספר האיברים.',
      2: 'זה מה ש-`length(park) / total` מדפיס (`5 / 15`). בקוד הסדר הפוך: `total` נמצא משמאל ל-`/`, ולכן מחלקים את `15` ב-`5`.'
    }
  },

  {
    id: 'vectors-c-order',
    station: 'vectors',
    level: 1,
    context: 'כמה ארגזים העמסתם על הוואן בכל עצירה: אתמול בשתי עצירות, והיום בשלוש:',
    code: 'yesterday <- c(4, 9)\ntoday <- c(1, 7, 2)\nall_stops <- c(today, yesterday)\nall_stops',
    options: ['1 7 2 4 9', '4 9 1 7 2', '1 2 4 7 9', 'שגיאה (Error), כי לשני הווקטורים יש אורך שונה'],
    answer: 0,
    hint: 'קראו את השורה השלישית משמאל לימין: מה `c()` עושה עם כל וקטור שהוא מקבל?',
    explanation: [
      {
        text: '`c()` מצרף את הווקטורים אחד אחרי השני, **בסדר שבו הם כתובים בתוך הסוגריים**. כאן `today` כתוב ראשון, ואחריו `yesterday`:',
        vector: { values: ['1', '7', '2', '4', '9'], marks: ['', '', '', '', ''], labels: ['today', 'today', 'today', 'yesterday', 'yesterday'], showIndex: true }
      },
      {
        text: 'האורכים לא צריכים להיות שווים: `c()` לא מתאים איבר לאיבר, הוא רק שם את הווקטורים בשורה אחת. יוצא וקטור עם 5 איברים:',
        output: '[1] 1 7 2 4 9'
      }
    ],
    whyWrong: {
      1: 'זה מה ש-`c(yesterday, today)` מדפיס. לא משנה איזה וקטור יצרנו קודם, ולא איזה יום היה קודם: הסדר בתוצאה נקבע לפי הסדר שבו כתבנו אותם בתוך `c()`.',
      2: '`c()` לא ממיין את המספרים. הוא שומר כל ערך במקום שלו: קודם כל האיברים של `today`, כמו שהם, ואחריהם האיברים של `yesterday`.',
      3: 'אורך שווה חשוב בחשבון בין וקטורים (למשל `+`), כי שם R מתאים איבר לאיבר. `c()` רק מצרף וקטורים אחד אחרי השני, ולכן הוא עובד עם כל אורך.'
    }
  },

  // ---------- level 2 ----------
  {
    id: 'vectors-bill-total',
    station: 'vectors',
    level: 2,
    context: 'על הוואן יש שלושה סוגי מתקנים. כמה מבחנות נכנסות בכל סוג, וכמה מתקנים מכל סוג העמסתם:',
    code: 'per_rack <- c(12, 20, 8)\nn_racks <- c(2, 1, 3)\nsum(per_rack * n_racks)',
    options: ['240', '24 20 24', '68', '46'],
    answer: 2,
    hint: 'R מריץ קודם את מה שבתוך הסוגריים של `sum()`. כתבו את `per_rack * n_racks` איבר-איבר.',
    explanation: [
      {
        text: '`*` בין שני וקטורים באותו אורך מכפיל כל איבר באיבר **שבאותו מיקום** בווקטור השני. כך מקבלים כמה מבחנות נכנסות בכל המתקנים מכל סוג:',
        vector: { values: ['24', '20', '24'], marks: ['on', 'on', 'on'], labels: ['12 * 2', '20 * 1', '8 * 3'] }
      },
      {
        text: '`sum()` מחבר את שלוש המכפלות, `24 + 20 + 24`, כלומר כמה מבחנות נכנסות בכל המתקנים שעל הוואן יחד:',
        output: '[1] 68'
      }
    ],
    whyWrong: {
      0: '`240` הוא מה ש-`sum(per_rack) * sum(n_racks)` מדפיס (`40 * 6`), כאילו כל גודל מתקן מוכפל בכל הכמויות. אבל `per_rack * n_racks` מכפיל רק זוגות שבאותו מיקום: סוג ראשון בכמות הראשונה, שני בשנייה ושלישי בשלישית.',
      1: '`24 20 24` הוא מה ש-`per_rack * n_racks` לבד מדפיס. `sum()` שמסביב ממשיך צעד אחד: הוא מחבר את שלושת המספרים למספר אחד.',
      3: '`46` הוא מה ש-`sum(c(per_rack, n_racks))` מדפיס: הסכום של כל המספרים בשני הווקטורים יחד. אבל `*` לא מצרף את הווקטורים, אלא **מכפיל** כל גודל מתקן בכמות שלו.'
    }
  },

  {
    id: 'vectors-minus-mean',
    station: 'vectors',
    level: 2,
    context: 'כמה קילומטרים נסע הוואן בכל אחד משלושה סבבים קצרים בשכונת North:',
    code: 'km <- c(6, 11, 7)\nkm <- km - mean(km)\nkm',
    options: ['6 11 7', '2 -3 1', '0', '-2 3 -1'],
    answer: 3,
    hint: 'בשורה 2, R מחשב קודם את כל הצד הימני של `<-`, ורק אז שומר. כמה מספרים מחזיר `mean(km)`?',
    explanation: [
      {
        text: 'בשורה 2 R מחשב קודם את הצד הימני. `mean(km)` הוא מספר **אחד**: `(6 + 11 + 7) / 3`, כלומר `8`.'
      },
      {
        text: 'מספר אחד שמחסירים מווקטור מוחסר מ**כל** איבר, לפי הסדר שבקוד: האיבר פחות `8`:',
        vector: { values: ['-2', '3', '-1'], marks: ['on', 'on', 'on'], labels: ['6 - 8', '11 - 8', '7 - 8'] }
      },
      {
        text: 'התוצאה נשמרת בחזרה ב-`km`, במקום הערכים הישנים, ושורה 3 מדפיסה אותה: בכמה כל סבב היה ארוך או קצר מהממוצע:',
        output: '[1] -2  3 -1'
      }
    ],
    whyWrong: {
      0: 'אלה הערכים של `km` **לפני** שורה 2. שורה 2 שומרת את התוצאה באותו שם, `km`, ולכן הערכים החדשים מחליפים את הישנים.',
      1: 'זה מה ש-`mean(km) - km` מדפיס. בקוד הסדר הפוך: מכל איבר מחסירים את הממוצע, ולכן `6 - 8` נותן `-2`, ולא `2`.',
      2: '`0` הוא מה ש-`sum(km)` מדפיס בסוף הקוד. אבל `mean(km)` הוא מספר אחד שמוחסר מ**כל** אחד משלושת האיברים, ולכן `km` נשאר וקטור עם 3 מספרים.'
    }
  },

  {
    id: 'vectors-min-negative',
    station: 'vectors',
    level: 2,
    context: 'כמה מבחנות מילאתם בשכונות North, South ו-Port, בשבוע הראשון ובשבוע השני:',
    code: 'week1 <- c(12, 7, 15)\nweek2 <- c(9, 11, 6)\nmin(week2 - week1)',
    options: ['-9', '-3', '6', '-4'],
    answer: 0,
    hint: 'קודם כתבו את `week2 - week1` איבר-איבר, ושימו לב לסדר החיסור ולסימנים.',
    explanation: [
      {
        text: '`week2 - week1` מחסיר מהמספר של כל שכונה בשבוע השני את המספר של אותה שכונה בשבוע הראשון:',
        vector: { values: ['-3', '4', '-9'], marks: ['', '', ''], labels: ['9 - 12', '11 - 7', '6 - 15'] }
      },
      {
        text: '`min()` מחזיר את הערך **הקטן ביותר**. במספרים שליליים, ככל שהמספר אחרי המינוס גדול יותר, המספר עצמו קטן יותר: `-9` קטן מ-`-3`:',
        output: '[1] -9'
      }
    ],
    whyWrong: {
      1: '`-3` הוא המספר השלילי הקרוב ביותר ל-`0`, אבל הוא לא הקטן ביותר. `-9` קטן ממנו: ירידה של 9 מבחנות היא יותר מירידה של 3.',
      2: '`6` הוא מה ש-`min(week2)` מדפיס, השכונה עם הכי מעט מבחנות בשבוע השני. אבל כאן `min()` מקבל את ההפרשים `week2 - week1`, ולא את הספירות עצמן.',
      3: 'זה מה ש-`min(week1 - week2)` מדפיס. בחיסור הסדר חשוב: `week2 - week1` נותן `-3 4 -9`, ו-`week1 - week2` נותן את אותם מספרים עם סימן הפוך, `3 -4 9`.'
    }
  },

  // ---------- level 3 ----------
  {
    id: 'vectors-colon-before-plus',
    station: 'vectors',
    level: 3,
    context: 'כמה קילומטרים נסע הוואן בכל קטע של המסלול, לפי הסדר:',
    code: 'legs <- c(14, 8, 21, 5, 17)\nk <- 3\nlegs[1:k + 1]',
    options: ['14 8 21 5', '8 21 5', '15 9 22', '14 8 21'],
    answer: 1,
    hint: 'בתוך `[ ]` יש גם `:` וגם `+`. איזה מהם R מחשב קודם? כתבו את המיקומים לפני שאתם שולפים ערכים.',
    explanation: [
      {
        text: 'ב-R, `:` מחושב **לפני** `+` ו-`-`. לכן `1:k + 1` הוא `(1:3) + 1`: קודם נוצר `1 2 3`, ואז מוסיפים 1 לכל אחד מהם:',
        vector: { values: ['2', '3', '4'], marks: ['on', 'on', 'on'], labels: ['1 + 1', '2 + 1', '3 + 1'] }
      },
      {
        text: 'אלה **מיקומים**, כלומר מספרי קטעים. R שולף את הערכים שבמיקומים 2, 3 ו-4:',
        vector: { values: ['14', '8', '21', '5', '17'], marks: ['off', 'on', 'on', 'on', 'off'], showIndex: true }
      },
      {
        text: 'זה הפלט:',
        output: '[1]  8 21  5'
      }
    ],
    whyWrong: {
      0: 'זה מה ש-`legs[1:(k + 1)]` מדפיס (מיקומים 1 עד 4). בלי סוגריים R לא מחשב קודם את `k + 1`: הוא יוצר קודם את `1:k`, ורק אז מוסיף 1 לכל מיקום.',
      2: 'זה מה ש-`legs[1:k] + 1` מדפיס: שם ה-`+ 1` נמצא מחוץ ל-`[ ]` ומשנה את ה**ערכים**. כאן הוא בתוך `[ ]`, ולכן הוא משנה את ה**מיקומים**.',
      3: 'זה מה ש-`legs[1:k]` מדפיס, כאילו ה-`+ 1` לא קיים. אבל `1:k + 1` הוא `2 3 4`, ולכן כל מיקום זז במקום אחד.'
    }
  },

  {
    id: 'vectors-mean-combined',
    station: 'vectors',
    level: 3,
    context: 'טל אספה מבחנות יומיים בשכונת Hills, ועמית ארבעה ימים בשכונת Market. כמה מבחנות מילאו בכל יום:',
    code: 'hills <- c(3, 5)\nmarket <- c(12, 8, 9, 11)\nmean(c(hills, market))',
    options: ['7', '4 10', '8', '48'],
    answer: 2,
    hint: 'מה יוצא מ-`c(hills, market)`: שני וקטורים, או וקטור אחד? וכמה איברים יש בו?',
    explanation: [
      {
        text: 'R מריץ קודם את `c()`, שמצרף את שני הווקטורים לווקטור **אחד** עם 6 איברים:',
        vector: { values: ['3', '5', '12', '8', '9', '11'], marks: ['', '', '', '', '', ''], labels: ['hills', 'hills', 'market', 'market', 'market', 'market'], showIndex: true }
      },
      {
        text: '`mean()` לא יודע שפעם היו שני וקטורים. הוא מחבר את כל 6 האיברים (`48`) ומחלק ב-6. כך כל יום נספר פעם אחת, ולשכונה עם 4 הימים יש משקל גדול יותר:',
        output: '[1] 8'
      }
    ],
    whyWrong: {
      0: '`7` הוא הממוצע של שני הממוצעים, `(mean(hills) + mean(market)) / 2`, כלומר `(4 + 10) / 2`. אבל `mean()` מקבל כאן וקטור אחד עם 6 מספרים, ומחלק את הסכום של כולם ב-6.',
      1: 'זה מה ש-`c(mean(hills), mean(market))` מדפיס, ממוצע נפרד לכל שכונה. אבל כאן `c()` נמצא **בתוך** `mean()`: קודם מצרפים את הווקטורים, ואז `mean()` מחזיר מספר אחד.',
      3: '`48` הוא מה ש-`sum(c(hills, market))` מדפיס. `mean()` ממשיך צעד אחד: הוא מחלק את הסכום במספר האיברים, 6.'
    }
  },

  {
    id: 'vectors-saved-sum-stays',
    station: 'vectors',
    level: 3,
    context: 'בכל יום של השבוע רשמתם כמה מבחנות אספתם:',
    code: 'per_day <- c(40, 25, 55)\ntotal_tubes <- sum(per_day)\nper_day <- c(per_day, 24)\ntotal_tubes / length(per_day)',
    options: ['36', '30', '40', '48'],
    answer: 1,
    hint: 'עקבו שורה אחרי שורה, ורשמו אחרי כל שורה מה יש ב-`total_tubes` וכמה איברים יש ב-`per_day`.',
    explanation: [
      {
        text: 'שורה 2: `sum(per_day)` מחושב ברגע זה, והתוצאה, `120`, נשמרת ב-`total_tubes`. מעכשיו `total_tubes` הוא פשוט המספר `120`: הוא לא "זוכר" שהוא הגיע מ-`per_day`.'
      },
      {
        text: 'שורה 3: `c(per_day, 24)` מוסיף את היום הרביעי בסוף, ועכשיו ב-`per_day` יש 4 איברים. `total_tubes` לא משתנה ונשאר `120`:',
        vector: { values: ['40', '25', '55', '24'], marks: ['', '', '', 'on'], showIndex: true }
      },
      {
        text: 'שורה 4: `length(per_day)` מחושב רק עכשיו, ולכן הוא `4`. R מחשב `120 / 4`:',
        output: '[1] 30'
      }
    ],
    whyWrong: {
      0: '`36` הוא מה ש-`mean(per_day)` מדפיס בסוף הקוד (`144 / 4`), כאילו `total_tubes` התעדכן וכולל גם את `24`. אבל `total_tubes` חושב בשורה 2 ונשמר כמספר `120`, ושינוי של `per_day` אחר כך לא משנה אותו.',
      2: '`40` הוא `120 / 3`, כאילו ב-`per_day` עדיין יש 3 איברים. אבל `length(per_day)` מחושב רק בשורה 4, אחרי ש-`24` כבר נוסף, ולכן הוא `4`.',
      3: '`48` הוא `144 / 3`: סכום חדש חלקי אורך ישן. בפועל זה הפוך: `total_tubes` הוא הסכום **הישן** (`120`), ו-`length(per_day)` הוא האורך **החדש** (`4`).'
    }
  },

  // ---------- level 1 ----------
  {
    id: 'vectors-pick-order',
    station: 'vectors',
    level: 1,
    context: 'המרחק בקילומטרים מהמעבדה לכל אחת מארבע השכונות בסבב:',
    code: 'km_away <- c(24, 30, 18, 27)\nkm_away[c(4, 1)]',
    options: ['27 24', '24 27', '4 1', '27 18 30 24'],
    answer: 0,
    hint: 'בתוך `[ ]` יש וקטור של מיקומים. באיזה סדר R עובר עליהם?',
    explanation: [
      {
        text: 'בתוך `[ ]` יש וקטור של **מיקומים**, `c(4, 1)`. R שולף את הערכים שנמצאים במיקומים האלה:',
        vector: { values: ['24', '30', '18', '27'], marks: ['on', 'off', 'off', 'on'], showIndex: true }
      },
      {
        text: 'R מחזיר את הערכים **לפי הסדר שבו כתבנו את המיקומים**: קודם השכונה במיקום 4 (`27`) ואחר כך השכונה במיקום 1 (`24`):',
        vector: { values: ['27', '24'], marks: ['on', 'on'], labels: ['km_away[4]', 'km_away[1]'] }
      },
      {
        text: 'זה הפלט:',
        output: '[1] 27 24'
      }
    ],
    whyWrong: {
      1: '`24 27` הוא מה ש-`km_away[c(1, 4)]` מדפיס. R לא מסדר את המיקומים מהקטן לגדול: הוא שולף אותם בדיוק בסדר שכתבנו, קודם 4 ואחר כך 1.',
      2: '`4` ו-`1` הם **המיקומים** שביקשנו, לא הערכים. `km_away[c(4, 1)]` מחזיר את מה ש**נמצא** במיקומים האלה: `27` ו-`24`.',
      3: '`27 18 30 24` הוא מה ש-`km_away[4:1]` מדפיס: כל המיקומים מ-4 עד 1. אבל `c(4, 1)` הוא וקטור של שני מספרים בלבד, 4 ו-1, ולכן R שולף רק שני ערכים.'
    }
  },

  {
    id: 'vectors-range-index',
    station: 'vectors',
    level: 1,
    context: 'כמה דקות חיכה הוואן בכל אחת מחמש העצירות בסבב:',
    code: 'wait <- c(6, 9, 7, 11, 8)\nwait[2:4]',
    options: ['9 11', '7 11 8', '9 7 11', '9 7'],
    answer: 2,
    hint: 'אילו מספרים `2:4` יוצר? כתבו אותם, ואז מצאו את המיקומים האלה ב-`wait`.',
    explanation: [
      {
        text: '`2:4` יוצר את המספרים `2 3 4`, כלומר שלושה **מיקומים**, כולל שני הקצוות.'
      },
      {
        text: 'R שולף את הערכים שבמיקומים 2, 3 ו-4. ב-R סופרים מ-1, ולכן מיקום 2 הוא העצירה השנייה:',
        vector: { values: ['6', '9', '7', '11', '8'], marks: ['off', 'on', 'on', 'on', 'off'], showIndex: true }
      },
      {
        text: 'זה הפלט:',
        output: '[1]  9  7 11'
      }
    ],
    whyWrong: {
      0: '`9 11` הוא מה ש-`wait[c(2, 4)]` מדפיס: רק מיקומים 2 ו-4. אבל `2:4` הוא לא שני מספרים: הוא כל המספרים מ-2 עד 4, כלומר `2 3 4`.',
      1: '`7 11 8` הוא מה ש-`wait[3:5]` מדפיס, כאילו סופרים את המיקומים מ-0. ב-R המיקום הראשון הוא 1, ולכן מיקום 2 הוא `9`.',
      3: '`9 7` הוא מה ש-`wait[2:3]` מדפיס, כאילו המספר האחרון לא נכלל. ב-R, `2:4` כולל גם את `4`, ולכן גם `11` נכנס.'
    }
  },

  {
    id: 'vectors-rep-whole',
    station: 'vectors',
    level: 1,
    context: 'לפני הסבב אורזים בוואן ארגזים של מבחנות:',
    code: 'packing <- rep(c(2, 5), 3)\npacking',
    options: ['2 2 2 5 5 5', '6 15', '2 5 3', '2 5 2 5 2 5'],
    answer: 3,
    hint: 'השם `rep` בא מ-repeat (לחזור על משהו). על מה בדיוק R חוזר כאן, ובאיזה סדר?',
    explanation: [
      {
        text: '`rep(x, times)` חוזר על `x` כמה פעמים. כאן `x` הוא הווקטור `c(2, 5)`, ו-`times` הוא `3`.'
      },
      {
        text: 'כש-`times` הוא מספר אחד, R חוזר על **הווקטור כולו**, לפי הסדר: `2 5`, ושוב `2 5`, ושוב `2 5`:',
        vector: { values: ['2', '5', '2', '5', '2', '5'], marks: ['on', 'on', '', '', 'on', 'on'], labels: ['פעם 1', 'פעם 1', 'פעם 2', 'פעם 2', 'פעם 3', 'פעם 3'] }
      },
      {
        text: 'זה הפלט:',
        output: '[1] 2 5 2 5 2 5'
      }
    ],
    whyWrong: {
      0: '`2 2 2 5 5 5` הוא מה ש-`rep(c(2, 5), c(3, 3))` מדפיס: שם כל איבר חוזר 3 פעמים בנפרד. כש-`times` הוא מספר אחד, R חוזר על כל הווקטור `2 5` שלוש פעמים, ולכן המספרים מתחלפים.',
      1: '`6 15` הוא מה ש-`c(2, 5) * 3` מדפיס: כל איבר כפול 3. אבל `rep()` לא מכפיל את הערכים: הוא חוזר עליהם, ולכן התוצאה ארוכה יותר.',
      2: '`2 5 3` הוא מה ש-`c(c(2, 5), 3)` מדפיס: שם `3` פשוט נוסף בסוף. ב-`rep()` הארגומנט השני אומר **כמה פעמים** לחזור, והוא עצמו לא נכנס לווקטור.'
    }
  },

  // ---------- level 2 ----------
  {
    id: 'vectors-logical-to-number',
    station: 'vectors',
    level: 2,
    context: 'כמה מבחנות מילאתם בכל עצירה. בשתי עצירות הנהג רשם בטעות רק אם אספתם או לא:',
    code: 'collected <- c(3, TRUE, 0, FALSE, 2)\ncollected',
    options: ['3 TRUE 0 FALSE 2', '3 1 0 0 2', '"3" "TRUE" "0" "FALSE" "2"', 'שגיאה (Error), כי אי אפשר לשים מספרים ו-`TRUE` באותו וקטור'],
    answer: 1,
    hint: 'אילו סוגים של ערכים יש בתוך `c()`? ומה R עושה כשהוא מקבל סוגים שונים?',
    explanation: [
      {
        text: 'ב-`c()` יש מספרים וגם ערכים לוגיים (`TRUE` ו-`FALSE`), אבל אין טקסט:',
        vector: { values: ['3', 'TRUE', '0', 'FALSE', '2'], marks: ['', 'on', '', 'on', ''], labels: ['numeric', 'logical', 'numeric', 'logical', 'numeric'] }
      },
      {
        text: 'וקטור מחזיק סוג אחד בלבד. כל הערכים כאן יכולים להיות מספרים, ולכן R הופך את הערכים הלוגיים למספרים: `TRUE` הופך ל-`1` ו-`FALSE` הופך ל-`0`:',
        vector: { values: ['3', '1', '0', '0', '2'], marks: ['', 'on', '', 'on', ''], labels: ['numeric', 'numeric', 'numeric', 'numeric', 'numeric'] }
      },
      {
        text: 'זה הפלט:',
        output: '[1] 3 1 0 0 2'
      }
    ],
    whyWrong: {
      0: 'בווקטור אחד אי אפשר שיהיו גם מספרים וגם ערכים לוגיים: כל האיברים הם מאותו סוג. R הופך את `TRUE` ל-`1` ואת `FALSE` ל-`0`, וכך כל הווקטור הוא מספרים.',
      2: 'כל האיברים הופכים לטקסט רק כשיש בווקטור לפחות ערך אחד של טקסט (עם מירכאות). כאן אין טקסט, ולכן R הופך הכול למספרים: `TRUE` ל-`1` ו-`FALSE` ל-`0`.',
      3: 'R לא נותן שגיאה כשמערבבים ב-`c()` מספרים עם `TRUE` או `FALSE`. הוא הופך את כל האיברים לסוג אחד, כאן מספרים, וממשיך.'
    }
  },

  {
    id: 'vectors-minus-position',
    station: 'vectors',
    level: 2,
    context: 'אלון רשם כמה ארגזים נכנסו לוואן בכל אחת מחמש העצירות:',
    code: 'loads <- c(3, 5, 4, 2, 1)\nsum(loads[-2])',
    options: ['10', '13', '5', '15'],
    answer: 0,
    hint: 'שימו לב שהמספר `2` מופיע גם בתוך `[ ]` וגם בתוך הווקטור עצמו. מה מסמן המספר שבתוך `[ ]`?',
    explanation: [
      {
        text: 'מספר בתוך `[ ]` הוא **מיקום**, לא ערך. מינוס לפניו אומר: הוציאו את האיבר שבמיקום הזה. לכן `-2` מוציא את העצירה השנייה, את ה-`5`. ה-`2` שבמיקום 4 נשאר:',
        vector: { values: ['3', '5', '4', '2', '1'], marks: ['', 'drop', '', '', ''], showIndex: true }
      },
      {
        text: '`sum()` מחבר את ארבעת המספרים שנשארו: `3 + 4 + 2 + 1`',
        output: '[1] 10'
      }
    ],
    whyWrong: {
      1: '`13` יוצא אם מוציאים את **הערך** `2` (`3 + 5 + 4 + 1`). אבל `-2` בתוך `[ ]` מתייחס ל**מיקום** 2, ולכן יוצא ה-`5`, וה-`2` שבמיקום 4 נשאר.',
      2: '`5` הוא האיבר שבמיקום 2, כלומר מה ש-`sum(loads[2])` נותן. המינוס לפני ה-2 **מוציא** את המיקום הזה, ולא בוחר אותו.',
      3: '`15` הוא הסכום של כל חמש העצירות, `sum(loads)`. אבל `loads[-2]` כבר בלי העצירה השנייה, ולכן `sum()` מקבל רק ארבעה מספרים.'
    }
  },

  {
    id: 'vectors-before-last',
    station: 'vectors',
    level: 2,
    context: 'כמה דקות נשאר הוואן בכל אחת מארבע השכונות, לפי סדר הסבב:',
    code: 'stay <- c(54, 62, 48, 70)\nstay[length(stay) - 1]',
    options: ['3', '69', '54 62 48', '48'],
    answer: 3,
    hint: 'פתרו מבפנים החוצה: קודם `length(stay)`, ואחר כך `- 1`. ומה עושה המספר שיצא כשהוא נמצא בתוך `[ ]`?',
    explanation: [
      {
        text: '`length(stay)` הוא `4`, כי יש 4 שכונות. ה-`- 1` נמצא **בתוך** `[ ]`, ולכן הוא משנה את המיקום: `4 - 1` הוא `3`.'
      },
      {
        text: 'עכשיו R מחשב את `stay[3]`, כלומר שולף את הערך שבמיקום 3, השכונה שלפני האחרונה:',
        vector: { values: ['54', '62', '48', '70'], marks: ['off', 'off', 'on', 'off'], showIndex: true }
      },
      {
        text: 'זה הפלט:',
        output: '[1] 48'
      }
    ],
    whyWrong: {
      0: '`3` הוא מה ש-`length(stay) - 1` מדפיס לבד, בלי `stay[ ]` מסביב. כאן `3` הוא רק המיקום, ו-`stay[3]` מחזיר את הערך שנמצא בו.',
      1: '`69` הוא מה ש-`stay[length(stay)] - 1` מדפיס: שם ה-`- 1` נמצא מחוץ ל-`[ ]`, ולכן הוא מוריד דקה אחת מהשכונה האחרונה. כאן הוא בתוך `[ ]`, ולכן הוא מזיז את המיקום אחד אחורה.',
      2: '`54 62 48` הוא מה ש-`stay[-length(stay)]` מדפיס: מינוס **לפני** מיקום מוציא אותו. כאן כתוב `length(stay) - 1`, חיסור רגיל, והתוצאה היא מיקום אחד: `3`.'
    }
  },

  {
    id: 'vectors-nchar-each',
    station: 'vectors',
    level: 2,
    context: 'מדפיסים מדבקות לארגזים עם שם השכונה. אלה השכונות של הסבב היום:',
    code: 'hoods <- c("North", "Hills", "Old Port")\nnchar(hoods)',
    options: ['5 5 7', '3', '5 5 8', '18'],
    answer: 2,
    hint: 'מה בדיוק `nchar()` סופר? ומה הוא עושה כשהוא מקבל וקטור שלם, ולא טקסט אחד?',
    explanation: [
      {
        text: '`hoods` הוא וקטור של טקסט עם 3 איברים. `nchar()` פועל על **כל איבר בנפרד**, ומחזיר מספר אחד לכל איבר:',
        vector: { values: ['"North"', '"Hills"', '"Old Port"'], marks: ['', '', 'on'], labels: ['5', '5', '8'], showIndex: true }
      },
      {
        text: '`nchar()` סופר כל תו שבין המירכאות, וגם רווח הוא תו. ב-`"Old Port"` יש 3 אותיות, רווח אחד ועוד 4 אותיות, כלומר 8 תווים.'
      },
      {
        text: 'התוצאה היא וקטור באורך 3, מספר לכל שכונה:',
        output: '[1] 5 5 8'
      }
    ],
    whyWrong: {
      0: '`5 5 7` יוצא אם סופרים רק אותיות. אבל `nchar()` סופר כל תו שבין המירכאות, גם את הרווח באמצע `"Old Port"`, ולכן יש בו 8 תווים.',
      1: '`3` הוא מה ש-`length(hoods)` מדפיס: כמה **איברים** יש בווקטור. `nchar()` סופר כמה **תווים** יש בכל איבר.',
      3: '`18` הוא מה ש-`sum(nchar(hoods))` מדפיס, כל התווים יחד. בלי `sum()`, R לא מחבר: `nchar()` מחזיר מספר נפרד לכל איבר.'
    }
  },

  // ---------- level 3 ----------
  {
    id: 'vectors-swap-overwrite',
    station: 'vectors',
    level: 3,
    context: 'כמה מבחנות יש בכל אחד משלושת המדפים בוואן:',
    code: 'shelves <- c(9, 4, 6)\nshelves[1] <- shelves[3]\nshelves[3] <- shelves[1]\nshelves',
    options: ['6 4 9', '6 4 6', '9 4 9', '9 4 6'],
    answer: 1,
    hint: 'עקבו אחרי `shelves` שורה אחרי שורה. מה הערך של `shelves[1]` ברגע ששורה 3 רצה?',
    explanation: [
      {
        text: 'שורה 2: `shelves[3]` הוא `6`, והוא נכנס למיקום 1. הערך `9` שהיה שם **נמחק**:',
        vector: { values: ['6', '4', '6'], marks: ['on', '', ''], showIndex: true }
      },
      {
        text: 'שורה 3: `shelves[1]` הוא **עכשיו** `6`, לא `9`. לכן למיקום 3 נכנס שוב `6`, ושום דבר לא משתנה:',
        vector: { values: ['6', '4', '6'], marks: ['', '', 'on'], showIndex: true }
      },
      {
        text: 'ה-`9` כבר לא נמצא בשום מקום, ולכן הערכים לא הוחלפו:',
        output: '[1] 6 4 6'
      }
    ],
    whyWrong: {
      0: 'זאת התוצאה של החלפה אמיתית בין המדף הראשון לשלישי, אבל R מריץ את השורות אחת אחרי השנייה. אחרי שורה 2 ה-`9` כבר נמחק, ולכן בשורה 3 `shelves[1]` הוא `6`, לא `9`. (כדי להחליף, צריך קודם לשמור את `9` במשתנה נוסף.)',
      2: '`9 4 9` יוצא אם קוראים את החץ הפוך, כאילו `shelves[1] <- shelves[3]` מעתיק את מה שבמיקום 1 אל מיקום 3. אבל `<-` מכניס את מה שמימין לתוך מה שמשמאל: `shelves[1]` מקבל את הערך של `shelves[3]`.',
      3: 'שתי השורות לא מבטלות זו את זו: כל השמה **מחליפה** את הערך שבמיקום. אחרי שורה 2 ה-`9` נמחק, ושורה 3 לא יכולה להחזיר אותו, כי היא מעתיקה את מה שיש עכשיו ב-`shelves[1]`, כלומר `6`.'
    }
  },

  {
    id: 'vectors-remove-renumber',
    station: 'vectors',
    level: 3,
    context: 'כמה מבחנות תכננתם למלא בכל עצירה בסבב:',
    code: 'plan <- c(15, 40, 22, 9)\nplan <- plan[-2]\nplan[2] + plan[3]',
    options: ['62', 'שגיאה (Error), כי מיקום 2 כבר לא קיים', '31', '22'],
    answer: 2,
    hint: 'כתבו את `plan` אחרי שורה 2. כמה איברים יש בו עכשיו, ומה נמצא במיקום 2?',
    explanation: [
      {
        text: 'שורה 2: `[-2]` מוציא את המיקום השני, והתוצאה נשמרת שוב ב-`plan`:',
        vector: { values: ['15', '40', '22', '9'], marks: ['', 'drop', '', ''], showIndex: true }
      },
      {
        text: 'עכשיו יש ב-`plan` שלושה איברים, והמיקומים **מתעדכנים**: `22` עבר למיקום 2, ו-`9` עבר למיקום 3:',
        vector: { values: ['15', '22', '9'], marks: ['', 'on', 'on'], showIndex: true }
      },
      {
        text: 'שורה 3 מחברת את הערכים שבמיקומים 2 ו-3 של הווקטור החדש, `22 + 9`:',
        output: '[1] 31'
      }
    ],
    whyWrong: {
      0: '`62` הוא `40 + 22`, הערכים שהיו במיקומים 2 ו-3 **לפני** שורה 2. אבל `plan <- plan[-2]` שמר את הווקטור החדש, ובו המיקומים מתעדכנים: במיקום 2 יש עכשיו `22`, ובמיקום 3 יש `9`.',
      1: 'אחרי שמוציאים איבר, הווקטור פשוט מתקצר ומספרי המיקומים מתעדכנים. ב-`plan` יש עכשיו 3 איברים, ולכן מיקום 2 ומיקום 3 קיימים, ואין שגיאה.',
      3: '`22` יוצא אם חושבים שבמיקום 2 נשאר "חור" ריק (כאילו יש בו 0), ושבמיקום 3 עדיין נמצא `22`. אבל בווקטור אין חורים: אחרי שמוציאים איבר, כל איבר שאחריו עובר למיקום הקודם.'
    }
  },

  {
    id: 'vectors-index-inside-index',
    station: 'vectors',
    level: 3,
    context: 'על הפתקים שמחכים בעצירות של הוואן כתובים מספרים:',
    code: 'next_stop <- c(3, 4, 2, 1)\nnext_stop[next_stop[1]]',
    options: ['2', '3', '3 2', '1'],
    answer: 0,
    hint: 'יש כאן סוגריים מרובעים בתוך סוגריים מרובעים. איזה חלק R מחשב קודם, ומה הוא עושה עם התוצאה?',
    explanation: [
      {
        text: 'R מתחיל מהסוגריים **הפנימיים**: `next_stop[1]` הוא הערך שבמיקום 1, כלומר `3`:',
        vector: { values: ['3', '4', '2', '1'], marks: ['on', '', '', ''], showIndex: true }
      },
      {
        text: 'עכשיו הקוד הוא בעצם `next_stop[3]`: הערך `3` משמש כ**מיקום**. במיקום 3 נמצא `2`:',
        vector: { values: ['3', '4', '2', '1'], marks: ['off', 'off', 'on', 'off'], showIndex: true }
      },
      {
        text: 'R מדפיס רק את התוצאה הסופית:',
        output: '[1] 2'
      }
    ],
    whyWrong: {
      1: '`3` הוא מה ש-`next_stop[1]` מדפיס, וזה רק הצעד הפנימי. R ממשיך: הוא משתמש ב-`3` כמיקום ושולף את `next_stop[3]`.',
      2: '`3 2` הוא מה ש-`next_stop[c(1, 3)]` מדפיס. אבל R לא מדפיס את הצעדים שבדרך: התוצאה של הסוגריים הפנימיים היא רק מיקום, והפלט הוא הערך שנמצא בו.',
      3: '`1` הוא המיקום שבו נמצא **הערך** `3`. אבל בתוך `[ ]` המספר `3` הוא מיקום, ולכן R לא מחפש איפה נמצא הערך 3: הוא שולף את מה שנמצא במיקום 3, כלומר `2`.'
    }
  },

  // ===== שבוע 3: שמות, סינון ו-NA =====
  // ---------- level 1 ----------
  {
    id: 'names-na-second-name',
    station: 'names-na',
    level: 1,
    context: 'כמה נקודות וירוס ספרתם במיקרוסקופ בדגימות מכל שכונה:',
    code: 'spots <- c(North = 40, Port = 25, Hills = 60)\nnames(spots)[2]',
    options: ['25', '"Port"', '"Hills"', 'Port 25'],
    answer: 1,
    hint: 'קודם חשבו מה `names(spots)` מחזיר לבדו, ורק אחר כך מה `[2]` שולף ממנו.',
    explanation: [
      {
        text: 'ב-`spots` יש 3 איברים, ולכל איבר יש שם של שכונה:',
        vector: { values: ['40', '25', '60'], marks: ['', '', ''], labels: ['North', 'Port', 'Hills'], showIndex: true }
      },
      {
        text: '`names(spots)` מחזיר וקטור של טקסט עם השמות בלבד, בלי המספרים. `[2]` שולף ממנו את המיקום השני:',
        vector: { values: ['"North"', '"Port"', '"Hills"'], marks: ['off', 'on', 'off'], showIndex: true }
      },
      {
        text: 'השם מודפס כטקסט, עם מרכאות:',
        output: '[1] "Port"'
      }
    ],
    whyWrong: {
      0: '`25` הוא ה**ערך** שבמיקום 2, כלומר מספר הנקודות. אבל `names(spots)` מחזיר רק את השמות, ולכן `[2]` שולף את השם השני ולא את המספר.',
      2: 'ב-R ספירת המיקומים מתחילה מ-1, ולכן מיקום 2 הוא `"Port"`. `"Hills"` נמצא במיקום 3.',
      3: 'זה מה ש-`spots[2]` מדפיס: האיבר השני יחד עם השם שלו (R מדפיס את השם מעל המספר). כאן `spots` נמצא בתוך `names()`, ולכן מקבלים רק את השם, כטקסט במרכאות.'
    }
  },

  {
    id: 'names-na-count-missing',
    station: 'names-na',
    level: 1,
    context: 'ספירת הנקודות ב-6 שקופיות. `NA` מסמן שקופית שנשברה בדרך למיקרוסקופ:',
    code: 'slides <- c(72, NA, 80, 65, NA, NA)\nsum(is.na(slides))',
    options: ['NA', 'FALSE TRUE FALSE FALSE TRUE TRUE', '217', '3'],
    answer: 3,
    hint: 'מה `is.na()` מחזיר לכל שקופית? ואיך `sum()` מחבר ערכים כאלה?',
    explanation: [
      {
        text: '`is.na(slides)` בודק כל איבר: `TRUE` אם הוא `NA` (שקופית שבורה), ו-`FALSE` אם יש בו ספירה:',
        vector: {
          values: ['72', 'NA', '80', '65', 'NA', 'NA'],
          marks: ['off', 'on', 'off', 'off', 'on', 'on'],
          labels: ['FALSE', 'TRUE', 'FALSE', 'FALSE', 'TRUE', 'TRUE']
        }
      },
      {
        text: '`sum()` סופר כל `TRUE` כ-1 וכל `FALSE` כ-0: `0 + 1 + 0 + 0 + 1 + 1`. כך מקבלים את מספר השקופיות השבורות:',
        output: '[1] 3'
      }
    ],
    whyWrong: {
      0: '`NA` הוא מה ש-`sum(slides)` מדפיס: כשיש `NA` בין המספרים, גם הסכום שלהם הוא `NA`. אבל כאן `sum()` מחבר את התוצאה של `is.na()`, ובה יש רק `TRUE` ו-`FALSE`, בלי אף `NA`.',
      1: 'זה מה ש-`is.na(slides)` מדפיס לבד. כאן הוא נמצא בתוך `sum()`, שסופר את ה-`TRUE` ומחזיר מספר אחד.',
      2: '`217` הוא סך הנקודות בשקופיות השלמות, כלומר `sum(slides, na.rm = TRUE)`. אבל כאן לא מחברים את הנקודות עצמן: מחברים את ה-`TRUE` וה-`FALSE` ש-`is.na()` מחזיר, כלומר סופרים כמה שקופיות נשברו.'
    }
  },

  {
    id: 'names-na-which-positions',
    station: 'names-na',
    level: 1,
    context: 'באיזו הגדלה (`zoom`) הסתכלתם על כל אחת מחמש השקופיות:',
    code: 'zoom <- c(10, 40, 100, 10, 40)\nwhich(zoom == 40)',
    options: ['2 5', '40 40', 'FALSE TRUE FALSE FALSE TRUE', '2'],
    answer: 0,
    hint: 'קודם כתבו מה `zoom == 40` מחזיר לכל שקופית. ואז: מה `which()` עושה עם ה-`TRUE` שבתוצאה?',
    explanation: [
      {
        text: '`zoom == 40` בודק כל שקופית ומחזיר `TRUE` או `FALSE`:',
        vector: {
          values: ['10', '40', '100', '10', '40'],
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
      1: '`40 40` הוא מה ש-`zoom[zoom == 40]` מדפיס: הערכים עצמם. `which()` לא מחזיר ערכים, אלא את המיקומים שלהם בווקטור, כלומר את מספרי השקופיות.',
      2: 'זה מה ש-`zoom == 40` מדפיס לבד. `which()` עובר על הווקטור הזה ומחזיר רק את המיקומים שבהם יש `TRUE`.',
      3: '`which()` מחזיר את **כל** המיקומים שבהם התנאי נכון, ולא רק את הראשון. `40` מופיע פעמיים: במיקום 2 ובמיקום 5. (ו-`which()` גם לא סופר: את מספר ה-`TRUE` נותן `sum(zoom == 40)`.)'
    }
  },

  // ---------- level 2 ----------
  {
    id: 'names-na-or-keeps-order',
    station: 'names-na',
    level: 2,
    context: 'כמה נקודות וירוס ספרתם בכל אחת משש השקופיות של הבוקר:',
    code: 'counts <- c(4, 15, 32, 70, 81, 9)\ncounts[counts < 12 | counts > 60]',
    options: ['numeric(0)', '15 32', '4 70 81 9', '4 9 70 81'],
    answer: 2,
    hint: 'בדקו כל ספירה מול **שני** התנאים, משמאל לימין. מה `|` דורש כדי לתת `TRUE`?',
    explanation: [
      {
        text: 'לכל שקופית R בודק את שני התנאים. `|` ("או") נותן `TRUE` אם **לפחות אחד** מהם נכון:',
        table: {
          columns: ['counts', 'counts < 12', 'counts > 60', '|'],
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
        text: 'R שולף את הספירות שבמיקומים שבהם יש `TRUE`, **לפי הסדר שלהן בווקטור**:',
        vector: { values: ['4', '15', '32', '70', '81', '9'], marks: ['on', 'off', 'off', 'on', 'on', 'on'], showIndex: true }
      },
      {
        text: 'זה הפלט:',
        output: '[1]  4 70 81  9'
      }
    ],
    whyWrong: {
      0: '`numeric(0)` (וקטור ריק) הוא מה ש-`&` היה מדפיס: אין ספירה שהיא גם קטנה מ-12 וגם גדולה מ-60. אבל `|` פירושו "או": מספיק שאחד התנאים נכון.',
      1: '`15 32` הן בדיוק הספירות ש**לא** עומדות באף אחד מהתנאים. R שולף את המיקומים שבהם יש `TRUE`, כלומר את כל השאר.',
      3: 'R לא מחזיר קודם את מה שעומד בתנאי הראשון ואחר כך את מה שעומד בשני. הוא עובר על הווקטור פעם אחת, משמאל לימין, ושומר על הסדר המקורי, ולכן `9` מופיע בסוף. (`4 9 70 81` הוא מה ש-`c(counts[counts < 12], counts[counts > 60])` מדפיס.)'
    }
  },

  {
    id: 'names-na-rev-names',
    station: 'names-na',
    level: 2,
    context: 'כמה שקופיות בדק כל אחד מהצוות במיקרוסקופ, לפי סדר המשמרות:',
    code: 'checked <- c(Tal = 20, Hila = 35, Ido = 10)\nnames(rev(checked))[1]',
    options: ['"Ido"', '"Tal"', '"Hila"', '10'],
    answer: 0,
    hint: 'כתבו את `rev(checked)` במלואו, עם השמות. רק אחר כך הפעילו עליו את `names()`.',
    explanation: [
      {
        text: '`checked` הוא וקטור עם שמות:',
        vector: { values: ['20', '35', '10'], marks: ['', '', ''], labels: ['Tal', 'Hila', 'Ido'], showIndex: true }
      },
      {
        text: '`rev()` הופך את סדר האיברים: האחרון הופך לראשון. כל שם צמוד לערך שלו, ולכן השמות זזים יחד עם המספרים:',
        vector: { values: ['10', '35', '20'], marks: ['on', '', ''], labels: ['Ido', 'Hila', 'Tal'], showIndex: true }
      },
      {
        text: '`names()` מחזיר את השמות לפי הסדר החדש, ו-`[1]` שולף את הראשון:',
        output: '[1] "Ido"'
      }
    ],
    whyWrong: {
      1: '`"Tal"` היה נכון אם `rev()` היה הופך רק את המספרים והשמות היו נשארים במקומם. אבל כל שם צמוד לערך שלו: `Ido` זז יחד עם `10` למיקום הראשון.',
      2: '`rev()` לא ממיין מהגדול לקטן: הוא רק הופך את הסדר. `Hila` הייתה ראשונה רק אם היינו ממיינים לפי מספר השקופיות (`35` הוא המספר הגדול ביותר).',
      3: '`10` הוא ה**ערך** הראשון אחרי ההיפוך (זה מה ש-`unname(rev(checked))[1]` מדפיס). אבל `names()` מחזיר את השמות, ולא את המספרים.'
    }
  },

  {
    id: 'names-na-and-name-value',
    station: 'names-na',
    level: 2,
    context: 'ארבע דגימות מהמגש של היום, וכמה נקודות וירוס נראו בכל אחת:',
    code: 'spots <- c(A1 = 12, A2 = 30, A3 = 8, A4 = 25)\nsum(spots[names(spots) != "A2" & spots > 10])',
    options: ['67', '45', '75', '37'],
    answer: 3,
    hint: 'עברו דגימה-דגימה ובדקו את שני התנאים: אחד על השם ואחד על המספר. מה `&` דורש כדי שדגימה תיכנס לסכום?',
    explanation: [
      {
        text: 'לכל דגימה נבדקים שני תנאים: האם השם שלה שונה מ-`"A2"`, והאם הערך גדול מ-10. `&` ("וגם") נותן `TRUE` רק אם **שניהם** נכונים:',
        table: {
          columns: ['name', 'value', '!= "A2"', '> 10', '&'],
          rows: [
            ['A1', '12', 'TRUE', 'TRUE', 'TRUE'],
            ['A2', '30', 'FALSE', 'TRUE', 'FALSE'],
            ['A3', '8', 'TRUE', 'FALSE', 'FALSE'],
            ['A4', '25', 'TRUE', 'TRUE', 'TRUE']
          ],
          highlightRows: [0, 3]
        }
      },
      {
        text: 'בתוך `[ ]` נשארות רק `A1` ו-`A4`:',
        vector: { values: ['12', '30', '8', '25'], marks: ['on', 'off', 'off', 'on'], labels: ['A1', 'A2', 'A3', 'A4'] }
      },
      {
        text: '`sum()` מחבר אותן: `12 + 25`',
        output: '[1] 37'
      }
    ],
    whyWrong: {
      0: '`67` הוא מה ש-`sum(spots[spots > 10])` מדפיס, כלומר בלי התנאי על השם. אבל `&` דורש ששני התנאים יתקיימו, ולכן `A2` לא נכנסת לסכום, למרות ש-30 גדול מ-10.',
      1: '`45` הוא מה ש-`sum(spots[names(spots) != "A2"])` מדפיס, כלומר בלי התנאי `spots > 10`. בגלל `&` גם `A3` נשארת בחוץ, כי 8 לא גדול מ-10.',
      2: '`75` הוא סכום כל הדגימות. זה מה שהיה יוצא עם `|` ("או"), כי כל דגימה עומדת לפחות באחד התנאים. אבל `&` ("וגם") דורש ששניהם יתקיימו.'
    }
  },

  // ---------- level 3 ----------
  {
    id: 'names-na-not-keeps-na',
    station: 'names-na',
    level: 3,
    context: 'על המגש יש חמש שקופיות, ושתיים מהן נשברו בדרך. כמה נקודות וירוס ראיתם בכל אחת:',
    code: 'tray <- c(8, NA, 3, 12, NA)\ntray[!(tray > 5)]',
    options: ['3', 'NA 3 NA', '8 NA 12 NA', 'FALSE NA TRUE FALSE NA'],
    answer: 1,
    hint: 'האם R יכול לדעת אם בשקופית שבורה יש יותר מ-5 נקודות? ומה קורה כשמפעילים `!` על התשובה שלו?',
    explanation: [
      {
        text: '`tray > 5` בודק כל שקופית. על `NA` אי אפשר לדעת אם הוא גדול מ-5, ולכן גם התשובה שם היא `NA`:',
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
        text: 'בתוך `[ ]`, R מחזיר את הערך בכל מיקום שבו יש `TRUE`, ו-`NA` בכל מיקום שבו יש `NA`. לכן השקופיות השבורות נשארות בתוצאה:',
        output: '[1] NA  3 NA'
      }
    ],
    whyWrong: {
      0: 'ה-`NA` לא נעלמים מעצמם: `!(tray > 5)` נותן `NA` במיקומים 2 ו-5, ו-R מחזיר `NA` בכל מיקום כזה. כדי לקבל רק `3` צריך להוציא את ה-`NA` במפורש, למשל עם `tray[!(tray > 5) & !is.na(tray)]`.',
      2: 'זה מה ש-`tray[tray > 5]` מדפיס, כלומר בלי ה-`!`. `!` הופך את התנאי, ולכן נבחרת הספירה ש**לא** גדולה מ-5, כלומר `3`. ה-`NA` נשארים בשני המקרים.',
      3: 'זה מה ש-`!(tray > 5)` מדפיס לבד. כשהוא בתוך `tray[ ]`, R לא מדפיס את ה-`TRUE` וה-`FALSE`, אלא שולף את הערכים מ-`tray`.'
    }
  },

  {
    id: 'names-na-diff-narm',
    station: 'names-na',
    level: 3,
    context: 'ספרתם נקודות באותן 4 שקופיות בבוקר ובערב. חלק מהספירות חסרות:',
    code: 'morning <- c(70, 82, NA, 65)\nevening <- c(68, NA, 74, 66)\nchange <- evening - morning\nsum(change, na.rm = TRUE)',
    options: ['NA', '-9', '-1', '-2 NA NA 1'],
    answer: 2,
    hint: 'קודם כתבו את `change` שקופית-שקופית. מה יוצא כשאחד משני המספרים בחיסור הוא `NA`?',
    explanation: [
      {
        text: 'החיסור נעשה איבר מול איבר. בכל מקום שבו אחת הספירות היא `NA`, גם התוצאה היא `NA`:',
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
      1: '`-9` יוצא אם מתייחסים ל-`NA` כאילו הוא `0` (למשל `74 - 0`, שזה `74`). זה גם מה ש-`sum(evening, na.rm = TRUE) - sum(morning, na.rm = TRUE)` מדפיס. אבל `NA` הוא ספירה חסרה ולא אפס נקודות: `74 - NA` הוא `NA`, ו-`na.rm = TRUE` מוציא אותו מהסכום.',
      3: 'זה הערך של `change`. השורה האחרונה מחברת אותו עם `sum()`, ולכן מודפס מספר אחד.'
    }
  },

  {
    id: 'names-na-replace-which',
    station: 'names-na',
    level: 3,
    context: 'במעבדה יש שלושה מיקרוסקופים: אדום, כחול וירוק. כמה שקופיות מחכות ליד כל אחד:',
    code: 'waiting <- c(red = 3, blue = 0, green = 5)\nwaiting["blue"] <- waiting["red"] + 2\nnames(waiting)[which(waiting == 5)]',
    options: ['"green"', '2 3', '"red" "green"', '"blue" "green"'],
    answer: 3,
    hint: 'עקבו אחרי `waiting` שורה אחרי שורה, וכתבו איך הוא נראה אחרי שורה 2.',
    explanation: [
      {
        text: 'שורה 2: `waiting["red"]` הוא `3`, ו-`3 + 2` הוא `5`. התוצאה נשמרת באיבר ששמו `blue`, כי הוא כתוב משמאל ל-`<-`:',
        vector: { values: ['3', '5', '5'], marks: ['', 'on', ''], labels: ['red', 'blue', 'green'], showIndex: true }
      },
      {
        text: 'שורה 3: `waiting == 5` נכון עכשיו בשני מקומות, ו-`which()` מחזיר את שני המיקומים: `2` ו-`3`.',
        vector: { values: ['3', '5', '5'], marks: ['off', 'on', 'on'], labels: ['FALSE', 'TRUE', 'TRUE'], showIndex: true }
      },
      {
        text: '`names(waiting)` הוא `"red" "blue" "green"`, ו-R שולף ממנו את השמות שבמיקומים 2 ו-3:',
        output: '[1] "blue"  "green"'
      }
    ],
    whyWrong: {
      0: '`"green"` הוא מה שהיה יוצא בלי שורה 2. אבל שורה 2 שינתה את `blue` ל-`5`, ולכן גם הוא עונה על התנאי `waiting == 5`.',
      1: '`2 3` הם המיקומים ש-`which()` מחזיר. אבל הם נמצאים בתוך `names(waiting)[ ]`, ולכן R שולף את **השמות** שבמיקומים האלה.',
      2: '`waiting["red"] + 2` רק **קורא** את הערך של `red` ומוסיף לו 2. התוצאה נשמרת במה שכתוב משמאל ל-`<-`, כלומר ב-`blue`, ו-`red` נשאר `3`.'
    }
  },

  // ---------- level 1 ----------
  {
    id: 'names-na-length-after-names',
    station: 'names-na',
    level: 1,
    context: 'כמה שקופיות נשברו בדרך למעבדה, מכל שכונה:',
    code: 'broken <- c(4, 2, 7)\nnames(broken) <- c("North", "Port", "Market")\nlength(broken)',
    options: ['6', '13', '3', '7'],
    answer: 2,
    hint: 'מה `length()` סופר? ומה בדיוק השתנה ב-`broken` בשורה 2?',
    explanation: [
      {
        text: 'שורה 1 יוצרת וקטור של 3 מספרים. שורה 2 נותנת שם לכל איבר. השמות הם תוויות שמודבקות על האיברים, ולא איברים חדשים:',
        vector: { values: ['4', '2', '7'], marks: ['', '', ''], labels: ['North', 'Port', 'Market'], showIndex: true }
      },
      {
        text: '`length()` סופר כמה **איברים** יש בווקטור. עדיין יש בו 3 מספרים, ופשוט לכל אחד מהם יש עכשיו שם של שכונה:',
        output: '[1] 3'
      }
    ],
    whyWrong: {
      0: '`6` יוצא אם סופרים את השמות כאיברים נוספים: 3 מספרים ועוד 3 שמות. אבל `names()` רק מדביק תווית על כל איבר שכבר קיים, והווקטור נשאר באורך 3.',
      1: '`13` הוא סך השקופיות השבורות, כלומר מה ש-`sum(broken)` מדפיס. `length()` לא מחבר את הערכים: הוא סופר כמה איברים יש.',
      3: '`7` הוא הערך הגדול ביותר (מה ש-`max(broken)` מדפיס), והוא גם הערך האחרון. `length()` לא מסתכל על הערכים בכלל: הוא רק סופר כמה איברים יש.'
    }
  },

  {
    id: 'names-na-rename-one',
    station: 'names-na',
    level: 1,
    prompt: 'מה יודפס?',
    context: 'שלוש דגימות על השולחן ליד המיקרוסקופ, וכמה נקודות ספרתם בכל אחת:',
    code: 'spots <- c(S1 = 120, S2 = 45, S3 = 8)\nnames(spots)[2] <- "A7"\nnames(spots)',
    options: ['"S1" "S2" "S3"', '"S1" "A7" "S3"', '"S1" "S2" "A7"', '"S1" "A7" "S2" "S3"'],
    answer: 1,
    hint: 'מה כתוב משמאל ל-`<-` בשורה 2? מה בדיוק מוחלף שם, ומה נשאר כמו שהיה?',
    explanation: [
      {
        text: 'לפני שורה 2, לכל מספר ב-`spots` יש שם:',
        vector: { values: ['120', '45', '8'], marks: ['', '', ''], labels: ['S1', 'S2', 'S3'], showIndex: true }
      },
      {
        text: '`names(spots)[2] <- "A7"` מחליף רק את **השם** שבמיקום 2. המספר `45` לא משתנה, ושאר השמות נשארים במקומם:',
        vector: { values: ['120', '45', '8'], marks: ['', 'on', ''], labels: ['S1', 'A7', 'S3'], showIndex: true }
      },
      {
        text: 'שורה 3 מדפיסה את השמות אחרי השינוי:',
        output: '[1] "S1" "A7" "S3"'
      }
    ],
    whyWrong: {
      0: 'אלה השמות **לפני** שורה 2. `names(spots)[2] <- "A7"` משנה את השמות של `spots` עצמו, ולכן בשורה 3 כבר רואים את `"A7"`.',
      2: 'כך היה יוצא אם המיקומים היו נספרים מ-0, ואז `[2]` היה השם השלישי. אבל ב-R הספירה מתחילה מ-1, ולכן מוחלף השם השני, `"S2"`.',
      3: 'ההשמה עם `<-` **מחליפה** את השם שבמיקום 2, ולא מוסיפה שם חדש. ב-`spots` עדיין יש 3 איברים, ולכן יש לו בדיוק 3 שמות.'
    }
  },

  {
    id: 'names-na-unname-capitals',
    station: 'names-na',
    level: 1,
    context: 'מי מהצוות מסתכל במיקרוסקופ על כל דגימה:',
    code: 'viewer <- c(S1 = "Gal", S2 = "Shir", S3 = "Omri")\nunname(viewer)',
    options: ['"Gal" "Shir" "Omri"', '"S1" "S2" "S3"', '"S1" "Gal" "S2" "Shir" "S3" "Omri"', 'Gal Shir Omri'],
    answer: 0,
    hint: 'בזוג כמו `S1 = "Gal"`, מה השם ומה הערך? ומה `unname()` מוריד מהווקטור?',
    explanation: [
      {
        text: 'בכל זוג, מה שמשמאל ל-`=` הוא **השם**, ומה שמימין הוא **הערך**. לכן `viewer` הוא וקטור של טקסט עם 3 איברים (לא 6), ולכל איבר יש שם של דגימה:',
        vector: { values: ['"Gal"', '"Shir"', '"Omri"'], marks: ['', '', ''], labels: ['S1', 'S2', 'S3'], showIndex: true }
      },
      {
        text: '`unname()` מחזיר את הערכים בלי השמות. הערכים הם טקסט, ולכן R מדפיס אותם במרכאות:',
        output: '[1] "Gal"  "Shir" "Omri"'
      }
    ],
    whyWrong: {
      1: '`"S1" "S2" "S3"` הם השמות, כלומר מה ש-`names(viewer)` מדפיס. `unname()` עושה את ההפך: הוא מוריד את השמות ומשאיר את הערכים, ובכל זוג הערך הוא מה שמימין ל-`=`.',
      2: 'כך היה יוצא אם השמות היו איברים נוספים בווקטור. אבל ב-`viewer` יש רק 3 איברים: `S1` הוא תווית של `"Gal"`, ולא איבר בפני עצמו. `unname()` מוריד את התוויות, ונשארים 3 ערכים.',
      3: 'הערכים של `viewer` הם טקסט, ו-R מדפיס טקסט במרכאות. `unname()` רק מוריד את השמות ולא משנה את הערכים עצמם, ולכן המרכאות נשארות.'
    }
  },

  {
    id: 'names-na-pick-two-names',
    station: 'names-na',
    level: 1,
    context: 'כמה דקות לקח לספור את הנקודות בכל שקופית:',
    code: 'minutes <- c(A1 = 9, A2 = 7, A3 = 15, A4 = 18)\nsum(minutes[c("A2", "A4")])',
    options: ['40', '49', '7 18', '25'],
    answer: 3,
    hint: 'אילו איברים בדיוק `minutes[c("A2", "A4")]` שולף? רק אחרי זה חשבו מה `sum()` עושה איתם.',
    explanation: [
      {
        text: 'בתוך `[ ]` יש וקטור של שני שמות. R שולף את האיברים שקוראים להם בדיוק כך, ורק אותם:',
        vector: { values: ['9', '7', '15', '18'], marks: ['off', 'on', 'off', 'on'], labels: ['A1', 'A2', 'A3', 'A4'] }
      },
      {
        text: '`sum()` מחבר את שני הזמנים שנשלפו: `7 + 18`',
        output: '[1] 25'
      }
    ],
    whyWrong: {
      0: '`40` הוא `7 + 15 + 18`, כאילו `c("A2", "A4")` הוא טווח "מ-`A2` עד `A4`" (זה מה ש-`sum(minutes[2:4])` מדפיס). אבל וקטור של שמות הוא לא טווח: R שולף רק את שני האיברים שהשמות שלהם כתובים, ו-`A3` לא נכללת.',
      1: '`49` הוא הזמן של כל השקופיות, כלומר מה ש-`sum(minutes)` מדפיס. כאן `sum()` מקבל רק את מה שנשלף בתוך `[ ]`: שני זמנים בלבד.',
      2: '`7 18` הם הזמנים ש-`minutes[c("A2", "A4")]` שולף לבדו (R מדפיס אותם יחד עם השמות שלהם). כאן הם נמצאים בתוך `sum()`, ולכן מודפס מספר אחד: הסכום שלהם.'
    }
  },

  // ---------- level 2 ----------
  {
    id: 'names-na-rev-then-index',
    station: 'names-na',
    level: 2,
    context: 'כמה שקופיות עברו במיקרוסקופ בכל שעה של המשמרת, מהשעה הראשונה עד האחרונה:',
    code: 'per_hour <- c(5, 9, 2, 7, 4)\nrev(per_hour)[1:2]',
    options: ['4 7', '5 9', '7 4', '9 5'],
    answer: 0,
    hint: 'מה R עושה קודם: הופך את הווקטור, או שולף את המיקומים `1:2`? כתבו את התוצאה של השלב הראשון לפני שתמשיכו.',
    explanation: [
      {
        text: 'קודם R מריץ את `rev(per_hour)`, שהופך את סדר האיברים: השעה האחרונה הופכת לראשונה.',
        vector: { values: ['4', '7', '2', '9', '5'], marks: ['on', 'on', 'off', 'off', 'off'], showIndex: true }
      },
      {
        text: 'רק אחר כך `[1:2]` שולף את שני המיקומים הראשונים **של הווקטור ההפוך**: במיקום 1 יש `4`, ובמיקום 2 יש `7`.',
        output: '[1] 4 7'
      }
    ],
    whyWrong: {
      1: '`5 9` הם שני האיברים הראשונים של `per_hour` המקורי, כלומר מה ש-`per_hour[1:2]` מדפיס. אבל `[1:2]` כתוב אחרי `rev(per_hour)`, ולכן הוא שולף מהווקטור ההפוך.',
      2: '`7 4` הם שתי השעות האחרונות, אבל בסדר המקורי (מה ש-`per_hour[4:5]` מדפיס). אחרי `rev()` הסדר הפוך, ולכן `4` מופיע ראשון ו-`7` אחריו.',
      3: '`9 5` הוא מה ש-`rev(per_hour[1:2])` מדפיס: קודם שולפים את שני הראשונים, ואז הופכים אותם. כאן `[1:2]` כתוב **אחרי** הסוגריים של `rev()`, ולכן קודם הופכים את כל הווקטור, ורק אז שולפים.'
    }
  },

  {
    id: 'names-na-name-of-max',
    station: 'names-na',
    level: 2,
    context: 'סך הנקודות שספרתם במיקרוסקופ בדגימות מכל שכונה:',
    code: 'by_hood <- c(North = 62, Port = 2, Hills = 85, Market = 57)\nby_hood[by_hood == max(by_hood)] <- 0\nnames(by_hood)[by_hood == max(by_hood)]',
    options: ['"Hills"', '62', '"North" "Port" "Hills" "Market"', '"North"'],
    answer: 3,
    hint: 'מה יש ב-`by_hood` אחרי השורה השנייה? ומה `max(by_hood)` שווה כשמחשבים אותו שוב בשורה השלישית?',
    explanation: [
      {
        text: 'בשורה השנייה `by_hood == max(by_hood)` הוא `TRUE` רק במקום של `85` (`Hills`), ושם נכנס `0`:',
        vector: { values: ['62', '2', '0', '57'], marks: ['', '', 'drop', ''], labels: ['North', 'Port', 'Hills', 'Market'] }
      },
      {
        text: 'בשורה השלישית `max(by_hood)` מחושב **מחדש**, ועכשיו הוא `62`. התנאי `by_hood == 62` נכון רק ל-`North`:',
        vector: { values: ['62', '2', '0', '57'], marks: ['on', 'off', 'off', 'off'], labels: ['TRUE', 'FALSE', 'FALSE', 'FALSE'] }
      },
      {
        text: '`names(by_hood)` עם התנאי הזה מחזיר את השם שבמקום הזה:',
        output: '[1] "North"'
      }
    ],
    whyWrong: {
      0: '`"Hills"` הייתה התשובה **לפני** השורה השנייה. השורה השנייה שמה `0` במקום `85`, ולכן כש-`max(by_hood)` מחושב שוב בשורה השלישית, המקסימום הוא כבר `62`.',
      1: '`62` הוא מספר הנקודות ב-`North`, כלומר **ערך**. אבל השורה האחרונה בוחרת מתוך `names(by_hood)`, ולכן מקבלים את השם ולא את המספר.',
      2: 'בשורה השנייה התנאי `by_hood == max(by_hood)` נכון רק במקום אחד, ולכן רק `85` הופך ל-`0`, לא כל הווקטור. (אילו כל הערכים היו `0`, כולם היו שווים למקסימום וכל ארבעת השמות היו מודפסים.)'
    }
  },

  {
    id: 'names-na-condition-other-vector',
    station: 'names-na',
    level: 2,
    context: 'כמה שניות לקח לכל אחד מהצוות לכוון את המיקרוסקופ על השקופית שלו:',
    code: 'team <- c("Lior", "Ido", "Shir", "Gal")\nfocus <- c(12, 35, 8, 20)\nfocus[team == "Shir"]',
    options: ['"Shir"', '8', '3', 'FALSE FALSE TRUE FALSE'],
    answer: 1,
    hint: 'על איזה וקטור נבדק התנאי, ומאיזה וקטור R שולף בגלל הסוגריים המרובעים?',
    explanation: [
      {
        text: '`team == "Shir"` בודק כל שם, ומחזיר וקטור של `TRUE` ו-`FALSE` באורך 4:',
        table: {
          columns: ['team', 'focus', 'team == "Shir"'],
          rows: [
            ['"Lior"', '12', 'FALSE'],
            ['"Ido"', '35', 'FALSE'],
            ['"Shir"', '8', 'TRUE'],
            ['"Gal"', '20', 'FALSE']
          ],
          rowNames: ['1', '2', '3', '4'],
          highlightRows: [2]
        }
      },
      {
        text: 'הווקטור הזה נמצא בתוך `focus[ ]`, ולכן R שולף מ-`focus` את מה שנמצא במיקום של ה-`TRUE`: מיקום 3. (זה עובד כי שני הווקטורים באותו אורך, ובכל מיקום יש נתונים של אותו אדם.)',
        output: '[1] 8'
      }
    ],
    whyWrong: {
      0: '`"Shir"` הוא מה ש-`team[team == "Shir"]` מדפיס. כאן הסוגריים המרובעים שייכים ל-`focus`, ולכן R שולף מ-`focus`: את הזמן של שיר.',
      2: '`3` הוא המיקום שבו התנאי נכון, כלומר מה ש-`which(team == "Shir")` מדפיס. בתוך `focus[ ]` R לא מחזיר את המיקום, אלא את מה שנמצא בו.',
      3: 'זה הערך של התנאי `team == "Shir"` לבד. כשהוא בתוך `focus[ ]`, R משתמש בו כדי לבחור: הוא שומר רק את המקום שבו יש `TRUE`.'
    }
  },

  // ---------- level 3 ----------
  {
    id: 'names-na-relabel-reversed',
    station: 'names-na',
    level: 3,
    context: 'כמה נקודות נמצאו בכל אחת משלוש השקופיות שעל המגש:',
    code: 'spots <- c(S1 = 2, S2 = 5, S3 = 1)\nnames(spots) <- rev(names(spots))\nnames(spots)[spots > 1]',
    options: ['"S1" "S2"', '"S2" "S1"', '"S3" "S2"', '2 5'],
    answer: 2,
    hint: 'שורה 2 משנה רק חלק אחד של `spots`. איזה חלק? כתבו את `spots` איבר-איבר, עם השמות, אחרי שורה 2.',
    explanation: [
      {
        text: 'לפני שורה 2:',
        vector: { values: ['2', '5', '1'], marks: ['', '', ''], labels: ['S1', 'S2', 'S3'], showIndex: true }
      },
      {
        text: '`rev(names(spots))` הופך רק את וקטור השמות: `"S3" "S2" "S1"`. ההשמה ל-`names(spots)` מדביקה את השמות האלה לפי הסדר, והמספרים נשארים במקומם. עכשיו `S3` הוא השם של `2`, ו-`S1` הוא השם של `1`:',
        vector: { values: ['2', '5', '1'], marks: ['on', '', 'on'], labels: ['S3', 'S2', 'S1'], showIndex: true }
      },
      {
        text: 'שורה 3: `spots > 1` נכון במיקומים 1 ו-2, ו-R שולף מ-`names(spots)` את השמות שבמיקומים האלה:',
        vector: { values: ['"S3"', '"S2"', '"S1"'], marks: ['on', 'on', 'off'], labels: ['TRUE', 'TRUE', 'FALSE'], showIndex: true }
      },
      {
        text: 'זה הפלט:',
        output: '[1] "S3" "S2"'
      }
    ],
    whyWrong: {
      0: '`"S1" "S2"` הוא מה שהיה יוצא בלי שורה 2. אבל שורה 2 שינתה את השמות של `spots`: עכשיו השם של `2` הוא `S3`, ולא `S1`.',
      1: 'זה מה שהיה יוצא אם בשורה 2 היה כתוב `spots <- rev(spots)`: אז המספרים היו זזים יחד עם השמות שלהם. אבל כאן הופכים רק את השמות ומדביקים אותם בחזרה, והמספרים נשארים במקומם. לכן המדבקות `S1` ו-`S3` החליפו מקום, ו-`S2` נשארה במקומה.',
      3: '`2 5` הם המספרים שעוברים את התנאי. אבל התנאי נמצא בתוך `names(spots)[ ]`, ולכן R שולף את **השמות** שבמיקומים האלה, ולא את המספרים.'
    }
  },

  {
    id: 'names-na-not-or',
    station: 'names-na',
    level: 3,
    context: 'מאיזו שכונה הגיעה כל אחת מחמש השקופיות שעל השולחן:',
    code: 'origin <- c("North", "Port", "Hills", "North", "Market")\norigin[!(origin == "North" | origin == "Port")]',
    options: ['"North" "Port" "North"', '"Hills" "Market"', '"North" "Port" "Hills" "North" "Market"', '"Port" "Hills" "Market"'],
    answer: 1,
    hint: 'קודם חשבו מה יוצא בתוך הסוגריים העגולים לכל שקופית. רק אחרי זה הפעילו את `!` על התוצאה.',
    explanation: [
      {
        text: 'בתוך הסוגריים: `|` ("או") נותן `TRUE` לכל שקופית שהגיעה מ-`"North"` **או** מ-`"Port"`:',
        table: {
          columns: ['origin', '== "North"', '== "Port"', '|'],
          rows: [
            ['"North"', 'TRUE', 'FALSE', 'TRUE'],
            ['"Port"', 'FALSE', 'TRUE', 'TRUE'],
            ['"Hills"', 'FALSE', 'FALSE', 'FALSE'],
            ['"North"', 'TRUE', 'FALSE', 'TRUE'],
            ['"Market"', 'FALSE', 'FALSE', 'FALSE']
          ],
          rowNames: ['1', '2', '3', '4', '5']
        }
      },
      {
        text: '`!` הופך את התוצאה של כל הסוגריים: `TRUE` הופך ל-`FALSE`, ולהפך. נשארות רק השקופיות שלא הגיעו מאף אחת משתי השכונות:',
        vector: {
          values: ['"North"', '"Port"', '"Hills"', '"North"', '"Market"'],
          marks: ['off', 'off', 'on', 'off', 'on'],
          labels: ['FALSE', 'FALSE', 'TRUE', 'FALSE', 'TRUE'],
          showIndex: true
        }
      },
      {
        text: 'זה הפלט:',
        output: '[1] "Hills"  "Market"'
      }
    ],
    whyWrong: {
      0: '`"North" "Port" "North"` הוא מה ש-`origin[origin == "North" | origin == "Port"]` מדפיס, כלומר בלי ה-`!`. ה-`!` שלפני הסוגריים הופך את התוצאה, ולכן נבחרות דווקא השקופיות ש**לא** הגיעו מ-`North` או מ-`Port`.',
      2: 'כך יוצא אם מכניסים את ה-`!` לכל תנאי בנפרד ומשאירים את `|`: `origin[origin != "North" | origin != "Port"]`. כל שכונה היא "לא `North`" או "לא `Port`", ולכן כל השקופיות נבחרות. אבל ה-`!` הופך את התוצאה של כל הסוגריים ביחד: נשארות רק שקופיות שלא הגיעו מ-`North` **וגם** לא הגיעו מ-`Port`.',
      3: '`"Port" "Hills" "Market"` הוא מה ש-`origin[!(origin == "North") | origin == "Port"]` מדפיס, כלומר כש-`!` הופך רק את התנאי הראשון. כאן ה-`!` עומד לפני סוגריים שמקיפים את שני התנאים, ולכן הוא הופך את התוצאה של שניהם ביחד, ו-`"Port"` לא נבחרת.'
    }
  },

  {
    id: 'names-na-which-minus-one',
    station: 'names-na',
    level: 3,
    prompt: 'מה יודפס?',
    context: 'הכנתם חמש שקופיות, אחת אחרי השנייה, וספרתם בכל אחת מהן נקודות:',
    code: 'readings <- c(18, 25, 31, 22, 29)\nhigh <- which(readings > 24)\nreadings[high - 1]',
    options: ['18 25 22', '24 30 28', '1 2 4', '25 31 29'],
    answer: 0,
    hint: 'מה שמור ב-`high`: ספירות או מיקומים? אחרי שתכתבו אותו, חשבו על מה בדיוק פועל ה-`- 1`.',
    explanation: [
      {
        text: '`readings > 24` נכון בשקופיות 2, 3 ו-5, ו-`which()` שומר ב-`high` את ה**מיקומים** האלה: `2 3 5`.',
        vector: {
          values: ['18', '25', '31', '22', '29'],
          marks: ['off', 'on', 'on', 'off', 'on'],
          labels: ['FALSE', 'TRUE', 'TRUE', 'FALSE', 'TRUE'],
          showIndex: true
        }
      },
      {
        text: '`high - 1` מוריד 1 מכל מיקום, ומקבלים `1 2 4`: המיקומים של השקופיות **שלפני** כל שקופית עם הרבה נקודות. `readings[ ]` שולף את הספירות שבמיקומים האלה:',
        vector: { values: ['18', '25', '31', '22', '29'], marks: ['on', 'on', 'off', 'on', 'off'], showIndex: true }
      },
      {
        text: 'זה הפלט:',
        output: '[1] 18 25 22'
      }
    ],
    whyWrong: {
      1: '`24 30 28` הוא מה ש-`readings[readings > 24] - 1` מדפיס: מורידים 1 מהספירות הגבוהות עצמן. אבל ב-`high` שמורים מיקומים ולא ספירות, ולכן `high - 1` מזיז כל מיקום שקופית אחת אחורה.',
      2: '`1 2 4` הוא הערך של `high - 1`, כלומר מיקומים. בשורה 3 הם נמצאים בתוך `readings[ ]`, ולכן R שולף את הספירות שבמיקומים האלה.',
      3: '`25 31 29` הן הספירות של השקופיות עם הרבה נקודות עצמן (מה ש-`readings[high]` מדפיס). ה-`- 1` מזיז כל מיקום שקופית אחת אחורה, ולכן מקבלים את השקופיות שלפניהן.'
    }
  },

  // ---------- level 1 ----------
  {
    id: 'names-na-zero-not-missing',
    station: 'names-na',
    level: 1,
    context: 'כמה נקודות וירוס נמצאו בכל שקופית. `NA` מסמן שקופית שנשברה ואי אפשר לספור בה:',
    code: 'found <- c(0, 3, NA, 0, 1)\nis.na(found)',
    options: ['TRUE FALSE TRUE TRUE FALSE', '3', 'FALSE FALSE TRUE FALSE FALSE', 'FALSE FALSE NA FALSE FALSE'],
    answer: 2,
    hint: 'עברו על השקופיות אחת-אחת. מה בדיוק `is.na()` בודק בכל איבר, ומה הוא מחזיר עליו?',
    explanation: [
      {
        text: '`is.na()` בודק כל איבר בנפרד ושואל שאלה אחת: האם הערך כאן חסר? `0` הוא מספר רגיל (שקופית בלי נקודות), ולכן הוא לא `NA`:',
        vector: {
          values: ['0', '3', 'NA', '0', '1'],
          marks: ['off', 'off', 'on', 'off', 'off'],
          labels: ['FALSE', 'FALSE', 'TRUE', 'FALSE', 'FALSE'],
          showIndex: true
        }
      },
      {
        text: 'גם על ה-`NA` עצמו `is.na()` עונה בבירור: `TRUE`. התוצאה היא וקטור של `TRUE` ו-`FALSE` באורך 5, כמו `found`:',
        output: '[1] FALSE FALSE  TRUE FALSE FALSE'
      }
    ],
    whyWrong: {
      0: 'זה מה שהיה יוצא אם `0` היה נחשב ערך חסר. אבל `0` הוא ספירה אמיתית (בדקתם ולא מצאתם נקודות), ו-`NA` פירושו שאין ספירה בכלל. `is.na()` מחזיר `TRUE` רק במקום שבו יש `NA`.',
      1: '`3` הוא ה**מיקום** של השקופית השבורה (זה מה ש-`which(is.na(found))` מדפיס). `is.na()` לבד לא מחזיר מיקומים: הוא מחזיר `TRUE` או `FALSE` לכל איבר.',
      3: 'נכון שרוב החישובים עם `NA` נותנים `NA`, אבל `is.na()` נועד בדיוק כדי לזהות `NA`. לכן עליו הוא עונה `TRUE`, ולא `NA`.'
    }
  },

  {
    id: 'names-na-keep-measured',
    station: 'names-na',
    level: 1,
    context: 'במתקן יש 6 שקופיות, ושתיים מהן נשברו בדרך. אלה הספירות:',
    code: 'rack <- c(31, 18, NA, 25, 12, NA)\nrack[!is.na(rack)]',
    options: ['31 18 25 12', 'NA NA', 'TRUE TRUE FALSE TRUE TRUE FALSE', '1 2 4 5'],
    answer: 0,
    hint: 'קודם כתבו מה `is.na(rack)` מחזיר. מה ה-`!` משנה בזה? ומה `rack[ ]` עושה עם התוצאה?',
    explanation: [
      {
        text: '`is.na(rack)` מחזיר `TRUE` במקומות שבהם יש `NA`. ה-`!` הופך כל ערך, ולכן `!is.na(rack)` מחזיר `TRUE` דווקא במקומות שבהם **יש** ספירה:',
        vector: {
          values: ['31', '18', 'NA', '25', '12', 'NA'],
          marks: ['on', 'on', 'off', 'on', 'on', 'off'],
          labels: ['TRUE', 'TRUE', 'FALSE', 'TRUE', 'TRUE', 'FALSE'],
          showIndex: true
        }
      },
      {
        text: 'בתוך `rack[ ]`, R שולף את הערכים שבמקומות שבהם יש `TRUE`. כך נשארות רק הספירות של השקופיות השלמות:',
        output: '[1] 31 18 25 12'
      }
    ],
    whyWrong: {
      1: '`NA NA` הוא מה ש-`rack[is.na(rack)]` מדפיס, בלי ה-`!`: אז נבחרות דווקא השקופיות השבורות. ה-`!` הופך את התנאי, ולכן נבחרות כל השאר.',
      2: 'זה מה ש-`!is.na(rack)` מדפיס לבד. כשהוא בתוך `rack[ ]`, R לא מדפיס את ה-`TRUE` וה-`FALSE`, אלא משתמש בהם כדי לשלוף ערכים מ-`rack`.',
      3: '`1 2 4 5` הם ה**מיקומים** של השקופיות השלמות (זה מה ש-`which(!is.na(rack))` מדפיס). אבל `rack[ ]` מחזיר את הערכים שבמיקומים האלה, ולא את המיקומים עצמם.'
    }
  },

  {
    id: 'names-na-min-narm',
    station: 'names-na',
    level: 1,
    context: 'ארבע דגימות הגיעו מ-`Port`, אבל השקופית השלישית נשברה:',
    code: 'port <- c(120, 95, NA, 140)\nmin(port, na.rm = TRUE)',
    options: ['NA', '0', '2', '95'],
    answer: 3,
    hint: 'נסו להיזכר מה `na.rm = TRUE` עושה. אחר כך כתבו בין אילו ספירות `min()` משווה.',
    explanation: [
      {
        text: '`na.rm = TRUE` אומר ל-`min()` להוציא את ה-`NA` מהחישוב. הוא לא מחליף אותו במספר כלשהו, אלא פשוט מדלג עליו:',
        vector: { values: ['120', '95', 'NA', '140'], marks: ['', '', 'drop', ''], showIndex: true }
      },
      {
        text: 'נשארו `120`, `95` ו-`140`. הקטן מביניהם הוא `95`, ו-`min()` מחזיר את הערך עצמו:',
        output: '[1] 95'
      }
    ],
    whyWrong: {
      0: '`NA` הוא מה ש-`min(port)` מדפיס, בלי `na.rm = TRUE`. כאן `na.rm = TRUE` מדלג על השקופית השבורה, ולכן `min()` משווה את שאר הספירות ומחזיר מספר.',
      1: '`0` יוצא אם חושבים ש-`NA` הוא אפס. אבל `NA` הוא ספירה שלא ידועה, ולא שקופית בלי נקודות. `na.rm = TRUE` מוציא אותו מהחישוב לגמרי, ולא הופך אותו ל-`0`.',
      2: '`2` הוא ה**מיקום** של `95` (זה מה ש-`which(port == 95)` מדפיס). `min()` מחזיר את הערך הקטן ביותר, ולא את המיקום שלו.'
    }
  },

  // ---------- level 2 ----------
  {
    id: 'names-na-fee-unknown',
    station: 'names-na',
    level: 2,
    context: 'כמה דקות לוקח לספור כל אחת משלוש שקופיות, וזמן הכיוון של המיקרוסקופ (`setup`), שעוד לא מדדתם:',
    code: 'per_slide <- c(40, 55, 25)\nsetup <- NA\nper_slide + setup',
    options: ['40 55 25', 'NA NA NA', 'NA', 'NA 55 25'],
    answer: 1,
    hint: 'כשמחברים וקטור עם ערך אחד, לאילו איברים R מוסיף את הערך הזה? ומה יוצא כשמחברים מספר עם `NA`?',
    explanation: [
      {
        text: 'כשמחברים וקטור עם ערך אחד, R מוסיף את הערך הזה ל**כל** איבר בווקטור:',
        table: {
          columns: ['per_slide', 'setup', 'per_slide + setup'],
          rows: [
            ['40', 'NA', 'NA'],
            ['55', 'NA', 'NA'],
            ['25', 'NA', 'NA']
          ],
          rowNames: ['1', '2', '3']
        }
      },
      {
        text: 'מספר ועוד ערך לא ידוע הוא ערך לא ידוע, ולכן כל אחד מהסכומים הוא `NA`. התוצאה היא וקטור באורך 3, כמו `per_slide`:',
        output: '[1] NA NA NA'
      }
    ],
    whyWrong: {
      0: '`NA` הוא לא `0`, ו-R לא מדלג עליו בחיבור. `40 + NA` הוא `NA`, כי אי אפשר לדעת כמה יוצא כשאחד המספרים חסר.',
      2: '`NA` אחד הוא מה ש-`sum(per_slide + setup)` מדפיס. בלי `sum()`, החיבור נעשה איבר-איבר, והתוצאה היא וקטור באורך 3, כמו `per_slide`.',
      3: '`setup` לא מתווסף רק לאיבר הראשון: כשמחברים וקטור עם ערך אחד, R מוסיף את הערך לכל איבר. לכן גם `55 + NA` וגם `25 + NA` הם `NA`.'
    }
  },

  {
    id: 'names-na-equals-na',
    station: 'names-na',
    level: 2,
    context: 'ספירה חוזרת של ארבע שקופיות. `NA` מסמן שקופית שנשברה:',
    code: 'recheck <- c(4, NA, 2, NA)\nrecheck == NA',
    options: ['FALSE TRUE FALSE TRUE', 'FALSE FALSE FALSE FALSE', 'NA NA NA NA', '2 4'],
    answer: 2,
    hint: 'בכל השוואה כאן, בצד ימין של `==` עומד `NA`. נסו להיזכר מה קורה לחישובים ולהשוואות שיש בהם `NA`.',
    explanation: [
      {
        text: '`NA` פירושו "ערך לא ידוע". `4 == NA` שואל אם 4 שווה למשהו שלא ידוע, ו-R לא יכול לדעת. לכן התשובה היא `NA`, ולא `FALSE`.'
      },
      {
        text: 'אפילו `NA == NA` הוא `NA`: שתי ספירות חסרות לא בהכרח שוות זו לזו. כך כל ההשוואות יוצאות `NA`:',
        vector: {
          values: ['4', 'NA', '2', 'NA'],
          marks: ['', '', '', ''],
          labels: ['NA', 'NA', 'NA', 'NA'],
          showIndex: true
        }
      },
      {
        text: 'זה הפלט. כדי למצוא את השקופיות השבורות צריך `is.na(recheck)`, ולא `==`:',
        output: '[1] NA NA NA NA'
      }
    ],
    whyWrong: {
      0: 'זה מה ש-`is.na(recheck)` מדפיס, וזו הדרך הנכונה למצוא ערכים חסרים. אבל `==` משווה ערכים, וכל השוואה עם `NA` מחזירה `NA`, גם `NA == NA`.',
      1: 'נכון ש-`4` הוא לא `NA`, אבל `==` לא בודק "האם זה `NA`?". הוא בודק אם `4` שווה לערך לא ידוע, ועל זה R לא יכול לענות, ולכן הוא מחזיר `NA` ולא `FALSE`.',
      3: '`2 4` הם המיקומים של השקופיות השבורות (זה מה ש-`which(is.na(recheck))` מדפיס). אבל כאן אין `which()`, ו-`recheck == NA` מחזיר תשובה לכל איבר.'
    }
  },

  {
    id: 'names-na-which-skips-na',
    station: 'names-na',
    level: 2,
    context: 'מ-`Hills` הגיעו חמש שקופיות, ושתיים מהן נשברו בדרך:',
    code: 'hills <- c(28, NA, 33, 35, NA)\nwhich(hills > 30)',
    options: ['2 3 4 5', '33 35', 'NA 33 35 NA', '3 4'],
    answer: 3,
    hint: 'כתבו מה `hills > 30` מחזיר בכל מיקום. אחר כך חשבו: `which()` מחזיר את המיקומים שבהם יש... מה בדיוק?',
    explanation: [
      {
        text: '`hills > 30` בודק כל שקופית. בשקופיות השבורות יוצא `NA`:',
        vector: {
          values: ['28', 'NA', '33', '35', 'NA'],
          marks: ['off', '', 'on', 'on', ''],
          labels: ['FALSE', 'NA', 'TRUE', 'TRUE', 'NA'],
          showIndex: true
        }
      },
      {
        text: '`which()` מחזיר רק את המיקומים שבהם יש `TRUE`. `NA` הוא לא `TRUE`, ולכן `which()` מדלג עליו, ואין `NA` בתוצאה:',
        output: '[1] 3 4'
      }
    ],
    whyWrong: {
      0: '`which()` לא מחזיר מיקומים של `NA`: הוא מחזיר רק את המיקומים שבהם יש `TRUE`. במיקומים 2 ו-5 ההשוואה נתנה `NA`, ולכן הם לא נכנסים.',
      1: '`33 35` הן ה**ספירות** שגדולות מ-30. `which()` מחזיר את ה**מיקומים** שלהן בווקטור, ולא את הערכים עצמם.',
      2: 'זה מה ש-`hills[hills > 30]` מדפיס: בשליפה עם `[ ]`, כל `NA` בתנאי הופך ל-`NA` בתוצאה. `which()` מתנהג אחרת: הוא מדלג על ה-`NA` ומחזיר רק מיקומים.'
    }
  },

  {
    id: 'names-na-and-not-missing',
    station: 'names-na',
    level: 2,
    context: 'מה ראיתם במיקרוסקופ בשש השקופיות מ-`Market` (`NA` = שקופית שבורה):',
    code: 'market <- c(45, NA, 15, 30, NA, 10)\nsum(market[market > 20 & !is.na(market)])',
    options: ['NA', '100', '75', '2'],
    answer: 2,
    hint: 'מה התנאי `market > 20` נותן במקומות של `NA`? ומה `& !is.na(market)` עושה במקומות האלה?',
    explanation: [
      {
        text: '`market > 20` נותן `NA` במקומות שבהם השקופית שבורה:',
        vector: { values: ['45', 'NA', '15', '30', 'NA', '10'], marks: ['on', '', 'off', 'on', '', 'off'], labels: ['TRUE', 'NA', 'FALSE', 'TRUE', 'NA', 'FALSE'] }
      },
      {
        text: '`!is.na(market)` הוא `FALSE` בדיוק במקומות האלה, ו-`NA & FALSE` הוא `FALSE`. לכן נשארות רק `45` ו-`30`:',
        vector: { values: ['45', 'NA', '15', '30', 'NA', '10'], marks: ['on', 'drop', 'off', 'on', 'drop', 'off'], labels: ['TRUE', 'FALSE', 'FALSE', 'TRUE', 'FALSE', 'FALSE'] }
      },
      {
        text: '`sum()` מחבר את הספירות שנבחרו: `45 + 30`',
        output: '[1] 75'
      }
    ],
    whyWrong: {
      0: '`NA` היה יוצא בלי `& !is.na(market)`: אז ה-`NA` נשארים בבחירה, ו-`NA` בתוך `sum()` הופך את כל התוצאה ל-`NA`. כאן התנאי השני מוציא אותם.',
      1: '`100` הוא הסכום של **כל** הספירות הקיימות (`45 + 15 + 30 + 10`), כלומר `sum(market, na.rm = TRUE)`. אבל התנאי `market > 20` משאיר רק את `45` ואת `30`.',
      3: '`2` הוא **מספר** השקופיות החשודות, כלומר `sum(market > 20 & !is.na(market))`. אבל כאן התנאי נמצא בתוך `[ ]`, ולכן מחברים את הספירות עצמן.'
    }
  },

  // ---------- level 3 ----------
  {
    id: 'names-na-count-passing',
    station: 'names-na',
    level: 3,
    context: 'חמש הדגימות שבדקתם היום במיקרוסקופ. שקופית אחת נשברה:',
    code: 'today <- c(72, 55, NA, 90, 64)\nsum(today >= 60)',
    options: ['NA', '3', '226', 'TRUE FALSE NA TRUE TRUE'],
    answer: 0,
    hint: 'קודם כתבו מה `today >= 60` מחזיר לכל דגימה, גם לשקופית השבורה. אחר כך חשבו מה `sum()` עושה עם מה שיצא.',
    explanation: [
      {
        text: '`today >= 60` בודק כל דגימה. על השקופית השבורה אי אפשר לדעת אם יש בה 60 נקודות ומעלה, ולכן שם יוצא `NA`:',
        vector: {
          values: ['72', '55', 'NA', '90', '64'],
          marks: ['on', 'off', '', 'on', 'on'],
          labels: ['TRUE', 'FALSE', 'NA', 'TRUE', 'TRUE'],
          showIndex: true
        }
      },
      {
        text: '`sum()` סופר כל `TRUE` כ-1 וכל `FALSE` כ-0. את ה-`NA` הוא לא יכול לספור: אם בשקופית השבורה היו 60 נקודות ומעלה, היו 4 דגימות שעוברות את התנאי, ואם לא, היו 3. לכן הסכום לא ידוע:',
        output: '[1] NA'
      }
    ],
    whyWrong: {
      1: '`3` הוא מה ש-`sum(today >= 60, na.rm = TRUE)` מדפיס. בלי `na.rm = TRUE`, `sum()` לא מדלג על ה-`NA` שיצא מההשוואה, והתוצאה כולה היא `NA`.',
      2: '`226` הוא סך הנקודות בדגימות שעוברות את התנאי (זה מה ש-`sum(today[today >= 60], na.rm = TRUE)` מדפיס). כאן `sum()` מחבר את ה-`TRUE` וה-`FALSE` של ההשוואה, כלומר סופר דגימות, ולא מחבר נקודות.',
      3: 'זה מה ש-`today >= 60` מדפיס לבד. כאן הוא בתוך `sum()`, שמחזיר ערך אחד.'
    }
  },

  {
    id: 'names-na-narm-one-call',
    station: 'names-na',
    level: 3,
    context: 'במשמרת הלילה בדקתם חמש שקופיות, ואחת מהן נשברה:',
    code: 'night <- c(7, 9, NA, 5, 8)\nmax(night, na.rm = TRUE) - min(night)',
    options: ['4', 'NA', '9', 'שגיאה (Error)'],
    answer: 1,
    hint: 'חשבו כל פונקציה בנפרד: מה כתוב בתוך הסוגריים של `max()`, ומה כתוב בתוך הסוגריים של `min()`?',
    explanation: [
      {
        text: '`max(night, na.rm = TRUE)`: בתוך הסוגריים של `max()` כתוב `na.rm = TRUE`, ולכן הוא מדלג על ה-`NA` ומחזיר `9`:',
        vector: { values: ['7', '9', 'NA', '5', '8'], marks: ['', 'on', 'drop', '', ''], showIndex: true }
      },
      {
        text: '`min(night)`: ה-`na.rm = TRUE` שייך רק ל-`max()`, ולא משפיע על `min()`. בלי `na.rm`, `min()` מחזיר `NA`, כי אולי דווקא בשקופית השבורה היו הכי מעט נקודות.'
      },
      {
        text: 'נשאר `9 - NA`, וחיסור עם ערך לא ידוע נותן ערך לא ידוע:',
        output: '[1] NA'
      }
    ],
    whyWrong: {
      0: '`4` (`9 - 5`) הוא מה ש-`max(night, na.rm = TRUE) - min(night, na.rm = TRUE)` מדפיס. `na.rm = TRUE` משפיע רק על הפונקציה שבתוך הסוגריים שלה, ולא על כל השורה. ל-`min()` צריך לכתוב אותו שוב.',
      2: '`9` יוצא אם חושבים ש-`NA` הוא `0`, כלומר ש-`min(night)` הוא `0` ו-`9 - 0` הוא `9`. אבל `NA` הוא ספירה חסרה ולא אפס נקודות: `min(night)` מחזיר `NA`, ו-`9 - NA` הוא `NA`.',
      3: 'אין כאן שגיאה: R יודע לחשב עם `NA`, והתוצאה של חישוב כזה היא פשוט `NA`.'
    }
  },

  {
    id: 'names-na-length-average',
    station: 'names-na',
    level: 3,
    context: 'ארבע דגימות הגיעו מ-`Park`, ואחת השקופיות נשברה:',
    code: 'park <- c(30, NA, 50, 40)\navg <- sum(park, na.rm = TRUE) / length(park)\npark > avg',
    options: ['FALSE NA TRUE TRUE', 'FALSE NA TRUE FALSE', 'NA NA NA NA', 'FALSE FALSE TRUE TRUE'],
    answer: 0,
    hint: 'חשבו את `avg` לאט: כמה יוצא `sum(park, na.rm = TRUE)`? ובכמה מחלקים אותו, כלומר מה `length(park)` מחזיר?',
    explanation: [
      {
        text: '`sum(park, na.rm = TRUE)` מדלג על ה-`NA` ומחבר `30 + 50 + 40`, כלומר `120`.'
      },
      {
        text: '`length(park)` סופר את **כל** המקומות בווקטור, כולל ה-`NA`, ולכן הוא `4` ולא `3` (`na.rm = TRUE` השפיע רק על `sum()`). לכן `avg` הוא `120 / 4`, כלומר `30`, ולא `40`, שהוא מה ש-`mean(park, na.rm = TRUE)` מחזיר.'
      },
      {
        text: '`park > avg` משווה כל ספירה ל-`30`. `30 > 30` הוא `FALSE`, ועל השקופית השבורה אי אפשר לדעת, ולכן שם יוצא `NA`:',
        vector: {
          values: ['30', 'NA', '50', '40'],
          marks: ['off', '', 'on', 'on'],
          labels: ['FALSE', 'NA', 'TRUE', 'TRUE'],
          showIndex: true
        }
      },
      {
        text: 'זה הפלט:',
        output: '[1] FALSE    NA  TRUE  TRUE'
      }
    ],
    whyWrong: {
      1: 'זה מה ש-`park > mean(park, na.rm = TRUE)` מדפיס, כלומר כשהממוצע הוא `40`. אבל כאן מחלקים ב-`length(park)`, ו-`length()` סופר גם את ה-`NA`: `120 / 4` הוא `30`, ולכן `40 > 30` הוא `TRUE`.',
      2: '`NA NA NA NA` היה יוצא אם `avg` היה `NA` (זה מה ש-`park > NA` מדפיס). אבל `na.rm = TRUE` מדלג על ה-`NA` בתוך `sum()`, ו-`length(park)` הוא מספר רגיל (`4`), ולכן `avg` הוא `30`.',
      3: 'זה מה ש-`!is.na(park) & park > avg` מדפיס. בלי `!is.na()`, ההשוואה של השקופית השבורה עם `30` נותנת `NA` ולא `FALSE`: R לא יודע אם היו בה יותר נקודות או פחות.'
    }
  },

  // ===== שבוע 4: מטריצות וטבלאות =====
  // ---------- level 1 ----------
  {
    id: 'tables-colnames',
    station: 'tables',
    level: 1,
    context: 'שלוש דגימות חדשות נכנסו היום למקפיא. ברשימת המלאי רושמים באיזה מדף שמתם כל אחת:',
    code: 'stock <- data.frame(\n  sample = c("S1", "S4", "A7"),\n  shelf = c(3, 1, 2)\n)\ncolnames(stock)',
    options: ['"S1" "S4" "A7"', '"sample" "shelf"', '"1" "2" "3"', '2'],
    answer: 1,
    hint: 'ציירו את הטבלה על דף: מה כתוב בשורה העליונה, מה כתוב בצד, ומה יש בתוך התאים?',
    explanation: [
      {
        text: '`data.frame()` בונה טבלה: כל וקטור הופך לעמודה, והשם שכתוב לפניו (`sample`, `shelf`) הופך לשם של העמודה. השורות מקבלות מספרים באופן אוטומטי:',
        table: {
          columns: ['sample', 'shelf'],
          rows: [['S1', '3'], ['S4', '1'], ['A7', '2']],
          rowNames: ['1', '2', '3']
        }
      },
      {
        text: '`colnames()` מחזיר רק את **שמות העמודות**, כווקטור של טקסט (ולכן עם מירכאות):',
        output: '[1] "sample" "shelf"'
      }
    ],
    whyWrong: {
      0: '`"S1" "S4" "A7"` הם הערכים שבתוך העמודה `sample`, כלומר מה ש-`stock$sample` מדפיס. `colnames()` לא מחזיר את מה שיש בתוך העמודות, אלא את השמות שלהן.',
      2: '`"1" "2" "3"` הם שמות **השורות**, כלומר מה ש-`rownames(stock)` מדפיס. `col` ב-`colnames` הוא קיצור של column, עמודה.',
      3: '`2` הוא **מספר** העמודות, כלומר מה ש-`ncol(stock)` מדפיס. `colnames()` לא סופר את העמודות, אלא מחזיר את השמות שלהן.'
    }
  },

  {
    id: 'tables-cell-index',
    station: 'tables',
    level: 1,
    context: 'רשימת המקפיא: כמה מבחנות יש מכל דגימה, וכמה ימים היא כבר בפנים:',
    code: 'freezer <- data.frame(\n  sample = c("S2", "S5", "A1", "A3"),\n  tubes = c(12, 30, 25, 18),\n  days = c(4, 7, 5, 6)\n)\nfreezer[3, 2]',
    options: ['7', '30', '5', '25'],
    answer: 3,
    hint: 'בתוך `[ , ]` יש שני מספרים. איזה מהם בוחר שורה ואיזה בוחר עמודה? ומאיפה מתחילים לספור?',
    explanation: [
      {
        text: 'ב-`[3, 2]` המספר **הראשון** הוא השורה. שורת הכותרות לא נספרת, ולכן שורה 3 היא השורה של `A1`:',
        table: {
          columns: ['sample', 'tubes', 'days'],
          rows: [['S2', '12', '4'], ['S5', '30', '7'], ['A1', '25', '5'], ['A3', '18', '6']],
          rowNames: ['1', '2', '3', '4'],
          highlightRows: [2]
        }
      },
      {
        text: 'המספר **השני** הוא העמודה. גם `sample` היא עמודה, והיא הראשונה, ולכן העמודה השנייה היא `tubes`. בשורה 3 שלה יש `25`:',
        output: '[1] 25'
      }
    ],
    whyWrong: {
      0: '`7` הוא מה ש-`freezer[2, 3]` מדפיס: שורה 2, עמודה 3. הסדר בתוך הסוגריים קבוע: קודם שורה, ואחר כך עמודה.',
      1: '`30` יוצא אם סופרים את שורת הכותרות (`sample tubes days`) כשורה 1, כמו באקסל. ב-R הכותרות לא נספרות: שורה 1 היא `S2`, ולכן שורה 3 היא `A1`. (`30` הוא מה ש-`freezer[2, 2]` מדפיס.)',
      2: '`5` יוצא אם לא סופרים את `sample` כעמודה. אבל גם `sample` היא עמודה בטבלה, והיא הראשונה, ולכן העמודה השנייה היא `tubes`. (`5` הוא מה ש-`freezer[3, 3]` מדפיס.)'
    }
  },

  {
    id: 'tables-cbind-nrow',
    station: 'tables',
    level: 1,
    context: 'כמה מבחנות הכנסתם למדף העליון ולמדף התחתון של המקפיא, בשלוש משמרות:',
    code: 'top <- c(4, 7, 2)\nbottom <- c(5, 1, 8)\nshelves <- cbind(top, bottom)\nnrow(shelves)',
    options: ['3', '2', '6', '3 2'],
    answer: 0,
    hint: 'ציירו את `shelves` על דף: האם כל וקטור נכנס אליה כשורה או כעמודה?',
    explanation: [
      {
        text: '`cbind()` מחבר וקטורים **כעמודות** (c הוא קיצור של column). כל וקטור הופך לעמודה, והשם שלו הופך לשם העמודה:',
        table: {
          columns: ['top', 'bottom'],
          rows: [['4', '5'], ['7', '1'], ['2', '8']],
          rowNames: ['[1,]', '[2,]', '[3,]']
        }
      },
      {
        text: 'בכל עמודה יש 3 מספרים (אחד לכל משמרת), ולכן ב-`shelves` יש 3 שורות ו-2 עמודות. `nrow()` מחזיר את מספר השורות:',
        output: '[1] 3'
      }
    ],
    whyWrong: {
      1: '`2` הוא מספר העמודות (`ncol(shelves)`). הוא היה מספר השורות אילו השתמשנו ב-`rbind()`, שמחבר וקטורים כשורות. אבל `cbind()` מחבר אותם כעמודות, ולכן יש 2 עמודות ו-3 שורות.',
      2: '`6` הוא מספר כל הערכים במטריצה, כלומר מה ש-`length(shelves)` מדפיס. `nrow()` סופר רק את השורות.',
      3: '`3 2` הוא מה ש-`dim(shelves)` מדפיס: מספר השורות ומספר העמודות יחד. `nrow()` מחזיר רק מספר אחד, את מספר השורות.'
    }
  },

  // ---------- level 2 ----------
  {
    id: 'tables-df-col-order',
    station: 'tables',
    level: 2,
    context: 'רשימת המקפיא: כמה ימים כל דגימה כבר בפנים, וכמה מבחנות יש ממנה:',
    code: 'storage <- data.frame(\n  sample = c("A2", "B5", "C1"),\n  days = c(12, 14, 13),\n  tubes = c(20, 35, 28)\n)\nstorage <- storage[, c(3, 1, 2)]\nstorage[2, 1]',
    options: ['"B5"', '14', '35', '"A2"'],
    answer: 2,
    hint: 'הווקטור `c(3, 1, 2)` כתוב אחרי הפסיק. מה הוא בוחר, ובאיזה סדר? ושימו לב שהתוצאה נשמרת בחזרה ב-`storage`.',
    explanation: [
      {
        text: 'ב-`storage[, c(3, 1, 2)]` המקום שלפני הפסיק ריק, ולכן נלקחות כל השורות. אחרי הפסיק יש וקטור של מספרי עמודות, **בסדר שבו הן יופיעו**: קודם עמודה 3 (`tubes`), אחריה עמודה 1 (`sample`), ובסוף עמודה 2 (`days`).'
      },
      {
        text: 'הטבלה החדשה נשמרת בחזרה ב-`storage`. מעכשיו העמודה הראשונה היא `tubes`:',
        table: {
          columns: ['tubes', 'sample', 'days'],
          rows: [['20', 'A2', '12'], ['35', 'B5', '14'], ['28', 'C1', '13']],
          rowNames: ['1', '2', '3'],
          highlightRows: [1]
        }
      },
      {
        text: '`[2, 1]` סופר מקומות בטבלה **הנוכחית**: שורה 2, עמודה 1, כלומר `tubes` של `B5`:',
        output: '[1] 35'
      }
    ],
    whyWrong: {
      0: '`"B5"` הוא מה ש-`storage[2, 1]` היה מדפיס **לפני** שינוי הסדר. אבל העמודות לא שומרות על המספר המקורי שלהן: אחרי `storage <- storage[, c(3, 1, 2)]` העמודה הראשונה היא `tubes`.',
      1: '`14` יוצא אם קוראים את `c(3, 1, 2)` כאילו הוא אומר לאן כל עמודה זזה (עמודה 1 למקום 3, עמודה 2 למקום 1...). אבל הווקטור אומר **איזו עמודה** תופיע בכל מקום: במקום הראשון עמודה 3. (`14` היה נכון אילו היה כתוב `c(2, 3, 1)`: אז העמודה הראשונה הייתה `days`.)',
      3: '`"A2"` יוצא אם `c(3, 1, 2)` מסדר מחדש את **השורות** (`"C1"`, `"A2"`, `"B5"`). אבל הווקטור כתוב אחרי הפסיק, ולכן הוא קובע את סדר העמודות. השורות נשארות באותו סדר.'
    }
  },

  {
    id: 'tables-filter-names',
    station: 'tables',
    level: 2,
    context: 'כמה ימים כל אחת מארבע הדגימות כבר נמצאת במקפיא:',
    code: 'freezer <- data.frame(\n  sample = c("N1", "P4", "H2", "M7"),\n  days = c(12, 30, 8, 25)\n)\nfreezer[freezer$days > 20, "sample"]',
    options: ['"P4" "M7"', 'FALSE TRUE FALSE TRUE', '30 25', '2 4'],
    answer: 0,
    hint: 'בתוך `[ , ]` יש שני חלקים: מה שלפני הפסיק בוחר שורות, ומה שאחריו בוחר עמודות. מה בוחר כל חלק כאן?',
    explanation: [
      {
        text: '`freezer$days > 20` בודק כל מספר ימים ומחזיר `TRUE` או `FALSE`, אחד לכל שורה:',
        vector: { values: ['12', '30', '8', '25'], marks: ['off', 'on', 'off', 'on'], labels: ['FALSE', 'TRUE', 'FALSE', 'TRUE'] }
      },
      {
        text: 'הווקטור הזה נמצא **לפני** הפסיק, ולכן הוא בוחר שורות: נשארות רק השורות שבהן יש `TRUE`:',
        table: {
          columns: ['sample', 'days'],
          rows: [['N1', '12'], ['P4', '30'], ['H2', '8'], ['M7', '25']],
          rowNames: ['1', '2', '3', '4'],
          highlightRows: [1, 3]
        }
      },
      {
        text: 'אחרי הפסיק כתוב `"sample"`, ולכן מהשורות האלה R מחזיר רק את שמות הדגימות:',
        output: '[1] "P4" "M7"'
      }
    ],
    whyWrong: {
      1: 'זה מה ש-`freezer$days > 20` לבד מדפיס. כאן התנאי נמצא בתוך `[ , ]` לפני הפסיק, ושם הוא רק **בוחר** שורות: R מחזיר את הערכים מהשורות שבהן יש `TRUE`, ולא את `TRUE` ו-`FALSE` עצמם.',
      2: 'אלה מספרי הימים של הדגימות שנבחרו, כלומר מה ש-`freezer[freezer$days > 20, "days"]` מדפיס. אבל אחרי הפסיק כתוב `"sample"`, ולכן R מחזיר את שמות הדגימות.',
      3: '`2 4` הם **מספרי השורות** שבהן יש `TRUE`, כלומר מה ש-`which(freezer$days > 20)` מדפיס. אבל `[ , ]` לא מחזיר מיקומים: הוא מחזיר את הערכים שבשורות האלה.'
    }
  },

  {
    id: 'tables-complete-cases',
    station: 'tables',
    level: 2,
    context: 'יומן המקפיא: כמה מבחנות הכנסתם וכמה הוצאתם בכל יום. איפה ששכחתם לרשום, כתוב `NA`:',
    code: 'moves <- data.frame(\n  day = c("Sun", "Mon", "Tue", "Wed"),\n  added = c(12, NA, 9, 15),\n  taken = c(4, 6, NA, 3)\n)\ncomplete.cases(moves)',
    options: ['FALSE TRUE TRUE FALSE', '"Sun" "Wed"', '2', 'TRUE FALSE FALSE TRUE'],
    answer: 3,
    hint: '`complete.cases()` עובר על הטבלה שורה אחרי שורה. מתי שורה נחשבת "שלמה"?',
    explanation: [
      {
        text: '`complete.cases()` בודק כל שורה. שורה "שלמה" היא שורה שאין בה אף `NA`, באף עמודה. ביום שני חסר כמה מבחנות הכנסתם, וביום שלישי חסר כמה הוצאתם:',
        table: {
          columns: ['day', 'added', 'taken'],
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
      0: 'זה הפוך: `complete.cases()` מחזיר `TRUE` לשורות **השלמות**, אלה שאין בהן `NA`. (`FALSE TRUE TRUE FALSE` הוא מה ש-`!complete.cases(moves)` מדפיס.)',
      1: '`complete.cases()` לא שולף את השורות השלמות (את זה עושה `na.omit()`), אלא מחזיר `TRUE` או `FALSE` לכל שורה. `"Sun" "Wed"` הוא מה ש-`moves$day[complete.cases(moves)]` מדפיס.',
      2: '`2` הוא **מספר** השורות השלמות, כלומר מה ש-`sum(complete.cases(moves))` מדפיס. בלי `sum()`, R מחזיר `TRUE` או `FALSE` לכל אחת מ-4 השורות.'
    }
  },

  // ---------- level 3 ----------
  {
    id: 'tables-matrix-by-column',
    station: 'tables',
    level: 3,
    context: 'מגש במקפיא מחולק לתאים. רושמים במטריצה כמה מבחנות יש בכל תא:',
    code: 'tray <- matrix(c(3, 8, 1, 6, 4, 9), ncol = 2)\ntray[2, ]',
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
        text: 'ב-`[2, ]` המספר שלפני הפסיק הוא השורה, והמקום הריק אחרי הפסיק אומר "כל העמודות". לכן R מחזיר את כל שורה 2 של המגש:',
        output: '[1] 8 4'
      }
    ],
    whyWrong: {
      0: '`1 6` היא שורה 2 אם ממלאים את המטריצה שורה אחרי שורה, כמו ש-`matrix(c(3, 8, 1, 6, 4, 9), ncol = 2, byrow = TRUE)` עושה. בלי `byrow = TRUE`, R ממלא עמודה אחרי עמודה, ולכן `3`, `8` ו-`1` נכנסים כולם לעמודה הראשונה.',
      2: '`8 6 9` יוצא אם קוראים את `ncol = 2` כאילו כתוב `nrow = 2`, כלומר 2 שורות ו-3 עמודות (זה מה ש-`matrix(c(3, 8, 1, 6, 4, 9), nrow = 2)[2, ]` מדפיס). אבל `ncol` קובע את מספר ה**עמודות**, ולכן יש 2 עמודות ו-3 שורות.',
      3: '`6 4 9` היא העמודה השנייה, כלומר מה ש-`tray[, 2]` מדפיס. ב-`[2, ]` המספר `2` בא **לפני** הפסיק, ולכן הוא מספר של שורה.'
    }
  },

  {
    id: 'tables-na-omit-position',
    station: 'tables',
    level: 3,
    context: 'ארגזים במקפיא: כמה מבחנות יש בכל ארגז, וכמה ימים הוא שם. בחלק מהשורות חסר מידע:',
    code: 'boxes <- data.frame(\n  tubes = c(5, NA, 3, 10),\n  days = c(30, 45, NA, 55)\n)\nclean <- na.omit(boxes)\nclean[2, "tubes"]',
    options: ['3', 'NA', '10', 'שגיאה (Error), כי שורה 2 נמחקה'],
    answer: 2,
    hint: 'כתבו איך נראית `clean` אחרי `na.omit()`: אילו שורות נשארו בה, ואיך R ממספר אותן?',
    explanation: [
      {
        text: '`na.omit()` מוחק כל שורה שיש בה `NA`, גם אם ה-`NA` נמצא רק באחת העמודות. לכן נמחקות גם שורה 2 (חסר `tubes`) וגם שורה 3 (חסר `days`):',
        table: {
          columns: ['tubes', 'days'],
          rows: [['5', '30'], ['NA', '45'], ['3', 'NA'], ['10', '55']],
          rowNames: ['1', '2', '3', '4'],
          highlightRows: [0, 3]
        }
      },
      {
        text: 'ב-`clean` נשארו 2 שורות. R שומר את **השמות** המקוריים שלהן, `1` ו-`4`, ולכן כך הוא מדפיס את `clean`:',
        table: {
          columns: ['tubes', 'days'],
          rows: [['5', '30'], ['10', '55']],
          rowNames: ['1', '4'],
          highlightRows: [1]
        }
      },
      {
        text: 'אבל מספר בלי מירכאות בתוך `[ , ]` הוא **מיקום**, ולא שם של שורה. `[2, "tubes"]` לוקח את השורה **השנייה** ב-`clean` (זו ששמה `4`), מהעמודה `tubes`. (כדי לבחור שורה לפי השם שלה כותבים את השם במירכאות: גם `clean["4", "tubes"]` מחזיר `10`.)',
        output: '[1] 10'
      }
    ],
    whyWrong: {
      0: '`3` יוצא אם חושבים ש-`na.omit()` מוחק רק את התא שבו יש `NA`, ואז בעמודה `tubes` נשאר `5 3 10`. אבל `na.omit()` מוחק **שורות שלמות**: גם שורה 3 נמחקה, כי חסר בה `days`.',
      1: '`NA` הוא מה ש-`boxes[2, "tubes"]` מדפיס: השורה השנייה בטבלה **המקורית**. אבל `clean` היא טבלה אחרת, ושורה 2 של `boxes` כבר לא נמצאת בה. השורה השנייה ב-`clean` היא השורה ששמה `4`.',
      3: 'נכון ששורה 2 נמחקה, אבל `[2, ]` לא מחפש שורה ש**שמה** 2. מספר בתוך `[ , ]` הוא מיקום, ולכן R לוקח את השורה השנייה שנשארה ב-`clean`, בלי שגיאה.'
    }
  },

  {
    id: 'tables-rbind-text',
    station: 'tables',
    level: 3,
    context: 'רשימת המלאי של המקפיא, ודגימה חדשה שהגיעה היום:',
    code: 'stock <- data.frame(\n  sample = c("S1", "S2"),\n  tubes = c(3, 5)\n)\nstock <- rbind(stock, c("S3", 4))\nclass(stock$tubes)',
    options: ['"character"', '"numeric"', '"data.frame"', 'שגיאה (Error), כי בשורה החדשה יש גם טקסט וגם מספר'],
    answer: 0,
    hint: 'לפני ש-`rbind()` מוסיף את השורה, R בונה את הווקטור `c("S3", 4)`. מאיזה סוג יהיו האיברים בווקטור הזה?',
    explanation: [
      {
        text: 'קודם R בונה את הווקטור `c("S3", 4)`. בווקטור כל האיברים מאותו סוג, ולכן `4` הופך לטקסט, `"4"`:',
        vector: { values: ['"S3"', '"4"'], marks: ['', 'on'], labels: ['character', 'character'] }
      },
      {
        text: '`rbind()` מוסיף את הווקטור כשורה חדשה: `"S3"` נכנס לעמודה `sample`, ו-`"4"` לעמודה `tubes`. גם בעמודה של טבלה כל הערכים מאותו סוג, ולכן `3` ו-`5` הופכים גם הם לטקסט (כאן סימנו אותם במירכאות כדי להראות שהם טקסט):',
        table: {
          columns: ['sample', 'tubes'],
          rows: [['S1', '"3"'], ['S2', '"5"'], ['S3', '"4"']],
          rowNames: ['1', '2', '3'],
          highlightRows: [2]
        }
      },
      {
        text: 'שימו לב: כש-R מדפיס טבלה הוא לא מראה מירכאות, ולכן `tubes` **נראית** כמו עמודה של מספרים. אבל `class()` מגלה את הסוג האמיתי:',
        output: '[1] "character"'
      }
    ],
    whyWrong: {
      1: '`"numeric"` הוא מה ש-`class(stock$tubes)` היה מדפיס **לפני** `rbind()`. אבל `c("S3", 4)` הפך את `4` לטקסט, וכשהוא נכנס לעמודה `tubes`, כל העמודה הפכה לטקסט. כדי להחזיר אותה למספרים צריך `as.numeric()`.',
      2: '`"data.frame"` הוא מה ש-`class(stock)` מדפיס: הסוג של הטבלה כולה. אבל `stock$tubes` היא עמודה אחת, ו-`class()` מחזיר את הסוג של הערכים שבה.',
      3: 'R לא עוצר בשגיאה כשמערבבים טקסט ומספרים: הוא הופך את המספרים לטקסט וממשיך. לכן `rbind()` מוסיף את השורה בלי בעיה, והעמודה `tubes` הופכת לטקסט.'
    }
  },

  // ---------- level 1 ----------
  {
    id: 'tables-dim-byrow',
    station: 'tables',
    level: 1,
    context: 'במתקן קטן במקפיא יש 8 מקומות למבחנות. `1` הוא מקום עם מבחנה, ו-`0` הוא מקום ריק:',
    code: 'slots <- c(1, 0, 1, 1, 0, 1, 1, 0)\nrack <- matrix(slots, nrow = 2, byrow = TRUE)\ndim(rack)',
    options: ['4 2', '2 4', '8', '2'],
    answer: 1,
    hint: 'מה קובע כמה שורות יהיו במטריצה, ומה בדיוק `byrow = TRUE` משנה? ובאיזה סדר `dim()` מחזיר את המספרים?',
    explanation: [
      {
        text: '`nrow = 2` קובע שבמטריצה יהיו 2 **שורות**. יש 8 מספרים, ולכן R מחשב לבד שיהיו `8 / 2 = 4` עמודות.'
      },
      {
        text: '`byrow = TRUE` משנה רק את **הסדר** שבו המספרים נכנסים (שורה אחרי שורה), ולא את הצורה של המטריצה. עדיין יש 2 שורות ו-4 עמודות:',
        table: {
          columns: ['[,1]', '[,2]', '[,3]', '[,4]'],
          rows: [['1', '0', '1', '1'], ['0', '1', '1', '0']],
          rowNames: ['[1,]', '[2,]']
        }
      },
      {
        text: '`dim()` מחזיר שני מספרים: קודם את מספר השורות, ואחר כך את מספר העמודות:',
        output: '[1] 2 4'
      }
    ],
    whyWrong: {
      0: '`4 2` יוצא אם חושבים ש-`byrow = TRUE` הופך את `nrow = 2` ל"2 מספרים בכל שורה". אבל `nrow` תמיד קובע את מספר השורות, ו-`byrow` לא משנה את זה. (`4 2` הוא מה ש-`dim(matrix(slots, ncol = 2, byrow = TRUE))` מדפיס.)',
      2: '`8` הוא מספר כל המקומות במתקן, כלומר מה ש-`length(rack)` מדפיס. `dim()` לא סופר את התאים, אלא מחזיר את מספר השורות ואת מספר העמודות.',
      3: '`2` הוא רק מספר השורות, כלומר מה ש-`nrow(rack)` מדפיס. `dim()` מחזיר שני מספרים: גם את מספר השורות וגם את מספר העמודות.'
    }
  },

  {
    id: 'tables-length-rbind',
    station: 'tables',
    level: 1,
    context: 'שלושה מהצוות רשמו כמה מבחנות כל אחד מהם הכניס למקפיא, בכל אחד מ-4 ימים:',
    code: 'tal <- c(12, 8, 15, 10)\nshir <- c(5, 9, 7, 11)\nido <- c(6, 14, 3, 9)\nplaced <- rbind(tal, shir, ido)\nlength(placed)',
    options: ['3', '4', '3 4', '12'],
    answer: 3,
    hint: 'מה `length()` סופר כשנותנים לו וקטור? נסו לחשוב מה הוא סופר כשנותנים לו מטריצה.',
    explanation: [
      {
        text: '`rbind()` מחבר את שלושת הווקטורים **כשורות**: כל אחד מהצוות הוא שורה, וכל יום הוא עמודה. השמות של הווקטורים הופכים לשמות של השורות:',
        table: {
          columns: ['[,1]', '[,2]', '[,3]', '[,4]'],
          rows: [['12', '8', '15', '10'], ['5', '9', '7', '11'], ['6', '14', '3', '9']],
          rowNames: ['tal', 'shir', 'ido']
        }
      },
      {
        text: 'גם למטריצה יש אורך: `length()` סופר את **כל** הערכים שבה, בכל השורות ובכל העמודות. יש 3 שורות, ובכל אחת 4 ערכים, כלומר `3 * 4 = 12` ערכים:',
        output: '[1] 12'
      }
    ],
    whyWrong: {
      0: '`3` הוא מספר השורות (כמה וקטורים חיברנו), כלומר מה ש-`nrow(placed)` מדפיס. `length()` לא סופר שורות, אלא את כל הערכים שבמטריצה.',
      1: '`4` הוא האורך של כל וקטור לבד (`length(tal)`), וגם מספר העמודות (`ncol(placed)`). אבל `length(placed)` סופר את הערכים של שלושת הווקטורים יחד.',
      2: '`3 4` הוא מה ש-`dim(placed)` מדפיס: מספר השורות ומספר העמודות. `length()` מחזיר מספר אחד: כמה ערכים יש בסך הכול.'
    }
  },

  {
    id: 'tables-sum-matrix',
    station: 'tables',
    level: 1,
    context: 'כמה מבחנות הוצאתם מהמקפיא במשמרת בוקר (שורה 1) ובמשמרת ערב (שורה 2), בשלושה ימים:',
    code: 'taken <- matrix(c(3, 9, 2, 6, 5, 8), nrow = 2)\nsum(taken)',
    options: ['33', '12 8 13', '10 23', '6'],
    answer: 0,
    hint: 'מה `sum()` עושה כשנותנים לו וקטור? ומה משתנה, אם בכלל, כשנותנים לו מטריצה?',
    explanation: [
      {
        text: 'בלי `byrow`, R ממלא את המטריצה עמודה אחרי עמודה, וכל עמודה היא יום אחד:',
        table: {
          columns: ['[,1]', '[,2]', '[,3]'],
          rows: [['3', '2', '5'], ['9', '6', '8']],
          rowNames: ['[1,]', '[2,]']
        }
      },
      {
        text: '`sum()` לא עובד לפי שורות או לפי עמודות: הוא מחבר את **כל** הערכים שבמטריצה ומחזיר מספר אחד, `3 + 9 + 2 + 6 + 5 + 8`:',
        output: '[1] 33'
      }
    ],
    whyWrong: {
      1: '`12 8 13` הם הסכומים של כל עמודה (כל יום) בנפרד. למשל, `sum(taken[, 1])` מדפיס `12`. אבל `sum(taken)` לא מחלק לעמודות: הוא מחבר את כל הערכים יחד למספר אחד.',
      2: '`10 23` הם הסכומים של כל שורה (בוקר וערב) בנפרד. למשל, `sum(taken[1, ])` מדפיס `10`. אבל `sum(taken)` מחבר את כל הערכים שבמטריצה, משתי השורות יחד.',
      3: '`6` הוא **מספר** הערכים במטריצה, כלומר מה ש-`length(taken)` מדפיס. `sum()` לא סופר את הערכים, אלא מחבר אותם.'
    }
  },

  {
    id: 'tables-class-cbind',
    station: 'tables',
    level: 1,
    context: 'שני מדי חום במקפיא, אחד ליד הדלת ואחד בגב המקפיא, מדדו את הטמפרטורה בשלוש שעות:',
    code: 'door <- c(-18, -17, -19)\nback <- c(-24, -23, -25)\ntemps <- cbind(door, back)\nclass(temps)',
    options: ['"data.frame"', '"numeric"', '"matrix" "array"', 'TRUE'],
    answer: 2,
    hint: 'נסו להיזכר מה `cbind()` בונה כשמחברים בעזרתו וקטורים.',
    explanation: [
      {
        text: '`cbind()` מחבר את שני הווקטורים כעמודות ובונה מהם **מטריצה**. השמות של הווקטורים הופכים לשמות של העמודות:',
        table: {
          columns: ['door', 'back'],
          rows: [['-18', '-24'], ['-17', '-23'], ['-19', '-25']],
          rowNames: ['[1,]', '[2,]', '[3,]']
        }
      },
      {
        text: '`class()` מחזיר את הסוג של האובייקט `temps` כולו, ולא של המספרים שבתוכו. על מטריצה R עונה בשתי מילים: `"matrix"`, וגם `"array"` (כל מטריצה ב-R היא גם סוג של `array`):',
        output: '[1] "matrix" "array"'
      }
    ],
    whyWrong: {
      0: '`"data.frame"` הוא מה ש-`class(data.frame(door, back))` מדפיס. אבל `cbind()` של וקטורים בונה מטריצה, ולא טבלה מסוג `data.frame` (טבלה כזאת יוצאת מ-`cbind()` רק כשאחד הדברים שמחברים הוא כבר `data.frame`).',
      1: '`"numeric"` הוא הסוג של הערכים שבתוך המטריצה, כלומר מה ש-`class(door)` מדפיס. אבל `class(temps)` שואל מה הסוג של `temps` כולו, והוא מטריצה.',
      3: '`TRUE` הוא מה ש-`is.matrix(temps)` מדפיס: התשובה לשאלה "האם זו מטריצה?". `class()` לא עונה בכן או לא, אלא מחזיר את שם הסוג.'
    }
  },

  // ---------- level 2 ----------
  {
    id: 'tables-count-cells',
    station: 'tables',
    level: 2,
    context: 'כמה מבחנות יש בכל ארגז על מדף במקפיא:',
    code: 'shelf <- matrix(c(28, 33, 31, 26, 35, 30), nrow = 2)\nsum(shelf > 30)',
    options: ['99', '3', '4', '1'],
    answer: 1,
    hint: 'על מה בדיוק R בודק את `> 30`: על המטריצה כולה בבת אחת, או על משהו אחר? ומה `sum()` עושה עם `TRUE` ו-`FALSE`?',
    explanation: [
      {
        text: 'בלי `byrow`, R ממלא את המטריצה עמודה אחרי עמודה:',
        table: {
          columns: ['[,1]', '[,2]', '[,3]'],
          rows: [['28', '31', '35'], ['33', '26', '30']],
          rowNames: ['[1,]', '[2,]']
        }
      },
      {
        text: '`shelf > 30` בודק **כל תא** בנפרד, ומחזיר מטריצה באותו גודל של `TRUE` ו-`FALSE`. שימו לב: `30` לא גדול מ-30, ולכן הוא מקבל `FALSE`:',
        table: {
          columns: ['[,1]', '[,2]', '[,3]'],
          rows: [['FALSE', 'TRUE', 'TRUE'], ['TRUE', 'FALSE', 'FALSE']],
          rowNames: ['[1,]', '[2,]']
        }
      },
      {
        text: 'בתוך `sum()` כל `TRUE` נחשב 1 וכל `FALSE` נחשב 0. לכן `sum()` סופר כמה ארגזים עברו את הבדיקה:',
        output: '[1] 3'
      }
    ],
    whyWrong: {
      0: '`99` הוא הסכום של המבחנות בארגזים עם יותר מ-30 מבחנות (`33 + 31 + 35`), כלומר מה ש-`sum(shelf[shelf > 30])` מדפיס. אבל כאן `sum()` מקבל את התוצאה של `shelf > 30`, כלומר `TRUE` ו-`FALSE`, ולא את מספרי המבחנות עצמם.',
      2: '`4` יוצא אם סופרים גם את `30`. אבל `>` פירושו "גדול מ-", ו-30 לא גדול מ-30. (`4` הוא מה ש-`sum(shelf >= 30)` מדפיס.)',
      3: '`1` יוצא אם חושבים ש-`shelf > 30` נותן תשובה אחת לכל המטריצה. אבל השוואה על מטריצה נבדקת בכל תא בנפרד, ולכן יש 6 תשובות, ושלוש מהן `TRUE`.'
    }
  },

  {
    id: 'tables-row-assign',
    station: 'tables',
    level: 2,
    context: 'כמה ארגזים יש בכל תא במקפיא: 2 מדפים (שורות), ו-3 תאים בכל מדף:',
    code: 'boxes <- matrix(c(4, 6, 1, 3, 5, 2), nrow = 2)\nboxes[2, ] <- 0\nboxes[, 2]',
    options: ['0 0', '1 3', '6 0', '1 0'],
    answer: 3,
    hint: 'בדקו איפה הפסיק נמצא בכל אחת משתי השורות האחרונות, ומה אומר מקום ריק לידו. וכמה תאים מקבלים את ה-`0`?',
    explanation: [
      {
        text: 'בלי `byrow`, R ממלא את המטריצה עמודה אחרי עמודה:',
        table: {
          columns: ['[,1]', '[,2]', '[,3]'],
          rows: [['4', '1', '5'], ['6', '3', '2']],
          rowNames: ['[1,]', '[2,]']
        }
      },
      {
        text: '`boxes[2, ]` היא **כל** שורה 2: המקום הריק אחרי הפסיק אומר "כל העמודות". כשמציבים בה `0`, R שם `0` בכל התאים של המדף השני:',
        table: {
          columns: ['[,1]', '[,2]', '[,3]'],
          rows: [['4', '1', '5'], ['0', '0', '0']],
          rowNames: ['[1,]', '[2,]'],
          highlightRows: [1]
        }
      },
      {
        text: '`boxes[, 2]` לוקח את העמודה השנייה משני המדפים: `1` משורה 1, ו-`0` משורה 2:',
        output: '[1] 1 0'
      }
    ],
    whyWrong: {
      0: '`0 0` יוצא אם חושבים ש-`boxes[2, ]` היא עמודה 2. אבל המספר `2` כתוב **לפני** הפסיק, ולכן הוא מספר של שורה. (`0 0` הוא מה שהיה מודפס אחרי `boxes[, 2] <- 0`.)',
      1: '`1 3` היא העמודה השנייה **לפני** השינוי. היא יוצאת אם חושבים ש-`0` אחד נכנס רק לתא אחד (למשל `boxes[2, 1]`). אבל R מציב את ה-`0` בכל התאים שנבחרו, כלומר בכל שורה 2, ולכן גם `3` הופך ל-`0`.',
      2: '`6 0` יוצא אם ממלאים את המטריצה שורה אחרי שורה, ואז בשורה 1 יש `4 6 1`. אבל בלי `byrow = TRUE`, R ממלא עמודה אחרי עמודה, ולכן `6` נמצא בשורה 2 והופך ל-`0`.'
    }
  },

  {
    id: 'tables-matrix-na-zero',
    station: 'tables',
    level: 2,
    context: 'מגירה במקפיא מחולקת ל-2 שורות של 3 תאים. רשמתם כמה מבחנות יש בכל תא, ובשני תאים שכחתם לרשום מספר:',
    code: 'drawer <- matrix(c(6, NA, 3, 4, NA, 2), nrow = 2)\ndrawer[is.na(drawer)] <- 0\ndrawer[2, ]',
    options: ['0 4 2', '4 0 2', 'NA 4 2', '4 2'],
    answer: 0,
    hint: 'קודם מלאו את המטריצה ומצאו באילו תאים יש `NA`. מה השורה השנייה בקוד עושה לתאים האלה, ומה היא עושה לשאר התאים?',
    explanation: [
      {
        text: 'בלי `byrow`, R ממלא את המטריצה עמודה אחרי עמודה. לכן ה-`NA` הראשון נכנס לשורה 2 בעמודה 1, והשני לשורה 1 בעמודה 3:',
        table: {
          columns: ['[,1]', '[,2]', '[,3]'],
          rows: [['6', '3', 'NA'], ['NA', '4', '2']],
          rowNames: ['[1,]', '[2,]']
        }
      },
      {
        text: '`is.na(drawer)` בודק כל תא ומחזיר מטריצה באותו גודל: `TRUE` במקום שיש בו `NA`, ו-`FALSE` בכל השאר:',
        table: {
          columns: ['[,1]', '[,2]', '[,3]'],
          rows: [['FALSE', 'FALSE', 'TRUE'], ['TRUE', 'FALSE', 'FALSE']],
          rowNames: ['[1,]', '[2,]']
        }
      },
      {
        text: 'כש-`[ ]` נמצא **משמאל** ל-`<-`, הוא בוחר אילו תאים להחליף: כל תא עם `TRUE` מקבל `0`. שאר התאים לא משתנים, ושום תא לא נמחק:',
        table: {
          columns: ['[,1]', '[,2]', '[,3]'],
          rows: [['6', '3', '0'], ['0', '4', '2']],
          rowNames: ['[1,]', '[2,]'],
          highlightRows: [1]
        }
      },
      {
        text: '`drawer[2, ]` מחזיר את כל שורה 2:',
        output: '[1] 0 4 2'
      }
    ],
    whyWrong: {
      1: '`4 0 2` יוצא אם ממלאים את המטריצה שורה אחרי שורה, כמו ש-`byrow = TRUE` עושה. אבל בלי `byrow`, R ממלא עמודה אחרי עמודה, ולכן ה-`NA` של שורה 2 נמצא בעמודה 1.',
      2: '`NA 4 2` היא שורה 2 **לפני** ההחלפה. `is.na(drawer)` לבד רק בודק ולא משנה כלום, אבל כאן הוא בתוך `[ ]` משמאל ל-`<-`, ולכן R כותב `0` בכל תא שהיה בו `NA`.',
      3: '`4 2` יוצא אם חושבים שהשורה השנייה בקוד מוחקת את ה-`NA`. אבל `<- 0` לא מוחק: הוא שם `0` במקום ה-`NA`. במטריצה נשארות 3 עמודות, ולכן בשורה 2 עדיין יש 3 ערכים. (מחיקה של שורות שיש בהן `NA` היא מה ש-`na.omit()` עושה.)'
    }
  },

  // ---------- level 3 ----------
  {
    id: 'tables-logical-colorder',
    station: 'tables',
    level: 3,
    context: 'כמה ימים כל מבחנה כבר נמצאת במתקן, שיש בו 2 שורות של 3 מבחנות:',
    code: 'days <- matrix(c(18, 25, 22, 30, 15, 27), nrow = 2, byrow = TRUE)\ndays[days > 20]',
    options: ['25 22 30 27', 'שגיאה (Error), כי במטריצה חייבים לכתוב שורה ועמודה עם פסיק', '30 25 22 27', '2 3 5 6'],
    answer: 2,
    hint: 'ציירו את המטריצה. ואז חשבו: כש-R מוציא ערכים ממטריצה לתוך וקטור, באיזה סדר הוא עובר על התאים?',
    explanation: [
      {
        text: '`byrow = TRUE` ממלא שורה אחרי שורה: 3 המספרים הראשונים נכנסים לשורה 1, ו-3 הבאים לשורה 2:',
        table: {
          columns: ['[,1]', '[,2]', '[,3]'],
          rows: [['18', '25', '22'], ['30', '15', '27']],
          rowNames: ['[1,]', '[2,]']
        }
      },
      {
        text: '`days > 20` בודק כל תא ומחזיר מטריצה של `TRUE` ו-`FALSE` באותו גודל. כשהיא נמצאת בתוך `[ ]` (בלי פסיק), R מחזיר וקטור של כל הערכים שבמקומם יש `TRUE`:',
        table: {
          columns: ['[,1]', '[,2]', '[,3]'],
          rows: [['FALSE', 'TRUE', 'TRUE'], ['TRUE', 'FALSE', 'TRUE']],
          rowNames: ['[1,]', '[2,]']
        }
      },
      {
        text: 'אבל R תמיד עובר על מטריצה **עמודה אחרי עמודה**, מלמעלה למטה, גם כשמילאנו אותה שורה אחרי שורה (`byrow` משנה רק את המילוי). לכן הסדר הוא: עמודה 1 (`18`, `30`), עמודה 2 (`25`, `15`), עמודה 3 (`22`, `27`). מתוכם נשארים רק הערכים שמעל 20:',
        vector: { values: ['18', '30', '25', '15', '22', '27'], marks: ['off', 'on', 'on', 'off', 'on', 'on'], labels: ['FALSE', 'TRUE', 'TRUE', 'FALSE', 'TRUE', 'TRUE'] }
      },
      {
        text: 'זה הפלט:',
        output: '[1] 30 25 22 27'
      }
    ],
    whyWrong: {
      0: '`25 22 30 27` יוצא אם עוברים על המטריצה שורה אחרי שורה, באותו סדר שבו מילאנו אותה. אבל R עובר על מטריצה עמודה אחרי עמודה, ולכן `30` (מעמודה 1) מגיע לפני `25` (מעמודה 2).',
      1: 'כמו בווקטור, אפשר לבחור ערכים ממטריצה גם עם תנאי אחד בתוך `[ ]`, בלי פסיק. R בודק כל תא ומחזיר את הערכים שבמקומם יש `TRUE`, בלי שגיאה. (כך עובד גם `data[is.na(data)] <- 0` מהתרגול.)',
      3: '`2 3 5 6` הם **המיקומים** של התאים שעברו את התנאי (כשסופרים עמודה אחרי עמודה), כלומר מה ש-`which(days > 20)` מדפיס. אבל `[ ]` לא מחזיר מיקומים: הוא מחזיר את הערכים שבמקומות האלה.'
    }
  },

  {
    id: 'tables-text-sum-error',
    station: 'tables',
    level: 3,
    context: 'דף שתלוי על דלת המקפיא: שם הדגימה, וכמה מבחנות יש ממנה:',
    code: 'id <- c("A1", "A2", "A3")\ntubes <- c(4, 12, 30)\nsheet <- cbind(id, tubes)\nsum(sheet[, "tubes"])',
    options: ['46', '"46"', 'NA', 'שגיאה (Error), כי מספרי המבחנות ב-`sheet` הם טקסט'],
    answer: 3,
    hint: 'לפני שמחשבים סכום, בדקו מאיזה סוג יהיו הערכים ב-`sheet`. האם במטריצה יכולים לשבת יחד טקסט ומספרים?',
    explanation: [
      {
        text: 'במטריצה כל הערכים מאותו סוג, כמו בווקטור. `id` הוא טקסט, ולכן `cbind()` הופך גם את מספרי המבחנות לטקסט: `"4"`, `"12"` ו-`"30"`. כך R מדפיס את `sheet`, עם מירכאות:',
        table: {
          columns: ['id', 'tubes'],
          rows: [['"A1"', '"4"'], ['"A2"', '"12"'], ['"A3"', '"30"']],
          rowNames: ['[1,]', '[2,]', '[3,]']
        }
      },
      {
        text: '`sheet[, "tubes"]` מחזיר את העמודה `tubes`, והיא וקטור של טקסט:',
        vector: { values: ['"4"', '"12"', '"30"'], marks: ['on', 'on', 'on'], labels: ['character', 'character', 'character'] }
      },
      {
        text: '`sum()` מחבר רק מספרים. הוא לא הופך טקסט למספרים בעצמו, ולכן R עוצר עם שגיאה:',
        output: 'Error in sum(sheet[, "tubes"]) : invalid \'type\' (character) of argument'
      }
    ],
    whyWrong: {
      0: '`46` היה נכון אילו מספרי המבחנות היו נשארים מספרים, כמו ב-`data.frame(id, tubes)`, שבו לכל עמודה יש סוג משלה (`sum(data.frame(id, tubes)$tubes)` מדפיס `46`). אבל במטריצה כל הערכים מאותו סוג, ולכן `cbind()` הפך אותם לטקסט, ו-`sum()` לא מחבר טקסט.',
      1: '`sum()` לא יודע לחבר טקסט, גם כשהטקסט נראה כמו מספר. הוא לא מחזיר תשובה בכלל, גם לא כטקסט, אלא עוצר עם שגיאה.',
      2: '`NA` מסמן ערך **חסר**, וכאן שום ערך לא חסר: יש שלושה מספרים, רק שהם נשמרו כטקסט. `sum()` לא הופך טקסט ל-`NA`, אלא עוצר עם שגיאה.'
    }
  },

  {
    id: 'tables-total-row',
    station: 'tables',
    level: 3,
    context: 'כמה מבחנות הכנסתם לשני מדפים במקפיא (שורות) בשלושה ימים (עמודות):',
    code: 'added <- matrix(c(4, 6, 3, 5, 2, 7), nrow = 2)\nadded <- rbind(added, added[1, ] + added[2, ])\nadded[, 3]',
    options: ['2 7 9', '3 7 10', '10 8 9', '2 7 27'],
    answer: 0,
    hint: 'עבדו בשלבים: ציירו את `added`, חשבו מה `added[1, ] + added[2, ]` מחזיר (מספר אחד או כמה?), ואז הוסיפו אותו למטריצה.',
    explanation: [
      {
        text: 'בלי `byrow`, R ממלא את המטריצה עמודה אחרי עמודה:',
        table: {
          columns: ['[,1]', '[,2]', '[,3]'],
          rows: [['4', '3', '2'], ['6', '5', '7']],
          rowNames: ['[1,]', '[2,]']
        }
      },
      {
        text: '`added[1, ]` היא שורה 1 (`4 3 2`), ו-`added[2, ]` היא שורה 2 (`6 5 7`). `+` בין שני וקטורים באותו אורך מחבר כל איבר עם האיבר שבאותו מקום: `4 + 6`, `3 + 5` ו-`2 + 7`. מתקבלים 3 סכומים, אחד לכל יום:',
        vector: { values: ['10', '8', '9'], marks: ['', '', 'on'], labels: ['יום 1', 'יום 2', 'יום 3'] }
      },
      {
        text: '`rbind()` מוסיף את הווקטור הזה כשורה **חדשה**, שורה 3, בתחתית המטריצה:',
        table: {
          columns: ['[,1]', '[,2]', '[,3]'],
          rows: [['4', '3', '2'], ['6', '5', '7'], ['10', '8', '9']],
          rowNames: ['[1,]', '[2,]', '[3,]'],
          highlightRows: [2]
        }
      },
      {
        text: '`added[, 3]` לוקח את העמודה השלישית מכל 3 השורות:',
        output: '[1] 2 7 9'
      }
    ],
    whyWrong: {
      1: '`3 7 10` יוצא אם ממלאים את המטריצה שורה אחרי שורה, ואז בשורה 1 יש `4 6 3`. אבל בלי `byrow = TRUE`, R ממלא עמודה אחרי עמודה, ולכן בשורה 1 יש `4 3 2`.',
      2: '`10 8 9` היא השורה החדשה, כלומר מה ש-`added[3, ]` מדפיס. ב-`[, 3]` המקום שלפני הפסיק ריק, ולכן `3` הוא מספר של **עמודה**: לוקחים את העמודה השלישית מכל השורות.',
      3: '`2 7 27` יוצא אם חושבים ש-`added[1, ] + added[2, ]` מחזיר מספר אחד, הסכום של כל הערכים (`27`), שממלא את כל השורה החדשה. (זה מה שהיה יוצא עם `rbind(added, sum(added))`.) אבל `+` בין שני וקטורים מחבר איבר עם איבר, ומחזיר 3 סכומים, אחד לכל יום.'
    }
  },

  // ---------- level 1 ----------
  {
    id: 'tables-df-add-sum',
    station: 'tables',
    level: 1,
    context: 'כמה מבחנות מכל דגימה כבר היו במקפיא, וכמה הגיעו היום. כל שורה היא דגימה אחרת:',
    code: 'storage <- data.frame(\n  stored = c(30, 42, 25),\n  arrived = c(45, 18, 37)\n)\nstorage$total <- storage$stored + storage$arrived\nstorage$total',
    options: ['197', '30 42 25 45 18 37', '75 60 62', 'שגיאה (Error), כי אין בטבלה עמודה בשם `total`'],
    answer: 2,
    hint: 'זכרו שכל עמודה בטבלה היא וקטור. מה עושה `+` בין שני וקטורים? ומה קורה כשכותבים `<-` לעמודה שעוד לא קיימת?',
    explanation: [
      {
        text: '`storage$stored` ו-`storage$arrived` הן שתי עמודות, וכל אחת מהן היא וקטור של 3 מספרים. `+` בין שני וקטורים באותו אורך מחבר אותם **איבר מול איבר**: הראשון עם הראשון, השני עם השני, וכך הלאה:',
        vector: { values: ['75', '60', '62'], marks: ['on', 'on', 'on'], labels: ['30 + 45', '42 + 18', '25 + 37'] }
      },
      {
        text: '`storage$total <-` שומר את התוצאה בעמודה **חדשה** בשם `total`. העמודה לא הייתה קיימת קודם, ו-R פשוט מוסיף אותה לטבלה:',
        table: {
          columns: ['stored', 'arrived', 'total'],
          rows: [['30', '45', '75'], ['42', '18', '60'], ['25', '37', '62']],
          rowNames: ['1', '2', '3']
        }
      },
      {
        text: 'השורה האחרונה מדפיסה את העמודה החדשה:',
        output: '[1] 75 60 62'
      }
    ],
    whyWrong: {
      0: '`197` הוא הסכום של **כל** המספרים בטבלה, כלומר מה ש-`sum(storage$total)` מדפיס. `+` בין שתי עמודות לא מחבר הכול למספר אחד: הוא מחבר כל שורה בנפרד, ולכן יוצאים 3 מספרים, אחד לכל דגימה.',
      1: '`30 42 25 45 18 37` הוא מה ש-`c(storage$stored, storage$arrived)` מדפיס: שתי העמודות אחת אחרי השנייה. `+` לא מצמיד וקטורים זה לזה, אלא מחבר אותם בחשבון, איבר מול איבר.',
      3: 'נכון שלפני השורה `storage$total <- ...` לא הייתה בטבלה עמודה בשם `total`. אבל כשכותבים `storage$total <-`, R **יוצר** את העמודה ומוסיף אותה לטבלה. כך מוסיפים עמודה חדשה לטבלה.'
    }
  },

  {
    id: 'tables-df-col-type',
    station: 'tables',
    level: 1,
    context: 'כמה ימים כל דגימה כבר נמצאת במקפיא:',
    code: 'freezer <- data.frame(\n  sample = c("S7", "S8", "S9"),\n  days = c(8, 25, 12)\n)\nclass(freezer$days)',
    options: ['"numeric"', '"character"', '"data.frame"', '8 25 12'],
    answer: 0,
    hint: 'קודם חשבו מה `freezer$days` מחזיר. אחר כך זכרו מה `class()` מחזיר, ובדקו אם לעמודת הטקסט שלידה יש השפעה על התשובה.',
    explanation: [
      {
        text: '`data.frame()` בונה טבלה מכמה וקטורים, וכל וקטור הופך לעמודה. כל עמודה נשארת וקטור **נפרד** עם סוג משלה: `sample` היא עמודה של טקסט, ו-`days` היא עמודה של מספרים:',
        table: {
          columns: ['sample', 'days'],
          rows: [['S7', '8'], ['S8', '25'], ['S9', '12']],
          rowNames: ['1', '2', '3']
        }
      },
      {
        text: '`freezer$days` מחזיר רק את העמודה `days`, כלומר את הווקטור `8 25 12`. `class()` לא מדפיס את המספרים עצמם, אלא את **הסוג** שלהם:',
        output: '[1] "numeric"'
      }
    ],
    whyWrong: {
      1: 'עמודת הטקסט `sample` לא משנה את העמודה `days`. בווקטור אחד באמת כל הערכים הופכים לטקסט אם יש ביניהם טקסט, אבל בטבלה כל עמודה היא וקטור נפרד ושומרת על הסוג שלה. `"character"` הוא מה ש-`class(freezer$sample)` מדפיס.',
      2: '`"data.frame"` הוא מה ש-`class(freezer)` מדפיס: הסוג של הטבלה כולה. כאן `class()` מקבל רק את העמודה `freezer$days`, ולכן הוא מחזיר את הסוג של הערכים שבה.',
      3: '`8 25 12` הם הערכים שבעמודה, כלומר מה ש-`freezer$days` לבד מדפיס. `class()` לא מחזיר את הערכים, אלא את הסוג שלהם.'
    }
  },

  {
    id: 'tables-df-rows-vector',
    station: 'tables',
    level: 1,
    context: 'כמה מבחנות יש בכל מגירה של המקפיא:',
    code: 'drawers <- data.frame(\n  drawer = c("A", "B", "C", "D"),\n  tubes = c(12, 15, 6, 9)\n)\ndrawers[c(2, 4), "tubes"]',
    options: ['15 6 9', '12 6', 'שגיאה (Error), כי לפני הפסיק אפשר לכתוב רק מספר של שורה אחת', '15 9'],
    answer: 3,
    hint: 'מה שלפני הפסיק בוחר שורות. כתבו לעצמכם את הווקטור `c(2, 4)`: אילו מספרי שורות יש בו?',
    explanation: [
      {
        text: 'לפני הפסיק כתוב `c(2, 4)`: וקטור עם **שני** מספרים, `2` ו-`4`. כמו בווקטור רגיל, אפשר לבחור כמה מקומות בבת אחת, ולכן R לוקח את שורה 2 ואת שורה 4 (שורת הכותרות לא נספרת):',
        table: {
          columns: ['drawer', 'tubes'],
          rows: [['A', '12'], ['B', '15'], ['C', '6'], ['D', '9']],
          rowNames: ['1', '2', '3', '4'],
          highlightRows: [1, 3]
        }
      },
      {
        text: 'אחרי הפסיק כתוב `"tubes"`, ולכן מכל אחת מהשורות האלה R לוקח רק את מספר המבחנות:',
        output: '[1] 15  9'
      }
    ],
    whyWrong: {
      0: '`15 6 9` יוצא אם קוראים את `c(2, 4)` כאילו כתוב `2:4`, כלומר "משורה 2 עד שורה 4". אבל `c()` לא יוצר טווח: יש בו רק המספרים שכתובים בו, `2` ו-`4`. (`15 6 9` הוא מה ש-`drawers[2:4, "tubes"]` מדפיס.)',
      1: '`12 6` יוצא אם סופרים את שורת הכותרות (`drawer tubes`) כשורה 1. ב-R הכותרות לא נספרות: שורה 1 היא מגירה `A`, ולכן שורות 2 ו-4 הן המגירות `B` ו-`D`. (`12 6` הוא מה ש-`drawers[c(1, 3), "tubes"]` מדפיס.)',
      2: 'לפני הפסיק אפשר לכתוב וקטור של כמה מספרי שורות, בדיוק כמו שבוחרים כמה מקומות מווקטור רגיל עם `[c(2, 4)]`. R מחזיר ערך אחד מכל שורה שנבחרה, בלי שגיאה.'
    }
  },

  // ---------- level 2 ----------
  {
    id: 'tables-df-and-two-cols',
    station: 'tables',
    level: 2,
    context: 'רשימת המקפיא לפי שכונות: כמה מבחנות יש מכל שכונה, וכמה ימים הן כבר בפנים:',
    code: 'stock <- data.frame(\n  area = c("North", "South", "Port", "Hills", "Park"),\n  tubes = c(3, 4, 2, 5, 4),\n  days = c(52, 69, 71, 78, 61)\n)\nstock$area[stock$tubes >= 4 & stock$days < 70]',
    options: ['"South" "Hills" "Park"', '"South" "Park"', '"North" "South" "Hills" "Park"', '"North" "South" "Park"'],
    answer: 1,
    hint: 'בדקו כל שכונה בנפרד: האם היא עומדת בתנאי הראשון? ובתנאי השני? ומה `&` דורש כדי לתת `TRUE`?',
    explanation: [
      {
        text: 'R בודק כל תנאי על כל השורות, ומקבל וקטור של `TRUE` ו-`FALSE`. קודם `stock$tubes >= 4` (לפחות 4 מבחנות):',
        vector: { values: ['3', '4', '2', '5', '4'], marks: ['off', 'on', 'off', 'on', 'on'], labels: ['FALSE', 'TRUE', 'FALSE', 'TRUE', 'TRUE'] }
      },
      {
        text: 'אחר כך `stock$days < 70` (פחות מ-70 ימים במקפיא):',
        vector: { values: ['52', '69', '71', '78', '61'], marks: ['on', 'on', 'off', 'off', 'on'], labels: ['TRUE', 'TRUE', 'FALSE', 'FALSE', 'TRUE'] }
      },
      {
        text: '`&` נותן `TRUE` רק בשורה שבה **שני** התנאים הם `TRUE`. זה קורה רק בשורה 2 ובשורה 5:',
        vector: { values: ['"North"', '"South"', '"Port"', '"Hills"', '"Park"'], marks: ['off', 'on', 'off', 'off', 'on'], labels: ['FALSE', 'TRUE', 'FALSE', 'FALSE', 'TRUE'] }
      },
      {
        text: 'מ-`stock$area` נשארים רק השמות שבמקומות של `TRUE`:',
        output: '[1] "South" "Park"'
      }
    ],
    whyWrong: {
      0: '`"South" "Hills" "Park"` הן השכונות שיש מהן לפחות 4 מבחנות, כלומר מה ש-`stock$area[stock$tubes >= 4]` מדפיס. אבל המבחנות של `"Hills"` נמצאות במקפיא `78` ימים, יותר מ-70. `&` דורש ששני התנאים יתקיימו, ולכן `"Hills"` לא נבחרת.',
      2: 'זה מה ש-`|` (או) היה נותן: כל שכונה שעומדת **לפחות באחד** מהתנאים. `&` (וגם) מחמיר יותר: שכונה נבחרת רק אם היא עומדת בשניהם. לכן `"North"` (3 מבחנות) ו-`"Hills"` (`78` ימים) לא נבחרות.',
      3: '`"North" "South" "Park"` הן השכונות שהמבחנות שלהן במקפיא פחות מ-70 ימים, כלומר מה ש-`stock$area[stock$days < 70]` מדפיס. אבל מ-`"North"` יש רק 3 מבחנות, פחות מ-4. `&` דורש ששני התנאים יתקיימו, ולכן `"North"` לא נבחרת.'
    }
  },

  {
    id: 'tables-df-new-col-dim',
    station: 'tables',
    level: 2,
    context: 'רשימת המלאי: כמה מבחנות יש במקפיא מכל דגימה:',
    code: 'stock <- data.frame(\n  sample = c("N2", "S4", "P1", "H3", "M6"),\n  tubes = c(52, 38, 29, 47, 31)\n)\nstock$left <- stock$tubes - 10\ndim(stock)',
    options: ['5 2', '6 2', '5 3', '3 5'],
    answer: 2,
    hint: 'ציירו את `stock` על דף אחרי השורה `stock$left <- ...`. לאן נכנסו המספרים החדשים? ומה `dim()` מדפיס קודם?',
    explanation: [
      {
        text: 'בהתחלה יש ב-`stock` חמש שורות (דגימה אחת בכל שורה) ושתי עמודות: `sample` ו-`tubes`.'
      },
      {
        text: '`stock$tubes - 10` מוריד 10 מכל מספר, ומקבלים וקטור של 5 מספרים חדשים. `stock$left <-` שומר אותם בעמודה **חדשה** בשם `left`. לכל דגימה נוסף מספר בשורה שלה, אבל לא נוספה אף שורה:',
        table: {
          columns: ['sample', 'tubes', 'left'],
          rows: [['N2', '52', '42'], ['S4', '38', '28'], ['P1', '29', '19'], ['H3', '47', '37'], ['M6', '31', '21']],
          rowNames: ['1', '2', '3', '4', '5']
        }
      },
      {
        text: '`dim()` מחזיר שני מספרים: קודם את מספר השורות, ואחר כך את מספר העמודות:',
        output: '[1] 5 3'
      }
    ],
    whyWrong: {
      0: '`5 2` הוא מה ש-`dim(stock)` היה מדפיס **לפני** השורה `stock$left <- ...`. השורה הזאת לא רק מחשבת: היא שומרת את התוצאה בטבלה כעמודה חדשה, ולכן יש עכשיו 3 עמודות.',
      1: '`6 2` יוצא אם חושבים שהמספרים החדשים נכנסו כשורה חדשה בתחתית הטבלה. אבל `$` עובד עם **עמודות**: `stock$left <-` מוסיף עמודה, ובכל שורה נוסף ערך אחד.',
      3: '`3 5` הוא מספר העמודות ואחריו מספר השורות. `dim()` תמיד מחזיר קודם את מספר **השורות** (5 דגימות), ורק אחר כך את מספר העמודות (3).'
    }
  },

  {
    id: 'tables-df-unequal-length',
    station: 'tables',
    level: 2,
    context: 'רשימה של דגימות חדשות שהגיעו היום למקפיא:',
    code: 'incoming <- data.frame(\n  sample = c("S1", "S2", "S3"),\n  box = c(9, 11)\n)\nincoming$box',
    options: ['9 11 NA', '9 11 9', '9 11', 'שגיאה (Error), כי בעמודות יש מספר שונה של ערכים'],
    answer: 3,
    hint: 'ספרו כמה ערכים יש בכל אחד מהווקטורים. כמה שורות אמורות להיות בטבלה?',
    explanation: [
      {
        text: '`data.frame()` הופך כל וקטור לעמודה, ובכל שורה יש ערך אחד מכל עמודה. לכן כל הווקטורים צריכים להיות **באותו אורך**. כאן ב-`sample` יש 3 דגימות, אבל ב-`box` יש רק 2 מספרי ארגזים.'
      },
      {
        text: 'R לא מנחש לאיזו דגימה חסר הארגז, ולא משלים את החסר בעצמו. הוא עוצר כבר ב-`data.frame()` עם שגיאה, ולכן `incoming` לא נוצרת בכלל:',
        output: 'Error in data.frame(sample = c("S1", "S2", "S3"), box = c(9, 11)) : \n  arguments imply differing number of rows: 3, 2'
      }
    ],
    whyWrong: {
      0: '`NA` מופיע כשערך חסר כתוב **בתוך** הווקטור, למשל אם היינו כותבים `box = c(9, 11, NA)`. כאן לא כתוב `NA`: פשוט יש רק 2 ערכים. R לא מוסיף `NA` בעצמו, כי הוא לא יודע לאיזו דגימה חסר הארגז.',
      1: '`data.frame()` חוזר על הערכים של עמודה קצרה רק כשהאורך שלה נכנס בדיוק במספר השורות (למשל 2 ערכים ל-4 שורות). כאן יש 3 שורות ו-2 מספרי ארגזים, ו-2 לא נכנס בדיוק ב-3, ולכן R לא משלים `9` נוסף אלא עוצר בשגיאה.',
      2: 'בטבלה אין עמודה קצרה מהאחרות, כי בכל שורה יש ערך אחד מכל עמודה. `9 11` הוא רק מה ש-`c(9, 11)` מדפיס לבד, מחוץ לטבלה. כאן `data.frame()` עוצר בשגיאה עוד לפני שהטבלה נוצרת.'
    }
  },

  {
    id: 'tables-df-not-logical',
    station: 'tables',
    level: 2,
    context: 'ארבעה ארגזים במקפיא, ולכל אחד רשום אם הוא כבר מלא:',
    code: 'boxes <- data.frame(\n  box = c("B1", "B2", "B3", "B4"),\n  full = c(TRUE, FALSE, TRUE, FALSE)\n)\nboxes$box[!boxes$full]',
    options: ['"B2" "B4"', '"B1" "B3"', 'FALSE TRUE FALSE TRUE', 'שגיאה (Error), כי בתוך `[ ]` צריך תנאי עם `==`'],
    answer: 0,
    hint: 'העמודה `full` כבר מלאה ב-`TRUE` וב-`FALSE`. מה עושה לה הסימן `!`? ומה קורה כשמכניסים את התוצאה לתוך `[ ]`?',
    explanation: [
      {
        text: '`boxes$full` היא עמודה של ערכים לוגיים. `!` הופך כל ערך: `TRUE` הופך ל-`FALSE`, ו-`FALSE` הופך ל-`TRUE`. למעלה הערכים של `boxes$full`, ולמטה מה ש-`!boxes$full` נותן:',
        vector: { values: ['TRUE', 'FALSE', 'TRUE', 'FALSE'], labels: ['FALSE', 'TRUE', 'FALSE', 'TRUE'] }
      },
      {
        text: 'לא צריך כאן `==`: וקטור של `TRUE` ו-`FALSE` אפשר להכניס ישר לתוך `[ ]`. R לוקח מ-`boxes$box` את השמות שבמקומות של `TRUE`, כלומר את הארגזים ש**לא** מלאים:',
        vector: { values: ['"B1"', '"B2"', '"B3"', '"B4"'], marks: ['off', 'on', 'off', 'on'], labels: ['FALSE', 'TRUE', 'FALSE', 'TRUE'] }
      },
      {
        text: 'זה הפלט:',
        output: '[1] "B2" "B4"'
      }
    ],
    whyWrong: {
      1: '`"B1" "B3"` הם הארגזים המלאים, כלומר מה ש-`boxes$box[boxes$full]` מדפיס, בלי `!`. הסימן `!` הופך את `TRUE` ו-`FALSE`, ולכן נבחרים דווקא הארגזים שבעמודה `full` שלהם כתוב `FALSE`.',
      2: 'זה מה ש-`!boxes$full` לבד מדפיס. כאן הווקטור הזה נמצא בתוך `[ ]` של `boxes$box`, ולכן הוא רק **בוחר** שמות: R מחזיר את השמות שבמקומות של `TRUE`, ולא את `TRUE` ו-`FALSE` עצמם.',
      3: 'בתוך `[ ]` לא חייבים לכתוב השוואה. מה שצריך שם הוא וקטור של `TRUE` ו-`FALSE`, והשוואה היא רק דרך אחת לקבל אותו. `!boxes$full` כבר וקטור כזה, ולכן אין שגיאה.'
    }
  },

  // ---------- level 3 ----------
  {
    id: 'tables-df-replace-by-cond',
    station: 'tables',
    level: 3,
    context: 'כמה מבחנות יש בכל אחד מארבעת המתקנים במקפיא:',
    code: 'racks <- data.frame(\n  rack = c("R1", "R2", "R3", "R4"),\n  tubes = c(40, 70, 20, 120)\n)\nracks$tubes[racks$tubes > 50] <- 50\nsum(racks$tubes)',
    options: ['250', '160', '200', '100'],
    answer: 1,
    hint: 'בשורה `racks$tubes[racks$tubes > 50] <- 50` יש `[ ]` בצד **שמאל** של `<-`. אילו מקומות בעמודה מקבלים את הערך החדש? ומה קורה לשאר?',
    explanation: [
      {
        text: '`racks$tubes > 50` בודק כל מתקן. רק בשורות של `R2` ושל `R4` יש יותר מ-50 מבחנות:',
        vector: { values: ['40', '70', '20', '120'], marks: ['off', 'on', 'off', 'on'], labels: ['FALSE', 'TRUE', 'FALSE', 'TRUE'] }
      },
      {
        text: 'כש-`[ ]` נמצא **משמאל** ל-`<-`, הוא לא שולף ערכים, אלא בוחר אילו מקומות להחליף. רק במקומות של `TRUE` נכנס `50`. שאר המספרים נשארים כמו שהם, ואף שורה לא נמחקת:',
        vector: { values: ['40', '50', '20', '50'], marks: ['', 'on', '', 'on'], labels: ['R1', 'R2', 'R3', 'R4'] }
      },
      {
        text: 'עכשיו `sum()` מחבר את כל העמודה: `40 + 50 + 20 + 50`:',
        output: '[1] 160'
      }
    ],
    whyWrong: {
      0: '`250` הוא הסכום של המספרים **המקוריים**. אבל השורה `racks$tubes[racks$tubes > 50] <- 50` משנה את העמודה `tubes` בתוך הטבלה עצמה: אחריה `70` ו-`120` כבר לא נמצאים בעמודה, ובמקומם יש `50`.',
      2: '`200` יוצא אם כל ארבעת המספרים הופכים ל-`50`. אבל כתוב `[racks$tubes > 50]`, ולכן רק המספרים שגבוהים מ-50 מוחלפים. `40` ו-`20` נשארים כמו שהם.',
      3: '`100` הוא `50 + 50`: יוצא אם חושבים שאחרי ההחלפה נשארים בעמודה רק הערכים שהוחלפו. אבל `[ ]` משמאל ל-`<-` לא מסנן את העמודה: הוא רק קובע אילו מקומות יקבלו `50`, ו-`40` ו-`20` נשארים בה.'
    }
  },

  {
    id: 'tables-df-max-tie',
    station: 'tables',
    level: 3,
    context: 'כמה מבחנות סידר כל אחד מהצוות במקפיא היום:',
    code: 'shifts <- data.frame(\n  name = c("Lior", "Hila", "Ido", "Shani"),\n  tubes = c(14, 18, 9, 18)\n)\nshifts[shifts$tubes == max(shifts$tubes), "name"]',
    options: ['"Hila" "Shani"', '"Hila"', '18', 'שגיאה (Error), כי לשניים מהצוות יש את המספר הגבוה ביותר'],
    answer: 0,
    hint: 'עבדו מבפנים החוצה: קודם חשבו מה `max(shifts$tubes)` מחזיר. אחר כך בדקו את התנאי על כל שורה ושורה.',
    explanation: [
      {
        text: 'R מתחיל מהפונקציה הפנימית: `max(shifts$tubes)` מחזיר את המספר הגבוה ביותר, `18`. כלומר התנאי הוא בעצם `shifts$tubes == 18`.'
      },
      {
        text: 'R משווה כל שורה ל-`18`. גם `"Hila"` וגם `"Shani"` סידרו `18` מבחנות, ולכן יש שני `TRUE`:',
        vector: { values: ['14', '18', '9', '18'], marks: ['off', 'on', 'off', 'on'], labels: ['FALSE', 'TRUE', 'FALSE', 'TRUE'] }
      },
      {
        text: 'התנאי נמצא לפני הפסיק, ולכן הוא בוחר את **כל** השורות שבהן יש `TRUE`. אחרי הפסיק כתוב `"name"`, ולכן R מחזיר את השמות משתי השורות:',
        output: '[1] "Hila"  "Shani"'
      }
    ],
    whyWrong: {
      1: '`max()` מחזיר מספר אחד, `18`, אבל התנאי `shifts$tubes == 18` נבדק על **כל** שורה. בשתי שורות יש `18`, ולכן שתיהן נבחרות. R לא עוצר אחרי ה-`TRUE` הראשון.',
      2: '`18` הוא מה ש-`max(shifts$tubes)` מדפיס. כאן `max()` הוא רק חלק מהתנאי שבוחר שורות. אחרי הפסיק כתוב `"name"`, ולכן R מחזיר שמות, ולא מספרי מבחנות.',
      3: 'תיקו לא גורם לשגיאה. התנאי פשוט נותן `TRUE` בשתי שורות, ו-R מחזיר את השמות משתיהן.'
    }
  },

  {
    id: 'tables-df-or-count',
    station: 'tables',
    level: 3,
    context: 'כמה פעמים כל אחד מהצוות פתח את המקפיא ביום שני וביום שלישי:',
    code: 'opened <- data.frame(\n  name = c("Gal", "Yuval", "Ori", "Neta", "Tal"),\n  mon = c(9, 4, 12, 7, 3),\n  tue = c(6, 11, 10, 5, 2)\n)\nsum(opened$mon > 8 | opened$tue > 8)',
    options: ['4', '3', '1', 'שגיאה (Error), כי אי אפשר לחבר `TRUE` ו-`FALSE`'],
    answer: 1,
    hint: 'קודם עברו על השורות אחת אחת, ובדקו מה יוצא מ-`|` בכל שורה. רק אחר כך ספרו.',
    explanation: [
      {
        text: 'R בודק את שני התנאים על כל שורה. `|` (או) נותן `TRUE` בשורה שבה **לפחות אחד** מהתנאים הוא `TRUE`:',
        table: {
          columns: ['name', 'mon > 8', 'tue > 8', '|'],
          rows: [
            ['Gal', 'TRUE', 'FALSE', 'TRUE'],
            ['Yuval', 'FALSE', 'TRUE', 'TRUE'],
            ['Ori', 'TRUE', 'TRUE', 'TRUE'],
            ['Neta', 'FALSE', 'FALSE', 'FALSE'],
            ['Tal', 'FALSE', 'FALSE', 'FALSE']
          ],
          rowNames: ['1', '2', '3', '4', '5'],
          highlightRows: [0, 1, 2]
        }
      },
      {
        text: '`"Ori"` עומד בשני התנאים, אבל הוא עדיין שורה אחת, ולכן הוא מקבל `TRUE` אחד בלבד. כך נראה הווקטור ש-`sum()` מקבל:',
        vector: { values: ['TRUE', 'TRUE', 'TRUE', 'FALSE', 'FALSE'], marks: ['on', 'on', 'on', 'off', 'off'] }
      },
      {
        text: 'ב-R `TRUE` נחשב 1 ו-`FALSE` נחשב 0, ולכן `sum()` סופר כמה `TRUE` יש:',
        output: '[1] 3'
      }
    ],
    whyWrong: {
      0: '`4` יוצא אם סופרים כל תנאי בנפרד ומחברים: 2 ביום שני ועוד 2 ביום שלישי (זה מה ש-`sum(opened$mon > 8) + sum(opened$tue > 8)` מדפיס). כך `"Ori"` נספר פעמיים. `|` בודק כל שורה פעם אחת, ולכן `"Ori"` מקבל `TRUE` אחד.',
      2: '`1` הוא מה ש-`&` (וגם) היה נותן: רק `"Ori"` עומד בשני התנאים. `|` (או) מסתפק בתנאי אחד, ולכן גם `"Gal"` וגם `"Yuval"` נספרים.',
      3: 'ב-R אפשר לחבר ערכים לוגיים: `TRUE` נחשב 1 ו-`FALSE` נחשב 0. לכן `sum()` על וקטור של `TRUE` ו-`FALSE` סופר כמה `TRUE` יש בו, בלי שגיאה.'
    }
  },

  // ===== שבוע 5: apply ו-paste =====
  // ---------- level 1 ----------
  {
    id: 'apply-paste-sep',
    station: 'apply',
    level: 1,
    context: 'הרובוט מגיע למבחנה מספר 7 במתקן B:',
    code: 'paste("tube", 7, "B", sep = "_")',
    options: ['"tube 7 B"', '"tube_7_B"', '"tube7B"', '"tube" "7" "B"'],
    answer: 1,
    hint: 'כמה טקסטים יוצאים מ-`paste()` כאן? ומה `sep` קובע?',
    explanation: [
      {
        text: '`paste()` מקבל 3 חלקים ומחבר אותם לטקסט **אחד**. את המספר `7` הוא הופך לטקסט בעצמו:',
        vector: { values: ['"tube"', '7', '"B"'], marks: ['', '', ''] }
      },
      {
        text: '`sep = "_"` קובע מה יבוא **בין** החלקים. בלי `sep` היה בא רווח, וכאן בא קו תחתון:',
        output: '[1] "tube_7_B"'
      }
    ],
    whyWrong: {
      0: 'זה מה ש-`paste("tube", 7, "B")` מדפיס, בלי `sep`. רווח הוא רק ברירת המחדל: כשכותבים `sep = "_"`, R שם קו תחתון במקום הרווח.',
      2: 'זה מה ש-`sep = ""` היה נותן, כלומר שום דבר בין החלקים. כאן `sep = "_"`, ולכן יש קו תחתון בין כל שני חלקים.',
      3: 'שלושה טקסטים נפרדים הם מה ש-`c("tube", 7, "B")` נותן. `paste()` **מדביק** את החלקים לטקסט אחד, ולכן בפלט יש רק זוג מירכאות אחד.'
    }
  },

  {
    id: 'apply-row-sum',
    station: 'apply',
    level: 1,
    context: 'כמה מבחנות הרובוט הניח בשלושה מגשים (השורות), במשמרת בוקר ובמשמרת ערב:',
    code: 'trays <- data.frame(\n  morning = c(3, 5, 2),\n  evening = c(4, 1, 6)\n)\napply(trays, 1, sum)[2]',
    options: ['11', '21', '6', '7 6 8'],
    answer: 2,
    hint: 'מה `apply(trays, 1, sum)` מחזיר לפני ה-`[2]`? על מה הוא עובר כש-`MARGIN` הוא `1`?',
    explanation: [
      {
        text: '`MARGIN = 1` פירושו **שורות**: `apply()` מחשב `sum` לכל שורה (כל מגש) בנפרד:',
        table: {
          columns: ['morning', 'evening', 'sum'],
          rows: [['3', '4', '7'], ['5', '1', '6'], ['2', '6', '8']],
          rowNames: ['1', '2', '3'],
          highlightRows: [1]
        }
      },
      {
        text: 'התוצאה היא וקטור עם סכום לכל מגש, ו-`[2]` בוחר את הסכום השני:',
        vector: { values: ['7', '6', '8'], marks: ['off', 'on', 'off'], showIndex: true }
      },
      {
        text: 'זה הפלט:',
        output: '[1] 6'
      }
    ],
    whyWrong: {
      0: '`11` הוא הסכום של עמודת `evening`, כלומר מה שבוחרים כשעוברים על **העמודות** (`apply(trays, 2, sum)`). כאן `MARGIN` הוא `1`, ולכן `apply()` עובר על השורות.',
      1: '`21` הוא הסכום של כל הטבלה, `sum(trays)`. `apply()` לא מחבר הכול יחד: הוא מחזיר סכום נפרד לכל שורה, ו-`[2]` בוחר אחד מהם.',
      3: 'זה מה ש-`apply(trays, 1, sum)` מדפיס: סכום לכל מגש. אבל `[2]` בסוף בוחר רק את הסכום **השני** מתוכם.'
    }
  },

  {
    id: 'apply-lapply-column',
    station: 'apply',
    level: 1,
    context: 'כמה ארגזים של דגימות הגיעו לרובוט מצפון העיר ומדרומה, בשלושה ימים:',
    code: 'boxes <- data.frame(\n  north = c(4, 6, 5),\n  south = c(3, 9, 2)\n)\nres <- lapply(boxes, max)\nres$south',
    options: ['9', '6', '4 9 5', '3 9 2'],
    answer: 0,
    hint: 'על מה `lapply()` עובר: על השורות או על העמודות? ומה נשמר ב-`res`?',
    explanation: [
      {
        text: 'כך נראית הטבלה. כל שורה היא יום:',
        table: {
          columns: ['north', 'south'],
          rows: [['4', '3'], ['6', '9'], ['5', '2']],
          rowNames: ['1', '2', '3']
        }
      },
      {
        text: '`lapply()` עובר רק על **העמודות**, ומפעיל את `max()` על כל עמודה בנפרד. התוצאה היא רשימה (list) עם תוצאה אחת לכל עמודה, ולכל תוצאה יש את השם של העמודה שלה:',
        vector: { values: ['6', '9'], marks: ['', 'on'], labels: ['north', 'south'] }
      },
      {
        text: '`res$south` שולף מהרשימה את התוצאה של העמודה `south`:',
        output: '[1] 9'
      }
    ],
    whyWrong: {
      1: '`6` הוא המקסימום של העמודה `north`, כלומר מה ש-`res$north` מדפיס. `$south` שולף את התוצאה של העמודה `south`.',
      2: 'אלה המקסימום של כל **שורה** (כל יום), כלומר מה ש-`apply(boxes, 1, max)` מדפיס. `lapply()` עובר רק על עמודות, אף פעם לא על שורות.',
      3: 'זו העמודה `south` עצמה, כלומר מה ש-`boxes$south` מדפיס. אבל `res` היא לא הטבלה: יש בה את התוצאה של `max()` על כל עמודה, ולכן ב-`res$south` יש מספר אחד.'
    }
  },

  // ---------- level 2 ----------
  {
    id: 'apply-paste-collapse-pairs',
    station: 'apply',
    level: 2,
    context: 'כמה מקומות פנויים נשארו בשלושה מתקני מבחנות של הרובוט:',
    code: 'racks <- c("A", "B", "C")\nfree <- c(2, 4, 1)\npaste(racks, free, sep = ":", collapse = "; ")',
    options: ['"A:2" "B:4" "C:1"', '"A; 2:B; 4:C; 1"', '"A B C:2 4 1"', '"A:2; B:4; C:1"'],
    answer: 3,
    hint: 'כמה טקסטים יש אחרי ש-`paste()` מחבר את `racks` עם `free`? ומה `collapse` עושה איתם?',
    explanation: [
      {
        text: 'כש-`paste()` מקבל שני וקטורים, הוא מחבר אותם **איבר עם איבר**: הראשון עם הראשון, השני עם השני, וכך הלאה. `sep = ":"` הוא מה שבא בתוך כל זוג. יוצאים 3 טקסטים, אחד לכל מתקן:',
        vector: { values: ['"A:2"', '"B:4"', '"C:1"'], marks: ['', '', ''], showIndex: true }
      },
      {
        text: '`collapse = "; "` מדביק את 3 הטקסטים לטקסט **אחד**, ושם `"; "` בין כל שניים:',
        output: '[1] "A:2; B:4; C:1"'
      }
    ],
    whyWrong: {
      0: 'זה מה ש-`paste(racks, free, sep = ":")` מדפיס, בלי `collapse`. כאן יש גם `collapse = "; "`, והוא מדביק את 3 הטקסטים לטקסט אחד.',
      1: 'כאן התפקידים של `sep` ושל `collapse` התחלפו: זה מה ש-`paste(racks, free, sep = "; ", collapse = ":")` מדפיס. `sep` בא **בתוך** כל זוג (בין `"A"` ל-`2`), ו-`collapse` בא **בין** הזוגות.',
      2: '`paste()` לא הופך קודם כל וקטור לטקסט אחד. הוא מחבר את הווקטורים איבר עם איבר: `"A"` עם `2`, `"B"` עם `4` ו-`"C"` עם `1`. (`"A B C:2 4 1"` יוצא מ-`paste(paste(racks, collapse = " "), paste(free, collapse = " "), sep = ":")`.)'
    }
  },

  {
    id: 'apply-row-mean-narm',
    station: 'apply',
    level: 2,
    context: 'בשלושה ימים הרובוט בדק כמה אחוזים מכל אחד משלושה מקפיאים כבר מלאים. פעמיים החיישן לא קלט כלום (`NA`):',
    code: 'freezers <- data.frame(\n  mon = c(80, NA, 70),\n  wed = c(90, 60, NA),\n  fri = c(70, 90, 100)\n)\napply(freezers, 1, mean, na.rm = TRUE)',
    options: ['80 75 85', '80 NA NA', '75 75 86.66667', '80 50 56.66667'],
    answer: 0,
    hint: 'על מה `1` עובר: על המקפיאים או על הימים? ומה `na.rm = TRUE`, שכתוב אחרי `mean`, עושה לבדיקה שחסרה?',
    explanation: [
      {
        text: 'כך נראית הטבלה. כל שורה היא מקפיא:',
        table: {
          columns: ['mon', 'wed', 'fri'],
          rows: [['80', '90', '70'], ['NA', '60', '90'], ['70', 'NA', '100']],
          rowNames: ['1', '2', '3']
        }
      },
      {
        text: '`1` אומר "לפי שורות", ולכן R מחשב ממוצע לכל מקפיא. מה שכתוב אחרי `mean` (כאן `na.rm = TRUE`) עובר אל `mean()`, ולכן ה-`NA` לא נכנס לחישוב. בשורה עם `NA` מחלקים רק במספר הבדיקות שקיימות:',
        vector: { values: ['80', '75', '85'], marks: ['on', 'on', 'on'], labels: ['(80+90+70)/3', '(60+90)/2', '(70+100)/2'] }
      },
      {
        text: 'יוצא ממוצע אחד לכל מקפיא:',
        output: '[1] 80 75 85'
      }
    ],
    whyWrong: {
      1: 'זה מה ש-`apply(freezers, 1, mean)` מדפיס, **בלי** `na.rm = TRUE`: כל `NA` הופך את הממוצע של השורה שלו ל-`NA`. אבל כאן `na.rm = TRUE` עובר אל `mean()`, וה-`NA` פשוט לא נכנס לחישוב.',
      2: 'אלה הממוצעים של **העמודות**, כלומר של כל יום, וזה מה ש-`apply(freezers, 2, mean, na.rm = TRUE)` מחשב. `1` פירושו שורות, ולכן מקבלים ממוצע לכל מקפיא.',
      3: 'כך יוצא אם סופרים את ה-`NA` כ-0 ומחלקים ב-3: `(0 + 60 + 90) / 3 = 50`. אבל `na.rm = TRUE` **מוציא** את ה-`NA` מהחישוב, ולכן מחלקים רק ב-2: `(60 + 90) / 2 = 75`.'
    }
  },

  {
    id: 'apply-merge-by-key',
    station: 'apply',
    level: 2,
    context: 'רשימת המלאי ורשימת המקפיא של אותן שלוש דגימות: כמה מבחנות יש מכל דגימה, וכמה ימים היא כבר במקפיא:',
    code: 'stock <- data.frame(sample = c("A3", "S7", "B5"), tubes = c(70, 85, 90))\nfreezer <- data.frame(sample = c("B5", "A3", "S7"), days = c(60, 95, 80))\nboth <- merge(stock, freezer, by = "sample")\nboth[both$sample == "S7", "days"]',
    options: ['95', '80', '85', '60'],
    answer: 1,
    hint: 'איך `merge()` יודע איזו שורה של `freezer` שייכת לאיזו שורה של `stock`? מה `by = "sample"` אומר לו? ובאיזה סדר יוצאות השורות של `both`?',
    explanation: [
      {
        text: '`by = "sample"` אומר ל-`merge()` לחבר שורות שיש להן **אותו קוד דגימה**, לא שורות שנמצאות באותו מקום. `S7` נמצאת בשורה 2 של `stock` (`85`) ובשורה 3 של `freezer` (`80`), ושתי השורות האלה מתחברות. `merge()` גם מסדר את השורות לפי קוד הדגימה:',
        table: {
          columns: ['sample', 'tubes', 'days'],
          rows: [['A3', '70', '95'], ['B5', '90', '60'], ['S7', '85', '80']],
          rowNames: ['1', '2', '3'],
          highlightRows: [2]
        }
      },
      {
        text: '`both$sample == "S7"` בוחר את השורה של `S7`, ו-`"days"` את העמודה `days`:',
        output: '[1] 80'
      }
    ],
    whyWrong: {
      0: '`95` יוצא אם מחברים את הרשימות לפי המקום: `S7` בשורה 2 של `stock`, ובשורה 2 של `freezer` יש `95`, שהוא בעצם המספר של `A3`. כך מחבר `cbind()`, לפי המקום. `merge()` עם `by = "sample"` מחבר לפי קוד הדגימה, ולכן כל מספר מגיע לדגימה הנכונה.',
      2: '`85` הוא מספר המבחנות של `S7`, כלומר מה ש-`both[both$sample == "S7", "tubes"]` מדפיס. כאן מבקשים את העמודה `"days"`.',
      3: '`60` הוא מה ש-`both$days[2]` מדפיס: כאן חשבתם ש-`S7` נשארת בשורה 2, כמו ב-`stock`. אבל `merge()` מסדר את השורות לפי קוד הדגימה, ובשורה 2 של `both` נמצאת `B5`. וחוץ מזה, הקוד לא בוחר שורה לפי מקום: הוא בוחר את השורה שבה הקוד הוא `"S7"`.'
    }
  },

  // ---------- level 3 ----------
  {
    id: 'apply-order-positions',
    station: 'apply',
    level: 3,
    context: 'כמה דקות כל אחת מחמש מבחנות כבר מחכה בתור של הרובוט:',
    code: 'wait <- c(18, 25, 9, 31, 14)\norder(wait, decreasing = TRUE)',
    options: ['31 25 18 14 9', '3 2 5 1 4', '4 2 1 5 3', '3 5 1 2 4'],
    answer: 2,
    hint: 'מה `order()` מחזיר: ערכים, מיקומים או דירוג? ומאיפה מתחילים כשכתוב `decreasing = TRUE`?',
    explanation: [
      {
        text: 'זה הווקטור, עם המיקום של כל מבחנה בתור:',
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
      0: 'אלה המספרים עצמם מהגדול לקטן, כלומר מה ש-`wait[order(wait, decreasing = TRUE)]` מדפיס. `order()` לבד מחזיר רק **מיקומים**, לא ערכים.',
      1: 'זה **הדירוג** של כל מבחנה: `18` הוא השלישי בגודלו, `25` השני, `9` החמישי, וכן הלאה. `order()` עונה על שאלה אחרת: באיזה מיקום נמצא המספר שבא ראשון, באיזה נמצא השני, וכן הלאה. המספר הגדול ביותר, `31`, נמצא במיקום 4, ולכן הפלט מתחיל ב-`4`.',
      3: 'זה מה ש-`order(wait)` מדפיס, בלי `decreasing = TRUE`: מיקומים מהקטן לגדול (קודם `9`, שנמצא במיקום 3). כאן כתוב `decreasing = TRUE`, ולכן מתחילים מהגדול.'
    }
  },

  {
    id: 'apply-matrix-row-max',
    station: 'apply',
    level: 3,
    context: 'כמה מ"ל יש בכל מבחנה במתקן קטן של הרובוט, עם 2 שורות ו-3 עמודות:',
    code: 'rack <- matrix(c(4, 9, 7, 2, 5, 8), nrow = 2)\napply(rack, 1, max)',
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
        text: '`1` ב-`apply()` אומר "לפי שורות", ולכן R מחשב `max()` לכל שורה של המתקן. בשורה 1 (`4 7 5`) המקסימום הוא `7`, ובשורה 2 (`9 2 8`) הוא `9`:',
        output: '[1] 7 9'
      }
    ],
    whyWrong: {
      0: 'אלה המקסימום של כל **עמודה**, כלומר מה ש-`apply(rack, 2, max)` מדפיס. `1` פירושו שורות, ולכן יש רק 2 תוצאות, אחת לכל שורה.',
      1: '`9` הוא המספר הגדול ביותר בכל המתקן, כלומר מה ש-`max(rack)` מדפיס. `apply()` מחשב `max()` לכל שורה בנפרד ומחזיר תוצאה לכל שורה.',
      2: 'זה מה שיוצא אם ממלאים את המטריצה שורה אחרי שורה, עם `byrow = TRUE`: אז השורות הן `4 9 7` ו-`2 5 8`. בלי `byrow = TRUE`, R ממלא עמודה אחרי עמודה, ולכן השורה הראשונה היא `4 7 5`.'
    }
  },

  {
    id: 'apply-mixed-to-text',
    station: 'apply',
    level: 3,
    context: 'הרובוט קורא את רשימת המבחנות שבמגש: התווית של כל מבחנה, וכמה מ"ל יש בה:',
    code: 'tray <- data.frame(\n  tube = c("A1", "B2", "C3"),\n  ml = c(12, 30, 18)\n)\nlow <- apply(tray, 2, min)\nlow["ml"] + 1',
    options: ['שגיאה (Error)', '13', '"121"', 'NA'],
    answer: 0,
    hint: 'מה `apply()` עושה לטבלה לפני שהוא מתחיל לעבוד? ומה זה אומר על הערכים בעמודה `ml`?',
    explanation: [
      {
        text: '`apply()` הופך את הטבלה ל**מטריצה** לפני שהוא מתחיל. במטריצה כל הערכים מאותו סוג, ויש כאן עמודה של טקסט (התוויות), ולכן גם המספרים הופכים לטקסט:',
        table: {
          columns: ['tube', 'ml'],
          rows: [['"A1"', '"12"'], ['"B2"', '"30"'], ['"C3"', '"18"']],
          rowNames: ['[1,]', '[2,]', '[3,]']
        }
      },
      {
        text: '`min()` רץ על כל עמודה (על טקסט הוא בוחר לפי סדר האלף-בית). בעמודה `ml` הוא מחזיר `"12"`, אבל כטקסט, עם מירכאות. כך נראה `low`:',
        vector: { values: ['"A1"', '"12"'], marks: ['', 'on'], labels: ['tube', 'ml'] }
      },
      {
        text: '`low["ml"]` הוא הטקסט `"12"`, ואי אפשר לחבר מספר לטקסט. לכן R עוצר עם שגיאה:',
        output: 'Error in low["ml"] + 1 : non-numeric argument to binary operator'
      }
    ],
    whyWrong: {
      1: '`13` יוצא אם `ml` נשארת עמודה של מספרים, כמו ב-`lapply(tray, min)$ml + 1` (`lapply()` לא הופך את הטבלה למטריצה). אבל `apply()` כן הופך אותה למטריצה, ובגלל העמודה `tube` כל הערכים הופכים לטקסט, גם המספרים.',
      2: 'ב-R הסימן `+` לא מדביק טקסטים זה לזה (כמו שקורה בחלק משפות התכנות האחרות). כדי להדביק משתמשים ב-`paste()`. `"12" + 1` הוא חשבון על טקסט, ולכן R עוצר עם שגיאה.',
      3: 'נכון שכשמפעילים `apply()` עם `mean()` על טבלה עם טקסט מקבלים `NA` (ואזהרה), אבל `min()` עובד גם על טקסט ומחזיר `"12"`. הבעיה מגיעה רק בשורה האחרונה: `"12" + 1` הוא חשבון על טקסט, וזו שגיאה.'
    }
  },

  // ---------- level 1 ----------
  {
    id: 'apply-lapply-gives-list',
    station: 'apply',
    level: 1,
    context: 'הרובוט ספר כמה מבחנות וכמה ארגזים יש בשלושה חדרים במעבדה:',
    code: 'counts <- data.frame(\n  tubes = c(8, 9, 7),\n  boxes = c(6, 5, 7)\n)\nres <- lapply(counts, mean)\nclass(res)',
    options: ['"numeric"', '"list"', '"data.frame"', '"matrix" "array"'],
    answer: 1,
    hint: 'ב-`res` נשמרו כמה תוצאות של `mean()`. באיזה מבנה `lapply()` אוסף אותן?',
    explanation: [
      {
        text: '`lapply()` עובר על כל **עמודה** בטבלה ומפעיל עליה את `mean()`. יוצאות 2 תוצאות, אחת לכל עמודה:',
        vector: { values: ['8', '6'], marks: ['', ''], labels: ['tubes', 'boxes'] }
      },
      {
        text: '`lapply()` אוסף את התוצאות ב**רשימה** (list), ולכל תוצאה יש את השם של העמודה שלה. `class()` מחזיר את הסוג של `res`:',
        output: '[1] "list"'
      }
    ],
    whyWrong: {
      0: 'זה מה ש-`class(apply(counts, 2, mean))` מדפיס: `apply()` מחזיר וקטור של מספרים. `lapply()` מחזיר תמיד **רשימה** (list), גם כשכל תוצאה בה היא מספר.',
      2: 'זה מה ש-`class(counts)` מדפיס, כלומר הסוג של הטבלה עצמה. `res` היא לא הטבלה: יש בה רק את התוצאות של `mean()`, והן שמורות ברשימה.',
      3: 'זה מה ש-`class(as.matrix(counts))` מדפיס. נכון ש-`apply()` הופך טבלה למטריצה לפני שהוא מתחיל, אבל `lapply()` לא עושה את זה. ומה שנשמר ב-`res` הוא רק התוצאות, ברשימה.'
    }
  },

  {
    id: 'apply-count-true-rows',
    station: 'apply',
    level: 1,
    context: 'הרובוט בדק שני מתקנים, עם 4 מקומות בכל אחד. `TRUE` פירושו שיש מבחנה במקום:',
    code: 'slots <- rbind(c(TRUE, FALSE, TRUE, TRUE),\n               c(FALSE, FALSE, TRUE, FALSE))\napply(slots, 1, sum)',
    options: ['1 0 2 1', '4', 'שגיאה (Error), כי אי אפשר לחבר `TRUE` ו-`FALSE`', '3 1'],
    answer: 3,
    hint: 'מה `sum()` עושה עם `TRUE` ועם `FALSE`? ועל מה `1` עובר?',
    explanation: [
      {
        text: '`rbind()` שם כל וקטור כ**שורה**: השורה הראשונה היא המתקן הראשון, והשנייה היא המתקן השני:',
        table: {
          columns: ['[,1]', '[,2]', '[,3]', '[,4]'],
          rows: [['TRUE', 'FALSE', 'TRUE', 'TRUE'], ['FALSE', 'FALSE', 'TRUE', 'FALSE']],
          rowNames: ['[1,]', '[2,]']
        }
      },
      {
        text: '`1` אומר "לפי שורות". כש-`sum()` מחבר ערכים לוגיים, כל `TRUE` נספר כ-1 וכל `FALSE` כ-0. כך `sum()` סופר כמה `TRUE` יש בכל שורה, כלומר כמה מבחנות יש בכל מתקן:',
        vector: { values: ['3', '1'], marks: ['on', 'on'], labels: ['1+0+1+1', '0+0+1+0'] }
      },
      {
        text: 'יוצא מספר אחד לכל מתקן:',
        output: '[1] 3 1'
      }
    ],
    whyWrong: {
      0: 'אלה הסכומים של כל **עמודה** (כל מקום), כלומר מה ש-`apply(slots, 2, sum)` מדפיס. `1` פירושו שורות, ולכן מקבלים מספר אחד לכל מתקן.',
      1: '`4` הוא מספר כל ה-`TRUE` במטריצה, כלומר מה ש-`sum(slots)` מדפיס. `apply()` סופר בכל שורה בנפרד ומחזיר תוצאה לכל שורה.',
      2: '`sum()` עובד גם על ערכים לוגיים: כל `TRUE` נחשב 1 וכל `FALSE` נחשב 0. כך בדיוק סופרים כמה פעמים משהו קרה.'
    }
  },

  {
    id: 'apply-merge-dim',
    station: 'apply',
    level: 1,
    context: 'שתי רשימות על אותם שלושה אנשי צוות: באיזה חדר כל אחד עובד, וכמה מבחנות הוא הכניס היום לתור של הרובוט:',
    code: 'shifts <- data.frame(name = c("Gal", "Ido", "Shir"), room = c(3, 5, 3))\nsent <- data.frame(name = c("Gal", "Ido", "Shir"), tubes = c(9, 12, 10))\nteam <- merge(shifts, sent, by = "name")\ndim(team)',
    options: ['3 3', '3 4', '6 2', '3 2'],
    answer: 0,
    hint: 'איך `merge()` מחבר את שתי הטבלאות: זו לצד זו, או זו מתחת לזו? ומה קורה לעמודה ששתיהן משתפות?',
    explanation: [
      {
        text: '`merge()` מחבר את הטבלאות **זו לצד זו**: כל שורה של `shifts` מתחברת לשורה של `sent` שיש לה אותו `name`. העמודה `name` משמשת לחיבור, ולכן היא מופיעה **פעם אחת**, ואחריה העמודות האחרות של שתי הטבלאות:',
        table: {
          columns: ['name', 'room', 'tubes'],
          rows: [['Gal', '3', '9'], ['Ido', '5', '12'], ['Shir', '3', '10']],
          rowNames: ['1', '2', '3']
        }
      },
      {
        text: '`dim()` מחזיר קודם את מספר השורות (3 אנשי צוות) ואחר כך את מספר העמודות (3):',
        output: '[1] 3 3'
      }
    ],
    whyWrong: {
      1: 'זה מה ש-`dim(cbind(shifts, sent))` מדפיס: `cbind()` פשוט מצמיד את כל העמודות, ולכן `name` מופיעה פעמיים. `merge()` משתמש ב-`name` כדי להתאים בין השורות, ושומר אותה רק פעם אחת.',
      2: 'כאן חשבתם ש-`merge()` שם את הטבלה השנייה **מתחת** לראשונה, כמו `rbind()`. אבל `merge()` מחבר את הטבלאות זו לצד זו: כל איש צוות נשאר בשורה אחת, ונוספות לו עמודות.',
      3: 'כאן חשבתם שהעמודה שב-`by` נעלמת אחרי החיבור. היא לא נעלמת: היא נשארת בטבלה, פעם אחת, כדי שיהיה ברור של מי כל שורה.'
    }
  },

  {
    id: 'apply-new-column-dim',
    station: 'apply',
    level: 1,
    context: 'כמה פעמים הרובוט נכנס לכל אחד מארבעה חדרים במעבדה, ביום ראשון וביום שני. כל שורה היא חדר:',
    code: 'visits <- data.frame(\n  sun = c(3, 5, 2, 4),\n  mon = c(6, 7, 4, 9)\n)\nvisits$most <- apply(visits, 1, max)\ndim(visits)',
    options: ['4 2', '5 2', '4 3', '3 4'],
    answer: 2,
    hint: 'כמה מספרים `apply(visits, 1, max)` מחזיר? ומה קורה לטבלה כששומרים אותם ב-`visits$most`?',
    explanation: [
      {
        text: 'בהתחלה יש בטבלה 4 שורות (חדרים) ו-2 עמודות (ימים). `1` אומר "לפי שורות", ולכן `apply()` מחזיר מספר אחד לכל חדר, כלומר 4 מספרים:',
        vector: { values: ['6', '7', '4', '9'], marks: ['on', 'on', 'on', 'on'], labels: ['max(3, 6)', 'max(5, 7)', 'max(2, 4)', 'max(4, 9)'] }
      },
      {
        text: '`visits$most <- ...` שומר את 4 המספרים בעמודה **חדשה** בשם `most`. עכשיו הטבלה נראית כך:',
        table: {
          columns: ['sun', 'mon', 'most'],
          rows: [['3', '6', '6'], ['5', '7', '7'], ['2', '4', '4'], ['4', '9', '9']],
          rowNames: ['1', '2', '3', '4']
        }
      },
      {
        text: '`dim()` מחזיר קודם את מספר השורות ואחר כך את מספר העמודות. השורות לא השתנו, ונוספה עמודה אחת:',
        output: '[1] 4 3'
      }
    ],
    whyWrong: {
      0: 'זה מה ש-`dim(visits)` מדפיס **לפני** השורה עם `apply()`. השמירה ב-`visits$most` מוסיפה לטבלה עמודה חדשה, ולכן יש עכשיו 3 עמודות.',
      1: 'כאן חשבתם שנוספה **שורה** של תוצאות בתחתית הטבלה. אבל `visits$most <-` יוצר **עמודה** חדשה: בכל שורה נכתב המקסימום של אותה שורה, ומספר השורות נשאר 4.',
      3: 'אלה המספרים הנכונים בסדר הפוך. `dim()` מחזיר קודם את מספר **השורות** (4) ורק אחר כך את מספר העמודות (3).'
    }
  },

  // ---------- level 2 ----------
  {
    id: 'apply-number-columns-only',
    station: 'apply',
    level: 2,
    context: 'כמה מבחנות מכל דגימה הרובוט הוציא מהמקפיא ביום ראשון וביום שני:',
    code: 'stock <- data.frame(\n  sample = c("S1", "S2", "S3"),\n  sun = c(14, 6, 3),\n  mon = c(12, 7, 5)\n)\napply(stock[, 2:3], 1, sum)',
    options: ['26 13 8', 'שגיאה (Error), כי בטבלה יש עמודה של טקסט', '23 24', '47'],
    answer: 0,
    hint: 'אילו עמודות נשארות ב-`stock[, 2:3]`? ואחרי זה: על מה `1` עובר?',
    explanation: [
      {
        text: '`stock[, 2:3]` לוקח את כל השורות, ורק את העמודות 2 ו-3. עמודת הטקסט `sample` (עמודה 1) לא נכנסת:',
        table: {
          columns: ['sun', 'mon'],
          rows: [['14', '12'], ['6', '7'], ['3', '5']],
          rowNames: ['1', '2', '3']
        }
      },
      {
        text: 'נשארו רק מספרים, ולכן `apply()` עובד בלי בעיה. `1` אומר "לפי שורות", ו-`sum()` מחבר את שני הימים של כל דגימה:',
        vector: { values: ['26', '13', '8'], marks: ['on', 'on', 'on'], labels: ['14 + 12', '6 + 7', '3 + 5'] }
      },
      {
        text: 'יוצא סכום אחד לכל דגימה:',
        output: '[1] 26 13  8'
      }
    ],
    whyWrong: {
      1: 'נכון ש-`apply(stock, 1, sum)` נעצר עם שגיאה: בגלל העמודה `sample`, `apply()` הופך את כל הטבלה לטקסט. אבל כאן `apply()` מקבל רק את `stock[, 2:3]`, בלי `sample`, ובעמודות האלה יש רק מספרים.',
      2: 'אלה הסכומים של כל **עמודה** (כל יום), ו-`apply(stock[, 2:3], 2, sum)` מחשב אותם. `1` פירושו שורות, ולכן מקבלים סכום לכל דגימה.',
      3: 'זה הסכום של כל המספרים יחד, כלומר מה ש-`sum(stock[, 2:3])` מדפיס. `apply()` מחשב סכום נפרד לכל שורה.'
    }
  },

  {
    id: 'apply-length-with-na',
    station: 'apply',
    level: 2,
    context: 'כמה דגימות הגיעו מכל אחת משלוש שכונות (השורות) בארבעה ימים. חלק מהדיווחים לא הגיעו לרובוט (`NA`):',
    code: 'arrived <- data.frame(\n  sun = c(12, NA, 30),\n  mon = c(NA, NA, 25),\n  tue = c(8, 14, 20),\n  wed = c(5, 9, NA)\n)\napply(arrived, 1, length)',
    options: ['3 2 3', 'NA NA NA', '4 4 4', '3 3 3 3'],
    answer: 2,
    hint: 'מה `length()` מחזיר כשיש `NA` בווקטור? חשבו למשל על `length(c(5, NA))`.',
    explanation: [
      {
        text: 'כך נראית הטבלה. כל שורה היא שכונה:',
        table: {
          columns: ['sun', 'mon', 'tue', 'wed'],
          rows: [['12', 'NA', '8', '5'], ['NA', 'NA', '14', '9'], ['30', '25', '20', 'NA']],
          rowNames: ['1', '2', '3']
        }
      },
      {
        text: '`1` אומר "לפי שורות", ולכן `length()` רץ על כל שורה. `length()` לא מחשב כלום עם הערכים: הוא רק סופר כמה איברים יש. `NA` הוא איבר כמו כל איבר אחר (מקום שהערך שלו חסר), ולכן גם הוא נספר. בכל שורה יש 4 איברים:',
        vector: { values: ['4', '4', '4'], marks: ['on', 'on', 'on'], labels: ['12 NA 8 5', 'NA NA 14 9', '30 25 20 NA'] }
      },
      {
        text: 'יוצא מספר אחד לכל שכונה:',
        output: '[1] 4 4 4'
      }
    ],
    whyWrong: {
      0: 'כך סופרים רק את הדיווחים שהגיעו, כמו ש-`apply(!is.na(arrived), 1, sum)` מדפיס. `length()` סופר את **כל** האיברים בשורה, גם את ה-`NA`.',
      1: 'זה מה ש-`apply(arrived, 1, sum)` מדפיס: ב-`sum()` כל `NA` הופך את התוצאה ל-`NA`. אבל `length()` לא מחשב עם הערכים, הוא רק סופר אותם, ולכן `NA` לא מפריע לו.',
      3: 'זה האורך של כל **עמודה** (3 שכונות בכל יום), ו-`apply(arrived, 2, length)` מחשב אותו. `1` פירושו שורות, ולכן יש 3 תוצאות, אחת לכל שכונה.'
    }
  },

  {
    id: 'apply-which-rows',
    station: 'apply',
    level: 2,
    context: 'כמה מבחנות חיכו לרובוט בשלושה חדרים (השורות), בשלושה ימים (העמודות):',
    code: 'queue <- data.frame(\n  sun = c(21, 19, 17),\n  mon = c(25, 19, 20),\n  tue = c(23, 22, 26)\n)\nbusy <- apply(queue, 1, max) >= 24\nwhich(busy)',
    options: ['25 26', '1 3', 'TRUE FALSE TRUE', '2 3'],
    answer: 1,
    hint: 'עבדו לפי הסדר: מה `apply(queue, 1, max)` מחזיר? מה נשמר ב-`busy`? ומה `which()` עושה עם מה שנשמר?',
    explanation: [
      {
        text: '`1` אומר "לפי שורות", ולכן `apply()` מחזיר את התור הארוך ביותר בכל **חדר**:',
        vector: { values: ['25', '22', '26'], marks: ['', '', ''], labels: ['21 25 23', '19 19 22', '17 20 26'], showIndex: true }
      },
      {
        text: 'ההשוואה `>= 24` בודקת כל אחד מ-3 המספרים, ו-`busy` מקבל `TRUE` או `FALSE` לכל חדר:',
        vector: { values: ['TRUE', 'FALSE', 'TRUE'], marks: ['on', 'off', 'on'], showIndex: true }
      },
      {
        text: '`which()` מחזיר את **המיקומים** שבהם יש `TRUE`, כלומר את מספרי החדרים:',
        output: '[1] 1 3'
      }
    ],
    whyWrong: {
      0: 'אלה התורים הארוכים של החדרים האלה, כלומר מה ש-`apply(queue, 1, max)[busy]` מדפיס. `which()` לא מחזיר את הערכים, אלא את **המיקומים** שבהם יש `TRUE`.',
      2: 'זה `busy` עצמו, כלומר מה שהשורה `busy` לבדה הייתה מדפיסה. `which()` לוקח את הווקטור הזה ומחזיר רק את המיקומים של ה-`TRUE` שבו.',
      3: 'אלה המספרים של **העמודות** (הימים) שהגיעו ל-`24`, ו-`which(apply(queue, 2, max) >= 24)` מוצא אותם. `1` פירושו שורות, ולכן `which()` מחזיר מספרים של **חדרים**.'
    }
  },

  // ---------- level 3 ----------
  {
    id: 'apply-max-of-row-mins',
    station: 'apply',
    level: 3,
    context: 'שלושה אנשי צוות ספרו את המבחנות בארבעה ארגזים, וכל אחד קיבל מספר קצת אחר. כל שורה היא ארגז:',
    code: 'recount <- data.frame(\n  Tal = c(7, 9, 6, 8),\n  Ori = c(9, 6, 8, 8),\n  Hila = c(5, 8, 10, 9)\n)\nmax(apply(recount, 1, min))',
    options: ['6', '10', '9', '8'],
    answer: 3,
    hint: 'עבדו מבפנים החוצה: מה `apply(recount, 1, min)` מחזיר? רק אחר כך הפעילו `max()` על התוצאה.',
    explanation: [
      {
        text: 'כך נראית הטבלה:',
        table: {
          columns: ['Tal', 'Ori', 'Hila'],
          rows: [['7', '9', '5'], ['9', '6', '8'], ['6', '8', '10'], ['8', '8', '9']],
          rowNames: ['1', '2', '3', '4']
        }
      },
      {
        text: 'R מתחיל מבפנים, מ-`apply(recount, 1, min)`. `1` אומר "לפי שורות", ולכן מקבלים את הספירה **הנמוכה** של כל ארגז:',
        vector: { values: ['5', '6', '6', '8'], marks: ['', '', '', 'on'], labels: ['7 9 5', '9 6 8', '6 8 10', '8 8 9'] }
      },
      {
        text: 'עכשיו `max()` רץ פעם אחת על ארבעת המספרים האלה ובוחר את הגדול: זה הארגז שאפילו הספירה הנמוכה שלו היא הגבוהה ביותר:',
        output: '[1] 8'
      }
    ],
    whyWrong: {
      0: 'זה מה ש-`max(apply(recount, 2, min))` מדפיס: הספירה הנמוכה של כל **איש צוות** (`6 6 5`), והגדולה מביניהן. `1` פירושו שורות, כלומר הספירה הנמוכה של כל ארגז: `5 6 6 8`.',
      1: '`10` הוא המספר הגבוה ביותר בכל הטבלה, כלומר מה ש-`max(recount)` מדפיס. אבל כאן `max()` לא רץ על הטבלה: הוא רץ על מה ש-`apply()` החזיר, הספירה הנמוכה של כל ארגז.',
      2: 'כאן התפקידים של `max` ושל `min` התחלפו: זה מה ש-`min(apply(recount, 1, max))` מדפיס. בקוד, `min` נמצא בתוך `apply()` ורץ על כל שורה, ו-`max` נמצא בחוץ ורץ פעם אחת על התוצאות.'
    }
  },

  {
    id: 'apply-na-omit-whole-row',
    station: 'apply',
    level: 3,
    context: 'שני משקלים של הרובוט (העמודות) שקלו ארבעה מגשים (השורות), בק"ג. פעם אחת המשקל הראשון לא עבד:',
    code: 'weights <- cbind(c(4, NA, 9, 6), c(7, 1, 12, 5))\napply(na.omit(weights), 2, min)',
    options: ['4 1', 'NA 1', '4 5', '4 9 5'],
    answer: 2,
    hint: 'לפני ש-`apply()` מתחיל, `na.omit()` כבר משנה את המטריצה. ציירו איך היא נראית אחריו.',
    explanation: [
      {
        text: '`cbind()` שם כל וקטור כ**עמודה**. כך נראית המטריצה:',
        table: {
          columns: ['[,1]', '[,2]'],
          rows: [['4', '7'], ['NA', '1'], ['9', '12'], ['6', '5']],
          rowNames: ['[1,]', '[2,]', '[3,]', '[4,]'],
          highlightRows: [1]
        }
      },
      {
        text: '`na.omit()` מוחק כל **שורה** שיש בה `NA`, את כל השורה. לכן גם ה-`1` שבשורה 2 נמחק, אף שהוא לא חסר. נשארות 3 שורות:',
        table: {
          columns: ['[,1]', '[,2]'],
          rows: [['4', '7'], ['9', '12'], ['6', '5']],
          rowNames: ['[1,]', '[2,]', '[3,]']
        }
      },
      {
        text: '`2` אומר "לפי עמודות". המינימום של העמודה הראשונה (`4 9 6`) הוא `4`, ושל השנייה (`7 12 5`) הוא `5`:',
        output: '[1] 4 5'
      }
    ],
    whyWrong: {
      0: 'זה מה ש-`apply(weights, 2, min, na.rm = TRUE)` מדפיס: `na.rm = TRUE` מדלג רק על ה-`NA` עצמו. `na.omit()` מוחק את כל השורה שיש בה `NA`, ולכן גם ה-`1` שבעמודה השנייה כבר לא שם.',
      1: 'זה מה ש-`apply(weights, 2, min)` מדפיס, בלי `na.omit()`: ה-`NA` הופך את המינימום של העמודה הראשונה ל-`NA`. כאן `na.omit()` מוחק את השורה עם ה-`NA` עוד לפני ש-`apply()` מתחיל.',
      3: 'אלה המינימום של כל **שורה** שנשארה, כלומר מה ש-`apply(na.omit(weights), 1, min)` מדפיס. `2` פירושו עמודות, ולכן יש רק 2 תוצאות.'
    }
  },

  {
    id: 'apply-mean-includes-total',
    station: 'apply',
    level: 3,
    context: 'כמה תוויות הרובוט הדפיס לשלושה מתקני מבחנות, בשני סבבים:',
    code: 'printed <- data.frame(\n  round1 = c(3, 6, 2),\n  round2 = c(9, 2, 5)\n)\nprinted$total <- apply(printed, 1, sum)\nprinted$avg <- apply(printed, 1, mean)\nprinted$avg[1]',
    options: ['8', '6', '12', '8.000000 5.333333 4.666667'],
    answer: 0,
    hint: 'כמה עמודות יש ב-`printed` ברגע ש-`apply()` השני מתחיל לרוץ?',
    explanation: [
      {
        text: '`apply()` הראשון מחשב סכום לכל מתקן ושומר אותו בעמודה חדשה, `total`. מעכשיו יש בטבלה **3** עמודות:',
        table: {
          columns: ['round1', 'round2', 'total'],
          rows: [['3', '9', '12'], ['6', '2', '8'], ['2', '5', '7']],
          rowNames: ['1', '2', '3'],
          highlightRows: [0]
        }
      },
      {
        text: '`apply()` השני רץ על הטבלה **כמו שהיא עכשיו**, כולל העמודה `total`. לכן כל ממוצע הוא של 3 מספרים:',
        vector: { values: ['8', '5.333333', '4.666667'], marks: ['on', '', ''], labels: ['(3+9+12)/3', '(6+2+8)/3', '(2+5+7)/3'] }
      },
      {
        text: '`printed$avg[1]` הוא הממוצע של המתקן הראשון:',
        output: '[1] 8'
      }
    ],
    whyWrong: {
      1: '`6` הוא הממוצע של שני הסבבים בלבד, `(3 + 9) / 2`, כלומר מה ש-`apply(printed[, 1:2], 1, mean)[1]` מדפיס. אבל כש-`apply()` השני רץ, כבר יש בטבלה גם את העמודה `total`, והיא נכנסת לממוצע.',
      2: '`12` הוא הסכום של המתקן הראשון, כלומר מה ש-`printed$total[1]` מדפיס. `printed$avg` היא עמודה אחרת: הממוצע של כל העמודות בשורה.',
      3: 'זו כל העמודה `avg`, כלומר מה ש-`printed$avg` מדפיס. `[1]` לוקח ממנה רק את הערך הראשון, של המתקן הראשון.'
    }
  },

  // ---------- level 1 ----------
  {
    id: 'apply-collapse-between',
    station: 'apply',
    level: 1,
    context: 'אלה שלוש המשימות של הרובוט להיום:',
    code: 'tasks <- c("scan", "sort", "pack")\npaste(tasks, collapse = " + ")',
    options: ['"scan + sort + pack"', '"scan" "sort" "pack"', '"scan + sort + pack +"', '"scan+sort+pack"'],
    answer: 0,
    hint: 'מה `collapse` עושה לכמה טקסטים שבאים מאותו וקטור? ואיפה בדיוק הוא שם את `" + "`?',
    explanation: [
      {
        text: 'ב-`tasks` יש 3 טקסטים נפרדים:',
        vector: { values: ['"scan"', '"sort"', '"pack"'], marks: ['', '', ''], showIndex: true }
      },
      {
        text: '`collapse = " + "` מדביק אותם לטקסט **אחד**, ושם את `" + "` רק **בין** כל שני טקסטים, לא אחרי האחרון. גם הרווחים שבתוך המירכאות נכנסים לטקסט:',
        output: '[1] "scan + sort + pack"'
      }
    ],
    whyWrong: {
      1: 'שלושה טקסטים נפרדים הם מה ש-`tasks` לבד מדפיס (וגם `paste(tasks)`, בלי `collapse`). כאן יש `collapse`, והוא מדביק את שלושת הטקסטים לטקסט אחד.',
      2: '`collapse` שם את המפריד רק **בין** הטקסטים, לא אחרי כל אחד מהם. אחרי `"pack"`, הטקסט האחרון, לא בא כלום.',
      3: 'זה מה ש-`paste(tasks, collapse = "+")` מדפיס, בלי רווחים. כאן המפריד הוא `" + "`, עם רווח לפני ה-`+` ואחריו, ו-R מכניס אותו בדיוק כמו שהוא כתוב, כולל הרווחים.'
    }
  },

  {
    id: 'apply-paste-word-each',
    station: 'apply',
    level: 1,
    context: 'שלושה מתקני מבחנות חדשים הגיעו לחדר של הרובוט:',
    code: 'racks <- c(4, 7, 9)\npaste("Rack", racks)',
    options: ['"Rack 4 7 9"', '"Rack4" "Rack7" "Rack9"', '"Rack 4" "Rack 7" "Rack 9"', '"Rack 4 Rack 7 Rack 9"'],
    answer: 2,
    hint: 'ב-`racks` יש 3 מספרים, ו-`"Rack"` הוא טקסט אחד בלבד. איך `paste()` מחבר ביניהם?',
    explanation: [
      {
        text: '`paste()` מחבר איבר עם איבר. ב-`racks` יש 3 מספרים, ו-`"Rack"` הוא טקסט אחד, ולכן R משתמש בו שוב ושוב, פעם אחת עם כל מספר:',
        vector: { values: ['"Rack"', '"Rack"', '"Rack"'], marks: ['on', 'on', 'on'], labels: ['4', '7', '9'] }
      },
      {
        text: 'כשלא כתוב `sep`, בין החלקים בא רווח. אין כאן `collapse`, ולכן נשארים 3 טקסטים נפרדים, שלט לכל מתקן:',
        output: '[1] "Rack 4" "Rack 7" "Rack 9"'
      }
    ],
    whyWrong: {
      0: '`paste()` לא מכניס את כל הווקטור פעם אחת אחרי המילה. הוא מחבר את `"Rack"` עם **כל** מספר בנפרד, ולכן יוצאים 3 טקסטים, ובכל אחד מהם מופיעה המילה `Rack`.',
      1: 'זה מה ש-`paste("Rack", racks, sep = "")` מדפיס. כשלא כתוב `sep`, `paste()` שם **רווח** בין החלקים, ולכן יש רווח בין `Rack` למספר.',
      3: 'זה מה ש-`paste("Rack", racks, collapse = " ")` מדפיס. רק `collapse` מדביק כמה טקסטים לטקסט אחד, וכאן אין `collapse`, ולכן נשארים 3 טקסטים נפרדים.'
    }
  },

  {
    id: 'apply-order-index-values',
    station: 'apply',
    level: 1,
    context: 'כמה דקות לוקח לרובוט לטפל בכל אחד מארבעה מגשים:',
    code: 'minutes <- c(28, 19, 31, 24)\nminutes[order(minutes)]',
    options: ['2 4 1 3', '19 24 28 31', '31 28 24 19', '3 1 4 2'],
    answer: 1,
    hint: 'קודם חשבו מה `order(minutes)` מחזיר. אחר כך: מה קורה כששמים את זה בתוך `minutes[ ]`?',
    explanation: [
      {
        text: 'זה הווקטור, עם המיקום של כל מספר:',
        vector: { values: ['28', '19', '31', '24'], marks: ['', '', '', ''], showIndex: true }
      },
      {
        text: '`order(minutes)` מחזיר את **המיקומים** מהקטן לגדול: `19` במיקום 2, `24` במיקום 4, `28` במיקום 1 ו-`31` במיקום 3:',
        vector: { values: ['2', '4', '1', '3'], marks: ['on', 'on', 'on', 'on'], labels: ['19', '24', '28', '31'] }
      },
      {
        text: '`minutes[ ]` שולף את הערכים שבמיקומים האלה, לפי הסדר הזה. כך מקבלים את הזמנים מהקצר לארוך:',
        output: '[1] 19 24 28 31'
      }
    ],
    whyWrong: {
      0: 'אלה המיקומים, כלומר מה ש-`order(minutes)` לבד מדפיס. כאן המיקומים נמצאים בתוך `minutes[ ]`, ולכן R שולף את **הערכים** שבמיקומים האלה.',
      2: 'זה הסדר מהארוך לקצר, כלומר מה ש-`minutes[order(minutes, decreasing = TRUE)]` מדפיס. בלי `decreasing = TRUE`, `order()` מתחיל מהקטן.',
      3: 'אלה **המקומות** שכל מגש מקבל בתור מהקצר לארוך: `28` הוא השלישי, `19` הראשון, וכן הלאה. אבל `minutes[order(minutes)]` לא מדפיס מקומות: הוא מדפיס את הזמנים עצמם, מסודרים.'
    }
  },

  // ---------- level 2 ----------
  {
    id: 'apply-sep-one-vector',
    station: 'apply',
    level: 2,
    context: 'לכל אחת משלוש המבחנות במגש של הרובוט יש פקק בצבע אחר:',
    code: 'caps <- c("red", "blue", "green")\npaste(caps, sep = "-")',
    options: ['"red-blue-green"', '"red-" "blue-" "green-"', '"red blue green"', '"red" "blue" "green"'],
    answer: 3,
    hint: 'בין מה למה `sep` מפריד? וכמה חלקים `paste()` קיבל כאן?',
    explanation: [
      {
        text: '`sep` הוא מה שבא בין **החלקים** ש-`paste()` מקבל, כמו ב-`paste("A", "B", sep = "-")`. כאן `paste()` קיבל רק חלק אחד: הווקטור `caps`:',
        vector: { values: ['"red"', '"blue"', '"green"'], marks: ['', '', ''], showIndex: true }
      },
      {
        text: 'אין חלק נוסף להדביק אליו, ולכן `sep` לא מוסיף כלום. אין גם `collapse`, ולכן 3 הטקסטים לא מודבקים זה לזה. הם יוצאים בדיוק כמו שהיו:',
        output: '[1] "red"   "blue"  "green"'
      }
    ],
    whyWrong: {
      0: 'זה מה ש-`paste(caps, collapse = "-")` מדפיס. רק `collapse` מדביק את האיברים של וקטור אחד לטקסט אחד. `sep` מפריד בין **חלקים** שונים של `paste()`, וכאן יש רק חלק אחד.',
      1: 'זה מה ש-`paste(caps, "-", sep = "")` מדפיס: שם `"-"` הוא חלק שני, ו-R מחבר אותו לכל צבע. כאן `"-"` הוא רק המפריד, ואין חלק שני שצריך להפריד ממנו.',
      2: '`paste()` לא מדביק מעצמו את האיברים של וקטור לטקסט אחד. זה קורה רק עם `collapse`, כמו ב-`paste(caps, collapse = " ")`. בלי `collapse` נשארים 3 טקסטים.'
    }
  },

  {
    id: 'apply-nchar-collapsed',
    station: 'apply',
    level: 2,
    context: 'אלה השכונות שבהן הוואן של המעבדה יעצור היום:',
    code: 'stops <- c("Port", "Hills", "Park")\nroute <- paste(stops, collapse = ", ")\nnchar(route)',
    options: ['13', '17', '4 5 4', '15'],
    answer: 1,
    hint: 'כתבו לעצמכם את `route` בדיוק כמו ש-R שומר אותו, תו אחרי תו. מה `nchar()` סופר?',
    explanation: [
      {
        text: '`collapse = ", "` מדביק את 3 השמות לטקסט **אחד**, ושם פסיק ורווח בין כל שניים. ב-`route` נשמר `"Port, Hills, Park"`. מתחת לכל חלק כתוב כמה תווים יש בו:',
        vector: { values: ['"Port"', '", "', '"Hills"', '", "', '"Park"'], marks: ['', 'on', '', 'on', ''], labels: ['4', '2', '5', '2', '4'] }
      },
      {
        text: '`nchar()` סופר את **כל** התווים בטקסט: האותיות, וגם הפסיקים והרווחים. `4 + 2 + 5 + 2 + 4 = 17`:',
        output: '[1] 17'
      }
    ],
    whyWrong: {
      0: '`13` הוא מספר האותיות בלבד (`4 + 5 + 4`). אבל `collapse` הכניס לטקסט גם פסיק ורווח בין השמות, ו-`nchar()` סופר גם אותם: עוד 4 תווים.',
      2: 'זה מה ש-`nchar(stops)` מדפיס: מספר לכל שכונה בנפרד. אבל `route` הוא טקסט **אחד** (בזכות `collapse`), ולכן `nchar(route)` מחזיר מספר אחד.',
      3: '`15` יוצא אם סופרים את הפסיקים ושוכחים את הרווחים. המפריד הוא `", "`, פסיק **וגם** רווח, כלומר 2 תווים בכל פעם, ו-`nchar()` סופר גם את הרווח.'
    }
  },

  {
    id: 'apply-lapply-keeps-type',
    station: 'apply',
    level: 2,
    context: 'רשימת המקפיא שהרובוט קורא: הקוד של כל דגימה, וכמה מבחנות יש ממנה:',
    code: 'freezer <- data.frame(\n  sample = c("A7", "S2", "B4"),\n  tubes = c(80, 250, 45)\n)\nkinds <- lapply(freezer, class)\nkinds$tubes',
    options: ['"numeric"', '"character"', '"list"', '80 250 45'],
    answer: 0,
    hint: 'האם `lapply()` משנה את הטבלה לפני שהוא מתחיל, כמו ש-`apply()` עושה? ועל מה `class()` רץ בכל פעם?',
    explanation: [
      {
        text: '`lapply()` עובר על כל **עמודה** בנפרד, כמו שהיא בטבלה. הוא **לא** הופך את הטבלה למטריצה, ולכן כל עמודה שומרת על הסוג שלה. על כל עמודה הוא מפעיל `class()`:',
        vector: { values: ['"character"', '"numeric"'], marks: ['', 'on'], labels: ['sample', 'tubes'] }
      },
      {
        text: 'ב-`kinds` נשמרה רשימה עם תוצאה לכל עמודה. `kinds$tubes` שולף את התוצאה של העמודה `tubes`:',
        output: '[1] "numeric"'
      }
    ],
    whyWrong: {
      1: 'זה מה ש-`apply(freezer, 2, class)` נותן לעמודה `tubes`: `apply()` הופך קודם את הטבלה למטריצה, ובגלל העמודה `sample` הכל הופך לטקסט. `lapply()` לא עושה את זה: הוא עובר על כל עמודה כמו שהיא, ולכן העמודות יכולות להיות מסוגים שונים.',
      2: '`"list"` הוא הסוג של `kinds` עצמה, כלומר מה ש-`class(kinds)` מדפיס. `kinds$tubes` שולף מתוך הרשימה רק את מה ש-`class()` החזיר לעמודה `tubes`.',
      3: 'אלה הערכים של העמודה, כלומר מה ש-`freezer$tubes` מדפיס. אבל `kinds` היא לא הטבלה: יש בה את התוצאה של `class()` על כל עמודה, כלומר את **הסוג** של העמודה.'
    }
  },

  {
    id: 'apply-order-text-column',
    station: 'apply',
    level: 2,
    context: 'כמה מבחנות ריקות כל שכונה הזמינה מהרובוט:',
    code: 'orders <- data.frame(\n  area = c("Port", "Center", "South", "Market"),\n  tubes = c(12, 40, 6, 8)\n)\nbyname <- orders[order(orders$area), ]\nbyname[1, "tubes"]',
    options: ['12', '6', '40', '"Center"'],
    answer: 2,
    hint: 'לפי מה `order()` מסדר כשהוא מקבל עמודה של טקסט? ואיזו שורה תהיה ראשונה ב-`byname`?',
    explanation: [
      {
        text: 'כך נראית הטבלה:',
        table: {
          columns: ['area', 'tubes'],
          rows: [['Port', '12'], ['Center', '40'], ['South', '6'], ['Market', '8']],
          rowNames: ['1', '2', '3', '4']
        }
      },
      {
        text: '`orders$area` היא עמודה של טקסט, ולכן `order()` מסדר לפי **סדר האלף-בית**: `Center` (שורה 2), `Market` (שורה 4), `Port` (שורה 1) ו-`South` (שורה 3):',
        vector: { values: ['2', '4', '1', '3'], marks: ['on', '', '', ''], labels: ['Center', 'Market', 'Port', 'South'] }
      },
      {
        text: 'השורות זזות **שלמות**: כל שכונה זזה יחד עם מספר המבחנות שלה. כך נראית `byname`:',
        table: {
          columns: ['area', 'tubes'],
          rows: [['Center', '40'], ['Market', '8'], ['Port', '12'], ['South', '6']],
          rowNames: ['2', '4', '1', '3'],
          highlightRows: [0]
        }
      },
      {
        text: '`byname[1, "tubes"]` לוקח את מספר המבחנות בשורה הראשונה של `byname`, השורה של `Center`:',
        output: '[1] 40'
      }
    ],
    whyWrong: {
      0: '`12` נמצא בשורה הראשונה של הטבלה **המקורית**, כלומר זה מה ש-`orders[1, "tubes"]` מדפיס. אבל `byname` כבר מסודרת לפי שמות השכונות, ושם `Center` באה ראשונה.',
      1: '`6` יוצא אם מסדרים לפי מספר המבחנות, כמו ב-`orders[order(orders$tubes), ]`. כאן `order()` מקבל את העמודה `area`, ולכן הוא מסדר לפי שמות השכונות, בסדר האלף-בית.',
      3: '`"Center"` הוא שם השכונה בשורה הראשונה, כלומר מה ש-`byname[1, "area"]` מדפיס. כאן מבקשים את העמודה `"tubes"`, ולכן מקבלים את מספר המבחנות של `Center`.'
    }
  },

  // ---------- level 3 ----------
  {
    id: 'apply-sorted-filter',
    station: 'apply',
    level: 3,
    context: 'המשקל (בק"ג) של ארבעה ארגזים שהרובוט צריך להעמיס על הוואן:',
    prompt: 'מה יודפס?',
    code: 'van <- data.frame(\n  box = c("B2", "S1", "S4", "A7"),\n  kg = c(30, 4, 12, 25)\n)\nheavy <- van[order(van$kg, decreasing = TRUE), ]\nheavy$box[heavy$kg > 10]',
    options: ['"B2" "S4" "A7"', '30 25 12', '"S4" "A7" "B2"', '"B2" "A7" "S4"'],
    answer: 3,
    hint: 'קודם כתבו את `heavy`: באיזה סדר השורות שלה? רק אחר כך בדקו מי עובר את התנאי `> 10`.',
    explanation: [
      {
        text: '`order(van$kg, decreasing = TRUE)` מחזיר את מיקומי השורות מהכבד לקל: שורה 1 (`30`), שורה 4 (`25`), שורה 3 (`12`) ושורה 2 (`4`):',
        vector: { values: ['1', '4', '3', '2'], marks: ['on', 'on', 'on', 'on'], labels: ['30', '25', '12', '4'] }
      },
      {
        text: 'כך נראית `heavy`, אחרי שהשורות סודרו:',
        table: {
          columns: ['box', 'kg'],
          rows: [['B2', '30'], ['A7', '25'], ['S4', '12'], ['S1', '4']],
          rowNames: ['1', '4', '3', '2']
        }
      },
      {
        text: '`heavy$kg > 10` בודק כל שורה של `heavy`, **בסדר החדש**, ונותן `TRUE TRUE TRUE FALSE`. הארגזים שמקבלים `TRUE` נשארים באותו סדר:',
        vector: { values: ['"B2"', '"A7"', '"S4"', '"S1"'], marks: ['on', 'on', 'on', 'drop'], labels: ['TRUE', 'TRUE', 'TRUE', 'FALSE'] }
      },
      {
        text: 'R מדפיס את הארגזים לפי הסדר שלהם ב-`heavy`:',
        output: '[1] "B2" "A7" "S4"'
      }
    ],
    whyWrong: {
      0: 'זה הסדר של הטבלה **המקורית**, כלומר מה ש-`van$box[van$kg > 10]` מדפיס. כאן הסינון נעשה על `heavy`, שבה השורות כבר מסודרות מהכבד לקל, ולכן `A7` (`25`) בא לפני `S4` (`12`).',
      1: 'אלה המשקלים, כלומר מה ש-`heavy$kg[heavy$kg > 10]` מדפיס. כאן שולפים מהעמודה `box`, ולכן יוצאים קודים של ארגזים. התנאי `heavy$kg > 10` רק בוחר **אילו** שורות לקחת.',
      2: 'זה הסדר מהקל לכבד, כמו בלי `decreasing = TRUE`. כאן כתוב `decreasing = TRUE`, ולכן ב-`heavy` הארגז הכבד ביותר, `B2`, נמצא ראשון.'
    }
  },

  {
    id: 'apply-order-by-nchar',
    station: 'apply',
    level: 3,
    context: 'הרובוט צריך להדפיס מדבקות לכמה דברים שבמעבדה:',
    code: 'stickers <- c("sample", "van", "tray", "glove")\nstickers[order(nchar(stickers))]',
    options: ['2 3 4 1', '"glove" "sample" "tray" "van"', '"van" "tray" "glove" "sample"', '3 4 5 6'],
    answer: 2,
    hint: 'עבדו מבפנים החוצה: מה `nchar(stickers)` מחזיר? מה `order()` עושה עם זה? ומה יוצא כששמים את התוצאה בתוך `stickers[ ]`?',
    explanation: [
      {
        text: '`nchar(stickers)` סופר את האותיות בכל מילה:',
        vector: { values: ['6', '3', '4', '5'], marks: ['', '', '', ''], labels: ['sample', 'van', 'tray', 'glove'], showIndex: true }
      },
      {
        text: '`order()` מקבל את המספרים האלה ומחזיר את **המיקומים** שלהם מהקטן לגדול: `3` במיקום 2, `4` במיקום 3, `5` במיקום 4 ו-`6` במיקום 1:',
        vector: { values: ['2', '3', '4', '1'], marks: ['on', 'on', 'on', 'on'], labels: ['3', '4', '5', '6'] }
      },
      {
        text: '`stickers[ ]` שולף את המילים שבמיקומים האלה, לפי הסדר הזה. כך המילים מסודרות מהקצרה לארוכה:',
        output: '[1] "van"    "tray"   "glove"  "sample"'
      }
    ],
    whyWrong: {
      0: 'אלה המיקומים, כלומר מה ש-`order(nchar(stickers))` לבד מדפיס. כאן הם נמצאים בתוך `stickers[ ]`, ולכן R שולף את **המילים** שבמיקומים האלה.',
      1: 'זה סדר האלף-בית, כלומר מה ש-`stickers[order(stickers)]` מדפיס. כאן `order()` לא מקבל את המילים עצמן אלא את `nchar(stickers)`, כלומר את האורכים, ולכן הוא מסדר לפי האורך.',
      3: 'אלה האורכים מסודרים, כלומר מה ש-`nchar(stickers)[order(nchar(stickers))]` מדפיס. אבל המיקומים נמצאים בתוך `stickers[ ]`, ולכן R שולף את המילים, לא את המספרים.'
    }
  },

  {
    id: 'apply-sorted-rownames',
    station: 'apply',
    level: 3,
    context: 'בעוד כמה ימים כל דגימה צריכה לצאת מהמקפיא:',
    code: 'due <- data.frame(\n  sample = c("S4", "A7", "B2", "S1"),\n  days = c(4, 2, 1, 3)\n)\nsoon <- due[order(due$days), ]\nrownames(soon)',
    options: ['"3" "2" "4" "1"', '"1" "2" "3" "4"', '"4" "2" "1" "3"', '"B2" "A7" "S1" "S4"'],
    answer: 0,
    hint: 'כשהשורות של טבלה זזות, מה קורה לשמות של השורות? ומאיפה הגיעו השמות האלה מלכתחילה?',
    explanation: [
      {
        text: 'לטבלה שנבנית עם `data.frame()` יש שמות שורות אוטומטיים: `"1"`, `"2"`, `"3"` ו-`"4"`. השם שייך לשורה ונשאר איתה:',
        table: {
          columns: ['sample', 'days'],
          rows: [['S4', '4'], ['A7', '2'], ['B2', '1'], ['S1', '3']],
          rowNames: ['1', '2', '3', '4']
        }
      },
      {
        text: '`order(due$days)` מחזיר את מיקומי השורות מהמספר הקטן לגדול: שורה 3 (`1`), שורה 2 (`2`), שורה 4 (`3`) ושורה 1 (`4`):',
        vector: { values: ['3', '2', '4', '1'], marks: ['on', 'on', 'on', 'on'], labels: ['B2', 'A7', 'S1', 'S4'] }
      },
      {
        text: 'כשהשורות זזות, כל שורה לוקחת איתה את השם שלה. R לא ממספר את השורות מחדש. כך נראית `soon`:',
        table: {
          columns: ['sample', 'days'],
          rows: [['B2', '1'], ['A7', '2'], ['S1', '3'], ['S4', '4']],
          rowNames: ['3', '2', '4', '1']
        }
      },
      {
        text: '`rownames()` מחזיר את שמות השורות, כטקסט, לפי הסדר החדש:',
        output: '[1] "3" "2" "4" "1"'
      }
    ],
    whyWrong: {
      1: 'זה מה ש-`rownames(due)` מדפיס, לטבלה המקורית. R לא ממספר את השורות מחדש אחרי המיון: כל שורה שומרת את השם שהיה לה, ולכן השם הראשון ב-`soon` הוא `"3"`, השם של השורה של `B2`.',
      2: 'אלה **המקומות** שכל שורה מקבלת בטבלה החדשה: `S4` עוברת למקום 4, `A7` למקום 2, וכן הלאה. אבל `rownames()` לא מראה לאן כל שורה עברה. הוא מראה, לפי הסדר החדש, את השם **הישן** של כל שורה, ולכן מקבלים בדיוק את המיקומים ש-`order(due$days)` החזיר.',
      3: 'אלה הדגימות לפי הסדר החדש, כלומר מה ש-`soon$sample` מדפיס. `rownames()` לא מחזיר עמודה של הטבלה: הוא מחזיר את **שמות השורות**, שנמצאים בצד, מחוץ לעמודות.'
    }
  },

  // ===== שבוע 6: תנאים =====
  // ---------- level 1 ----------
  {
    id: 'conditions-if-mean',
    station: 'conditions',
    level: 1,
    context: 'המכונה בדקה את דגימה S4 שלוש פעמים. אלה שלוש הקריאות שלה:',
    code: 'readings <- c(66, 90, 63)\nif (mean(readings) > 75) {\n  print("positive")\n} else {\n  print("negative")\n}',
    options: ['"positive"', '"negative"', '"negative" "positive" "negative"', 'שגיאה (Error), כי `readings` הוא וקטור'],
    answer: 1,
    hint: 'מה התנאי בודק: כל קריאה בנפרד, או מספר אחד שמחושב מכל הקריאות?',
    explanation: [
      {
        text: '`mean(readings)` מחשב את הממוצע של שלוש הקריאות: `(66 + 90 + 63) / 3`, וזה `73`. כלומר התנאי הוא על מספר **אחד**.',
        vector: { values: ['66', '90', '63'], marks: ['', '', ''], showIndex: true }
      },
      {
        text: '`73 > 75` הוא `FALSE`, ולכן R מדלג על הבלוק של `if` ומריץ רק את הבלוק של `else`:',
        output: '[1] "negative"'
      }
    ],
    whyWrong: {
      0: 'נכון ש-`90` גדול מ-75, אבל התנאי לא בודק קריאה בודדת: הוא בודק את הממוצע, `73`, והוא לא גדול מ-75.',
      2: 'זה מה ש-`ifelse(readings > 75, "positive", "negative")` מדפיס: תשובה לכל קריאה. אבל כאן התנאי של `if` הוא מספר אחד (הממוצע), ו-R מריץ רק אחד משני הבלוקים, פעם אחת.',
      3: 'נכון ש-`if` צריך ערך אחד, `TRUE` או `FALSE`. אבל כאן הוא באמת מקבל ערך אחד: `mean()` הופך את שלוש הקריאות למספר אחד. שגיאה הייתה מתקבלת עם `if (readings > 75)`, כי שם התנאי נותן שלושה ערכים.'
    }
  },

  {
    id: 'conditions-all-battery',
    station: 'conditions',
    level: 1,
    context: 'לפני שמתחילים, המכונה בודקת כמה נוזל (באחוזים) יש בכל אחד מארבעת המכלים שלה:',
    code: 'tanks <- c(45, 80, 15, 60)\nall(tanks > 20)',
    options: ['TRUE', '3', 'TRUE TRUE FALSE TRUE', 'FALSE'],
    answer: 3,
    hint: 'בדקו כל מכל מול התנאי. כמה מהמכלים צריכים לעמוד בו כדי ש-`all()` יחזיר `TRUE`?',
    explanation: [
      {
        text: '`tanks > 20` בודק כל מכל ומחזיר `TRUE` או `FALSE`:',
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
      0: '`TRUE` הוא מה ש-`any(tanks > 20)` מדפיס: ל-`any()` מספיק מכל אחד שעומד בתנאי. `all()` דורש שכולם יעמדו בו, ו-`15` לא גדול מ-20.',
      1: '`3` הוא מה ש-`sum(tanks > 20)` מדפיס: כמה מכלים עומדים בתנאי. `all()` לא סופר: הוא עונה כן או לא, כלומר `TRUE` או `FALSE`.',
      2: 'זה מה ש-`tanks > 20` מדפיס לבד: תשובה לכל מכל. `all()` מקבל את כל התשובות האלה ומחזיר ערך **אחד** בלבד.'
    }
  },

  {
    id: 'conditions-ifelse-survey',
    station: 'conditions',
    level: 1,
    context: 'אלה התוצאות שהמכונה נתנה לארבע דגימות:',
    code: 'results <- c("positive", "negative", "positive", "positive")\nifelse(results == "positive", 1, 0)',
    options: ['1 0 1 1', 'TRUE FALSE TRUE TRUE', '"1" "0" "1" "1"', '3'],
    answer: 0,
    hint: 'קודם כתבו מה `results == "positive"` מחזיר. ואז: מה `ifelse()` עושה עם כל אחד מהערכים האלה?',
    explanation: [
      {
        text: '`results == "positive"` בודק כל תוצאה:',
        vector: {
          values: ['"positive"', '"negative"', '"positive"', '"positive"'],
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
      1: 'זה מה ש-`results == "positive"` מדפיס לבד. `ifelse()` לא מחזיר את ה-`TRUE` וה-`FALSE`: הוא שם `1` במקום כל `TRUE` ו-`0` במקום כל `FALSE`.',
      2: 'זה מה ש-`ifelse(results == "positive", "1", "0")` מדפיס. סוג הפלט נקבע לפי הערכים ש-`ifelse()` מחזיר, ולא לפי `results`. כאן `1` ו-`0` כתובים בלי מירכאות, ולכן הם מספרים.',
      3: '`3` הוא מה ש-`sum(ifelse(results == "positive", 1, 0))` מדפיס. `ifelse()` לבד לא מחבר כלום: הוא מחזיר וקטור עם תשובה לכל דגימה.'
    }
  },

  // ---------- level 2 ----------
  {
    id: 'conditions-first-true-wins',
    station: 'conditions',
    level: 2,
    context: 'המכונה מדדה את כמות הנגיף בארבע דגימות. על הלוח שלה יש שלוש נורות:',
    code: 'amounts <- c(72, 95, 60, 118)\nif (any(amounts > 90)) {\n  print("yellow")\n} else if (any(amounts > 110)) {\n  print("red")\n} else {\n  print("green")\n}',
    options: ['"red"', '"yellow" "red"', '"yellow"', '"green"'],
    answer: 2,
    hint: 'כמה מהתנאים כאן נכונים? ובאיזה סדר R בודק אותם?',
    explanation: [
      {
        text: 'R בודק את התנאים לפי הסדר, מלמעלה למטה. הראשון הוא `any(amounts > 90)`, ו-`amounts > 90` נותן:',
        vector: {
          values: ['72', '95', '60', '118'],
          marks: ['off', 'on', 'off', 'on'],
          labels: ['FALSE', 'TRUE', 'FALSE', 'TRUE']
        }
      },
      {
        text: 'יש לפחות `TRUE` אחד, ולכן `any(amounts > 90)` הוא `TRUE`. R מריץ את הבלוק הראשון ו**מדלג על כל השאר**: הוא בכלל לא בודק את `any(amounts > 110)`, ולא מגיע ל-`else`.',
        output: '[1] "yellow"'
      }
    ],
    whyWrong: {
      0: 'נכון ש-`any(amounts > 110)` הוא `TRUE` (בגלל `118`), אבל R לא מגיע לבדוק אותו. R לא מחפש את התנאי המתאים ביותר, אלא מריץ את **הראשון** שנכון. (`"red"` היה מודפס אם `any(amounts > 110)` היה כתוב ראשון.)',
      1: 'בשרשרת של `if`, `else if` ו-`else` רץ **בלוק אחד בלבד**: הראשון שהתנאי שלו `TRUE`. אחריו R מדלג על כל השאר, גם כשהתנאים שלהם נכונים.',
      3: '`"green"` היה מודפס עם `all()` במקום `any()`, כי לא בכל הדגימות הכמות גדולה מ-90. אבל ל-`any()` מספיקה דגימה אחת, ו-`95` ו-`118` גדולים מ-90.'
    }
  },

  {
    id: 'conditions-and-or-fee',
    station: 'conditions',
    level: 2,
    context: 'לפני ריצה, המכונה בודקת כמה מבחנות מחכות בתור וכמה נוזל (במ"ל) יש במכל:',
    code: 'tubes <- 3\ntank <- 180\nwait <- 30\nif (tubes >= 5 & tank >= 150) {\n  wait <- 0\n} else if (tubes >= 5 | tank >= 150) {\n  wait <- wait / 2\n}\nwait',
    prompt: 'מה יהיה הערך של `wait` בסוף הקוד?',
    options: ['15', '0', '30', 'שגיאה (Error), כי אין `else`'],
    answer: 0,
    hint: 'חשבו כל השוואה לבד: `TRUE` או `FALSE`? ואז שאלו: מה `&` דורש, ומה `|` דורש?',
    explanation: [
      {
        text: 'קודם כל השוואה לבד (`tubes` הוא `3` ו-`tank` הוא `180`), ואז מה `&` ו-`|` עושים עם שתי התוצאות:',
        table: {
          columns: ['tubes >= 5', 'tank >= 150', '&', '|'],
          rows: [['FALSE', 'TRUE', 'FALSE', 'TRUE']]
        }
      },
      {
        text: 'התנאי של `if` משתמש ב-`&` ("וגם"), שדורש ששני הצדדים יהיו `TRUE`. כאן התוצאה `FALSE`, ולכן R עובר ל-`else if`.'
      },
      {
        text: 'התנאי של `else if` משתמש ב-`|` ("או"), שמספיק לו צד אחד. כאן התוצאה `TRUE`, ולכן `wait` הופך ל-`30 / 2`:',
        output: '[1] 15'
      }
    ],
    whyWrong: {
      1: '`0` יוצא אם קוראים את `&` כמו "או". אבל `&` נותן `TRUE` רק כששני הצדדים `TRUE`, ו-`tubes >= 5` הוא `FALSE` (יש בתור רק 3 מבחנות).',
      2: '`30` יוצא אם קוראים את `|` כמו "וגם": אז אף תנאי לא נכון, ו-`wait` לא משתנה. אבל ל-`|` מספיק צד אחד נכון, ו-`tank >= 150` הוא `TRUE`.',
      3: '`else` הוא לא חובה. בלי `else`, אם אף תנאי לא נכון, R פשוט לא מריץ אף בלוק וממשיך הלאה. ובכל מקרה, כאן התנאי של `else if` נכון, ולכן `wait` הופך ל-`15`.'
    }
  },

  {
    id: 'conditions-ifelse-discount',
    station: 'conditions',
    level: 2,
    context: 'אלה ארבע הקריאות הגולמיות שהמכונה קיבלה מהחיישן:',
    code: 'raw <- c(40, 120, 75, 200)\nfixed <- ifelse(raw > 100, raw - 20, raw)\nsum(fixed)',
    options: ['355', '435', '40 100 75 180', '395'],
    answer: 3,
    hint: 'כתבו את `fixed` מיקום אחרי מיקום: בכל מיקום, מאיזה וקטור `ifelse()` לוקח את הערך?',
    explanation: [
      {
        text: '`raw - 20` הוא התשובה ל-`TRUE`, ו-`raw` הוא התשובה ל-`FALSE`. בכל מיקום `ifelse()` בודק את `raw > 100` ולוקח את הערך מהווקטור המתאים:',
        table: {
          columns: ['raw', 'raw > 100', 'raw - 20', 'fixed'],
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
        text: '`sum(fixed)` מחבר: `40 + 100 + 75 + 180`',
        output: '[1] 395'
      }
    ],
    whyWrong: {
      0: '`355` הוא מה ש-`sum(raw - 20)` מדפיס: תיקון לכל הקריאות. נכון ש-`raw - 20` מחושב לכל הווקטור, אבל `ifelse()` לוקח ממנו רק את המיקומים שבהם `raw > 100` הוא `TRUE`.',
      1: '`435` הוא `sum(raw)`, סכום הקריאות בלי שום תיקון. הוא יוצא אם חושבים ש-`ifelse()` בודק רק את הקריאה הראשונה (`40 > 100` הוא `FALSE`) ובוחר לפיה תשובה אחת לכל הווקטור. אבל `ifelse()` בודק כל מיקום בנפרד, ולכן `120` ו-`200` מתוקנות.',
      2: 'זה הערך של `fixed`. אבל השורה האחרונה היא `sum(fixed)`, ולכן מודפס מספר אחד: הסכום.'
    }
  },

  // ---------- level 3 ----------
  {
    id: 'conditions-if-vector-error',
    station: 'conditions',
    level: 3,
    context: 'כמה מבחנות מחכות לבדיקה בכל אחד משלושת המגשים של המכונה:',
    code: 'waiting <- c(12, 3, 7)\nif (waiting > 5) {\n  print("speed up")\n} else {\n  print("ok")\n}',
    prompt: 'מה יקרה כשנריץ את הקוד?',
    options: ['"speed up"', 'שגיאה (Error), כי בתנאי של `if` יש יותר מערך אחד', '"speed up" "ok" "speed up"', '"ok"'],
    answer: 1,
    hint: 'כתבו מה `waiting > 5` מחזיר. מה `if` עושה עם התוצאה הזאת?',
    explanation: [
      {
        text: '`waiting > 5` בודק כל מגש ומחזיר **שלושה** ערכים:',
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
        output: 'Error in if (waiting > 5) { : the condition has length > 1'
      }
    ],
    whyWrong: {
      0: 'R לא בודק רק את האיבר הראשון: `if` צריך ערך אחד, ו-`waiting > 5` נותן שלושה, ולכן R עוצר. (בגרסאות ישנות של R זה אכן היה הפלט, יחד עם אזהרה. היום זו שגיאה.)',
      2: 'זה מה ש-`ifelse(waiting > 5, "speed up", "ok")` מדפיס. `ifelse()` נותן תשובה לכל איבר, אבל `if` לא עובר על הווקטור איבר אחרי איבר: הוא צריך תשובה אחת.',
      3: '`"ok"` היה מודפס עם `if (all(waiting > 5))`, כי לא בכל המגשים מחכות יותר מ-5 מבחנות. אבל `if` לא מפעיל את `all()` בשבילכם: כשהתנאי שלו הוא וקטור, R עוצר עם שגיאה.'
    }
  },

  {
    id: 'conditions-df-all-andand',
    station: 'conditions',
    level: 3,
    context: 'הטבלה של שלוש דגימות: כמה פעמים המכונה בדקה כל אחת, וכמה נוזל (במ"ל) נשאר בה:',
    code: 'batch <- data.frame(sample = c("A1", "A2", "A3"),\n                    tests = c(3, 1, 2),\n                    ml = c(12, 9, 15))\nif (all(batch$tests > 0) && all(batch$ml > 10)) {\n  print("green")\n} else if (mean(batch$tests) >= 2) {\n  print("yellow")\n} else {\n  print("red")\n}',
    options: ['"green"', 'שגיאה (Error), כי `&&` עובד רק על ערך אחד, ו-`batch$tests > 0` נותן שלושה', '"yellow"', '"red"'],
    answer: 2,
    hint: 'קודם חשבו כל `all()` לבד: על מה הוא שואל, וכמה ערכים הוא מחזיר? ואם R מגיע ל-`else if`, הציבו בו את הממוצע.',
    explanation: [
      {
        text: '`all(batch$tests > 0)` שואל אם **כל** הדגימות נבדקו לפחות פעם אחת. כולן נבדקו, ולכן הוא `TRUE`. `all(batch$ml > 10)` שואל אם בכולן נשארו יותר מ-10 מ"ל, אבל `9` לא גדול מ-10, ולכן הוא `FALSE`:',
        table: {
          columns: ['sample', 'tests', 'ml', 'tests > 0', 'ml > 10'],
          rows: [
            ['"A1"', '3', '12', 'TRUE', 'TRUE'],
            ['"A2"', '1', '9', 'TRUE', 'FALSE'],
            ['"A3"', '2', '15', 'TRUE', 'TRUE']
          ],
          rowNames: ['1', '2', '3'],
          highlightRows: [1]
        }
      },
      {
        text: 'כל `all()` מחזיר ערך **אחד**, ולכן `&&` מקבל בדיוק מה שהוא צריך: `TRUE && FALSE`, וזה `FALSE`. R מדלג על הבלוק הראשון ועובר ל-`else if`.'
      },
      {
        text: '`mean(batch$tests)` הוא `(3 + 1 + 2) / 3`, כלומר `2`. `2 >= 2` הוא `TRUE`, כי `>=` כולל שוויון. לכן R מריץ את הבלוק הזה ומדלג על `else`:',
        output: '[1] "yellow"'
      }
    ],
    whyWrong: {
      0: '`"green"` יוצא אם קוראים את `all()` כמו `any()` או כמו "רוב הדגימות": בשתיים מתוך שלוש נשארו יותר מ-10 מ"ל. אבל `all()` דורש שכולן יעמדו בתנאי, ובדגימה `"A2"` נשארו רק `9`, ולכן התנאי הראשון הוא `FALSE`. (עם `any()` בשני הצדדים היה מודפס `"green"`.)',
      1: 'נכון ש-`&&` עובד רק על ערך אחד בכל צד: `batch$tests > 0 && batch$ml > 10` אכן היה עוצר עם שגיאה. אבל כאן כל צד עטוף ב-`all()`, שהופך שלושה ערכים לערך אחד, ולכן `&&` מקבל `TRUE` ו-`FALSE` בלי בעיה.',
      3: '`"red"` יוצא אם חושבים ש-`2 >= 2` הוא `FALSE`, כמו `2 > 2`. אבל `>=` כולל שוויון, והממוצע הוא בדיוק `2`, ולכן התנאי של `else if` הוא `TRUE`. (עם `mean(batch$tests) > 2` היה מודפס `"red"`.)'
    }
  },

  {
    id: 'conditions-chain-then-if',
    station: 'conditions',
    level: 3,
    context: 'לפני בדיקה, המכונה מכוונת את מהירות הסיבוב שלה:',
    code: 'speed <- 40\nif (speed < 50) {\n  speed <- speed + 20\n} else if (speed < 70) {\n  speed <- speed + 5\n}\nif (speed >= 60) speed <- speed * 2\nspeed',
    prompt: 'מה יהיה הערך של `speed` בסוף הקוד?',
    options: ['130', '60', '45', '120'],
    answer: 3,
    hint: 'עקבו אחרי `speed` שורה אחרי שורה. אחרי ש-`speed` משתנה, אילו תנאים R עוד בודק?',
    explanation: [
      {
        text: 'התנאי הראשון, `40 < 50`, הוא `TRUE`, ולכן `speed` הופך ל-`40 + 20`, כלומר `60`.'
      },
      {
        text: 'עכשיו `60 < 70`, אבל R **לא** חוזר לבדוק את `else if`: בשרשרת של `if` ו-`else if` רץ רק הבלוק הראשון שנכון, ו-R מדלג על כל השאר.'
      },
      {
        text: 'ה-`if` בשורה שאחרי השרשרת הוא `if` חדש ונפרד, ולכן R בודק אותו, עם הערך **העדכני**: `60 >= 60` הוא `TRUE`, ו-`speed` הופך ל-`60 * 2`:',
        output: '[1] 120'
      }
    ],
    whyWrong: {
      0: '`130` יוצא אם חושבים שאחרי הבלוק הראשון R בודק גם את `else if` (`60 < 70`) ומוסיף עוד 5. אבל בשרשרת של `if` ו-`else if` רץ בלוק אחד בלבד: אחרי שהראשון רץ, R מדלג על השאר.',
      1: '`60` יוצא אם מדלגים על `if (speed >= 60)`. אבל הוא לא שייך לשרשרת שלפניו: זה `if` נפרד, ו-R בודק אותו. הערך העדכני הוא `60`, ו-`60 >= 60` הוא `TRUE` (`>=` כולל גם את השוויון).',
      2: '`45` יוצא אם רק הבלוק של `else if` רץ. אבל R בודק את התנאים לפי הסדר ומריץ את הראשון שנכון: `40 < 50` כבר `TRUE`, ולכן רץ הבלוק הראשון. (וגם `45 >= 60` הוא `FALSE`, כך ש-`45` לא היה מוכפל.)'
    }
  },

  // ---------- level 1 ----------
  {
    id: 'conditions-dog-bed-boundary',
    station: 'conditions',
    level: 1,
    context: 'דגימה חדשה הגיעה למכונה, ולידה מחכות מבחנות בשלושה גדלים. זו כמות הנוזל בדגימה (במ"ל):',
    code: 'ml <- 10\nif (ml < 10) {\n  print("small tube")\n} else if (ml < 25) {\n  print("medium tube")\n} else {\n  print("large tube")\n}',
    options: ['"small tube"', '"medium tube"', '"large tube"', '"medium tube" "large tube"'],
    answer: 1,
    hint: 'הציבו `10` בכל תנאי, לפי הסדר. מה בדיוק `<` בודק?',
    explanation: [
      {
        text: 'R בודק את התנאים לפי הסדר. הראשון הוא `10 < 10`: האם 10 **קטן** מ-10? לא, הוא שווה לו. `<` נותן `TRUE` רק כשהצד השמאלי קטן ממש, ולכן התשובה היא `FALSE`, ו-R עובר ל-`else if`.'
      },
      {
        text: 'התנאי השני, `10 < 25`, הוא `TRUE`. R מריץ את הבלוק שלו ומדלג על `else`:',
        output: '[1] "medium tube"'
      }
    ],
    whyWrong: {
      0: '`"small tube"` יוצא אם קוראים את `<` כמו `<=` ("קטן או שווה"). אבל `10 < 10` הוא `FALSE`, כי 10 לא קטן מעצמו. (עם `if (ml <= 10)` היה מודפס `"small tube"`.)',
      2: '`else` רץ רק כש**כל** התנאים שלפניו `FALSE`. כשהתנאי של `if` הוא `FALSE`, R לא קופץ ישר ל-`else`: קודם הוא בודק את `else if`, ו-`10 < 25` הוא `TRUE`.',
      3: 'בשרשרת של `if`, `else if` ו-`else` רץ בלוק אחד בלבד. `else` לא רץ "בסוף, בכל מקרה": הוא רץ רק אם אף תנאי לפניו לא נכון.'
    }
  },

  {
    id: 'conditions-if-runs-once',
    station: 'conditions',
    level: 1,
    context: 'כמה ליטרים נשארו במכל של מכונת הבדיקות בסוף המשמרת של שיר:',
    code: 'tank <- 2\nif (tank < 5) {\n  tank <- tank + 2\n}\ntank',
    prompt: 'מה יהיה הערך של `tank` בסוף הקוד?',
    options: ['4', '6', '2', 'שגיאה (Error), כי אי אפשר לשנות בתוך `if` את המשתנה שהתנאי בודק'],
    answer: 0,
    hint: 'כמה פעמים `if` בודק את התנאי שלו? ומה R עושה אחרי שהבלוק רץ?',
    explanation: [
      {
        text: '`2 < 5` הוא `TRUE`, ולכן R מריץ את הבלוק: `tank` הופך ל-`2 + 2`, כלומר `4`.'
      },
      {
        text: '`if` בודק את התנאי **פעם אחת** ומריץ את הבלוק פעם אחת. הוא לא חוזר לבדוק את התנאי אחרי שהערך השתנה (למרות ש-`4 < 5` עדיין `TRUE`). R ממשיך לשורה הבאה ומדפיס את הערך העדכני:',
        output: '[1] 4'
      }
    ],
    whyWrong: {
      1: '`6` יוצא אם חושבים ש-`if` חוזר על הבלוק כל עוד התנאי נכון: אחרי הפעם הראשונה `tank` הוא `4`, ו-`4 < 5` עדיין `TRUE`, אז מוסיפים עוד 2. אבל `if` בודק את התנאי פעם אחת ומריץ את הבלוק פעם אחת בלבד.',
      2: '`2` יוצא אם חושבים שמה שמשתנה בתוך הסוגריים המסולסלים לא נשמר אחריהם. אבל השורה `tank <- tank + 2` משנה את `tank` עצמו, והערך החדש נשאר גם אחרי ה-`if`.',
      3: 'מותר לשנות בתוך הבלוק את המשתנה שהתנאי בודק. R בודק את התנאי לפני שהבלוק רץ, ואחר כך פשוט מריץ את הבלוק ושומר את הערך החדש.'
    }
  },

  {
    id: 'conditions-na-plus-isna',
    station: 'conditions',
    level: 1,
    context: 'במגש הראשון מחכות לבדיקה 6 מבחנות, ואת המבחנות במגש השני שכחו לספור:',
    code: 'first <- 6\nsecond <- NA\ntubes <- first + second\nif (is.na(tubes)) {\n  print("count again")\n} else {\n  print(tubes)\n}',
    options: ['6', 'NA', 'שגיאה (Error), כי אי אפשר לחבר מספר ל-`NA`', '"count again"'],
    answer: 3,
    hint: 'כתבו קודם את הערך של `tubes`. מה יוצא כשמחברים מספר ל-`NA`?',
    explanation: [
      {
        text: '`first + second` הוא `6 + NA`. R לא יודע כמה מבחנות יש במגש השני, ולכן הוא גם לא יכול לדעת מה הסכום: התוצאה היא `NA`. כלומר `tubes` הוא `NA`.'
      },
      {
        text: '`is.na(tubes)` בודק אם `tubes` חסר, והתשובה היא `TRUE`. לכן R מריץ את הבלוק של `if`:',
        output: '[1] "count again"'
      }
    ],
    whyWrong: {
      0: '`6` יוצא אם חושבים ש-`NA` הוא כמו `0`, או ש-R מדלג עליו בחיבור. אבל `NA` אומר "ערך לא ידוע", ולכן `6 + NA` הוא `NA`.',
      1: '`NA` הוא מה ש-`print(tubes)` מדפיס, כלומר הבלוק של `else`. אבל `else` רץ רק כשהתנאי `FALSE`, וכאן `is.na(tubes)` הוא `TRUE`.',
      2: 'חיבור עם `NA` לא עוצר את R בשגיאה: הוא מחזיר `NA`. בגלל זה בודקים את התוצאה עם `is.na()`, כמו בקוד הזה.'
    }
  },

  {
    id: 'conditions-length-one-word',
    station: 'conditions',
    level: 1,
    context: 'המכונה קוראת את הקוד שכתוב על מבחנה:',
    code: 'tag <- "A7North"\nif (length(tag) > 3) {\n  print("long code")\n} else {\n  print("short code")\n}',
    options: ['"long code"', '1', '"short code"', 'שגיאה (Error), כי אי אפשר להשוות טקסט למספר'],
    answer: 2,
    hint: 'מה בדיוק `length()` סופר? כתבו את הערך של `length(tag)` לפני שאתם בודקים את התנאי.',
    explanation: [
      {
        text: '`tag` הוא וקטור עם איבר **אחד**: הטקסט `"A7North"`. `length()` סופר איברים ולא תווים, ולכן `length(tag)` הוא `1`. (את התווים סופר `nchar(tag)`, והוא נותן `7`.)'
      },
      {
        text: '`1 > 3` הוא `FALSE`, ולכן R מריץ את הבלוק של `else`:',
        output: '[1] "short code"'
      }
    ],
    whyWrong: {
      0: '`"long code"` יוצא אם חושבים ש-`length()` סופר תווים: ב-`"A7North"` יש 7 תווים, ו-`7 > 3`. אבל את התווים סופר `nchar()`. `length()` סופר איברים, ויש כאן איבר אחד. (עם `if (nchar(tag) > 3)` היה מודפס `"long code"`.)',
      1: '`1` הוא מה ש-`length(tag)` מדפיס לבד. כאן הוא רק חלק מהתנאי, ומה שמודפס הוא מה שבתוך הבלוק שרץ.',
      3: 'כאן לא משווים טקסט למספר: `length(tag)` הוא המספר `1`, ולכן התנאי הוא `1 > 3`, השוואה של שני מספרים.'
    }
  },

  // ---------- level 2 ----------
  {
    id: 'conditions-total-not-updated',
    station: 'conditions',
    level: 2,
    context: 'המכונה מתכוננת לשלוש בדיקות. זו כמות הנוזל (במ"ל) שהיא שמה בכל בדיקה:',
    code: 'dose <- 50\ntotal <- dose * 3\nif (total > 120) {\n  dose <- dose - 10\n}\nc(dose, total)',
    options: ['40 150', '40 120', '50 150', '40 140'],
    answer: 0,
    hint: 'מתי R חישב את `total`, ומה בדיוק נשמר בו באותו רגע?',
    explanation: [
      {
        text: '`total` מחושב בשורה השנייה: `50 * 3`, כלומר `150`. ב-`total` נשמר המספר `150`, ולא הנוסחה `dose * 3`.'
      },
      {
        text: '`150 > 120` הוא `TRUE`, ולכן R מריץ את הבלוק, ו-`dose` הופך ל-`50 - 10`, כלומר `40`.'
      },
      {
        text: 'השינוי ב-`dose` לא משנה את `total`: R לא מחשב אותו מחדש לבד. לכן `total` נשאר `150`:',
        output: '[1]  40 150'
      }
    ],
    whyWrong: {
      1: '`120` יוצא אם חושבים ש-`total` מתעדכן לבד כש-`dose` משתנה (`40 * 3`). אבל R חישב את `total` פעם אחת, בשורה השנייה, ושמר בו את המספר `150`. כדי לעדכן אותו צריך לכתוב שוב `total <- dose * 3`.',
      2: '`50 150` יוצא אם הבלוק לא רץ, או אם השינוי בתוכו לא נשמר. אבל `150 > 120` הוא `TRUE`, ולכן הבלוק רץ ו-`dose` הופך ל-`40`.',
      3: '`140` יוצא אם מורידים 10 גם מ-`total`. אבל בבלוק יש רק שורה אחת, `dose <- dose - 10`, והיא משנה רק את `dose`.'
    }
  },

  {
    id: 'conditions-not-and',
    station: 'conditions',
    level: 2,
    context: 'החיישנים של המכונה מודדים כמה אבק יש בתוכה וכמה חזק היא רועדת:',
    code: 'dust <- 8\nshake <- 15\nif (!(dust > 5 & shake > 20)) {\n  print("go on")\n} else {\n  print("stop")\n}',
    options: ['"stop"', 'TRUE', '"go on"', 'שגיאה (Error), כי אי אפשר לשים `!` לפני סוגריים'],
    answer: 2,
    hint: 'חשבו קודם מה יוצא בתוך הסוגריים. על מה בדיוק ה-`!` פועל?',
    explanation: [
      {
        text: 'R מחשב קודם את מה שבתוך הסוגריים: כל השוואה לבד, ואז `&`, שנותן `TRUE` רק אם שני הצדדים `TRUE`:',
        table: {
          columns: ['dust > 5', 'shake > 20', 'dust > 5 & shake > 20'],
          rows: [['TRUE', 'FALSE', 'FALSE']]
        }
      },
      {
        text: 'ה-`!` שלפני הסוגריים הופך את התוצאה של **כל** מה שבתוכם: `!FALSE` הוא `TRUE`. לכן R מריץ את הבלוק של `if`:',
        output: '[1] "go on"'
      }
    ],
    whyWrong: {
      0: '`"stop"` יוצא אם שוכחים את ה-`!`, או אם מפעילים אותו רק על `dust > 5`. בשני המקרים התנאי יוצא `FALSE`. אבל ה-`!` נמצא לפני הסוגריים, ולכן הוא הופך את התוצאה של כל מה שבתוכם: `!FALSE` הוא `TRUE`.',
      1: '`TRUE` הוא מה ש-`!(dust > 5 & shake > 20)` מדפיס לבד: זה הערך של התנאי. `if` לא מדפיס את התנאי, אלא מריץ את הבלוק המתאים, והבלוק הזה מדפיס `"go on"`.',
      3: 'מותר לשים `!` לפני סוגריים. R מחשב קודם את מה שבתוכם, ואז `!` הופך את התוצאה: `FALSE` ל-`TRUE`, או `TRUE` ל-`FALSE`.'
    }
  },

  {
    id: 'conditions-which-position',
    station: 'conditions',
    level: 2,
    context: 'כמה דגימות המכונה בדקה בכל אחד מארבעת הימים האחרונים:',
    code: 'tested <- c(14, 30, 22, 9)\nbest <- which(tested == max(tested))\nif (best > 20) {\n  print("busy day")\n} else {\n  print("quiet day")\n}',
    options: ['"busy day"', '"quiet day"', '2', 'שגיאה (Error), כי `which()` מחזיר וקטור'],
    answer: 1,
    hint: 'כתבו מה נשמר ב-`best`. מה בדיוק `which()` מחזיר?',
    explanation: [
      {
        text: '`max(tested)` הוא `30`, ו-`tested == max(tested)` נותן `TRUE` רק במקום השני:',
        vector: {
          values: ['14', '30', '22', '9'],
          marks: ['off', 'on', 'off', 'off'],
          labels: ['FALSE', 'TRUE', 'FALSE', 'FALSE'],
          showIndex: true
        }
      },
      {
        text: '`which()` מחזיר את ה**מיקום** של ה-`TRUE`, ולא את הערך שנמצא שם. לכן `best` הוא `2`, ולא `30`.'
      },
      {
        text: '`2 > 20` הוא `FALSE`, ולכן R מריץ את הבלוק של `else`:',
        output: '[1] "quiet day"'
      }
    ],
    whyWrong: {
      0: '`"busy day"` יוצא אם חושבים ש-`best` הוא `30`, המספר הגדול ביותר. אבל `which()` מחזיר מיקום: `best` הוא `2`, ו-`2 > 20` הוא `FALSE`. (עם `if (max(tested) > 20)` היה מודפס `"busy day"`.)',
      2: '`2` הוא מה ש-`best` מדפיס לבד. כאן `best` רק נבדק בתנאי, ומה שמודפס הוא מה שבתוך הבלוק שרץ.',
      3: 'נכון ש-`which()` יכול להחזיר כמה מיקומים, אבל כאן יש רק `TRUE` אחד. לכן `best` הוא מספר אחד, ו-`if` מקבל ערך אחד בלי בעיה.'
    }
  },

  // ---------- level 3 ----------
  {
    id: 'conditions-equals-na-error',
    station: 'conditions',
    level: 3,
    context: 'התוצאה של דגימה S9 עוד לא יצאה מהמכונה, ולכן היא חסרה:',
    code: 'result <- NA\nif (result == NA) {\n  print("still running")\n} else {\n  print("done")\n}',
    prompt: 'מה יקרה כשנריץ את הקוד?',
    options: ['"still running"', '"done"', 'לא יודפס כלום, כי R ידלג על שני הבלוקים', 'שגיאה (Error), כי `result == NA` הוא `NA`, ו-`if` צריך `TRUE` או `FALSE`'],
    answer: 3,
    hint: 'חשבו קודם מה `result == NA` מחזיר, ורק אחר כך מה `if` עושה עם התוצאה הזאת.',
    explanation: [
      {
        text: '`NA` אומר "ערך לא ידוע". כל השוואה עם `NA` נותנת `NA`, גם `NA == NA`: R לא יכול לדעת אם ערך לא ידוע שווה לערך לא ידוע אחר. לכן `result == NA` הוא `NA`, ולא `TRUE`.'
      },
      {
        text: '`if` צריך `TRUE` או `FALSE` כדי לבחור בלוק. כשהוא מקבל `NA`, R עוצר עם שגיאה. (כדי לבדוק אם ערך חסר משתמשים ב-`is.na()`, ולא ב-`==`.)',
        output: 'Error in if (result == NA) { : missing value where TRUE/FALSE needed'
      }
    ],
    whyWrong: {
      0: '`"still running"` הוא מה ש-`if (is.na(result))` מדפיס. אבל `==` לא בודק אם ערך חסר: `result == NA` הוא `NA`, ולא `TRUE`.',
      1: '`"done"` יוצא אם חושבים ש-`NA == NA` הוא `FALSE`, ואז רץ ה-`else`. אבל התוצאה היא לא `FALSE` אלא `NA`, ו-`else` רץ רק כשהתנאי `FALSE`.',
      2: 'R לא מדלג בשקט: `if` חייב להחליט בין שני הבלוקים, וכשהתנאי הוא `NA` הוא לא יכול להחליט, ולכן R עוצר עם שגיאה.'
    }
  },

  {
    id: 'conditions-nested-if-else',
    station: 'conditions',
    level: 3,
    context: 'המכונה סיימה בדיקה. אלה השעה עכשיו וכמות הנוזל (במ"ל) שנשארה במכל שלה:',
    code: 'hour <- 13\ntank <- 30\ntask <- "wait"\nif (hour >= 12) {\n  if (tank >= 40) task <- "test"\n} else {\n  task <- "clean"\n}\ntask',
    prompt: 'מה יהיה הערך של `task` בסוף הקוד?',
    options: ['"wait"', '"clean"', '"test"', 'שגיאה (Error), כי ל-`if` הפנימי אין `else`'],
    answer: 0,
    hint: 'עקבו אחרי הסוגריים המסולסלים `{ }`: איפה מתחיל ואיפה נגמר כל בלוק? לאיזה `if` שייך ה-`else`?',
    explanation: [
      {
        text: 'התנאי החיצוני, `13 >= 12`, הוא `TRUE`, ולכן R נכנס לבלוק שלו. ה-`else` בא מיד אחרי ה-`}` שסוגר את הבלוק הזה, ולכן הוא שייך ל-`if` **החיצוני**, ו-R מדלג עליו.'
      },
      {
        text: 'בתוך הבלוק יש `if` פנימי: `30 >= 40` הוא `FALSE`. ל-`if` הפנימי אין `else`, ולכן אף השמה לא רצה, ו-`task` נשאר כמו שהיה:',
        output: '[1] "wait"'
      }
    ],
    whyWrong: {
      1: '`"clean"` יוצא אם חושבים שה-`else` שייך ל-`if` הפנימי ורץ כשאין מספיק נוזל. אבל ה-`else` בא אחרי ה-`}` שסוגר את הבלוק החיצוני, ולכן הוא שייך ל-`if (hour >= 12)`, ורץ רק כשהשעה לפני 12.',
      2: '`"test"` יוצא אם בודקים רק את התנאי החיצוני. אבל ההשמה `task <- "test"` נמצאת בתוך `if` פנימי, ו-`30 >= 40` הוא `FALSE`.',
      3: '`else` הוא לא חובה, גם ב-`if` פנימי. כשהתנאי שלו `FALSE` ואין `else`, R פשוט לא מריץ כלום וממשיך הלאה.'
    }
  },

  {
    id: 'conditions-pairwise-and-sum',
    station: 'conditions',
    level: 3,
    context: 'המכונה בדקה כל אחת מארבע דגימות פעמיים. הקריאות נשמרו באותו סדר בשני הווקטורים:',
    code: 'round1 <- c(90, 60, 85, 72)\nround2 <- c(68, 95, 80, 75)\nboth <- sum(round1 > 70 & round2 > 70)\nif (both > 0) {\n  print(paste(both, "positive"))\n} else {\n  print("no positive")\n}',
    options: ['"4 positive"', '"2 positive"', '"6 positive"', '"no positive"'],
    answer: 1,
    hint: 'כתבו את `round1 > 70` ואת `round2 > 70` זה מתחת לזה. מה `&` עושה עם שני וקטורים כאלה?',
    explanation: [
      {
        text: '`&` על שני וקטורים עובד **מיקום מול מיקום**: הוא מחבר את התשובה של כל דגימה בבדיקה הראשונה עם התשובה של **אותה דגימה** בבדיקה השנייה:',
        table: {
          columns: ['round1', 'round2', 'round1 > 70', 'round2 > 70', '&'],
          rows: [
            ['90', '68', 'TRUE', 'FALSE', 'FALSE'],
            ['60', '95', 'FALSE', 'TRUE', 'FALSE'],
            ['85', '80', 'TRUE', 'TRUE', 'TRUE'],
            ['72', '75', 'TRUE', 'TRUE', 'TRUE']
          ],
          rowNames: ['1', '2', '3', '4'],
          highlightRows: [2, 3]
        }
      },
      {
        text: '`sum()` סופר את ה-`TRUE` (כל `TRUE` נחשב 1, וכל `FALSE` נחשב 0), ולכן `both` הוא `2`.'
      },
      {
        text: '`2 > 0` הוא `TRUE`, ולכן R מריץ את הבלוק של `if`, ו-`paste()` מחבר את `2` ואת `"positive"`:',
        output: '[1] "2 positive"'
      }
    ],
    whyWrong: {
      0: '`"4 positive"` יוצא אם קוראים את `&` כמו `|`: בכל אחת מהדגימות יש לפחות בדיקה אחת מעל 70 (`sum(round1 > 70 | round2 > 70)` הוא `4`). אבל `&` דורש שהקריאה של אותה דגימה תהיה מעל 70 בשתי הבדיקות.',
      2: '`"6 positive"` יוצא אם סופרים כל בדיקה לבד ומחברים: 3 דגימות מעל 70 בבדיקה הראשונה ועוד 3 בשנייה. אבל `&` לא מחבר ספירות: הוא בודק כל דגימה, ונותן `TRUE` רק לדגימה שעברה את 70 בשתי הבדיקות.',
      3: '`"no positive"` יוצא אם חושבים ש-`&` נותן תשובה אחת על הווקטורים כולם ("האם כל הדגימות מעל 70 בשתי הבדיקות?"). אבל `&` בודק מיקום מול מיקום ומחזיר ארבע תשובות, ושתיים מהן `TRUE`.'
    }
  },

  // ---------- level 1 ----------
  {
    id: 'conditions-ifelse-two-vectors',
    station: 'conditions',
    level: 1,
    context: 'המכונה בדקה חמש דגימות פעמיים, בבוקר ובערב. אלה הקריאות שלהן:',
    code: 'morning <- c(10, 14, 9, 12, 7)\nevening <- c(12, 14, 11, 12, 10)\nifelse(evening > morning, evening - morning, 0)',
    options: ['2 2 3', '2 0 2 0 3', '12 0 11 0 10', 'TRUE FALSE TRUE FALSE TRUE'],
    answer: 1,
    hint: 'בדקו כל מקום בווקטור בנפרד: האם `evening` גדול מ-`morning`? ומה `ifelse()` שם במקום הזה בכל אחד מהמקרים?',
    explanation: [
      {
        text: '`evening > morning` משווה מקום-מקום: הדגימה הראשונה מול הראשונה, השנייה מול השנייה, וכן הלאה:',
        vector: { values: ['12', '14', '11', '12', '10'], marks: ['on', 'off', 'on', 'off', 'on'], labels: ['TRUE', 'FALSE', 'TRUE', 'FALSE', 'TRUE'] }
      },
      {
        text: 'במקום שבו התנאי `TRUE`, `ifelse()` שם את `evening - morning`. במקום שבו הוא `FALSE`, הוא שם `0`. כך יוצאת תשובה לכל אחד מחמשת המקומות:',
        vector: { values: ['2', '0', '2', '0', '3'], marks: ['on', 'off', 'on', 'off', 'on'], labels: ['12 - 10', '0', '11 - 9', '0', '10 - 7'] }
      },
      {
        text: 'זה הפלט:',
        output: '[1] 2 0 2 0 3'
      }
    ],
    whyWrong: {
      0: 'זה מה ש-`(evening - morning)[evening > morning]` היה מדפיס: רק הדגימות שהקריאה שלהן עלתה. אבל `ifelse()` לא מסנן: הוא מחזיר תשובה לכל מקום בווקטור, ובמקומות שבהם התנאי `FALSE` הוא שם `0`.',
      2: 'זה מה ש-`ifelse(evening > morning, evening, 0)` היה מדפיס: קריאת הערב עצמה. כאן התשובה ל-`TRUE` היא `evening - morning`, כלומר בכמה הקריאה עלתה.',
      3: 'זה הערך של התנאי `evening > morning` לבד. `ifelse()` משתמש בתנאי רק כדי לבחור: במקום כל `TRUE` או `FALSE` הוא שם את התשובה המתאימה.'
    }
  },

  {
    id: 'conditions-ifelse-isna-label',
    station: 'conditions',
    level: 1,
    context: 'הקריאות של ארבע דגימות. מבחנה אחת נשפכה, ולכן אין לה קריאה:',
    code: 'readings <- c(31, NA, 28, 35)\nifelse(is.na(readings), "retest", "done")',
    options: ['"done" NA "done" "done"', 'FALSE TRUE FALSE FALSE', '"retest" "done" "retest" "retest"', '"done" "retest" "done" "done"'],
    answer: 3,
    hint: 'מה `is.na()` מחזיר על כל אחת מהקריאות, כולל על ה-`NA`? ואיזו תשובה `ifelse()` שם על כל `TRUE`?',
    explanation: [
      {
        text: '`is.na(readings)` בודק כל קריאה: `TRUE` אם היא `NA`, ו-`FALSE` אם יש בה מספר. שימו לב: התשובה שלו היא תמיד `TRUE` או `FALSE`, אף פעם לא `NA`.',
        vector: {
          values: ['31', 'NA', '28', '35'],
          marks: ['off', 'on', 'off', 'off'],
          labels: ['FALSE', 'TRUE', 'FALSE', 'FALSE'],
          showIndex: true
        }
      },
      {
        text: '`ifelse()` שם `"retest"` (התשובה ל-`TRUE`) במיקום 2, ו-`"done"` (התשובה ל-`FALSE`) בכל שאר המיקומים:',
        output: '[1] "done"   "retest" "done"   "done"  '
      }
    ],
    whyWrong: {
      0: 'זה מה ש-`ifelse(readings > 0, "done", "retest")` מדפיס: שם התנאי הוא השוואה, ו-`NA > 0` הוא `NA`, ולכן גם בפלט יש `NA` באותו מקום. אבל `is.na()` לא מחזיר `NA`: על `NA` הוא עונה `TRUE`, ולכן במיקום הזה `ifelse()` שם `"retest"`.',
      1: 'זה מה ש-`is.na(readings)` מדפיס לבד. `ifelse()` מחליף כל `TRUE` בתשובה השנייה בסוגריים (`"retest"`) וכל `FALSE` בתשובה השלישית (`"done"`).',
      2: 'כאן התשובות התחלפו. התשובה השנייה בסוגריים, `"retest"`, היא התשובה ל-`TRUE`, ו-`is.na()` נותן `TRUE` רק במקום של ה-`NA`. (הפלט הזה היה מתקבל עם `!is.na(readings)` בתנאי.)'
    }
  },

  {
    id: 'conditions-any-isna-column',
    station: 'conditions',
    level: 1,
    context: 'המכונה בדקה דגימות משלוש שכונות. הקריאה של הנמל עוד לא הגיעה:',
    code: 'report <- data.frame(area = c("North", "Port", "Hills"),\n                     reading = c(540, NA, 470))\nany(is.na(report$reading))',
    options: ['TRUE', 'NA', 'FALSE TRUE FALSE', 'FALSE'],
    answer: 0,
    hint: 'קודם כתבו מה `is.na()` מחזיר על כל ערך בעמודה `reading`. ואז: מה `any()` שואל על התשובות האלה?',
    explanation: [
      {
        text: '`report$reading` היא העמודה של הקריאות. `is.na()` בודק כל ערך בה ועונה `TRUE` רק במקום של ה-`NA`:',
        vector: {
          values: ['540', 'NA', '470'],
          marks: ['off', 'on', 'off'],
          labels: ['FALSE', 'TRUE', 'FALSE'],
          showIndex: true
        }
      },
      {
        text: '`any()` מחזיר `TRUE` אם יש לפחות `TRUE` אחד. יש כזה (השכונה השנייה), ולכן התשובה לשאלה "האם חסרה קריאה כלשהי בעמודה?" היא `TRUE` אחד:',
        output: '[1] TRUE'
      }
    ],
    whyWrong: {
      1: '`NA` יוצא אם חושבים שה-`NA` שבנתונים "מתפשט" גם לכאן. אבל `is.na()` אף פעם לא מחזיר `NA`: על ערך חסר הוא עונה `TRUE`. לכן `any()` מקבל רק `TRUE` ו-`FALSE`, ויכול להחליט.',
      2: 'זה מה ש-`is.na(report$reading)` מדפיס לבד: תשובה לכל שכונה. `any()` מקבל את כל התשובות האלה ומחזיר ערך **אחד**.',
      3: '`FALSE` הוא מה ש-`all(is.na(report$reading))` מדפיס: `all()` שואל אם **כל** הקריאות חסרות, ורק אחת חסרה. ל-`any()` מספיקה קריאה חסרה אחת.'
    }
  },

  // ---------- level 2 ----------
  {
    id: 'conditions-ifelse-mean-share',
    station: 'conditions',
    level: 2,
    context: 'כמות הנגיף שהמכונה מדדה בחמש דגימות:',
    code: 'amount <- c(72, 55, 90, 48, 66)\npositive <- ifelse(amount >= 60, 1, 0)\nmean(positive)',
    options: ['3', '76', '0.6', '1 0 1 0 1'],
    answer: 2,
    hint: 'מה נשמר ב-`positive`: כמויות, או משהו אחר? ומה הממוצע של ערכים כאלה?',
    explanation: [
      {
        text: '`ifelse()` שם `1` בכל מיקום שבו הכמות לפחות 60, ו-`0` בכל השאר. כלומר ב-`positive` אין כמויות בכלל:',
        vector: {
          values: ['72', '55', '90', '48', '66'],
          marks: ['on', 'off', 'on', 'off', 'on'],
          labels: ['1', '0', '1', '0', '1'],
          showIndex: true
        }
      },
      {
        text: '`mean(positive)` מחבר את הערכים ומחלק במספר שלהם: `(1 + 0 + 1 + 0 + 1) / 5`, כלומר `3 / 5`. ממוצע של אחדים ואפסים הוא בעצם **החלק** של הדגימות החיוביות:',
        output: '[1] 0.6'
      }
    ],
    whyWrong: {
      0: '`3` הוא מה ש-`sum(positive)` מדפיס: כמה דגימות חיוביות. `mean()` לא נעצר בסכום: הוא מחלק אותו במספר הערכים, 5.',
      1: '`76` הוא מה ש-`mean(amount[amount >= 60])` מדפיס: הממוצע של הכמויות בדגימות החיוביות. אבל ב-`positive` אין כמויות: `ifelse()` שם בו `1` או `0`, ולכן `mean()` מחשב ממוצע של אחדים ואפסים.',
      3: 'זה הערך של `positive`. אבל השורה האחרונה היא `mean(positive)`, ולכן מודפס מספר אחד: הממוצע.'
    }
  },

  {
    id: 'conditions-ifelse-paste-rooms',
    station: 'conditions',
    level: 2,
    context: 'כמה מבחנות יש עכשיו בכל אחד משלושת התאים של המכונה:',
    code: 'slots <- c("A1", "B2", "C3")\ntubes <- c(0, 4, 2)\npaste(slots, ifelse(tubes > 0, "busy", "free"))',
    options: ['"A1 free" "B2 busy" "C3 busy"', '"A1" "B2" "C3" "free" "busy" "busy"', '"A1 free B2 busy C3 busy"', '"A1free" "B2busy" "C3busy"'],
    answer: 0,
    hint: 'קודם כתבו מה `ifelse()` מחזיר. ואז: איך `paste()` מחבר שני וקטורים?',
    explanation: [
      {
        text: 'R מריץ קודם את `ifelse()`: בכל תא `"busy"` אם יש בו מבחנות, ו-`"free"` אם אין:',
        vector: {
          values: ['0', '4', '2'],
          marks: ['off', 'on', 'on'],
          labels: ['"free"', '"busy"', '"busy"'],
          showIndex: true
        }
      },
      {
        text: 'עכשיו `paste()` מקבל שני וקטורים באורך 3 ומחבר אותם **מיקום מול מיקום**: הראשון עם הראשון, השני עם השני והשלישי עם השלישי, עם רווח ביניהם. התוצאה היא וקטור של 3 טקסטים:',
        output: '[1] "A1 free" "B2 busy" "C3 busy"'
      }
    ],
    whyWrong: {
      1: 'זה מה ש-`c(slots, ifelse(tubes > 0, "busy", "free"))` מדפיס: `c()` שם את הווקטורים אחד אחרי השני. `paste()` לא מאריך את הווקטור: הוא מחבר כל תא עם התווית שלו לטקסט אחד.',
      2: 'זה מה שמודפס כשמוסיפים `collapse = " "`, שמחבר את כל התוצאות לטקסט אחד. בלי `collapse`, `paste()` מחזיר וקטור: טקסט נפרד לכל מיקום.',
      3: 'זה מה שמודפס עם `sep = ""`. בברירת המחדל `paste()` שם **רווח** בין החלקים שהוא מחבר, ולכן מקבלים `"A1 free"` עם רווח.'
    }
  },

  {
    id: 'conditions-ifelse-df-column',
    station: 'conditions',
    level: 2,
    context: 'הטבלה של ארבע דגימות שעברו היום במכונה:',
    code: 'tests <- data.frame(sample = c("S1", "S2", "S3", "S4"),\n                    level = c(412, 474, 380, 240))\ntests$result <- ifelse(tests$level > 400, "positive", "negative")\ntests$sample[tests$result != "positive"]',
    options: ['"negative" "negative"', '"S1" "S2"', '3 4', '"S3" "S4"'],
    answer: 3,
    hint: 'קודם כתבו את העמודה החדשה `result`, דגימה אחרי דגימה. ואז: מה `!=` בודק, ומאיזו עמודה לוקחים את הערכים בסוף?',
    explanation: [
      {
        text: '`ifelse()` עובר על העמודה `level` ונותן תוצאה לכל דגימה. התוצאה נשמרת בעמודה חדשה, `result`:',
        table: {
          columns: ['sample', 'level', 'level > 400', 'result'],
          rows: [
            ['"S1"', '412', 'TRUE', '"positive"'],
            ['"S2"', '474', 'TRUE', '"positive"'],
            ['"S3"', '380', 'FALSE', '"negative"'],
            ['"S4"', '240', 'FALSE', '"negative"']
          ],
          rowNames: ['1', '2', '3', '4'],
          highlightRows: [2, 3]
        }
      },
      {
        text: '`!=` אומר "לא שווה". `tests$result != "positive"` נותן `FALSE FALSE TRUE TRUE`: `TRUE` רק בדגימות שאינן חיוביות.'
      },
      {
        text: 'את התנאי הזה שמים בסוגריים המרובעים של העמודה `sample`, ולכן מקבלים את **השמות** של הדגימות שבהן הוא `TRUE`:',
        output: '[1] "S3" "S4"'
      }
    ],
    whyWrong: {
      0: 'זה מה ש-`tests$result[tests$result != "positive"]` מדפיס: הערכים מהעמודה `result`. אבל לפני הסוגריים המרובעים כתוב `tests$sample`, ולכן הערכים נלקחים מעמודת השמות.',
      1: 'זה מה ש-`tests$sample[tests$result == "positive"]` מדפיס. `!=` הוא ההפך של `==`: הוא נותן `TRUE` בדגימות שה-`result` שלהן **לא** `"positive"`, כלומר בדגימות השליליות.',
      2: '`3 4` הוא מה ש-`which(tests$result != "positive")` מדפיס: המיקומים. כשמכניסים את התנאי לסוגריים המרובעים של `tests$sample`, מקבלים את הערכים שנמצאים במיקומים האלה, ולא את המיקומים עצמם.'
    }
  },

  {
    id: 'conditions-ifelse-mixed-types',
    station: 'conditions',
    level: 2,
    context: 'כמה מקומות פנויים נשארו בכל אחד משלושת המגשים של המכונה:',
    code: 'empty <- c(12, 0, 5)\nifelse(empty > 0, empty, "full")',
    options: ['12 "full" 5', '"12" "full" "5"', '12 NA 5', 'שגיאה (Error), כי אי אפשר לשים מספרים וטקסט באותו וקטור'],
    answer: 1,
    hint: 'בכל מיקום `ifelse()` בוחר ערך מאחד משני מקומות. מאיזה סוג הוא כל אחד מהם, ומה זה אומר על הווקטור שיוצא?',
    explanation: [
      {
        text: 'בכל מיקום `ifelse()` בוחר: אם יש מקומות פנויים, את המספר מ-`empty`, ואם אין, את הטקסט `"full"`:',
        vector: {
          values: ['12', '0', '5'],
          marks: ['on', 'off', 'on'],
          labels: ['12', '"full"', '5'],
          showIndex: true
        }
      },
      {
        text: 'אבל התוצאה היא **וקטור אחד**, ובווקטור כל הערכים מאותו סוג. בדיוק כמו ב-`c(12, "full", 5)`, R הופך את המספרים לטקסט, ולכן הם מודפסים עם מירכאות:',
        output: '[1] "12"   "full" "5"   '
      }
    ],
    whyWrong: {
      0: 'בווקטור אחד אי אפשר שחלק מהערכים יהיו מספרים וחלק טקסט. התוצאה של `ifelse()` היא וקטור אחד, ולכן R הופך את כולם לטקסט: `12` נהיה `"12"` ו-`5` נהיה `"5"`.',
      2: 'R לא זורק את הטקסט ולא שם במקומו `NA`. כשיש בווקטור גם מספרים וגם טקסט, R דווקא הופך את **המספרים** לטקסט, כי כל מספר אפשר לכתוב כטקסט.',
      3: 'אין כאן שגיאה. כמו ב-`c()`, כשיש בווקטור גם מספרים וגם טקסט, R הופך את כולם לטקסט וממשיך.'
    }
  },

  // ---------- level 3 ----------
  {
    id: 'conditions-nested-ifelse-minutes',
    station: 'conditions',
    level: 3,
    context: 'כמות הנגיף שהמכונה מצאה בחמש דגימות:',
    code: 'virus <- c(45, 10, 30, 60, 20)\nifelse(virus >= 45, "red", ifelse(virus >= 20, "yellow", "green"))',
    options: ['"yellow" "green" "yellow" "red" "green"', '"red" "green" "green" "red" "green"', '"red" "green" "yellow" "red" "yellow"', '"yellow" "green" "yellow" "yellow" "yellow"'],
    answer: 2,
    hint: 'באילו מיקומים ה-`ifelse()` הפנימי בכלל קובע את התשובה? ושימו לב לערכים שנמצאים בדיוק על הגבול.',
    explanation: [
      {
        text: 'קודם התנאי החיצוני, `virus >= 45`. במיקומים שבהם הוא `TRUE` התשובה היא `"red"`, ומה שה-`ifelse()` הפנימי נותן שם לא נכנס לתוצאה. שימו לב: `45 >= 45` הוא `TRUE`, כי `>=` כולל שוויון.',
        vector: {
          values: ['45', '10', '30', '60', '20'],
          marks: ['on', 'off', 'off', 'on', 'off'],
          labels: ['TRUE', 'FALSE', 'FALSE', 'TRUE', 'FALSE'],
          showIndex: true
        }
      },
      {
        text: 'רק במיקומים שבהם התנאי החיצוני `FALSE` התשובה באה מה-`ifelse()` הפנימי, שבודק `virus >= 20`. גם כאן `20 >= 20` הוא `TRUE`:',
        table: {
          columns: ['virus', 'virus >= 45', 'virus >= 20', 'נורה'],
          rows: [
            ['45', 'TRUE', '-', '"red"'],
            ['10', 'FALSE', 'FALSE', '"green"'],
            ['30', 'FALSE', 'TRUE', '"yellow"'],
            ['60', 'TRUE', '-', '"red"'],
            ['20', 'FALSE', 'TRUE', '"yellow"']
          ],
          rowNames: ['1', '2', '3', '4', '5'],
          highlightRows: [1, 2, 4]
        }
      },
      {
        text: 'הפלט:',
        output: '[1] "red"    "green"  "yellow" "red"    "yellow"'
      }
    ],
    whyWrong: {
      0: 'זה מה שהיה מודפס עם `>` במקום `>=`. אבל `>=` כולל שוויון: `45 >= 45` הוא `TRUE`, ולכן `45` מקבל `"red"`, וגם `20 >= 20` הוא `TRUE`, ולכן `20` מקבל `"yellow"`.',
      1: 'זה מה ש-`ifelse(virus >= 45, "red", "green")` מדפיס, בלי הנורה הצהובה. כשהתנאי החיצוני `FALSE`, התשובה היא לא ישר `"green"`, אלא מה שה-`ifelse()` הפנימי מחזיר, והוא בודק עוד תנאי: `virus >= 20`.',
      3: 'כאן `45` ו-`60` קיבלו `"yellow"`, כאילו התנאי הפנימי "דורס" את החיצוני (שני הערכים האלה גם לפחות 20). אבל התנאי הפנימי קובע רק במיקומים שבהם החיצוני `FALSE`. (הפלט הזה היה מתקבל אם `virus >= 20` היה התנאי החיצוני.)'
    }
  },

  {
    id: 'conditions-all-na-unknown',
    station: 'conditions',
    level: 3,
    context: 'לפני ריצה, המכונה בודקת את הלחץ בארבעה צינורות. החיישן של צינור אחד לא עבד:',
    code: 'pressure <- c(42, NA, 38, 51)\nall(pressure > 30)',
    options: ['TRUE', 'NA', 'FALSE', 'TRUE NA TRUE TRUE'],
    answer: 1,
    hint: 'מה `pressure > 30` נותן במקום של ה-`NA`? ומה `all()` עושה עם התשובות האלה?',
    explanation: [
      {
        text: '`pressure > 30` בודק כל צינור. על `NA` אי אפשר לדעת אם הוא גדול מ-30, ולכן גם התשובה שם היא `NA`:',
        vector: {
          values: ['42', 'NA', '38', '51'],
          marks: ['on', '', 'on', 'on'],
          labels: ['TRUE', 'NA', 'TRUE', 'TRUE'],
          showIndex: true
        }
      },
      {
        text: '`all()` צריך לדעת אם **כל** התשובות `TRUE`. שלוש הן `TRUE`, אבל הרביעית לא ידועה: אם הלחץ בצינור הזה גדול מ-30 התשובה היא `TRUE`, ואם לא, היא `FALSE`. R לא יכול להחליט, ולכן הוא מחזיר `NA`.'
      },
      {
        text: 'אילו היה בין התשובות `FALSE` אחד ודאי, למשל ב-`all(pressure > 40)`, התוצאה הייתה `FALSE` למרות ה-`NA`, כי אז כבר ברור שלא כולם עומדים בתנאי. כאן אין אף `FALSE`, ולכן:',
        output: '[1] NA'
      }
    ],
    whyWrong: {
      0: '`TRUE` הוא מה ש-`all(pressure > 30, na.rm = TRUE)` מדפיס: שם R מדלג על ה-`NA`. בלי `na.rm = TRUE` הוא לא מדלג: בצינור שלא נמדד הלחץ יכול להיות נמוך מ-30, ולכן אי אפשר לדעת אם **בכולם** הוא גדול מ-30.',
      2: '`FALSE` יוצא אם חושבים ש-`NA` נחשב כמו `FALSE`. אבל `NA` אומר "לא ידוע", לא "לא". `all()` מחזיר `FALSE` רק כשיש `FALSE` ודאי, למשל ב-`all(pressure > 40)`, כי `38` לא גדול מ-40.',
      3: 'זה מה ש-`pressure > 30` מדפיס לבד: תשובה לכל צינור. `all()` מקבל את כל התשובות האלה ומחזיר ערך **אחד**.'
    }
  },

  {
    id: 'conditions-ifelse-mean-na-all',
    station: 'conditions',
    level: 3,
    context: 'כמה פעמים המכונה בדקה כל אחת מארבע דגימות. רישום אחד נמחק:',
    code: 'runs <- c(2, NA, 5, 1)\nifelse(runs > mean(runs), "more", "less")',
    options: ['NA NA NA NA', '"less" NA "more" "less"', 'NA', 'שגיאה (Error), כי יש `NA` בנתונים'],
    answer: 0,
    hint: 'מה `mean(runs)` מחזיר כשיש בנתונים `NA`? ומה יוצא כשמשווים מספר לערך כזה?',
    explanation: [
      {
        text: 'קודם R מחשב את `mean(runs)`. יש בנתונים `NA`, ובלי `na.rm = TRUE` גם הממוצע הוא `NA`.'
      },
      {
        text: 'עכשיו **כל** ערך ב-`runs` מושווה ל-`NA`: `2 > NA`, `NA > NA`, `5 > NA`, `1 > NA`. השוואה לערך לא ידוע נותנת `NA`, גם כשבצד השני יש מספר:',
        vector: {
          values: ['2', 'NA', '5', '1'],
          marks: ['', '', '', ''],
          labels: ['NA', 'NA', 'NA', 'NA'],
          showIndex: true
        }
      },
      {
        text: 'במקום שבו התנאי `NA`, `ifelse()` מחזיר `NA`. כאן זה כל המיקומים, והתוצאה עדיין באורך 4:',
        output: '[1] NA NA NA NA'
      }
    ],
    whyWrong: {
      1: 'זה מה שמודפס עם `mean(runs, na.rm = TRUE)` בתנאי (אז הממוצע הוא בערך `2.67`, ורק במקום של ה-`NA` יוצא `NA`). אבל בלי `na.rm = TRUE`, `mean(runs)` הוא `NA`, וכל השוואה אליו נותנת `NA`, גם במיקומים שיש בהם מספר.',
      2: 'נכון ש-`mean(runs)` הוא `NA` אחד, אבל התנאי `runs > mean(runs)` עדיין משווה **כל** איבר של `runs`, ולכן הוא באורך 4. `ifelse()` מחזיר תשובה לכל איבר, וכאן כל התשובות הן `NA`.',
      3: '`NA` לא עוצר את R: `mean()` מחזיר `NA`, ההשוואות מחזירות `NA`, ו-`ifelse()` מחזיר `NA` באותם מקומות. אין כאן שגיאה.'
    }
  },

  // ===== שבוע 7: לולאות =====
  // ---------- level 1 ----------
  {
    id: 'loops-for-values',
    station: 'loops',
    level: 1,
    context: 'כמה ארגזים יצאו מפס הייצור בכל אחת משלוש המשמרות. בכל ארגז יש 10 בקבוקונים:',
    code: 'crates <- c(4, 9, 6)\nfor (n in crates) {\n  print(n * 10)\n}',
    prompt: 'אילו מספרים יודפסו?',
    options: ['10 20 30', '40 90 60', '60', '190'],
    answer: 1,
    hint: 'איזה ערך מקבל `n` בכל סיבוב? ובכמה סיבובים רץ `print()`?',
    explanation: [
      {
        text: '`for (n in crates)` עובר על **הערכים** שבתוך `crates`, אחד בכל סיבוב: קודם `n` הוא `4`, אחר כך `9`, ואז `6`.',
        vector: { values: ['4', '9', '6'], marks: ['on', 'on', 'on'], showIndex: true }
      },
      {
        text: '`print(n * 10)` נמצא בתוך הלולאה, ולכן בכל סיבוב הוא מדפיס שורה משלו: כמה בקבוקונים יצאו במשמרת הזאת.',
        vector: { values: ['40', '90', '60'], marks: ['on', 'on', 'on'], labels: ['4 × 10', '9 × 10', '6 × 10'] }
      },
      {
        text: 'שלושה סיבובים, שלוש הדפסות:',
        output: '[1] 40\n[1] 90\n[1] 60'
      }
    ],
    whyWrong: {
      0: 'זה מה שהיה מודפס אם `n` היה מקבל את **המיקומים** 1, 2, 3, כמו ב-`for (n in 1:3)`. אבל `for (n in crates)` נותן ל-`n` את **הערכים** שבתוך הווקטור: `4`, `9` ו-`6`.',
      2: '`print()` נמצא **בתוך** הלולאה, ולכן הוא רץ בכל אחד משלושת הסיבובים. `60` הוא רק מה שמודפס בסיבוב האחרון.',
      3: '`190` הוא מספר הבקבוקונים בכל המשמרות יחד, כלומר `sum(crates) * 10`. הלולאה לא מחברת את המספרים: בכל סיבוב היא מכפילה מספר אחד ומדפיסה אותו.'
    }
  },

  {
    id: 'loops-count-rounds',
    station: 'loops',
    level: 1,
    context: 'משמרת הבוקר מתחילה, ומכונת המילוי עובדת על הפס:',
    code: 'filled <- 0\nfor (vial in 4:9) {\n  filled <- filled + 1\n}\nfilled',
    options: ['5', '9', '39', '6'],
    answer: 3,
    hint: 'כמה פעמים רצה הלולאה? ומה בדיוק מוסיפים ל-`filled` בכל סיבוב?',
    explanation: [
      {
        text: '`4:9` הוא וקטור של כל המספרים השלמים מ-4 עד 9, **כולל** שניהם. יש בו 6 מספרים, ולכן הלולאה עושה 6 סיבובים, סיבוב לכל בקבוקון:',
        vector: { values: ['4', '5', '6', '7', '8', '9'], marks: ['on', 'on', 'on', 'on', 'on', 'on'], showIndex: true }
      },
      {
        text: 'בכל סיבוב `filled` גדל ב-1. מספר הבקבוקון (`vial`) לא משתתף בחישוב:',
        table: {
          columns: ['vial', 'filled'],
          rows: [['4', '1'], ['5', '2'], ['6', '3'], ['7', '4'], ['8', '5'], ['9', '6']],
          highlightRows: [5]
        }
      },
      {
        text: 'אחרי הלולאה השורה `filled` מדפיסה:',
        output: '[1] 6'
      }
    ],
    whyWrong: {
      0: '`9 - 4` הוא 5, אבל `4:9` כולל **גם** את 4 **וגם** את 9: `4 5 6 7 8 9`. אלה 6 מספרים, ולכן יש 6 סיבובים.',
      1: '`9` הוא הערך של `vial` בסיבוב האחרון, המספר של הבקבוקון האחרון. אבל הקוד מדפיס את `filled`, שגדל ב-1 בכל סיבוב בלי קשר לערך של `vial`.',
      2: '`39` הוא הסכום `4 + 5 + 6 + 7 + 8 + 9`, וזה מה שהיה יוצא עם `filled <- filled + vial`. כאן מוסיפים בכל סיבוב `1`, ולא את `vial`.'
    }
  },

  {
    id: 'loops-replace-not-add',
    station: 'loops',
    level: 1,
    context: 'כמה מ"ל תרופה יש בכל אחד משלושה בקבוקונים על הפס:',
    code: 'ml <- c(21, 25, 18)\nfor (m in ml) {\n  full <- m + 10\n}\nfull',
    options: ['28', '31 35 28', '31', '94'],
    answer: 0,
    hint: 'עקבו אחרי `full` סיבוב אחרי סיבוב. מה קורה לערך שהיה בו לפני כן?',
    explanation: [
      {
        text: 'בכל סיבוב `full <- m + 10` שם ב-`full` ערך **חדש**, והערך הקודם נמחק:',
        table: {
          columns: ['m', 'full'],
          rows: [['21', '31'], ['25', '35'], ['18', '28']],
          rowNames: ['1', '2', '3'],
          highlightRows: [2]
        }
      },
      {
        text: 'אחרי הלולאה נשאר ב-`full` רק הערך מהסיבוב האחרון, של הבקבוקון השלישי:',
        output: '[1] 28'
      }
    ],
    whyWrong: {
      1: 'ב-`full` לא נאספים כל הערכים: בכל סיבוב השורה `full <- m + 10` **מחליפה** את הערך הקודם. לכן אחרי הלולאה נשאר בו מספר אחד, מהסיבוב האחרון.',
      2: '`31` הוא הערך של `full` אחרי הסיבוב **הראשון**. הלולאה ממשיכה עוד שני סיבובים, ובכל אחד מהם `full` מקבל ערך חדש.',
      3: '`94` הוא `31 + 35 + 28`, כל התרופה בשלושת הבקבוקונים יחד. כדי לצבור סכום צריך להתחיל מ-`full <- 0` ולכתוב `full <- full + m + 10`. כאן `full` לא מופיע בצד ימין של החץ, ולכן כל סיבוב רק כותב ערך חדש.'
    }
  },

  // ---------- level 2 ----------
  {
    id: 'loops-grow-vector',
    station: 'loops',
    level: 2,
    context: 'כמה מנות נכנסו לכל אחד מארבעה בקבוקונים:',
    code: 'doses <- c(7, 2, 9, 4)\nready <- 0\nfor (d in doses) {\n  if (d > 5) {\n    ready <- c(ready, d)\n  }\n}\nready',
    options: ['7 9', '9 7 0', '0 7 9', '2'],
    answer: 2,
    hint: 'עקבו אחרי `ready` סיבוב אחרי סיבוב: מה יש בו לפני הסיבוב הראשון, ומה יש בו אחרי כל סיבוב?',
    explanation: [
      {
        text: 'בכל סיבוב `if` בודק אם `d > 5`. רק `7` ו-`9` עוברים:',
        vector: { values: ['7', '2', '9', '4'], marks: ['on', 'off', 'on', 'off'], labels: ['TRUE', 'FALSE', 'TRUE', 'FALSE'] }
      },
      {
        text: '`ready` מתחיל כ-`0`. `c(ready, d)` שומר את כל מה שכבר יש ב-`ready` ומוסיף את `d` **בסוף**:',
        table: {
          columns: ['d', 'd > 5', 'ready'],
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
      0: 'הלולאה לא מתחילה מווקטור ריק: היא מתחילה מ-`ready <- 0`. `c(ready, d)` שומר את מה שכבר היה ב-`ready`, ולכן ה-`0` נשאר בתחילת הווקטור.',
      1: '`c(ready, d)` שם את `d` **אחרי** `ready`, כלומר בסוף. הסדר `9 7 0` היה יוצא מ-`c(d, ready)`, שמוסיף כל מספר חדש בהתחלה.',
      3: '`2` הוא **מספר** הבקבוקונים שיש בהם יותר מ-5 מנות, כלומר `sum(doses > 5)`. הלולאה לא סופרת: היא אוספת את המספרים עצמם לתוך `ready`.'
    }
  },

  {
    id: 'loops-nrow-menu',
    station: 'loops',
    level: 2,
    context: 'רשימת הארגזים שיצאו מהפס: כמה בקבוקונים יש בכל ארגז, והאם הוא כבר נשלח לשכונות:',
    code: 'crates <- data.frame(\n  vials = c(18, 25, 42, 15),\n  sent = c("yes", "no", "yes", "no")\n)\nwaiting <- 0\nfor (i in 1:nrow(crates)) {\n  if (crates$sent[i] == "no") {\n    waiting <- waiting + crates$vials[i]\n  }\n}\nwaiting',
    options: ['40', '100', '60', '2'],
    answer: 0,
    hint: 'אילו ערכים מקבל `i`? ובאילו סיבובים התנאי שב-`if` נותן `TRUE`?',
    explanation: [
      {
        text: 'בטבלה יש 4 שורות, ולכן `1:nrow(crates)` הוא `1:4`: `i` עובר על **מספרי השורות**, ארגז אחרי ארגז.',
        table: {
          columns: ['vials', 'sent'],
          rows: [['18', 'yes'], ['25', 'no'], ['42', 'yes'], ['15', 'no']],
          rowNames: ['1', '2', '3', '4'],
          highlightRows: [1, 3]
        }
      },
      {
        text: 'רק בשורות שבהן `sent` הוא `"no"` (שורה 2 ושורה 4) מספר הבקבוקונים נוסף ל-`waiting`:',
        vector: { values: ['18', '25', '42', '15'], marks: ['off', 'on', 'off', 'on'], labels: ['"yes"', '"no"', '"yes"', '"no"'], showIndex: true }
      },
      {
        text: 'סך הכול `0 + 25 + 15`:',
        output: '[1] 40'
      }
    ],
    whyWrong: {
      1: '`100` הוא מספר הבקבוקונים בכל הארגזים, כלומר `sum(crates$vials)`. אבל `waiting` גדל רק בסיבובים שבהם `crates$sent[i] == "no"` נותן `TRUE`: בשורה 2 ובשורה 4.',
      2: '`60` הוא `18 + 42`, הבקבוקונים בארגזים **שכבר נשלחו**. התנאי בודק `== "no"`, ולכן נכנסים רק הארגזים שעוד מחכים.',
      3: '`2` הוא **מספר** הארגזים שעוד לא נשלחו. אבל ל-`waiting` מוסיפים את `crates$vials[i]`, כלומר את מספר הבקבוקונים בארגז, ולא `1`.'
    }
  },

  {
    id: 'loops-while-halving',
    station: 'loops',
    level: 2,
    context: 'פס הייצור מתחיל לעבוד עם מיכל תרופה חדש:',
    code: 'tank <- 100\nhours <- 0\nwhile (tank > 10) {\n  tank <- tank / 2\n  hours <- hours + 1\n}\nhours',
    options: ['3', '5', '6.25', '4'],
    answer: 3,
    hint: 'רשמו טבלה: מה הערך של `tank` בכל בדיקה של התנאי, ומה הערך של `hours` אחרי כל סיבוב.',
    explanation: [
      {
        text: 'בתחילת **כל** סיבוב R בודק את `tank > 10`. אם התשובה `TRUE`, הוא מחלק את `tank` ב-2 ומוסיף 1 ל-`hours`. כל שורה בטבלה היא בדיקה אחת: הערך של `tank` בזמן הבדיקה, והערך של `hours` אחרי הסיבוב:',
        table: {
          columns: ['tank', 'tank > 10', 'hours'],
          rows: [['100', 'TRUE', '1'], ['50', 'TRUE', '2'], ['25', 'TRUE', '3'], ['12.5', 'TRUE', '4'], ['6.25', 'FALSE', '4']],
          rowNames: ['1', '2', '3', '4', '5'],
          highlightRows: [3]
        }
      },
      {
        text: '`12.5` עדיין גדול מ-10, ולכן יש סיבוב רביעי. בבדיקה החמישית `tank` הוא `6.25`, התנאי `FALSE` והלולאה נגמרת:',
        output: '[1] 4'
      }
    ],
    whyWrong: {
      0: '`3` הוא מה ש-`while (tank / 2 > 10)` היה נותן: כאילו R בודק מראש אם המיכל **יירד** מתחת ל-10. אבל R בודק את `tank` כפי שהוא עכשיו: ב-`12.5` התנאי עדיין `TRUE`, ולכן יש סיבוב רביעי.',
      1: '`5` הוא מספר **הבדיקות** של התנאי: 4 בדיקות שנתנו `TRUE` ועוד בדיקה אחת שנתנה `FALSE`. אחרי הבדיקה האחרונה R יוצא מהלולאה בלי להריץ את הגוף, ולכן `hours` לא גדל בפעם החמישית.',
      2: '`6.25` הוא הערך של `tank` בסוף, כמה תרופה נשארה במיכל. אבל השורה האחרונה מדפיסה את `hours`, כלומר את מספר הסיבובים.'
    }
  },

  // ---------- level 3 ----------
  {
    id: 'loops-running-max',
    station: 'loops',
    level: 3,
    context: 'כמה בקבוקונים מילא הפס בכל אחת מחמש המשמרות של השבוע:',
    code: 'per_shift <- c(14, 22, 9, 22, 17)\nbest <- 0\nbest_shift <- 0\nfor (i in 1:length(per_shift)) {\n  if (per_shift[i] > best) {\n    best <- per_shift[i]\n    best_shift <- i\n  }\n}\nbest_shift',
    options: ['22', '2', '4', '5'],
    answer: 1,
    hint: 'עקבו אחרי `best` ו-`best_shift` סיבוב אחרי סיבוב. באילו סיבובים התנאי שב-`if` נותן `TRUE`?',
    explanation: [
      {
        text: 'בכל סיבוב `if` בודק אם במשמרת `i` מילאו יותר מהשיא שנשמר עד עכשיו ב-`best`. רק אם כן, `best` מקבל את הערך החדש ו-`best_shift` מקבל את **המיקום** `i`:',
        table: {
          columns: ['i', 'per_shift[i] > best', 'best', 'best_shift'],
          rows: [
            ['1', '14 > 0: TRUE', '14', '1'],
            ['2', '22 > 14: TRUE', '22', '2'],
            ['3', '9 > 22: FALSE', '22', '2'],
            ['4', '22 > 22: FALSE', '22', '2'],
            ['5', '17 > 22: FALSE', '22', '2']
          ],
          highlightRows: [3]
        }
      },
      {
        text: 'במשמרת 4 מילאו בדיוק כמו בשיא, אבל `22 > 22` הוא `FALSE`: `>` פירושו "גדול ממש". לכן השיא לא מתעדכן, ו-`best_shift` נשאר `2`:',
        output: '[1] 2'
      }
    ],
    whyWrong: {
      0: '`22` הוא מספר הבקבוקונים בשיא, והוא נשמר ב-`best`. אבל הקוד מדפיס את `best_shift`, ושם נשמר `i`, כלומר **המיקום** של המשמרת.',
      2: '`4` הוא מה שהיה יוצא עם `per_shift[i] >= best`: אז גם משמרת שמשתווה לשיא הייתה מחליפה אותו. עם `>` המשמרת הרביעית לא מעדכנת כלום, כי `22 > 22` הוא `FALSE`.',
      3: '`5` הוא הערך של `i` אחרי הלולאה, כי זה הסיבוב האחרון. אבל `best_shift` משתנה רק בתוך ה-`if`, ובמשמרת 5 `17 > 22` הוא `FALSE`.'
    }
  },

  {
    id: 'loops-repeat-first-round',
    station: 'loops',
    level: 3,
    context: 'בכל אחד משני הפסים מחכים עכשיו 10 בקבוקונים:',
    code: 'line1 <- 10\nwhile (line1 < 5) line1 <- line1 + 3\nline2 <- 10\nrepeat {\n  line2 <- line2 + 3\n  if (line2 >= 5) break\n}\nc(line1, line2)',
    options: ['10 10', '13 13', '10 13', '13 10'],
    answer: 2,
    hint: 'איפה כל אחת משתי הלולאות בודקת אם להמשיך: לפני הגוף, או בתוכו?',
    explanation: [
      {
        text: '`while` בודק את התנאי **לפני** כל סיבוב, גם לפני הראשון. `line1` הוא `10`, ו-`10 < 5` הוא `FALSE`, ולכן הגוף לא רץ אף פעם ו-`line1` נשאר `10`.'
      },
      {
        text: 'ל-`repeat` אין תנאי בהתחלה: R פשוט נכנס לגוף. הבדיקה היחידה היא ה-`if` שבתוך הגוף, ו-R מגיע אליה רק **אחרי** `line2 <- line2 + 3`. לכן הסיבוב הראשון רץ תמיד: `line2` הופך ל-`13`, ואז `13 >= 5` הוא `TRUE` ו-`break` עוצר.'
      },
      {
        text: 'הלולאה של `while` לא רצה בכלל, והלולאה של `repeat` רצה פעם אחת:',
        output: '[1] 10 13'
      }
    ],
    whyWrong: {
      0: 'זה היה נכון אם `repeat` היה בודק את התנאי לפני הסיבוב הראשון, כמו `while`. אבל ב-`repeat` הבדיקה היחידה היא ה-`if` שבתוך הגוף, ו-R מגיע אליה רק אחרי `line2 <- line2 + 3`. לכן `line2` גדל פעם אחת ל-`13`.',
      1: '`while` לא מריץ את הגוף "לפחות פעם אחת": הוא בודק את `line1 < 5` עוד לפני הסיבוב הראשון. `10 < 5` הוא `FALSE`, ולכן `line1` לא משתנה ונשאר `10`.',
      3: 'כאן שתי הלולאות התהפכו. דווקא `while` בודק לפני הסיבוב, ולכן לא רץ בכלל. `repeat` נכנס לגוף בלי בדיקה, ולכן רץ פעם אחת.'
    }
  },

  {
    id: 'loops-break-before-print',
    station: 'loops',
    level: 3,
    context: 'מעבירים בקבוקונים ממגשים לארגז אחד:',
    code: 'trays <- c(3, 5, 4, 6, 2)\nbox <- 0\nfor (n in trays) {\n  box <- box + n\n  if (box > 10) {\n    break\n  }\n  print(box)\n}',
    prompt: 'אילו מספרים יודפסו?',
    options: ['3 8 12', '3 8 12 18 20', '12', '3 8'],
    answer: 3,
    hint: 'עקבו אחרי `box` בכל סיבוב. באיזה סדר רצות השורות שבתוך הלולאה?',
    explanation: [
      {
        text: 'בכל סיבוב קודם מוסיפים לארגז את הבקבוקונים של המגש (`n`), ואחר כך בודקים אם `box > 10`:',
        table: {
          columns: ['n', 'box', 'box > 10', 'print(box)'],
          rows: [['3', '3', 'FALSE', '3'], ['5', '8', 'FALSE', '8'], ['4', '12', 'TRUE', '-']],
          rowNames: ['1', '2', '3'],
          highlightRows: [2]
        }
      },
      {
        text: '`break` יוצא מהלולאה **מיד**, לפני `print(box)`. המגשים `6` ו-`2` לא נבדקים בכלל:',
        output: '[1] 3\n[1] 8'
      }
    ],
    whyWrong: {
      0: 'בסיבוב השלישי `box` הופך ל-`12` והתנאי `TRUE`. `break` יוצא מהלולאה **מיד**, ולכן `print(box)`, שבא אחריו, לא רץ בסיבוב הזה.',
      1: '`break` לא יוצא רק מה-`if`: הוא עוצר את **כל** הלולאה. `3 8 12 18 20` הוא מה שהקוד היה מדפיס בלי ה-`if` וה-`break`.',
      2: '`12` הוא הערך של `box` כשהלולאה נעצרת, ואותו הייתם רואים אם הייתם כותבים `box` בשורה נפרדת אחרי הלולאה. אבל `print(box)` נמצא בתוך הלולאה, והוא מספיק לרוץ פעמיים לפני ה-`break`.'
    }
  },

  // ---------- level 1 ----------
  {
    id: 'loops-product-outfits',
    station: 'loops',
    level: 1,
    context: 'הבקבוקונים בפס מגיעים ב-3 גדלים, עם 2 צבעי מכסה ו-5 צבעי מדבקה:',
    code: 'choices <- c(3, 2, 5)\nkinds <- 0\nfor (k in choices) {\n  kinds <- kinds * k\n}\nkinds',
    options: ['30', '0', '10', '5'],
    answer: 1,
    hint: 'עקבו אחרי `kinds` סיבוב אחרי סיבוב, החל מהערך שלו לפני הלולאה.',
    explanation: [
      {
        text: '`kinds` מתחיל ב-`0`, ובכל סיבוב הוא נכפל ב-`k`:',
        table: {
          columns: ['k', 'kinds * k', 'kinds'],
          rows: [['3', '0 * 3', '0'], ['2', '0 * 2', '0'], ['5', '0 * 5', '0']],
          rowNames: ['1', '2', '3'],
          highlightRows: [0, 1, 2]
        }
      },
      {
        text: '`0` כפול כל מספר נשאר `0`. כדי לקבל מכפלה, צריך להתחיל מ-`1` (ואז היה יוצא `30`). אחרי הלולאה מודפס הערך של `kinds`:',
        output: '[1] 0'
      }
    ],
    whyWrong: {
      0: '`30` היה יוצא אם `kinds` היה מתחיל ב-`1`: `1 * 3 * 2 * 5`. כאן הוא מתחיל ב-`0`, ו-`0` כפול כל מספר נשאר `0`.',
      2: '`10` הוא הסכום `3 + 2 + 5`. אבל בלולאה כתוב `*`, לא `+`.',
      3: '`5` הוא הערך של `k` בסיבוב האחרון (מספר צבעי המדבקה). אבל בסוף מדפיסים את `kinds`, ובכל סיבוב `kinds * k` משתמש בערך הקודם של `kinds`, שהוא תמיד `0`.'
    }
  },

  {
    id: 'loops-index-update',
    station: 'loops',
    level: 1,
    context: 'כמה בקבוקונים יש עכשיו בכל אחד משלושת המגשים על הפס:',
    code: 'trays <- c(20, 35, 50)\nfor (i in 1:length(trays)) {\n  trays[i] <- trays[i] + 5\n}\ntrays',
    options: ['55', '6 7 8', '20 35 50', '25 40 55'],
    answer: 3,
    hint: 'אילו ערכים מקבל `i`? ולאן נכתבת התוצאה בשורה `trays[i] <- trays[i] + 5`?',
    explanation: [
      {
        text: '`length(trays)` הוא `3`, ולכן `i` עובר על **המיקומים** `1`, `2` ו-`3`. `trays[i]` הוא מספר הבקבוקונים במגש שנמצא במיקום `i`:',
        vector: { values: ['20', '35', '50'], marks: ['on', 'on', 'on'], showIndex: true }
      },
      {
        text: 'בכל סיבוב R לוקח את הערך שבמיקום `i`, מוסיף לו 5, וכותב את התוצאה **לאותו מיקום** בתוך `trays`:',
        table: {
          columns: ['i', 'trays[i] + 5', 'trays'],
          rows: [['1', '20 + 5 = 25', '25 35 50'], ['2', '35 + 5 = 40', '25 40 50'], ['3', '50 + 5 = 55', '25 40 55']],
          highlightRows: [2]
        }
      },
      {
        text: 'כל שלושת המגשים השתנו:',
        output: '[1] 25 40 55'
      }
    ],
    whyWrong: {
      0: '`55` הוא רק המגש האחרון אחרי התוספת. אבל כל סיבוב כותב למיקום **אחר** בווקטור (`trays[1]`, אחר כך `trays[2]`, ואז `trays[3]`), ולכן אף ערך לא נמחק.',
      1: '`6 7 8` הוא `i + 5`, כאילו `i` הוא מספר הבקבוקונים. אבל `i` הוא רק **המיקום** (`1`, `2`, `3`). את הערך עצמו מקבלים עם `trays[i]`.',
      2: 'זה מה שהיה מודפס אחרי `for (t in trays) { t <- t + 5 }`, כי שינוי של משתנה הלולאה לא משנה את הווקטור. כאן כותבים ישירות לתוך `trays[i]`, ולכן הווקטור עצמו משתנה.'
    }
  },

  {
    id: 'loops-one-value',
    station: 'loops',
    level: 1,
    context: 'בסוף המשמרת יצאו מהפס 4 ארגזים, ובכל ארגז 5 בקבוקונים:',
    code: 'crates <- 4\nvials <- 0\nfor (crate in crates) {\n  vials <- vials + 5\n}\nvials',
    options: ['5', '20', '0', '1'],
    answer: 0,
    hint: 'בדקו על אילו ערכים `crate` עובר. כמה סיבובים יוצאים מזה?',
    explanation: [
      {
        text: '`crates` הוא וקטור עם ערך **אחד**: `4`. `for (crate in crates)` עובר על הערכים שבווקטור, ולכן יש סיבוב אחד בלבד, ובו `crate` הוא `4`:',
        vector: { values: ['4'], marks: ['on'], showIndex: true }
      },
      {
        text: 'בסיבוב היחיד `vials` גדל ב-5, מ-`0` ל-`5`. (כדי לעבור על 4 ארגזים צריך `for (crate in 1:crates)`, כי `1:crates` הוא `1 2 3 4`.)',
        output: '[1] 5'
      }
    ],
    whyWrong: {
      1: '`20` הוא מה ש-`for (crate in 1:crates)` היה נותן: 4 סיבובים של `+ 5`. כאן כתוב `crates` בלי `1:`, ולכן הלולאה עוברת על וקטור שיש בו רק הערך `4`, ורצה פעם אחת.',
      2: 'הלולאה כן רצה: `crates` הוא וקטור עם ערך אחד, ולכן יש סיבוב אחד. בסיבוב הזה `vials` גדל מ-`0` ל-`5`.',
      3: '`1` הוא **מספר הסיבובים**. אבל בכל סיבוב מוסיפים ל-`vials` את `5`, ולא `1`.'
    }
  },

  {
    id: 'loops-rows-paste',
    station: 'loops',
    level: 1,
    context: 'טבלת המשלוחים: כמה ארגזי תרופה יוצאים לכל שכונה:',
    code: 'shipping <- data.frame(\n  area = c("North", "Port", "Hills", "Park"),\n  crates = c(5, 2, 1, 7)\n)\nfor (i in 1:nrow(shipping)) {\n  print(paste(shipping$area[i], shipping$crates[i]))\n}',
    prompt: 'מה יודפס?',
    options: ['"North 5" "Port 2"', '"Park 7"', '"North 5" "Port 2" "Hills 1" "Park 7"', '"North5" "Port2" "Hills1" "Park7"'],
    answer: 2,
    hint: 'כמה שורות יש בטבלה, וכמה עמודות? ומה `paste()` שם בין החלקים שהוא מחבר?',
    explanation: [
      {
        text: 'בטבלה יש 4 שורות ו-2 עמודות. `nrow(shipping)` סופר **שורות**, ולכן `1:nrow(shipping)` הוא `1:4`, ו-`i` עובר על מספרי השורות:',
        table: {
          columns: ['area', 'crates'],
          rows: [['North', '5'], ['Port', '2'], ['Hills', '1'], ['Park', '7']],
          rowNames: ['1', '2', '3', '4']
        }
      },
      {
        text: 'בכל סיבוב `shipping$area[i]` ו-`shipping$crates[i]` לוקחים את השכונה ואת מספר הארגזים **מאותה שורה**, ו-`paste()` מחבר אותם עם רווח. `print()` נמצא בתוך הלולאה, ולכן כל סיבוב מדפיס מדבקה משלו:',
        output: '[1] "North 5"\n[1] "Port 2"\n[1] "Hills 1"\n[1] "Park 7"'
      }
    ],
    whyWrong: {
      0: 'שני סיבובים היו יוצאים אם הלולאה הייתה עוברת על **העמודות** (יש 2: `area` ו-`crates`). אבל `nrow()` סופר **שורות**, ויש 4, ולכן יש 4 סיבובים.',
      1: '`"Park 7"` הוא רק מה שמודפס בסיבוב האחרון. `print()` נמצא **בתוך** הלולאה, ולכן הוא רץ בכל אחד מ-4 הסיבובים.',
      3: '`paste()` שם **רווח** בין החלקים כברירת מחדל. כדי לחבר בלי רווח צריך לכתוב `sep = ""`, כלומר `paste(shipping$area[i], shipping$crates[i], sep = "")`.'
    }
  },

  // ---------- level 2 ----------
  {
    id: 'loops-paste-sentence',
    station: 'loops',
    level: 2,
    context: 'המכונה מכינה כיתוב למדבקה של הבקבוקונים:',
    code: 'label <- "CURE"\nfor (part in c("B7", "North", "Sun")) {\n  label <- paste(label, part, sep = "-")\n}\nlabel',
    options: ['"CURE-Sun"', '"CURE-B7-North-Sun-"', '"B7-North-Sun"', '"CURE-B7-North-Sun"'],
    answer: 3,
    hint: 'עקבו אחרי `label` סיבוב אחרי סיבוב: מה יש בו לפני הסיבוב, ומה `paste()` מחזיר בסופו?',
    explanation: [
      {
        text: 'בכל סיבוב `paste()` מחבר את `label` **הקודם** עם החלק החדש, ושם `-` ביניהם. התוצאה נשמרת שוב ב-`label`:',
        table: {
          columns: ['part', 'label אחרי הסיבוב'],
          rows: [['"B7"', '"CURE-B7"'], ['"North"', '"CURE-B7-North"'], ['"Sun"', '"CURE-B7-North-Sun"']],
          rowNames: ['1', '2', '3'],
          highlightRows: [2]
        }
      },
      {
        text: '`sep = "-"` נכנס רק **בין** שני החלקים ש-`paste()` מחבר, ולכן אין `-` בסוף. אחרי הלולאה השורה `label` מדפיסה את מה שנבנה:',
        output: '[1] "CURE-B7-North-Sun"'
      }
    ],
    whyWrong: {
      0: 'זה מה שהיה יוצא עם `label <- paste("CURE", part, sep = "-")`: כל סיבוב היה מתחיל מחדש מ-`"CURE"`. כאן כל סיבוב מוסיף ל-`label` הקודם, שכבר מכיל את כל מה שנבנה עד עכשיו.',
      1: '`sep` נכנס רק **בין** החלקים ש-`paste()` מחבר, לא אחרי החלק האחרון. לכן אין `-` בסוף.',
      2: 'בסיבוב הראשון `paste(label, part, sep = "-")` מחבר את `"CURE"` עם `"B7"`. ה-`"CURE"` לא נמחק: הוא נשאר בהתחלה, וכל חלק חדש נוסף אחריו.'
    }
  },

  {
    id: 'loops-count-odd-mod',
    station: 'loops',
    level: 2,
    context: 'המספרים של חמשת הבקבוקונים שבמגש:',
    code: 'vials <- c(13, 8, 5, 20, 7)\nodd <- 0\nfor (v in vials) {\n  odd <- odd + v %% 2\n}\nodd',
    options: ['3', '2', '53', '1'],
    answer: 0,
    hint: 'מה מחזיר `v %% 2` כש-`v` זוגי, ומה כש-`v` אי-זוגי?',
    explanation: [
      {
        text: '`v %% 2` הוא השארית בחילוק ב-2: `1` למספר אי-זוגי ו-`0` למספר זוגי. R מחשב קודם את `%%` ורק אחר כך את `+`:',
        vector: { values: ['13', '8', '5', '20', '7'], marks: ['on', 'off', 'on', 'off', 'on'], labels: ['1', '0', '1', '0', '1'] }
      },
      {
        text: 'בכל סיבוב מוסיפים ל-`odd` את השארית, כלומר `1` רק כשמספר הבקבוקון אי-זוגי: `0 + 1 + 0 + 1 + 0 + 1`',
        output: '[1] 3'
      }
    ],
    whyWrong: {
      1: '`2` הוא מספר הבקבוקונים **הזוגיים** (`8` ו-`20`). אבל כשהמספר זוגי, `v %% 2` הוא `0`, ולכן דווקא הבקבוקונים הזוגיים לא מוסיפים כלום ל-`odd`.',
      2: '`53` הוא סכום המספרים של הבקבוקונים, מה שהיה יוצא עם `odd <- odd + v`. כאן מוסיפים רק את השארית `v %% 2`, שהיא תמיד `0` או `1`.',
      3: '`1` הוא `7 %% 2`, השארית של הבקבוקון האחרון בלבד. אבל `odd` מופיע גם בצד ימין של החץ, ולכן כל סיבוב מוסיף לסכום שכבר נצבר.'
    }
  },

  {
    id: 'loops-fill-zeros',
    station: 'loops',
    level: 2,
    context: 'במגש יש 5 בקבוקונים ריקים, ומכונת המילוי מתחילה לעבוד (הכמויות במ"ל):',
    code: 'tray <- rep(0, 5)\nfor (i in 1:3) {\n  tray[i] <- i * 10\n}\ntray',
    options: ['10 20 30', '10 20 30 0 0', '10 20 30 40 50', '0 0 0 0 0 10 20 30'],
    answer: 1,
    hint: 'כמה ערכים יש ב-`tray` לפני הלולאה, ולאילו מיקומים הלולאה כותבת?',
    explanation: [
      {
        text: '`rep(0, 5)` יוצר וקטור של חמישה אפסים, בקבוקון ריק בכל מיקום:',
        vector: { values: ['0', '0', '0', '0', '0'], showIndex: true }
      },
      {
        text: '`i` עובר על `1:3`, ובכל סיבוב `tray[i] <- i * 10` **מחליף** את הערך שבמיקום `i`. הלולאה לא מגיעה למיקומים 4 ו-5, ולכן נשארים בהם אפסים:',
        vector: { values: ['10', '20', '30', '0', '0'], marks: ['on', 'on', 'on', 'off', 'off'], labels: ['i = 1', 'i = 2', 'i = 3', '', ''], showIndex: true }
      },
      {
        text: 'הווקטור נשאר באורך 5:',
        output: '[1] 10 20 30  0  0'
      }
    ],
    whyWrong: {
      0: 'הלולאה לא מקצרת את `tray`: היא רק מחליפה את הערכים במיקומים `1`, `2` ו-`3`. האפסים במיקומים 4 ו-5 נשארים, ולכן הווקטור עדיין באורך 5.',
      2: 'הלולאה עוברת על `1:3`, ולא על כל חמשת המיקומים. `10 20 30 40 50` היה יוצא עם `for (i in 1:5)`.',
      3: 'זה היה יוצא עם `tray <- c(tray, i * 10)`, שמוסיף ערך חדש **בסוף** הווקטור. `tray[i] <- ...` לא מוסיף מקום: הוא כותב **במקום** הערך שכבר נמצא במיקום `i`.'
    }
  },

  // ---------- level 3 ----------
  {
    id: 'loops-daily-change',
    station: 'loops',
    level: 3,
    context: 'כמה ליטרים של תרופה היו במיכל בכל בוקר, מיום ראשון עד יום רביעי:',
    code: 'tank <- data.frame(\n  day = c("Sun", "Mon", "Tue", "Wed"),\n  liters = c(20, 24, 19, 22)\n)\ntank$change <- 0\nfor (i in 2:nrow(tank)) {\n  tank$change[i] <- tank$liters[i] - tank$liters[i - 1]\n}\ntank$change',
    options: ['4 -5 3', '0 -4 5 -3', '0 4 -5 3', 'NA 4 -5 3'],
    answer: 2,
    hint: 'מה יש בעמודה `change` עוד לפני הלולאה? ומאיזו שורה הלולאה מתחילה?',
    explanation: [
      {
        text: '`tank$change <- 0` יוצר עמודה חדשה ושם `0` בכל 4 השורות. `2:nrow(tank)` הוא `2:4`, ולכן הלולאה מתחילה **משורה 2**, ולא נוגעת בשורה 1.'
      },
      {
        text: 'בכל סיבוב מחסירים מהכמות של היום (`liters[i]`) את הכמות של היום הקודם (`liters[i - 1]`):',
        table: {
          columns: ['day', 'liters', 'change'],
          rows: [['Sun', '20', '0'], ['Mon', '24', '24 - 20 = 4'], ['Tue', '19', '19 - 24 = -5'], ['Wed', '22', '22 - 19 = 3']],
          rowNames: ['1', '2', '3', '4'],
          highlightRows: [1, 2, 3]
        }
      },
      {
        text: 'בשורה 1 נשאר ה-`0` שנכתב לפני הלולאה, ולכן בעמודה יש 4 ערכים:',
        output: '[1]  0  4 -5  3'
      }
    ],
    whyWrong: {
      0: 'הלולאה מחשבת רק 3 ערכים, אבל היא כותבת אותם **לתוך** עמודה שיש בה כבר 4 שורות. שורה 1 לא נמחקת: נשאר בה ה-`0` שנכתב לפני הלולאה.',
      1: 'זה מה שהיה מודפס עם `tank$liters[i - 1] - tank$liters[i]`, כלומר חיסור בכיוון ההפוך. הקוד מחסיר את היום **הקודם** מהיום הנוכחי, ולכן כשהכמות עולה מ-`20` ל-`24` מקבלים `4` חיובי.',
      3: 'נכון שלשורה 1 אין יום קודם, אבל הלולאה לא מגיעה אליה בכלל (היא מתחילה מ-`2`). לפני הלולאה `tank$change <- 0` שם `0` בכל השורות, ולכן בשורה 1 נשאר `0`, ולא `NA`.'
    }
  },

  {
    id: 'loops-shift-overwrite',
    station: 'loops',
    level: 3,
    context: 'המספרים של ארבעת הבקבוקונים שעל הפס, לפי הסדר:',
    code: 'line <- c(5, 8, 2, 9)\nfor (i in 1:3) {\n  line[i + 1] <- line[i]\n}\nline',
    options: ['5 5 5 5', '5 5 8 2', '8 2 9 9', '5 5 5 9'],
    answer: 0,
    hint: 'רשמו את כל `line` אחרי כל סיבוב. מה יש ב-`line[2]` כשמגיעים לסיבוב השני?',
    explanation: [
      {
        text: 'בכל סיבוב הערך שבמיקום `i` נכתב למיקום `i + 1`. הלולאה קוראת וכותבת באותו וקטור, ולכן כל סיבוב רואה את מה שהסיבוב הקודם כבר **שינה**:',
        table: {
          columns: ['i', 'line[i + 1] <- line[i]', 'line'],
          rows: [['1', 'line[2] <- 5', '5 5 2 9'], ['2', 'line[3] <- 5', '5 5 5 9'], ['3', 'line[4] <- 5', '5 5 5 5']],
          highlightRows: [1, 2]
        }
      },
      {
        text: 'בסיבוב השני `line[2]` כבר `5` (ולא `8`), ובסיבוב השלישי `line[3]` כבר `5` (ולא `2`). כך ה-`5` עובר עד הסוף:',
        output: '[1] 5 5 5 5'
      }
    ],
    whyWrong: {
      1: '`5 5 8 2` היה יוצא אם כל סיבוב היה קורא מהווקטור **המקורי**. אבל בסיבוב הראשון `line[2]` כבר הוחלף ב-`5`, ולכן בסיבוב השני נכתב `5`, ולא `8`.',
      2: '`8 2 9 9` היה יוצא עם `line[i] <- line[i + 1]`, כלומר הזזה לכיוון ההפוך. כאן הערך שבמיקום `i` נכתב **לתוך** מיקום `i + 1`.',
      3: '`5 5 5 9` הוא מה שיש ב-`line` אחרי שני סיבובים בלבד. `1:3` נותן שלושה סיבובים, ובסיבוב השלישי גם `line[4]` מקבל `5`.'
    }
  },

  {
    id: 'loops-laugh-collapse',
    station: 'loops',
    level: 3,
    context: 'מכונת המילוי מצפצפת כשהיא מתחילה לעבוד:',
    code: 'for (i in 1:3) {\n  beep <- paste(rep("bip", i), collapse = "")\n  print(beep)\n}',
    prompt: 'מה יודפס?',
    options: ['"bip" "bip bip" "bip bip bip"', '"bip" "bipbip" "bipbipbip"', '"bipbipbip"', '"bip" "bip" "bip" "bip" "bip" "bip"'],
    answer: 1,
    hint: 'כמה פעמים `rep()` חוזר על `"bip"` בכל סיבוב? ומה `collapse = ""` עושה לווקטור שהוא מקבל?',
    explanation: [
      {
        text: 'בכל סיבוב `rep("bip", i)` יוצר וקטור שבו `"bip"` חוזר `i` פעמים. למשל, בסיבוב השלישי:',
        vector: { values: ['"bip"', '"bip"', '"bip"'], marks: ['on', 'on', 'on'], showIndex: true }
      },
      {
        text: '`collapse = ""` מחבר את כל האיברים של הווקטור לטקסט **אחד**, בלי שום דבר ביניהם:',
        table: {
          columns: ['i', 'rep("bip", i)', 'beep'],
          rows: [['1', '"bip"', '"bip"'], ['2', '"bip" "bip"', '"bipbip"'], ['3', '"bip" "bip" "bip"', '"bipbipbip"']],
          highlightRows: [0, 1, 2]
        }
      },
      {
        text: '`print(beep)` נמצא בתוך הלולאה, ולכן כל סיבוב מדפיס טקסט אחד:',
        output: '[1] "bip"\n[1] "bipbip"\n[1] "bipbipbip"'
      }
    ],
    whyWrong: {
      0: 'הרווח של ברירת המחדל שייך ל-`sep`, שמפריד בין **כמה חלקים נפרדים** בתוך `paste()`. כאן `paste()` מקבל רק וקטור אחד, ו-`collapse = ""` מחבר את האיברים שלו בלי שום רווח. (`collapse = " "` היה נותן `"bip bip bip"`.)',
      2: '`"bipbipbip"` הוא רק מה שמודפס בסיבוב האחרון. `print(beep)` נמצא בתוך הלולאה, ולכן גם הסיבוב הראשון והסיבוב השני מדפיסים.',
      3: 'זה מה שהיה מודפס בלי `collapse`: אז `paste(rep("bip", i))` מחזיר וקטור של כמה טקסטים נפרדים. `collapse = ""` מחבר אותם לטקסט **אחד** בכל סיבוב.'
    }
  },

  // ---------- level 1 ----------
  {
    id: 'loops-while-false-start',
    station: 'loops',
    level: 1,
    context: 'בתור של מכונת המילוי מחכים 4 בקבוקונים:',
    code: 'waiting <- 4\nwhile (waiting > 6) {\n  waiting <- waiting - 2\n}\nwaiting',
    options: ['2', '6', '4', 'שגיאה (Error)'],
    answer: 2,
    hint: 'מתי R בודק את התנאי של `while` בפעם הראשונה: לפני הסיבוב הראשון, או אחריו?',
    explanation: [
      {
        text: 'R בודק את התנאי של `while` **לפני** כל סיבוב, וגם לפני הסיבוב הראשון. בבדיקה הראשונה `waiting` הוא `4`, ו-`4 > 6` הוא `FALSE`.'
      },
      {
        text: 'התנאי `FALSE` כבר בבדיקה הראשונה, ולכן R לא נכנס ללולאה אפילו פעם אחת וממשיך לשורה שאחריה. `waiting` נשאר כמו שהיה:',
        output: '[1] 4'
      }
    ],
    whyWrong: {
      0: '`2` היה יוצא אם R היה מריץ את גוף הלולאה פעם אחת **לפני** שהוא בודק את התנאי. אבל `while` בודק את התנאי כבר לפני הסיבוב הראשון, וכאן הוא `FALSE` מההתחלה.',
      1: 'הלולאה לא מביאה את `waiting` עד למספר שבתנאי. היא רק מורידה 2 בכל סיבוב, וגם זה רק כשהתנאי `TRUE`. כאן `4 > 6` הוא `FALSE`, ולכן `waiting` לא משתנה בכלל.',
      3: 'לולאה שהתנאי שלה `FALSE` כבר בהתחלה היא לא שגיאה. R פשוט מדלג עליה וממשיך לשורה הבאה, `waiting`, שמדפיסה `4`.'
    }
  },

  {
    id: 'loops-for-var-after',
    station: 'loops',
    level: 1,
    context: 'המכונה סוגרת מכסים במגש אחרי מגש. יש 4 מגשים, ובכל מגש 5 בקבוקונים:',
    code: 'for (tray in 1:4) {\n  closed <- tray * 5\n}\ntray <- tray + 10\ntray',
    options: ['14', '15', '11', 'שגיאה (Error)'],
    answer: 0,
    hint: 'מה יש ב-`tray` ברגע שהלולאה נגמרת?',
    explanation: [
      {
        text: 'בכל סיבוב `tray` מקבל את הערך הבא מתוך `1:4`. בסיבוב האחרון הוא `4`:',
        vector: { values: ['1', '2', '3', '4'], marks: ['off', 'off', 'off', 'on'] }
      },
      {
        text: 'כשהלולאה נגמרת, `tray` לא נמחק. הוא משתנה רגיל, ונשאר בו הערך מהסיבוב האחרון: `4`.'
      },
      {
        text: 'השורה `tray <- tray + 10` מוסיפה לו 10, והשורה האחרונה מדפיסה אותו:',
        output: '[1] 14'
      }
    ],
    whyWrong: {
      1: '`15` היה יוצא אם `tray` היה מגיע ל-`5` בסוף הלולאה. אבל `for` נותן ל-`tray` רק את הערכים שבתוך `1:4`, והאחרון מהם הוא `4`. אין עוד צעד אחרי הסיבוב האחרון.',
      2: '`11` היה יוצא אם `tray` היה חוזר לערך הראשון, `1`, כשהלולאה נגמרת. אבל נשאר בו הערך מהסיבוב **האחרון**, `4`.',
      3: 'המשתנה של `for` לא קיים רק בתוך הלולאה. אחרי הלולאה `tray` הוא משתנה רגיל עם הערך `4`, ואפשר להמשיך להשתמש בו ולשנות אותו.'
    }
  },

  {
    id: 'loops-while-lte-limit',
    station: 'loops',
    level: 1,
    context: 'ממלאים בקבוקון גדול במנות של 5 מ"ל:',
    code: 'vial <- 0\nwhile (vial + 5 <= 15) {\n  vial <- vial + 5\n}\nvial',
    options: ['20', '3', '10', '15'],
    answer: 3,
    hint: 'עברו סיבוב אחרי סיבוב: מה הערך של `vial` בכל בדיקה של התנאי, ומה התנאי מחשב ממנו?',
    explanation: [
      {
        text: 'לפני כל סיבוב `while` בודק את התנאי `vial + 5 <= 15`, כלומר אם המנה הבאה תיכנס:',
        table: {
          columns: ['vial לפני', 'vial + 5 <= 15', 'vial אחרי'],
          rows: [['0', 'TRUE', '5'], ['5', 'TRUE', '10'], ['10', 'TRUE', '15'], ['15', 'FALSE', '—']],
          rowNames: ['1', '2', '3', '4'],
          highlightRows: [3]
        }
      },
      {
        text: 'כש-`vial` הוא `15`, הבדיקה היא `20 <= 15`, וזה `FALSE`, ולכן הלולאה נעצרת בלי להוסיף עוד מנה:',
        output: '[1] 15'
      }
    ],
    whyWrong: {
      0: '`20` היה יוצא עם `while (vial <= 15)`: אז גם כש-`vial` הוא `15` התנאי נכון, ועוד סיבוב מוסיף 5. כאן התנאי בודק את `vial + 5`, כלומר אם המנה **הבאה** תיכנס, ולכן הלולאה עוצרת ב-`15`.',
      1: '`3` הוא מספר הסיבובים שהלולאה רצה, כלומר מספר המנות. אבל השורה האחרונה מדפיסה את `vial`, לא סופרת סיבובים.',
      2: '`<=` פירושו "קטן **או שווה**". כש-`vial` הוא `10`, הבדיקה היא `15 <= 15`, וזה `TRUE`, ולכן יש עוד סיבוב.'
    }
  },

  // ---------- level 2 ----------
  {
    id: 'loops-while-and-stop',
    station: 'loops',
    level: 2,
    context: 'במיכל יש 100 ליטר תרופה, וכל ארגז שהפס ממלא לוקח ממנו 15 ליטר:',
    code: 'tank <- 100\ncrates <- 0\nwhile (tank >= 15 & crates < 4) {\n  tank <- tank - 15\n  crates <- crates + 1\n}\ntank',
    options: ['10', '40', '55', '4'],
    answer: 1,
    hint: 'מתי תנאי עם `&` הוא `TRUE`? עקבו אחרי `tank` ו-`crates` יחד, בדיקה אחרי בדיקה.',
    explanation: [
      {
        text: 'בתחילת כל סיבוב R בודק את שני התנאים. כל שורה בטבלה היא בדיקה אחת:',
        table: {
          columns: ['tank', 'crates', 'tank >= 15', 'crates < 4'],
          rows: [
            ['100', '0', 'TRUE', 'TRUE'],
            ['85', '1', 'TRUE', 'TRUE'],
            ['70', '2', 'TRUE', 'TRUE'],
            ['55', '3', 'TRUE', 'TRUE'],
            ['40', '4', 'TRUE', 'FALSE']
          ],
          rowNames: ['1', '2', '3', '4', '5'],
          highlightRows: [4]
        }
      },
      {
        text: '`&` נותן `TRUE` רק כששני התנאים `TRUE`. בבדיקה החמישית `crates < 4` הוא `FALSE`, ולכן הלולאה נעצרת, אף על פי שבמיכל נשאר מספיק לעוד ארגזים:',
        output: '[1] 40'
      }
    ],
    whyWrong: {
      0: '`10` הוא מה שהיה יוצא עם `|` במקום `&`: הלולאה הייתה ממשיכה כל עוד **אחד** התנאים `TRUE`, כלומר עד שהמיכל יורד מתחת ל-15. עם `&` היא נעצרת ברגע שתנאי אחד נהיה `FALSE`, וזה קורה כש-`crates` מגיע ל-`4`.',
      2: '`55` היה נשאר אחרי 3 ארגזים בלבד, כאילו `crates < 4` מאפשר רק 3. אבל התנאי נבדק **לפני** הסיבוב: כש-`crates` הוא `3`, `3 < 4` הוא `TRUE`, ולכן יש ארגז רביעי והמיכל יורד ל-`40`.',
      3: '`4` הוא הערך של `crates`, מספר הארגזים. אבל השורה האחרונה מדפיסה את `tank`.'
    }
  },

  {
    id: 'loops-flag-stays-true',
    station: 'loops',
    level: 2,
    context: 'המשקל (בגרם) של ארבעה בקבוקונים מלאים שיצאו מהפס:',
    code: 'weights <- c(45, 22, 38, 50)\nalarm <- FALSE\nfor (w in weights) {\n  if (w < 30) {\n    alarm <- TRUE\n  }\n}\nalarm',
    options: ['FALSE', 'FALSE TRUE FALSE FALSE', '1', 'TRUE'],
    answer: 3,
    hint: 'עקבו אחרי `alarm` סיבוב אחרי סיבוב. איזו שורה משנה אותו, ובאילו סיבובים היא רצה?',
    explanation: [
      {
        text: 'בכל סיבוב `if` בודק את `w < 30`. רק בבקבוקון השני, `22`, התשובה `TRUE`:',
        vector: { values: ['45', '22', '38', '50'], marks: ['off', 'on', 'off', 'off'], labels: ['FALSE', 'TRUE', 'FALSE', 'FALSE'] }
      },
      {
        text: 'אין כאן `else`, ולכן בסיבובים שבהם התנאי `FALSE` אף שורה לא נוגעת ב-`alarm`. מהרגע שהוא נהיה `TRUE`, הוא נשאר כך:',
        table: {
          columns: ['w', 'w < 30', 'alarm'],
          rows: [['45', 'FALSE', 'FALSE'], ['22', 'TRUE', 'TRUE'], ['38', 'FALSE', 'TRUE'], ['50', 'FALSE', 'TRUE']],
          highlightRows: [1]
        }
      },
      {
        text: 'אחרי הלולאה:',
        output: '[1] TRUE'
      }
    ],
    whyWrong: {
      0: '`alarm` לא חוזר ל-`FALSE` בבקבוקונים התקינים: אין `else`, ושום שורה לא מחזירה אותו. אחרי שהוא נהיה `TRUE` בבקבוקון השני, הוא נשאר `TRUE` עד הסוף, גם אם הבקבוקון האחרון תקין.',
      1: '`FALSE TRUE FALSE FALSE` הוא מה ש-`weights < 30` מדפיס: תשובה לכל בקבוקון. אבל `alarm` הוא ערך אחד שהלולאה משנה, ולא וקטור שאוסף תשובה מכל סיבוב.',
      2: '`1` הוא מספר הבקבוקונים הקלים מדי, כלומר `sum(weights < 30)`. אבל `alarm <- TRUE` לא מוסיף 1: הוא שם ב-`alarm` את הערך `TRUE`.'
    }
  },

  {
    id: 'loops-if-else-score',
    station: 'loops',
    level: 2,
    context: 'בדיקת האיכות בסוף הפס סימנה חמישה בקבוקונים:',
    code: 'checks <- c("ok", "cracked", "ok", "cracked", "ok")\npoints <- 0\nfor (v in checks) {\n  if (v == "ok") {\n    points <- points + 3\n  } else {\n    points <- points - 1\n  }\n}\npoints',
    options: ['7', '9', '15', '3'],
    answer: 0,
    hint: 'עקבו אחרי `points` סיבוב אחרי סיבוב. איזה חלק של ה-`if` רץ בכל סיבוב?',
    explanation: [
      {
        text: 'בכל סיבוב R בודק את `v == "ok"`. אם התשובה `TRUE`, רץ החלק של `if` (מוסיפים 3). אם היא `FALSE`, רץ החלק של `else` (מורידים 1):',
        vector: { values: ['"ok"', '"cracked"', '"ok"', '"cracked"', '"ok"'], marks: ['on', 'off', 'on', 'off', 'on'], labels: ['+3', '-1', '+3', '-1', '+3'] }
      },
      {
        text: '`points` מצטבר מסיבוב לסיבוב:',
        table: {
          columns: ['v', 'points'],
          rows: [['"ok"', '3'], ['"cracked"', '2'], ['"ok"', '5'], ['"cracked"', '4'], ['"ok"', '7']],
          highlightRows: [4]
        }
      },
      {
        text: 'סך הכול `3 + 3 + 3 - 1 - 1`:',
        output: '[1] 7'
      }
    ],
    whyWrong: {
      1: '`9` הוא מה שהקוד היה מדפיס בלי ה-`else`: רק הבקבוקונים התקינים היו משנים את `points`. אבל כאן, כש-`v` הוא `"cracked"`, רץ החלק של `else` ומוריד נקודה, וזה קורה פעמיים.',
      2: '`15` היה יוצא אם כל חמשת הסיבובים היו מוסיפים 3. אבל `if` בודק את `v` בכל סיבוב מחדש, ובסיבובים של `"cracked"` רץ דווקא ה-`else`.',
      3: '`3` הוא מספר הבקבוקונים התקינים, `sum(checks == "ok")`. אבל הלולאה לא סופרת בקבוקונים: היא מוסיפה 3 על כל `"ok"` ומורידה 1 על כל `"cracked"`.'
    }
  },

  {
    id: 'loops-while-break-early',
    station: 'loops',
    level: 2,
    context: 'הפס ממלא ארגז אחרי ארגז, ובכל ארגז 400 בקבוקונים:',
    code: 'vials <- 0\ncrates <- 0\nwhile (crates < 10) {\n  crates <- crates + 1\n  vials <- vials + 400\n  if (vials >= 1500) break\n}\ncrates',
    options: ['10', '3', '4', '1600'],
    answer: 2,
    hint: 'יש כאן שתי דרכים לצאת מהלולאה. איזו מהן קורה קודם?',
    explanation: [
      {
        text: 'בכל סיבוב `crates` גדל ב-1 ו-`vials` גדל ב-400. אחר כך `if` בודק אם `vials >= 1500`:',
        table: {
          columns: ['crates', 'vials', 'vials >= 1500'],
          rows: [['1', '400', 'FALSE'], ['2', '800', 'FALSE'], ['3', '1200', 'FALSE'], ['4', '1600', 'TRUE']],
          highlightRows: [3]
        }
      },
      {
        text: 'בסיבוב הרביעי התנאי `TRUE`, ו-`break` יוצא מהלולאה **מיד**, אף על פי שהתנאי של `while` (`4 < 10`) עדיין `TRUE`:',
        output: '[1] 4'
      }
    ],
    whyWrong: {
      0: '`10` הוא מה שהקוד היה מדפיס בלי השורה של `break`. לולאת `while` לא חייבת לחכות שהתנאי שלה יהיה `FALSE`: `break` עוצר אותה מיד, וכאן זה קורה כבר בארגז הרביעי.',
      1: 'אחרי 3 ארגזים `vials` הוא `1200`, עדיין פחות מ-1500, ולכן אין `break`. ה-`if` בא **אחרי** ההוספה: בארגז הרביעי `vials` מגיע ל-`1600` ורק אז `break`, כש-`crates` כבר `4`.',
      3: '`1600` הוא הערך של `vials` כשהלולאה נעצרת. אבל השורה האחרונה מדפיסה את `crates`, מספר הארגזים.'
    }
  },

  // ---------- level 3 ----------
  {
    id: 'loops-next-after-total',
    station: 'loops',
    level: 3,
    context: 'כמה בקבוקונים יצאו בכל אחד מארבעת המשלוחים של היום:',
    code: 'shipments <- c(120, 300, 80, 250)\ntotal <- 0\nsmall <- 0\nfor (n in shipments) {\n  total <- total + n\n  if (n > 200) next\n  small <- small + 1\n}\nc(total, small)',
    options: ['200 2', '750 2', '420 1', '750 4'],
    answer: 1,
    hint: 'שימו לב איפה `next` נמצא. אילו שורות כבר רצו בסיבוב לפני ש-R מגיע אליו, ואילו עוד לא?',
    explanation: [
      {
        text: 'בכל סיבוב השורה הראשונה מוסיפה את `n` ל-`total`, **לפני** הבדיקה. רק אחר כך `if` בודק אם `n > 200`:',
        table: {
          columns: ['n', 'total', 'n > 200', 'small'],
          rows: [['120', '120', 'FALSE', '1'], ['300', '420', 'TRUE', '1'], ['80', '500', 'FALSE', '2'], ['250', '750', 'TRUE', '2']],
          highlightRows: [1, 3]
        }
      },
      {
        text: 'כש-`n` הוא `300` או `250`, `next` מדלג רק על מה שבא **אחריו** בסיבוב (`small <- small + 1`) ועובר למשלוח הבא. השורה `total <- total + n` באה לפניו, ולכן היא כבר רצה גם בסיבובים האלה:',
        vector: { values: ['120', '300', '80', '250'], marks: ['on', 'off', 'on', 'off'], labels: ['small + 1', 'next', 'small + 1', 'next'] }
      },
      {
        text: '`total` כולל את הבקבוקונים של כל המשלוחים, ו-`small` סופר רק את המשלוחים הקטנים:',
        output: '[1] 750   2'
      }
    ],
    whyWrong: {
      0: '`200 2` היה יוצא אם `next` היה מבטל את **כל** הסיבוב, כולל השורה שלפניו. אבל `total <- total + n` כבר רץ לפני ש-R הגיע ל-`next`, ולכן גם `300` וגם `250` נכנסים ל-`total`.',
      2: '`420 1` הוא מה שהקוד היה מדפיס עם `break` במקום `next`: הלולאה הייתה נעצרת לגמרי במשלוח של 300 בקבוקונים. `next` רק מדלג לסיבוב הבא, והלולאה ממשיכה למשלוחים `80` ו-`250`.',
      3: '`750 4` הוא מה שהקוד היה מדפיס בלי השורה של `next`. כש-`n > 200`, `next` מדלג על `small <- small + 1`, ולכן המשלוחים הגדולים לא נספרים ב-`small`.'
    }
  },

  {
    id: 'loops-if-state-changes',
    station: 'loops',
    level: 3,
    context: 'המכונה עובדת 4 שעות ליד מיכל התרופה, ובהתחלה יש בו 17 ליטר:',
    code: 'tank <- 17\nfor (h in 1:4) {\n  if (tank < 20) {\n    tank <- tank + 4\n  } else {\n    tank <- tank - 3\n  }\n}\ntank',
    options: ['19', '33', '21', '22'],
    answer: 0,
    hint: 'רשמו טבלה: מה הערך של `tank` בתחילת כל סיבוב, ואיזה חלק של ה-`if` רץ בו.',
    explanation: [
      {
        text: 'ה-`if` נמצא בתוך הלולאה, ולכן בכל סיבוב R בודק את `tank < 20` מחדש, עם הערך **הנוכחי** של `tank`. בכל שורה: הבדיקה בתחילת הסיבוב, והערך של `tank` בסופו:',
        table: {
          columns: ['h', 'tank < 20', 'tank'],
          rows: [['1', '17 < 20: TRUE', '21'], ['2', '21 < 20: FALSE', '18'], ['3', '18 < 20: TRUE', '22'], ['4', '22 < 20: FALSE', '19']],
          highlightRows: [3]
        }
      },
      {
        text: 'בכל פעם שהמיכל עובר את 20 ליטר, בסיבוב הבא רץ ה-`else` ומוריד 3. אחרי 4 סיבובים:',
        output: '[1] 19'
      }
    ],
    whyWrong: {
      1: '`33` היה יוצא אם R היה בודק את התנאי פעם אחת בלבד, בהתחלה (`17 < 20`), ומוסיף 4 בכל ארבע השעות. אבל ה-`if` נמצא בתוך הלולאה, ולכן R בודק אותו מחדש בכל סיבוב, עם הערך החדש של `tank`.',
      2: '`21` הוא הערך אחרי השעה הראשונה, כשהמיכל עובר את 20. אבל זאת לולאת `for (h in 1:4)`: היא רצה בדיוק 4 סיבובים, ולא נעצרת כשמגיעים ל-20.',
      3: '`22` הוא הערך אחרי 3 סיבובים בלבד. `1:4` נותן 4 סיבובים, ובסיבוב הרביעי `22 < 20` הוא `FALSE`, ולכן רץ ה-`else` ומוריד 3.'
    }
  },

  {
    id: 'loops-while-even-bonus',
    station: 'loops',
    level: 3,
    context: 'משמרת חדשה מתחילה בפס הייצור, ושיר מצטרפת לצוות:',
    code: 'filled <- 0\nhour <- 0\nwhile (filled < 100) {\n  hour <- hour + 1\n  filled <- filled + 20\n  if (hour %% 2 == 0) filled <- filled + 15\n}\nc(hour, filled)',
    options: ['5 100', '4 110', '3 105', '3 75'],
    answer: 1,
    hint: 'עקבו אחרי `hour` ו-`filled` יחד. באילו שעות `hour %% 2 == 0`? ומתי R בודק את `filled < 100`?',
    explanation: [
      {
        text: 'בכל סיבוב `hour` גדל ב-1 ו-`filled` גדל ב-20. אם מספר השעה זוגי (`hour %% 2 == 0`), שיר ממלאת עוד 15:',
        table: {
          columns: ['hour', 'hour %% 2 == 0', 'filled'],
          rows: [['1', 'FALSE', '20'], ['2', 'TRUE', '55'], ['3', 'FALSE', '75'], ['4', 'TRUE', '110']],
          highlightRows: [1, 3]
        }
      },
      {
        text: 'R בודק את `filled < 100` רק בתחילת כל סיבוב. אחרי השעה השלישית `filled` הוא `75`, ולכן יש שעה רביעית. בבדיקה שאחריה `110 < 100` הוא `FALSE`, והלולאה נגמרת:',
        output: '[1]   4 110'
      }
    ],
    whyWrong: {
      0: '`5 100` הוא מה שהקוד היה מדפיס בלי השורה של התוספת. אבל בשעות 2 ו-4 `hour %% 2 == 0` הוא `TRUE` ונוספים עוד 15, ולכן עוברים את 100 כבר בשעה הרביעית.',
      2: '`3 105` היה יוצא אם התוספת הייתה נכנסת **בכל** שעה. אבל `hour %% 2 == 0` הוא `TRUE` רק כשהשארית של החלוקה ב-2 היא 0, כלומר בשעות הזוגיות: 2 ו-4.',
      3: '`3 75` הוא המצב אחרי 3 שעות, כאילו הלולאה נעצרת לפני ש-`filled` עובר את 100. אבל `75 < 100` עדיין `TRUE`, ולכן יש סיבוב רביעי, ורק אחריו `filled` הוא `110`.'
    }
  }
];
