# starter

![Version: 0.1.0](https://img.shields.io/badge/Version-0.1.0-informational?style=flat-square)

A Helm chart for Kubernetes

## Values

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| affinity | object | `{}` | set at each application level or only at global. check global.affinity |
| app.command | list | `["sleep"]` | sets the container `command` |
| app.containerSecurityContext | object | `{"allowPrivilegeEscalation":false,"runAsUser":0}` | application containerSecurityContext |
| app.containerSecurityContext.allowPrivilegeEscalation | bool | `false` | application containerSecurityContext.allowPrivilegeEscalation |
| app.containerSecurityContext.runAsUser | int | `0` | application containerSecurityContext.runAsUser |
| app.envFrom | list | `[]` | adds envFrom configMap or secrets |
| app.livenessProbe.enabled | bool | `false` | enables livenessProbe for pod |
| app.livenessProbe.path | string | `"/"` | livenessProbe check path |
| app.nodeSelector | object | `{}` | application nodeSelector |
| app.port | int | `3000` | application container port number |
| app.readinessProbe.enabled | bool | `false` | enables readinessProbe for pod |
| app.readinessProbe.path | string | `"/"` | readinessProbe check path |
| app.resources | object | `{"limits":{"cpu":"1.5","memory":"2048Mi"},"requests":{"cpu":"0.7","memory":"1025Mi"}}` | application resources |
| app.resources.limits | object | `{"cpu":"1.5","memory":"2048Mi"}` | application resources.limits |
| app.resources.limits.cpu | string | `"1.5"` | application resources.limits.cpu |
| app.resources.limits.memory | string | `"2048Mi"` | application resources.limits.memory |
| app.resources.requests | object | `{"cpu":"0.7","memory":"1025Mi"}` | application resources.requests |
| app.resources.requests.cpu | string | `"0.7"` | application resources.requests.cpu |
| app.resources.requests.memory | string | `"1025Mi"` | application resources.requests.memory |
| app.securityContext | object | `{"fsGroup":1000,"runAsUser":1000}` | application securityContext |
| app.securityContext.fsGroup | int | `1000` | application securityContext.fsGroup |
| app.securityContext.runAsUser | int | `1000` | application securityContext.runAsUser |
| app.serviceRequired | bool | `true` | creates k8s service resource if set to `true` |
| app.startupProbe.enabled | bool | `false` | enables startupProbe for pod |
| app.startupProbe.path | string | `"/"` | startupProbe check path |
| app.terminationGracePeriodSeconds | int | `30` | sets pod terminationGracePeriodSeconds |
| app.volumeMounts | list | `[]` | application volumeMounts |
| argoRollouts | object | `{"antiAffinity":"preferred","autoPromotionEnabled":false,"enabled":false,"previewReplica":{"Count":5,"enabled":false},"progressDeadlineSeconds":900}` | argo rollouts config, Applies to each applications |
| argoRollouts.antiAffinity | string | `"preferred"` | can be `required` or `preferred` |
| argoRollouts.autoPromotionEnabled | bool | `false` | set to `true` if rollout blue to green should be auto |
| argoRollouts.enabled | bool | `false` | set to `true` to create argo rollout resources |
| argoRollouts.previewReplica | object | `{"Count":5,"enabled":false}` | controls blue replicas |
| argoRollouts.previewReplica.Count | int | `5` | sets blue replicaCount |
| argoRollouts.previewReplica.enabled | bool | `false` | set to `true` to set blue replica count, if `false`, blue replicas match green replicaCount |
| argoRollouts.progressDeadlineSeconds | int | `900` | sets the timeout seconds to wait for blue or green to be healthy |
| autoscaling.enabled | bool | `false` | set `true` to enable hpa. set at each application level |
| autoscaling.externalMetrics | list | `[]` | You can add external metrics to use for scaling. set at each application level |
| autoscaling.maxReplicas | int | `100` | set max replica. set at each application level |
| autoscaling.minReplicas | int | `1` | set min replica. set at each application level |
| autoscaling.targetCPUUtilizationPercentage | int | `80` | set targetCPUUtilizationPercentage or targetMemoryUtilizationPercentage. set at each application level |
| envVariables | object | `{}` | envVariables can take key value pairs that are static, Applies to each applications, can be set globally also |
| externalSecrets | object | `{"enabled":false,"externalSecretsFrom":[]}` | externalSecrets config, Applies to each applications. |
| externalSecrets.enabled | bool | `false` | set to `true` to create externalSecrets resource. Applies to each applications. |
| externalSecrets.externalSecretsFrom | list | `[]` | set to aws secremanager alias. Applies to each applications. |
| fullnameOverride | string | `""` | Always use fullnameOverride in referer charts |
| global.dnsConfig | object | `{"searches":["hacker.com"]}` | only at global level |
| global.dnsConfig.searches | list | `["hacker.com"]` | dns search domain name |
| global.envVariables | object | `{}` | envVariables can take key value pairs that are static, Applies to each applications, can be set globally also |
| global.environment | string | `"private"` | only at global level |
| global.frontend | object | `{"nginx":{"additionalNginxConfig":"","basePath":"/","enabled":false,"image":"public.ecr.aws/nginx/nginx:1.19-alpine"}}` | nginx for frontend applications |
| global.frontend.nginx.additionalNginxConfig | string | `""` | additional nginx location blocks for path rewrite eg:  `additionalNginxConfig: |    location ~* "(^/roles/api/v1/.*$)" {      resolver 172.20.0.10;      rewrite ^/roles(.*)$ $1  break;      proxy_pass $roleUpstream;    }` |
| global.frontend.nginx.basePath | string | `"/"` | frontend app basepath |
| global.frontend.nginx.image | string | `"public.ecr.aws/nginx/nginx:1.19-alpine"` | nginx docker image |
| global.image | object | `{"pullPolicy":"IfNotPresent","repository":"","tag":""}` | only at global level |
| global.image.pullPolicy | string | `"IfNotPresent"` | docker image pullPolicy. can Always or IfNotPresent |
| global.image.repository | string | `""` | docker image ecr registry |
| global.image.tag | string | `""` | docker image tag |
| global.imagePullSecrets | list | `[]` | only at global level |
| global.tplEnvVariables | object | `{}` | tplEnvVariables can take key value pairs that are dynamic, Applies to each applications, can be set globally also eg: `HOST: http://{{ .Release.Namespace }}.{{ .Values.hostedZone }}` |
| ingress | object | `{"internal":{"annotations":{},"className":"","enabled":false,"hosts":[{"host":"chart-example.local","paths":[{"path":"/","pathType":"ImplementationSpecific"}],"tplHost":""}],"nameSuffix":"","tls":[]}}` | set this at each application level |
| ingress.internal.annotations | object | `{}` | sets ingress annotations for the ingress resource |
| ingress.internal.className | string | `""` | Use annotations to set className, Ignore this |
| ingress.internal.enabled | bool | `false` | `true` creates Ingress resource |
| ingress.internal.hosts | list | `[{"host":"chart-example.local","paths":[{"path":"/","pathType":"ImplementationSpecific"}],"tplHost":""}]` | sets hosts [] with hostname, path set host for static values or tplHost for dynamic values that refers other values from values file |
| ingress.internal.nameSuffix | string | `""` | ingress name suffix to append to fullname |
| nameOverride | string | `""` |  |
| nodeSelector | object | `{}` | set at each application level or only at global. check global.nodeSelector |
| podAnnotations | object | `{}` | app podAnnotations, Applies to each applications, can be set globally also |
| replicaCount | int | `1` |  |
| service.annotations | object | `{}` | service annotations, set this as each application level |
| service.port | int | `80` | set this at each application level to override. Defaults to 80 |
| service.type | string | `"NodePort"` | set this at each application level to override serive type. It can be NodePort or ClusterIP |
| serviceAccount.annotations | object | `{}` | Annotations to add to the service account |
| serviceAccount.create | bool | `false` | Specifies whether a service account should be created |
| serviceAccount.name | string | `""` | The name of the service account to use. If not set and create is true, a name is generated using the fullname template |
| servicemonitor | object | `{"enabled":false,"metricsPath":"/metrics","port":9000,"targetPort":"http"}` | set this at each application level. |
| servicemonitor.enabled | bool | `false` | set `true` to enable Prometheus to scrape your application for metrics |
| servicemonitor.metricsPath | string | `"/metrics"` | Path at which metrics is served |
| servicemonitor.port | int | `9000` | Port number at which metrics are exposed in container |
| servicemonitor.targetPort | string | `"http"` | Service targetPort name |
| tolerations | list | `[]` | set at each application level or only at global. check global.tolerations |
| tplEnvVariables | object | `{}` | tplEnvVariables can take key value pairs that are dynamic, Applies to each applications, can be set globally also eg: `HOST: http://{{ .Release.Namespace }}.{{ .Values.hostedZone }}` |
| volumes | list | `[]` | set at each application level only |

----------------------------------------------
Autogenerated from chart metadata using [helm-docs v1.11.0](https://github.com/norwoodj/helm-docs/releases/v1.11.0)
