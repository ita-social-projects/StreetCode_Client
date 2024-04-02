def CODE_VERSION = ''     
def IS_IMAGE_BUILDED = false
def isSuccess
def vers
pipeline {
    agent { 
        label 'stage' 
    }
    environment {
        GITHUB_TOKEN = credentials('GH_TOKEN')     
    }
    options {
        // test config to not keep ALL builds of PR check
        buildDiscarder(logRotator(numToKeepStr: '10', artifactNumToKeepStr: '10'))
        timestamps()
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
                    sh 'dotnet tool update --global GitVersion.Tool --version 5.12.0'
                 
                }
            }
        }
        stage('Build') {
            steps {
                script {
                    // sh './StreetCode_Client/build.sh Run'
                    sh(script: 'dotnet gitversion > GITVERSION_PROPERTIES', returnStdout: true)
                    sh "cat GITVERSION_PROPERTIES"
                    sh(script: "dotnet gitversion | grep -oP '(?<=\"MajorMinorPatch\": \")[^\"]*' > version", returnStatus: true)
                    sh "cat version"
                    vers = readFile(file: 'version').trim()
                    sh "echo ${vers}"
                    env.CODE_VERSION = readFile(file: 'version').trim()
                    echo "${env.CODE_VERSION}"
                    env.CODE_VERSION = "${env.CODE_VERSION}.${env.BUILD_NUMBER}"
                    echo "${env.CODE_VERSION}"
                    def gitCommit = sh(returnStdout: true, script: 'git log -1 --pretty=%B | cat').trim()
                    currentBuild.displayName = "${env.CODE_VERSION}-${BRANCH_NAME}:${gitCommit}"

                }
            }
        }
         stage('Set up node version') {
            steps {
                echo 'Set up node version'
           sh '''
                export NVM_DIR="$HOME/.nvm"
                if [ -s "$NVM_DIR/nvm.sh" ]; then
                    . "$NVM_DIR/nvm.sh" 
                fi
            
                # Print current Node.js version
                node -v
            
                # Switch to Node.js version 16
                # nvm install 16
                nvm use 16
            
                # Print Node.js version after switching
                node -v
            
                # Check npm version
                #npm version
                #npm install -g npm@7
                #npm version
                
                # Run npm install
                # npm install --save-dev jest ?
                npm install
                
                npm run test:cover

            '''
                //npm test -- --coverage
        //        sh 'npm install --save-dev jest'
        //        sh ' jest --coverage'
     //           sh 'npm run test:cover'

                }
            }
        // stage('Intall node modules') {
        //     steps {
        //         echo 'Installing modules...'
        //         sh 'npm version '
        //         sh 'npm install'
        //         }
        //     }
        // stage('Run test:cover') {
        //     steps {
        //         echo 'Collect test coverage'
        //         sh 'npm run test:cover'
        //     }
        // }
        /* uncomment me when you will fix lint
        stage('Run lint') {
            steps {
                echo 'Runt lint check'
                sh 'npm run lint'
            }
        }
        */
    

        stage('Build image') {
            when {
                branch pattern: "release/[0-9].[0-9].[0-9]", comparator: "REGEXP"
               
            }
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'docker-login-streetcode', passwordVariable: 'password', usernameVariable: 'username')]){
                        sh "docker build -t ${username}/streetcode_client:latest ."
                        IS_IMAGE_BUILDED = true
                    }
                }
            }
        }
        stage('Push image') {
            when {
                expression { IS_IMAGE_BUILDED == true }
            }   
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'docker-login-streetcode', passwordVariable: 'password', usernameVariable: 'username')]){
                        sh 'echo "${password}" | docker login -u "${username}" --password-stdin'
                        sh "docker push ${username}/streetcode_client:latest"
                        sh "docker tag  ${username}/streetcode_client:latest ${username}/streetcode_client:${env.CODE_VERSION}"
                        sh "docker push ${username}/streetcode_client:${env.CODE_VERSION}"
                
                    }
                }
            }
        }
    stage('Deploy Stage'){
        steps {
            input message: 'Do you want to approve deploy stage?', ok: 'Yes', submitter: 'deploy_admin, deploy_dev'
                script {
                    preDeployBackStage = sh(script: 'docker inspect $(docker ps | awk \'{print $2}\' | grep -v ID) | jq \'.[].RepoTags\' | grep  -m 1 "streetcode:" | tail -n 1 | cut -d ":" -f2 | head -c -2', returnStdout: true).trim()
                    echo "Last Tag Stage backend: ${preDeployBackStage}"
                    preDeployFrontStage = sh(script: 'docker inspect $(docker ps | awk \'{print $2}\' | grep -v ID) | jq \'.[].RepoTags\' | grep -m 1 "streetcode_client:" | tail -n 1 | cut -d ":" -f2 | head -c -2', returnStdout: true).trim()
                    echo "Last Tag Stage frontend: ${preDeployFrontStage}"
                
                    
                    echo "DOCKER_TAG_BACKEND ${env.CODE_VERSION}"
                    echo "DOCKER_TAG_FRONTEND  ${preDeployFrontStage}"

//                    docker image prune --force --filter "until=72h"
//                    docker system prune --force --filter "until=72h"
//                    export DOCKER_TAG_BACKEND=${env.CODE_VERSION}
//                    export DOCKER_TAG_FRONTEND=${preDeployFrontStage}
//                    docker compose down && sleep 10
//                    docker compose --env-file /etc/environment up -d

                }  
            }
        }    
    stage('WHAT IS THE NEXT STEP') {
        steps {
            script {
                    CHOICES = ["deployProd", "rollbackStage"];    
                        env.yourChoice = input  message: 'Please validate, choose one', ok : 'Proceed', submitter: 'deploy_admin',id :'choice_id',
                                        parameters: [choice(choices: CHOICES, description: 'Do you want to deploy or to rollback?', name: 'CHOICE')]
            } 
        }
    }
    stage('Deploy prod') {
        agent { label 'production' }
            when {
                expression { env.yourChoice == 'deployProd' }
            }
        steps {
            script {
                preDeployBackProd = sh(script: 'docker inspect $(docker ps | awk \'{print $2}\' | grep -v ID) | jq \'.[].RepoTags\' | grep  -m 1 "streetcode:" | tail -n 1 | cut -d ":" -f2 | head -c -2', returnStdout: true).trim()
                echo "Last Tag Prod backend: ${preDeployBackProd}"
                preDeployFrontProd = sh(script: 'docker inspect $(docker ps | awk \'{print $2}\' | grep -v ID) | jq \'.[].RepoTags\' | grep -m 1 "streetcode_client:" | tail -n 1 | cut -d ":" -f2 | head -c -2', returnStdout: true).trim()
                echo "Last Tag Prod frontend: ${preDeployFrontProd}"
//                    docker image prune --force --filter "until=72h"
//                    docker system prune --force --filter "until=72h"
//                    export DOCKER_TAG_BACKEND=${env.CODE_VERSION}
//                    export DOCKER_TAG_FRONTEND=${preDeployFrontProd}
//                    docker compose down && sleep 10
//                    docker compose --env-file /etc/environment up -d
                  
            }
        }
        post {
            always {
                echo 'Always'
            }
            success {
                script {
                    isSuccess = '1'
                } 
            }
        }
    }
    stage('Rollback Stage') {
        when {
            expression { env.yourChoice == 'rollbackStage' }
        }
        steps {
            script {
                echo "Rollback Tag Stage backend: ${preDeployBackStage}"
                echo "Rollback Tag Stage frontend: ${preDeployFrontStage}"
//                    docker image prune --force --filter "until=72h"
//                    docker system prune --force --filter "until=72h"
//                    export DOCKER_TAG_BACKEND=${preDeployBackStage}
//                    export DOCKER_TAG_FRONTEND=${preDeployFrontStage}
//                    docker compose down && sleep 10
//                    docker compose --env-file /etc/environment up -d
                

            }
        }
    }   
    stage('Sync after release') {
        when {
           expression { isSuccess == '1' }
        }   
        steps {
            script {
               // ?? 
                sh 'echo ${BRANCH_NAME}'
                sh "git checkout master" 
                sh 'echo ${BRANCH_NAME}'
               //     sh "git merge release/${env.CODE_VERSION}" 
               //   sh "git push origin main" 
                  
            }
        }
        post {
            success {
                sh 'gh auth status'
//                sh "gh release create v${vers}  --generate-notes --draft"
            }
        }
    }
    stage('Rollback Prod') {  
        steps {
            input message: 'Do you want to rollback deploy prod?', ok: 'Yes'
                script {
                    echo "Rollback Tag Prod backend: ${preDeployBackProd}"
                    echo "Rollback Tag Prod frontend: ${preDeployFrontProd}"
//                    docker image prune --force --filter "until=72h"
//                    docker system prune --force --filter "until=72h"
//                    export DOCKER_TAG_BACKEND=${preDeployBackProd}
//                    export DOCKER_TAG_FRONTEND=${preDeployFrontProd}
//                    docker compose down && sleep 10
//                    docker compose --env-file /etc/environment up -d
                }
            }    
        }
    }
}
