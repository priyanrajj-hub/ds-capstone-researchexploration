git config user.email "bot@antigravity.com"
git config user.name "Antigravity"
git fetch origin
git branch -M main
git reset --mixed origin/main
git add .
git commit -m "Refactor UI and fix UTF-16 bugs"
echo "--- STATUS ---"
git status
echo "--- LOGS ---"
git log --oneline origin/main..HEAD
