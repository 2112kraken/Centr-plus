kubectl create secret generic datadog-secret \
  --from-literal=api-key=your-datadog-api-key \
  --namespace=datadog
