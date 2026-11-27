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
3. Check that every answer matches what R really prints:

   ```
   node tools/check-answers.mjs
   ```

   This needs [Node.js](https://nodejs.org) and R. It runs every question's code in R and reports any mismatch.

Stations (and whether they open one after the other), lives, how many questions a run draws, time mode and the
mock exam (size, clock) are set in `js/config.js`. A station with no questions is shown as
"בקרוב".

## Files

| File | What it is |
| --- | --- |
| `index.html` | The page |
| `css/styles.css` | The look |
| `js/app.js` | The game logic |
| `js/config.js` | Settings and lab stations |
| `js/questions.js` | The question bank |
| `tools/check-answers.mjs` | Checks the answers against real R |
