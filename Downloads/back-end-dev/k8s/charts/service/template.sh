ENV=$1
SERVICE=$2

helm template $SERVICE . --namespace $ENV
