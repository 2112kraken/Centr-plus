ROLE="replicator"
PASSWORD="123"
DATABASES=("identity" "balance" "scheduler" "psp" "games" "stats" "gamification")
EXTENSION="uuid-ossp"

psql -d postgres -c "CREATE ROLE \"$ROLE\" WITH LOGIN PASSWORD '$PASSWORD' REPLICATION;"

for DB in "${DATABASES[@]}"; do
  psql -d postgres -c "CREATE DATABASE \"$DB\";"
  psql -d "$DB" -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"
done
