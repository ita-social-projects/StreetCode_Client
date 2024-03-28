pipeline {
    agent { 
        label 'stage' 
    }
    stages {
         stage('Checkout') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: scm.branches,
                    extensions: scm.extensions + [[$class: 'LocalBranch'], [$class: 'WipeWorkspace']],
                    userRemoteConfigs: [[credentialsId: 'StreetcodeGithubCreds', url: 'git@github.com:ita-social-projects/StreetCode_Client.git']],
                    doGenerateSubmoduleConfigurations: scm.doGenerateSubmoduleConfigurations
                ])
            }
        }
        stage('Print details') {
            steps {
                echo "BUILD_ID..............${env.BUILD_ID}"
                echo "BUILD_NUMBER..........${env.BUILD_NUMBER}"
                echo "BUILD_TAG.............${env.BUILD_TAG}"
                echo "EXECUTOR_NUMBER.......${env.EXECUTOR_NUMBER}"
                echo "JOB_NAME..............${env.JOB_NAME}"
                echo "NODE_NAME.............${env.NODE_NAME}"
                echo "WORKSPACE.............${env.WORKSPACE}"
            }
        }
        stage('Setup dependencies') {
            steps {
                script {
                    sh 'dotnet tool update --global dotnet-coverage'
                    sh 'dotnet tool update --global dotnet-sonarscanner'
                    sh 'dotnet tool update --global GitVersion.Tool --version 5.12.0'
                    sh 'docker image prune --force --all --filter "until=72h"'
                    sh 'docker system prune --force --all --filter "until=72h"'

                    sh 'gitversion /showvariable FullSemVer'
                 
                }
            }
        }
    }
}
