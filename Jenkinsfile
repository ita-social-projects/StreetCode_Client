pipeline {
    agent { 
        label 'stage' 
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
                nvm install 16
                nvm use 16
            
                # Print Node.js version after switching
                node -v
            
                # Check npm version
                npm version
            
                # Run npm install
                npm install
            '''

                }
            }
        stage('Intall node modules') {
            steps {
                echo 'Installing modules...'
                sh 'npm version '
                sh 'npm install'
                }
            }
        stage('Run test:cover') {
            steps {
                echo 'Collect test coverage'
                sh 'npm run test:cover'
            }
        }
        /* uncomment me when you will fix lint
        stage('Run lint') {
            steps {
                echo 'Runt lint check'
                sh 'npm run lint'
            }
        }
        */
    
    }
}
