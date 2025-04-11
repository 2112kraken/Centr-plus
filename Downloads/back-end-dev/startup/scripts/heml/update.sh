ENV=$1
APP_NAME=$2

helm upgrade $APP_NAME ./k8s/charts/app -f ./k8s/charts/app/examples/$APP_NAME-$ENV-values.yaml --namespace $ENV --set environment=$ENV
