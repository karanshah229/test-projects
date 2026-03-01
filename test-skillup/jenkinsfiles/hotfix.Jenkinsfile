@Library("hackerrank-jenkins-library/global-utils@master") _

def pipelineParams = params
createHotFixBranch {
  agentLabel = 'skillup'
  repoName   = pipelineParams.GIT_REPO
}
