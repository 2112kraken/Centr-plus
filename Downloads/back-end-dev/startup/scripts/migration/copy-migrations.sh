#!/usr/bin/env bash
#
# Copies *.ts migration files from defined services to adminpanel
# excluding specified filenames, printing only the copied file paths.

set -euo pipefail

#######################################
# Array of "src:dst" pairs
# to easily add or change services.
#######################################
MIGRATION_PATHS=(
  "apps/balance/migrations/:apps/adminpanel/migrations/balance/"
  "apps/identity/migrations/:apps/adminpanel/migrations/identity/"
  "apps/games/migrations/:apps/adminpanel/migrations/games/"
)

#######################################
# Files/patterns to exclude.
#######################################
EXCLUDES=(
  "*.publication.ts"
  "*.data.ts"
)

#######################################
# Builds the exclusion arguments for 'find'
# Each pattern in EXCLUDES becomes:
#   -not -name "<pattern>"
#######################################
function build_exclude_args() {
  local exclude_args=()
  for pattern in "${EXCLUDES[@]}"; do
    exclude_args+=( -not -name "$pattern" )
  done
  echo "${exclude_args[@]}"
}

#######################################
# Main logic:
#   1) Create destination if missing
#   2) Find matching *.ts files, excluding certain patterns
#   3) Copy and print only the destination file path
#######################################
for path_pair in "${MIGRATION_PATHS[@]}"; do
  IFS=':' read -r SRC DST <<< "$path_pair"

  # Ensure the destination directory exists
  mkdir -p "$DST"

  # Build exclude params
  EXCLUDE_ARGS=$(build_exclude_args)

  # Get the list of files to copy
  mapfile -t FOUND_FILES < <(eval "find \"$SRC\" -type f -name '*.ts' $EXCLUDE_ARGS")

  # Copy the files and print only their destination paths
  for FILE in "${FOUND_FILES[@]}"; do
    BASENAME=$(basename "$FILE")
    cp "$FILE" "$DST"
    echo "$DST$BASENAME"
  done
done
