#!/usr/bin/env bash
# ============================================================
#  clone-all.sh — One-click clone for all workspace repos
# ============================================================
#
#  Usage:
#    bash scripts/clone-all.sh                  # clone into current directory
#    bash scripts/clone-all.sh ~/workspace      # clone into ~/workspace
#    bash scripts/clone-all.sh . --https        # use HTTPS instead of SSH
#    bash scripts/clone-all.sh . --parallel     # clone in parallel (4 jobs)
#
set -euo pipefail

# ── Defaults ────────────────────────────────────────────────
TARGET_DIR="${1:-.}"
USE_HTTPS=false
PARALLEL=false
JOBS=4

for arg in "$@"; do
  case "$arg" in
    --https)    USE_HTTPS=true ;;
    --parallel) PARALLEL=true ;;
  esac
done

# ── Helpers ─────────────────────────────────────────────────
ssh_url()  { echo "git@github.com:$1/$2.git"; }
https_url(){ echo "https://github.com/$1/$2.git"; }

clone_one() {
  local org="$1" repo="$2"
  local url
  if $USE_HTTPS; then
    url="$(https_url "$org" "$repo")"
  else
    url="$(ssh_url "$org" "$repo")"
  fi

  if [ -d "$TARGET_DIR/$repo" ]; then
    echo "  SKIP  $repo (already exists)"
    return 0
  fi

  git clone --recurse-submodules "$url" "$TARGET_DIR/$repo" 2>/dev/null \
    && echo "  OK    $org/$repo" \
    || echo "  FAIL  $org/$repo"
}

# ── Banner ──────────────────────────────────────────────────
echo "========================================"
echo "  Workspace Repo Cloner"
echo "========================================"
echo "  Target : $TARGET_DIR"
echo "  Protocol: $( $USE_HTTPS && echo HTTPS || echo SSH )"
echo "  Parallel: $( $PARALLEL && echo "yes ($JOBS jobs)" || echo no )"
echo "========================================"
echo ""

# ── Repo inventory ──────────────────────────────────────────

# intellistream (29 repos)
INTELLISTREAM_REPOS=(
  neuromem
  SAGE
  SAGE-Docs
  sage-examples
  sage-tutorials
  sageVDB
  vamos
  llm-serving-workloads
  sage-faculty-twin
  sage-temporal-memory
  sage-slo-aware-llm-serving
  llm-serving-motto-lab
  graduate-paper-writing-course
  intro-to-llm-inference-engines
  parallel-distributed-state-management-survey
  cccf-domestic-inference-engine-survey
  huawei-stw-memory-rag-talk
  neuromem-bench
  FlowRAG
  CANDOR-Bench
  ascend-llm-realworkload-prof
  bidkv
  quality-bounded-inference-plugin
  kv-materialization-plugin
  kv-prefix-sharing-plugin
  sglang-request-placement
  sglang-segment-reuse-plugin
  StreamFP
)

# vLLM-HUST (12 repos)
VLLM_HUST_REPOS=(
  vllm-hust
  vllm-ascend-hust
  vllm-hust-perf-analyzer
  vllm-hust-workstation
  vllm-hust-benchmark
  vllm-hust-dev-hub
  vllm-hust-docs
  vllm-hust-website
  ascend-runtime-manager
  triton-ascend-hust
  vllm-ascend-quant-hust
  vllm-hust-org-profile
)

# Qixin-Gaoke (2 repos)
QIXIN_GAOKE_REPOS=(
  private-materials
  vllm-segment-reuse
)

# Personal (1 repo)
PERSONAL_REPOS=(
  shuhaozhangtony.github.io
)

# ── Clone logic ─────────────────────────────────────────────
mkdir -p "$TARGET_DIR"

clone_group() {
  local org="$1"; shift
  local repos=("$@")
  echo "── $org (${#repos[@]} repos) ──"
  for repo in "${repos[@]}"; do
    clone_one "$org" "$repo"
  done
  echo ""
}

if $PARALLEL; then
  echo "Cloning in parallel ($JOBS jobs)..."
  echo ""

  export TARGET_DIR USE_HTTPS
  export -f ssh_url https_url clone_one

  # Build full list and feed to xargs
  {
    for r in "${INTELLISTREAM_REPOS[@]}"; do echo "intellistream $r"; done
    for r in "${VLLM_HUST_REPOS[@]}";    do echo "vLLM-HUST $r"; done
    for r in "${QIXIN_GAOKE_REPOS[@]}";  do echo "Qixin-Gaoke $r"; done
    for r in "${PERSONAL_REPOS[@]}";     do echo "ShuhaoZhangTony $r"; done
  } | xargs -P "$JOBS" -L1 bash -c 'clone_one "$@"' _
else
  clone_group "intellistream"   "${INTELLISTREAM_REPOS[@]}"
  clone_group "vLLM-HUST"      "${VLLM_HUST_REPOS[@]}"
  clone_group "Qixin-Gaoke"    "${QIXIN_GAOKE_REPOS[@]}"
  clone_group "ShuhaoZhangTony" "${PERSONAL_REPOS[@]}"
fi

TOTAL=$(( ${#INTELLISTREAM_REPOS[@]} + ${#VLLM_HUST_REPOS[@]} + ${#QIXIN_GAOKE_REPOS[@]} + ${#PERSONAL_REPOS[@]} ))
echo "========================================"
echo "  Done! $TOTAL repos processed."
echo "========================================"
