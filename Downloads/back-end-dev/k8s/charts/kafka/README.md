# Kafka Chart

This Helm chart deploys Apache Kafka in KRaft mode.

## Common Operations

### List Topics
```bash
kubectl exec -n dev kafka-broker-0 -- /opt/kafka/bin/kafka-topics.sh \
  --list \
  --bootstrap-server localhost:9092
```

### Create Topic
```bash
kubectl exec -n dev kafka-broker-0 -- /opt/kafka/bin/kafka-topics.sh \
  --create \
  --topic your-topic-name \
  --partitions 1 \
  --replication-factor 1 \
  --bootstrap-server localhost:9092
```

### Describe Topic
```bash
kubectl exec -n dev kafka-broker-0 -- /opt/kafka/bin/kafka-topics.sh \
  --describe \
  --topic your-topic-name \
  --bootstrap-server localhost:9092
```

### Produce Messages
```bash
# Single message
kubectl exec -n dev kafka-broker-0 -- /opt/kafka/bin/kafka-console-producer.sh \
  --topic your-topic-name \
  --bootstrap-server localhost:9092 <<< "Your message"

# Interactive mode (Ctrl+D to exit)
kubectl exec -it -n dev kafka-broker-0 -- /opt/kafka/bin/kafka-console-producer.sh \
  --topic your-topic-name \
  --bootstrap-server localhost:9092
```

### Consume Messages
```bash
# Read all messages from beginning
kubectl exec -n dev kafka-broker-0 -- /opt/kafka/bin/kafka-console-consumer.sh \
  --topic your-topic-name \
  --from-beginning \
  --bootstrap-server localhost:9092

# Read new messages only
kubectl exec -n dev kafka-broker-0 -- /opt/kafka/bin/kafka-console-consumer.sh \
  --topic your-topic-name \
  --bootstrap-server localhost:9092

# Read specific number of messages
kubectl exec -n dev kafka-broker-0 -- /opt/kafka/bin/kafka-console-consumer.sh \
  --topic your-topic-name \
  --from-beginning \
  --max-messages 1 \
  --bootstrap-server localhost:9092
```

## Example Usage

1. Create a test topic:
```bash
kubectl exec -n dev kafka-broker-0 -- /opt/kafka/bin/kafka-topics.sh \
  --create \
  --topic test-topic \
  --partitions 1 \
  --replication-factor 1 \
  --bootstrap-server localhost:9092
```

2. Produce a test message:
```bash
kubectl exec -n dev kafka-broker-0 -- /opt/kafka/bin/kafka-console-producer.sh \
  --topic test-topic \
  --bootstrap-server localhost:9092 <<< "Hello Kafka"
```

3. Consume the message:
```bash
kubectl exec -n dev kafka-broker-0 -- /opt/kafka/bin/kafka-console-consumer.sh \
  --topic test-topic \
  --from-beginning \
  --max-messages 1 \
  --bootstrap-server localhost:9092
```
