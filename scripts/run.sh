#!/usr/bin/env bash
# Usage: ./scripts/run.sh [load|stress]   (needs `jmeter` on PATH)
set -euo pipefail
PROFILE="${1:-load}"
case "$PROFILE" in
  load)   THREADS=5;  RAMPUP=10; DURATION=60 ;;
  stress) THREADS=30; RAMPUP=30; DURATION=120 ;;
  *) echo "profile must be load or stress"; exit 1 ;;
esac
OUT="results/${PROFILE}"
rm -rf "$OUT" "results/dashboard/${PROFILE}"
mkdir -p results/dashboard
jmeter -n -t test-plans/load.jmx \
  -Jthreads=$THREADS -Jrampup=$RAMPUP -Jduration=$DURATION \
  -l "${OUT}.jtl" -e -o "results/dashboard/${PROFILE}"
echo "JMeter dashboard: results/dashboard/${PROFILE}/index.html"
