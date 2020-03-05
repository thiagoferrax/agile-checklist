pipeline {
    agent { any }
    stages {
        stage('build') {
            steps {
                sh 'docker-compose up'
            }
        }
    }
}
