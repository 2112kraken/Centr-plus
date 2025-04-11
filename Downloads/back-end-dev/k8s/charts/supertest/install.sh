#!/bin/bash

# Install the Helm chart
helm install "supertest-dev" . --namespace "dev"

echo "Helm chart for supertest has been installed in the dev namespace."
