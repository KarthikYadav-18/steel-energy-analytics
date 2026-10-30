# GitHub plan (Commits 10, Pull Requests 5, Stars 5)
Do real commits on different days. Do not make empty or fake commits.

## Steps
1. Create a new public repository named `steel-energy-analytics` on https://github.com/KarthikYadav-18
2. Open the project folder in VS Code and run in the terminal:
```
git init
git add README.md requirements.txt .gitignore data
git commit -m "Add dataset and README"
git branch -M main
git remote add origin https://github.com/KarthikYadav-18/steel-energy-analytics.git
git push -u origin main
```
3. Add the rest in separate commits, for example:
   * `git add notebooks` then commit "Add notebook with cleaning and EDA"
   * `git add visualizations results` then commit "Add graphs and results"
   * `git add models` then commit "Add trained model"
   * `git add app` then commit "Add Flask website"
   * `git add screenshots` then commit "Add website screenshots"
   * `git add report HOW_TO_RUN.md` then commit "Add report and run steps"
   * small edits later: README improvements, comments in the code, etc.
4. Pull requests: make a branch (`git checkout -b add-website`), commit, push (`git push -u origin add-website`), open the Pull Request on GitHub and merge it. Do this 2 or 3 times (for example website, README update, notebook comments).
5. Stars: put the repository link in your LinkedIn post and share it with classmates. Ask them to star it only if they find it useful.
