#!/bin/bash
# Quick commit + push helper.
# Usage:  ./push.sh "your commit message"
#         ./push.sh              (defaults the message to "update")

set -e  # stop immediately if any command fails

MSG=${1:-update}   # use the first argument, or "update" if none given

echo "📦 Staging all changes..."
git add .

# 🔒 Safety net: never let a .env (secrets) get committed
if git diff --cached --name-only | grep -qE '(^|/)\.env'; then
  echo "⚠️  A .env file is staged — aborting to protect your secrets!"
  git reset >/dev/null   # unstage everything
  exit 1
fi

# If there's nothing to commit, exit gracefully
if git diff --cached --quiet; then
  echo "✅ Nothing to commit — working tree clean."
  exit 0
fi

echo "📝 Committing: \"$MSG\""
git commit -q -m "$MSG"

echo "🚀 Pushing to GitHub..."
git push -q

echo "✅ Done! Vercel + Render will auto-redeploy in ~2-3 min."
