@Library("hackerrank-jenkins-library/skillup-frontend-pipelines@master") _

def pipelineParams = params
deployPrivate {
  agentLabel = 'slave'
  branch     = pipelineParams.branch
  nodename   = pipelineParams.nodename
  SLACK_USER = pipelineParams.SLACK_USER
  devspace   = pipelineParams.devspace
}
