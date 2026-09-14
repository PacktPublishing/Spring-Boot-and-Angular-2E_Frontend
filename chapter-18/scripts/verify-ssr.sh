#!/usr/bin/env bash
# Verifies /books is genuinely server-rendered with real API data, not just an
# empty table shell (e.g. because the backend was unreachable).
#
# Usage: ./scripts/verify-ssr.sh [base_url] [expected_title]

set -euo pipefail

BASE_URL="${1:-http://localhost:4000}"
EXPECTED_TITLE="${2:-Clean Code}"

html="$(curl -sf "${BASE_URL}/books")"

if ! grep -q "<table" <<<"$html"; then
  echo "FAIL: no <table> element found in server-rendered ${BASE_URL}/books HTML" >&2
  exit 1
fi

if ! grep -qF "$EXPECTED_TITLE" <<<"$html"; then
  echo "FAIL: server-rendered ${BASE_URL}/books HTML has a <table> but does not contain \"${EXPECTED_TITLE}\" - the table likely rendered empty because the backend API was unreachable" >&2
  exit 1
fi

echo "PASS: ${BASE_URL}/books server-rendered HTML contains a populated table, including \"${EXPECTED_TITLE}\""
