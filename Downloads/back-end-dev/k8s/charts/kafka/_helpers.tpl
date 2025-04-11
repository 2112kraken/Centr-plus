{{/* Define common labels */}}
{{- define "kafka.labels" -}}
app: {{ .Chart.Name }}
release: {{ .Release.Name }}
{{- end }}

{{/* Define controller specific labels */}}
{{- define "kafka.controller.labels" -}}
{{ include "kafka.labels" . }}
role: controller
{{- end }}

{{/* Define broker specific labels */}}
{{- define "kafka.broker.labels" -}}
{{ include "kafka.labels" . }}
role: broker
{{- end }}