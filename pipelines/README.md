# Pipelines

## Quick Start

1. Depoloy the ./pipelines-helm/ chart via: 
```bash
helm upgrade --install pipelines ./pipelines/pipelines-helm/ -f ./pipelines/pipelines-helm/values.yaml
```
1. Manually deploy ./pipelines/pipeline.yaml
1. expose service:
```bash
oc expose svc/el-caregiver-build-push-image-trigger
```
1. configure github secret in event listener
```bash
SECRET_VALUE=""  NOTE: Ensure to replace with your value

oc delete secret github-webhook-secret -n f6e00d-tools
oc create secret generic github-webhook-secret \
  --from-literal=webhook-token="$SECRET_VALUE" \
  -n f6e00d-tools
```
1. Optional, test your pipeline trigger:
```bash
oc patch el caregiver-build-push-image-trigger --type json -p '[{"op": "remove", "path":  "/spec/triggers/0/interceptors/0/params/0"}]' 

curl -k -d '{"ref":"main","repository":{"url":"https://github.com/bcgov/caregiver-portal.git"},"head_commit":{"message": "v3"}}' -H "Content-Type: application/json" -H "X-GitHub-Event: push" http://el-caregiver-build-push-image-trigger-f6e00d-tools.apps.gold.devops.gov.bc.ca 
```

## Objects

1. eventlistener: configured to github repository webhook, listens for events to trigger pipeline run
1. triggerbinding: Maps webhook event parameters to pipeline parameters
1. triggertemplate: Specifies pipeline reference and specifies parameters to pipeline
1. git-clone (task): pipeline task to fetch git repo
1. generate-id (task): generates unique id for pipeline run
1. buildah (task): build image from dockerfile and pushes to internal registry
1. helm-deploy (task): Deploys helm chart containing project application to specified namespace


# Future work
1. automated tests in pipeline(on push/merge)
1. helm permissions to couple pipeline.yaml into helm chart
1. dev/test/prod workflow
1. Automate POD / PVC deletion after pipeline run