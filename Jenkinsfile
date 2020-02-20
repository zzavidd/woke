pipeline {
    agent { dockerfile true }
    stages {
        stage('Clean') { 
            steps {
              dir('src'){
                sh 'rm -rf node_modules .next'
              }
            }
        }
        stage('Build') { 
            steps {
              dir('src'){
                sh 'npm ci'
                sh 'npm run build'
              }
            }
        }
        stage('Deploy') {
          steps {
            sh '/home/rebuild-woke.sh'
          }
        }
    }
}