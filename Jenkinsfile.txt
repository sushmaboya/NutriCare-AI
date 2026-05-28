pipeline {
    agent any

    stages {

        stage('Clone Repository') {
            steps {
                echo 'GitHub Repository Connected'
            }
        }

        stage('Frontend Build') {
            steps {
                dir('frontend') {
                    bat 'npm install'
                    bat 'npm run build'
                }
            }
        }

        stage('Backend Build') {
            steps {
                dir('backend') {
                    bat 'npm install'
                }
            }
        }

        stage('Docker Build') {
            steps {
                bat 'docker-compose build'
            }
        }

        stage('Deploy Containers') {
            steps {
                bat 'docker-compose up -d'
            }
        }
    }
}