#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SQL="${ROOT}/scripts/setup-mariadb.sql"

if ! command -v mariadb &>/dev/null && ! command -v mysql &>/dev/null; then
  echo "Error: mariadb or mysql client not found." >&2
  exit 1
fi

CLIENT="$(command -v mariadb || command -v mysql)"

echo "Creating database and user 'projectmatch' (requires admin access)..."
if [[ "$(id -u)" -eq 0 ]]; then
  "${CLIENT}" < "${SQL}"
else
  sudo "${CLIENT}" < "${SQL}"
fi

echo "Done. Default credentials match application.properties:"
echo "  database: projectmatch_db"
echo "  username: projectmatch"
echo "  password: projectmatch"
