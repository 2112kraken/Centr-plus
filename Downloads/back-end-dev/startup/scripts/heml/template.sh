ENV=$1
APP_NAME=$2
ROOT=$3

helm template $APP_NAME ./k8s/charts/$ROOT -f ./k8s/charts/$ROOT/examples/$APP_NAME-$ENV-values.yaml --namespace $ENV --set environment=$ENV
