pipeline {
    agent { 
        label 'stage' 
    }
    stages {
        stage('Docker build') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'docker-login-streetcode', passwordVariable: 'password', usernameVariable: 'username')]){
                        sh "docker build --no-cache -t ${username}/streetcode_client:latest ."
                    }
                }
            }
        }
        stage('Docker prune') {
            steps {
                script {
                    sh 'docker image prune --force --all --filter "until=72h"'
                    sh 'docker system prune --force --all --filter "until=72h"'
                }
            }
        }
        stage('Docker push') {
            steps {
                script {
                    Date date = new Date()
                    env.DATETAG = date.format("HH-dd-MM-yy", TimeZone.getTimeZone('GMT+3'))
                    withCredentials([usernamePassword(credentialsId: 'docker-login-streetcode', passwordVariable: 'password', usernameVariable: 'username')]){
                        sh 'echo "${password}" | docker login -u ${username} --password-stdin'
                        sh "docker push ${username}/streetcode_client:latest"
                        sh "docker tag ${username}/streetcode_client:latest ${username}/streetcode_client:${env.DATETAG}"
                        sh "docker push ${username}/streetcode_client:${env.DATETAG}"  
                    }
                }
            }
        }
    }
    post {
        failure {
            script {
                def buildStatus = '❌ FAILURE'
                def buildUrl = env.BUILD_URL
                def buildDuration = currentBuild.durationString
    
                def message = """
                *Build Status:* ${buildStatus}
                *Job Name:* ${env.JOB_NAME}
                *Build Number:* [${env.BUILD_NUMBER}](${buildUrl})
                *Duration:* ${buildDuration}
                """
    
                withCredentials([string(credentialsId: 'BotToken', variable: 'TOKEN'),
                                 string(credentialsId: 'chatid', variable: 'CHAT_ID')]) {
                    sh """
                    curl -s -X POST https://api.telegram.org/bot\$TOKEN/sendMessage -d chat_id=\$CHAT_ID -d reply_to_message_id=2246 -d parse_mode=markdown -d text='${message}'
                    """
                }
            }
        }
    }
}
