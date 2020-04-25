pipeline {

  agent { 
    dockerfile true
  }

  environment {
    JWT_SECRET = credentials('jwt-secret')
    AUTH_KEY = credentials('authorization-key')
    PORT = 3000
    MYSQL_HOST = credentials('mysql-host')
    MYSQL_NAME = credentials('mysql-name')
    MYSQL_USER = credentials('mysql-user')
    MYSQL_PWD = credentials('mysql-pwd')
    CLOUDINARY_NAME = credentials('cloudinary-name')
    CLOUDINARY_API_KEY = credentials('cloudinary-api-key')
    CLOUDINARY_API_SECRET = credentials('cloudinary-api-secret')
    SLACK_TOKEN = credentials('slack-token')
    EMAIL_USER = credentials('email-user')
    EMAIL_PWD = credentials('email-pwd')
    MAILCHIMP_INSTANCE = credentials('mailchimp-instance')
    MAILCHIMP_API_KEY = credentials('mailchimp-api-key')
    MAILCHIMP_LISTID = credentials('mailchimp-listid')
  }

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
    stage('Test') {
      steps {
        dir('src'){
          // echo 'Testing'
          sh 'npm run dev && npm run test-ci'
        }
      }
    }
  }

  post {
    always {
      dir('src'){
        sh 'rm -rf node_modules'
      }
    }
  }
}