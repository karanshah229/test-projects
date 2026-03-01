@Library("hackerrank-jenkins-library/skillup-frontend-pipelines@master") _

def pipelineParams = params
deployQA {
  agentLabel = 'skillup'
  branch     = pipelineParams.branch
  nodename   = pipelineParams.nodename
  sanity     = pipelineParams.sanity
  regression = pipelineParams.regression
}
