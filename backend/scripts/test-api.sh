#!/usr/bin/env bash
set -euo pipefail

BASE="${1:-http://localhost:8082}"
PASS=0
FAIL=0
TOKEN=""
PROJECT_ID=""
USER_EMAIL="apitest-$(date +%s)@example.com"

check() {
  local name="$1" expected="$2" actual="$3" body="${4:-}"
  if [[ "$actual" == "$expected" ]]; then
    echo "  PASS $name (HTTP $actual)"
    ((PASS++)) || true
  else
    echo "  FAIL $name (expected $expected, got $actual)"
    [[ -n "$body" ]] && echo "       $body"
    ((FAIL++)) || true
  fi
}

echo "=== ProjectMatch API tests @ $BASE ==="
echo

echo "--- Public endpoints ---"
code=$(curl -s -o /tmp/pm-open.json -w "%{http_code}" "$BASE/api/projects/open")
check "GET /api/projects/open" "200" "$code"
code=$(curl -s -o /tmp/pm-formations.json -w "%{http_code}" "$BASE/api/formations")
check "GET /api/formations" "200" "$code"
code=$(curl -s -o /tmp/pm-formations-free.json -w "%{http_code}" "$BASE/api/formations/free")
check "GET /api/formations/free" "200" "$code"

echo
echo "--- Auth: register & login ---"
reg=$(curl -s -w "\n%{http_code}" -X POST "$BASE/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"API Tester\",\"email\":\"$USER_EMAIL\",\"password\":\"secret123\",\"role\":\"STUDENT\"}")
code=$(echo "$reg" | tail -1)
body=$(echo "$reg" | sed '$d')
check "POST /api/auth/register" "200" "$code" "$body"
TOKEN=$(echo "$body" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
[[ -n "$TOKEN" ]] || { echo "  FAIL no token in register response"; ((FAIL++)); }

login=$(curl -s -w "\n%{http_code}" -X POST "$BASE/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$USER_EMAIL\",\"password\":\"secret123\"}")
code=$(echo "$login" | tail -1)
body=$(echo "$login" | sed '$d')
check "POST /api/auth/login" "200" "$code"
TOKEN=$(echo "$body" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

echo
echo "--- Protected without token (expect 401/403) ---"
code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/users/me")
[[ "$code" == "401" || "$code" == "403" ]] && { echo "  PASS GET /api/users/me without auth (HTTP $code)"; ((PASS++)); } \
  || { echo "  FAIL GET /api/users/me without auth (expected 401/403, got $code)"; ((FAIL++)); }

echo
echo "--- Authenticated endpoints ---"
code=$(curl -s -o /tmp/pm-me.json -w "%{http_code}" "$BASE/api/users/me" \
  -H "Authorization: Bearer $TOKEN")
check "GET /api/users/me" "200" "$code"
grep -q "$USER_EMAIL" /tmp/pm-me.json && { echo "  PASS /api/users/me returns correct email"; ((PASS++)); } \
  || { echo "  FAIL /api/users/me email mismatch"; ((FAIL++)); }

proj=$(curl -s -w "\n%{http_code}" -X POST "$BASE/api/projects" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Project","description":"API test project","requiredSkills":"Java,Spring"}')
code=$(echo "$proj" | tail -1)
body=$(echo "$proj" | sed '$d')
check "POST /api/projects" "200" "$code" "$body"
PROJECT_ID=$(echo "$body" | grep -o '"id":[0-9]*' | head -1 | cut -d: -f2)

code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/projects" -H "Authorization: Bearer $TOKEN")
check "GET /api/projects" "200" "$code"

code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/projects/search?keyword=Test" \
  -H "Authorization: Bearer $TOKEN")
check "GET /api/projects/search" "200" "$code"

if [[ -n "$PROJECT_ID" ]]; then
  code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/projects/$PROJECT_ID")
  check "GET /api/projects/{id} (public)" "200" "$code"

  code=$(curl -s -o /dev/null -w "%{http_code}" -X PATCH "$BASE/api/projects/$PROJECT_ID/status?status=IN_PROGRESS" \
    -H "Authorization: Bearer $TOKEN")
  check "PATCH /api/projects/{id}/status" "200" "$code"

  code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/teams/project/$PROJECT_ID" \
    -H "Authorization: Bearer $TOKEN")
  check "GET /api/teams/project/{id}" "200" "$code"

  # Owner is auto-added to team on project create; second user joins
  MEMBER_EMAIL="member-$(date +%s)@example.com"
  member_reg=$(curl -s -w "\n%{http_code}" -X POST "$BASE/api/auth/register" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"Team Member\",\"email\":\"$MEMBER_EMAIL\",\"password\":\"secret123\",\"role\":\"STUDENT\"}")
  code=$(echo "$member_reg" | tail -1)
  check "POST register (team member)" "200" "$code"
  MEMBER_TOKEN=$(echo "$member_reg" | sed '$d' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

  code=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/api/teams/project/$PROJECT_ID/join" \
    -H "Authorization: Bearer $MEMBER_TOKEN")
  check "POST /api/teams/project/{id}/join" "200" "$code"

  code=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/api/teams/project/$PROJECT_ID/leave" \
    -H "Authorization: Bearer $MEMBER_TOKEN")
  check "POST /api/teams/project/{id}/leave" "200" "$code"
fi

echo
echo "--- Summary: $PASS passed, $FAIL failed ---"
[[ "$FAIL" -eq 0 ]]
