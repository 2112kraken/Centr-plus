ROLE="replicator"
PASSWORD="123"
DATABASES=("admin")
EXTENSION="uuid-ossp"

psql -d postgres -c "CREATE ROLE \"$ROLE\" WITH LOGIN PASSWORD '$PASSWORD' REPLICATION;"

for DB in "${DATABASES[@]}"; do
  psql -d postgres -c "CREATE DATABASE \"$DB\";"
  psql -d "$DB" -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"
done
