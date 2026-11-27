# התפרצות (Outbreak): R exam practice game

A phone-friendly practice game for the first-semester "Intro to R" course. Every question is a short piece of R code and
the students pick what R prints, just like the exam. The story is only flavour: a mysterious virus is spreading, and
every right answer brings the cure closer.

The interface is in Hebrew. There are 7 lab stations, one per course week (1–7), with 203 questions in all: 29 per
station (10 easy, 10 medium, 9 hard), written from the course material in the exam's style. Every answer was checked in
real R, and every question was compared with the exam so that none of the exam's own questions (or close variations of
them) is in the game.

## Play it

- **On your computer:** open `index.html` in a browser (double-click works, no server needed).
- **For the students:** publish the repo with GitHub Pages: on GitHub go to *Settings → Pages*, choose
  *Deploy from a branch*, pick the branch and the `/ (root)` folder, and save. The game will be at
  `https://<user>.github.io/<repo>/`. Send that link to the students.

Progress is saved in each student's own browser (nothing is sent anywhere).

## How the game works

- **The story:** the students are the lab team making the cure, and the 7 stations are the steps of that work
  (registering at the lab, collecting samples, the microscope, the sample freezer, the lab robot, the testing machine,
  the production line). Every question happens inside its station's story. A short story screen opens each station
  the first time it is played in a round, and the stories are written in `js/config.js`.
- **Lab stations** (one per week) are all open: students practise whatever they want, in any order. Each run draws
  9 of the station's questions (3 easy, 3 medium, 3 hard), questions the student has never seen first, so playing a
  station again brings new questions. A run starts with 3 samples (lives).
- A wrong answer costs a sample and shows a step-by-step explanation of what R did, plus why that specific wrong
  answer is tempting.
- **The cure %** grows with right answers and reaches 100% when every station has been completed. Then
  **"מתחילים מחדש עם שאלות חדשות"** starts a new round: the stations and the cure start over, and each station
  brings questions the student hasn't seen yet. What they solved, their mistakes and their exam record are kept.
- Questions the students got wrong go to **"דגימות מזוהמות"** (review mode, no lives and no timer) until they answer them right.
- **"מכינים את התרופה"** is a mock exam with questions from all stations, easy to hard within each topic, and no
  feedback until the end, like the real exam. It is timed by default (90 seconds a question); students can turn the
  clock off in the menu (⋯).
- **"מצב זמן בתחנות"** (off by default, in the menu) adds a countdown to every station question.
- **"נסו ב-R"** runs the question's code in a real R inside the browser (webR). If it can't load, students can copy the
  code and paste it into RStudio.

## Adding or changing questions

1. Edit `js/questions.js`. The comment at the top of the file explains every field. In short, each question has:
   the R `code`, 4 `options` written like the exam, the `answer` (0 = a … 3 = d), a `hint`, an `explanation`
   (steps, optionally with a small vector / table / output picture), and `whyWrong` for each wrong option.
2. In Hebrew text, put anything R-related inside backticks, for example `` `sum(x)` `` or `` `38.2 39.1` ``,
   so it is shown left to right. `**bold**` makes text bold.
3. Check that every answer matches what R really prints (see the next section). Fix everything it reports
   before you publish: the game quietly leaves out a question whose `id`, `station`, `level`, `code`, `options`
   or `answer` is broken.

Stations (and whether they open one after the other), lives, how many questions a run draws, time mode and the
mock exam (size, clock) are set in `js/config.js`. A station with no questions is shown as
"בקרוב".

## Checking the answers with R

`tools/check-answers.mjs` runs every question's code in real R and compares it with the question. You need:

- [Node.js](https://nodejs.org) version 18 or newer (`node --version` shows yours).
- [R](https://cran.r-project.org) (any recent version). The checker runs R's `Rscript` program, so either `Rscript`
  must be on your PATH, or you set the `RSCRIPT` environment variable to its full path.

Run it from the repo folder (the one with `index.html`):

**Linux and macOS** (Terminal):

```
node tools/check-answers.mjs
```

The R installers for macOS and most Linux packages put `Rscript` on the PATH. If yours is somewhere else
(`which Rscript` prints nothing), give its path:

```
RSCRIPT=/opt/R/4.4.1/bin/Rscript node tools/check-answers.mjs
```

**Windows**: the R installer does **not** put `Rscript` on the PATH, so give its path (change `R-4.4.1` to the
folder you have under `C:\Program Files\R`).

Command Prompt (cmd):

```
set RSCRIPT=C:\Program Files\R\R-4.4.1\bin\Rscript.exe
node tools\check-answers.mjs
```

PowerShell:

```
$env:RSCRIPT = "C:\Program Files\R\R-4.4.1\bin\Rscript.exe"
node tools\check-answers.mjs
```

(Or add `C:\Program Files\R\R-4.4.1\bin` to the PATH in *Settings → System → About → Advanced system settings →
Environment Variables*, open a new window, and run just `node tools\check-answers.mjs`.)

To check another file in the same format, add its path: `node tools/check-answers.mjs my-new-questions.js`.

It prints one line per question (`ok`, `man` for a `manual` question, or `FAIL`), then either
**"All 203 questions match R."** or the list of problems, and then exits with code 1. If R can't be found it says so
once and stops. For every question it checks:

- the fields, the same way the game does: `id` and every option are strings in quotes, 4 options, `answer` 0–3,
  a known station, a `whyWrong` for every wrong option, well-formed explanation steps and pictures, and paired
  `` ` `` backticks in the Hebrew texts;
- that R prints the right option and none of the wrong ones (the code may run at most 20 seconds);
- that R prints no warning or message (students would see it too);
- that the console the game shows is exactly what R prints: the last `output` step of the explanation, or, when
  there is none, `[1] ` followed by the right option (so add an `output` step whenever R prints something else,
  for example `cat()`, a named vector, a factor or a matrix).

When the right answer is an error (its option contains the word `Error`, for example `'שגיאה (Error)'`), the check
passes when R stops with an error, and the question needs an `output` step with R's exact error message, so a typo
in the code can't pass as the intended error. A syntax error (`Error: unexpected ...`) is reported unless that
output step shows it.

Optional fields for special cases (also described at the top of `js/questions.js`):

| Field | Meaning |
| --- | --- |
| `manual: true` | Run the code but don't compare the options with R (only when the right option is Hebrew text). Warnings and the `output` step are still checked. |
| `warning: true` | R may print a warning or message for this question. The `output` step may then also include the warning lines. |
| `warning: 'coercion'` | The same, but only a warning or message containing this text is accepted. |
| `expectError: true` | The right answer is an R error even though its option has no word `Error`. |
| `expectError: false` | The right answer is not an error even though its option contains the word `Error`. |

## Files

| File | What it is |
| --- | --- |
| `index.html` | The page |
| `css/styles.css` | The look |
| `js/app.js` | The game logic |
| `js/config.js` | Settings and lab stations |
| `js/questions.js` | The question bank |
| `tools/check-answers.mjs` | Checks the answers against real R |
