@Library("hackerrank-jenkins-library/skillup-frontend-pipelines@master") _

def pipelineParams = params
deployProduction {
  agentLabel = 'skillup'
  branch     = pipelineParams.branch
  nodename   = pipelineParams.nodename
  sanity     = pipelineParams.sanity
  restart    = pipelineParams.restart
  SLACK_USER_EMAIL = pipelineParams.SLACK_USER_EMAIL
}
