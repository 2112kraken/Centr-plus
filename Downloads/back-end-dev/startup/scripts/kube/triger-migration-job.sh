ENV=$1
APP_NAME=$2

kubectl delete job $APP_NAME-migration -n $ENV && \
helm template $APP_NAME ./k8s/charts/app \
  -f ./k8s/charts/app/examples/$APP_NAME-$ENV-values.yaml \
  --namespace $ENV \
  --set environment=$ENV \
  -s templates/job.yaml | kubectl apply -f -