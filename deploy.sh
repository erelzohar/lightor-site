#!/usr/bin/env bash
#
# Deploy the public marketing site to /var/www/lightor-site/dist on the EC2 box,
# which nginx serves as lightor.app (and www.lightor.app).
#
# Normally run by GitHub Actions on a push to main, not by hand.
#
# The build runs first and its output is checked before anything on the server
# is touched, and the upload lands in a staging directory that is only swapped
# in once it is known to be complete. A failed build must never be able to take
# the live page down — which matters more here than for the product apps,
# because this page is what Google's OAuth branding review and Apple's store
# review read.

set -euo pipefail

# Override with: KEY=/path/to/key ./deploy.sh
KEY="${KEY:-$HOME/Documents/lightor-key.pem}"
# Override with: HOST=user@ip ./deploy.sh   (CI passes it from a secret)
HOST="${HOST:-ubuntu@51.16.211.227}"
TARGET=/var/www/lightor-site/dist
STAGING=temp_site_dist

[ -f "$KEY" ] || { echo "✗ ssh key not found at $KEY"; exit 1; }

echo "🚀 1/4  Building locally..."
npm run build

if [ ! -f dist/index.html ]; then
  echo "✗ dist/index.html missing — build produced nothing. Aborting before touching the server."
  exit 1
fi

# The <noscript> summary is the whole reason this page satisfies Google's
# branding review; a build that dropped it would pass every other check and
# still fail the review silently.
if ! grep -q "<noscript>" dist/index.html; then
  echo "✗ dist/index.html has no <noscript> block — the crawlable summary is gone."
  echo "  See the README: automated reviewers may not run JavaScript."
  exit 1
fi
echo "   built $(find dist -type f | wc -l | tr -d ' ') files"

echo "🚀 2/4  Uploading to staging on the server..."
ssh -i "$KEY" "$HOST" "rm -rf $STAGING"
scp -q -i "$KEY" -r ./dist "$HOST:$STAGING"

echo "⚙️  3/4  Swapping into $TARGET..."
ssh -i "$KEY" "$HOST" bash -s <<EOSSH
  set -euo pipefail
  if [ ! -f "$STAGING/index.html" ]; then
    echo "✗ staging incomplete on the server — live site left untouched"
    exit 1
  fi
  sudo mkdir -p "$TARGET"
  sudo rm -rf "$TARGET"/*
  sudo cp -r "$STAGING"/* "$TARGET"/
  sudo chown -R www-data:www-data "$TARGET"
  rm -rf "$STAGING"
EOSSH

echo "✅ 4/4  the marketing site deployed."
