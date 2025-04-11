#!/bin/bash

helm install datadog-agent -f values.yaml datadog/datadog -n datadog
