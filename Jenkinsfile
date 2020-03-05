pipeline {
    agent { none }
    stages {
        stage('build') {
            steps {
                sh 'docker-compose up'
            }
        }
    }
}
