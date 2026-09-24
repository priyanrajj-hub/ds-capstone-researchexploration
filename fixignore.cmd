git rm -r --cached "node_modules"
git rm -r --cached ".next"
echo node_modules/ > .gitignore
echo .next/ >> .gitignore
git add .gitignore
git commit --amend --no-edit
git push -u origin main
