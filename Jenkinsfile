pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = "kujtimpllana"
        IMAGE_TAG = "${BUILD_NUMBER}"
        KUBECONFIG = "/var/lib/jenkins/.kube/config"
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo "Checkout into GitHub Repository..."
                git branch: "main",
                url: "https://github.com/kujtimpllana/mern-cicd.git",
                credentialsId: "github-creds"
            }
        }
        stage('Build Back End Docker Image') {
            when {
                anyOf {
                    changeset "/api**"
                    triggeredBy "UserIdCause"
                }
            }
            steps {
                echo "Build Back End Docker Image..."
                dir ("api") {
                    sh """
                        docker build --no-cache -t $DOCKER_REGISTRY/mern-backend:${IMAGE_TAG} .
                    """
                }
            }
        }
        stage('Build Front End Docker Image') {
            when {
                anyOf {
                    changeset "frontend/**"
                    triggeredBy 'UserIdCause'
                }
            }
            steps {
                echo "Build Front End Docker Image..."
                dir ("frontend") {
                    sh """
                        docker build --no-cache -t ${DOCKER_REGISTRY}/mern-frontend:${IMAGE_TAG} .
                    """
                }
            }
        }
        stage('Test Back End Image using Trivy Image Scanner') {
            when {
                anyOf {
                    changeset "/api**"
                    triggeredBy "UserIdCause"
                }
            }
            steps {
                echo "Test Back End before pushing to DockerHub for any potential security issues using Trivy..."
                
                script {
                    sh "mkdir -p ${WORKSPACE}/trivy-backend-results"
                    try {
                        sh """
                            docker pull aquasec/trivy:latest
                            docker run --rm \
                                -v /var/run/docker.sock:/var/run/docker.sock \
                                -v ${WORKSPACE}/trivy-backend-results:/app \
                                -w /app \
                                aquasec/trivy:latest image \
                                --exit-code 1 \
                                --severity CRITICAL \
                                --format json \
                                --output trivy-backend-report.json \
                                ${DOCKER_REGISTRY}/mern-backend:${IMAGE_TAG}
                        """
                    } finally {
                        archiveArtifacts artifacts: 'trivy-backend-results/trivy-backend-report.json', allowEmptyArchive: true
                    }
                }
            }
        }
        stage('Test Front End Image using Trivy Image Scanner') {
            when {
                anyOf {
                    changeset "/frontend**"
                    triggeredBy "UserIdCause"
                }
            }
            steps {
                echo "Test Front End before pushing to Docker Hub for any potential security issues using Trivy..."
            
                script {
                    sh "mkdir -p ${WORKSPACE}/trivy-frontend-results"
                    try {
                        sh """
                            docker pull aquasec/trivy:latest
                            docker run --rm \
                                -v /var/run/docker.sock:/var/run/docker.sock \
                                -v ${WORKSPACE}/trivy-frontend-results:/app \
                                -w /app \
                                aquasec/trivy:latest image \
                                --exit-code 1 \
                                --severity CRITICAL \
                                --format json \
                                --output trivy-frontend-report.json \
                                ${DOCKER_REGISTRY}/mern-frontend:${IMAGE_TAG}
                        """
                    } finally {
                        archiveArtifacts artifacts: 'trivy-frontend-results/trivy-frontend-report.json', allowEmptyArchive: true
                    }
                }
            }
        }
        stage('Push to Docker Registry') {
            when {
                anyOf {
                    changeset "api/**"
                    changeset "frontend/**"
                    triggeredBy 'UserIdCause'
                }
            }
            steps {
                echo "Push Images to Docker Registry..."
                withCredentials([usernamePassword(credentialsId: "dockerhub_creds", usernameVariable: "DOCKER_USER", passwordVariable: "DOCKER_PASS")]) {
                    sh """
                        echo ${DOCKER_PASS} | docker login -u ${DOCKER_USER} --password-stdin
                        docker push ${DOCKER_REGISTRY}/mern-backend:${IMAGE_TAG}
                        docker push ${DOCKER_REGISTRY}/mern-frontend:${IMAGE_TAG}
                        docker logout || true
                    """    
                }
            }
        }
        stage('Deploy to local Kubernetes Cluster') {
            when {
                anyOf {
                    changeset "api/**"
                    changeset "frontend/**"
                    triggeredBy 'UserIdCause'
                }
            }
            steps {
                echo "Deploy to local K8s cluster..."
                dir("k8s") {
                    sh """
                        kubectl apply -f configmap.yaml --kubeconfig=${KUBECONFIG}
                        kubectl apply -f secret.yaml --kubeconfig=${KUBECONFIG}
                        kubectl apply -f mongodb-deployment.yaml --kubeconfig=${KUBECONFIG} 
                        kubectl apply -f backend-deployment.yaml --kubeconfig=${KUBECONFIG}
                        kubectl apply -f frontend-deployment.yaml --kubeconfig=${KUBECONFIG}
                        kubectl set image deployment/backend-deployment backend-container=${DOCKER_REGISTRY}/mern-backend:${IMAGE_TAG} --kubeconfig=${KUBECONFIG}
                        kubectl set image deployment/frontend-deployment frontend-container=${DOCKER_REGISTRY}/mern-frontend:${IMAGE_TAG} --kubeconfig=${KUBECONFIG}
                        kubectl rollout status deployment/backend-deployment
                        kubectl rollout status deployment/frontend-deployment
                    """
                }
            }
        }
        stage('Verify Deployments') {
            steps {
                echo "Verify pods, services, persistent volumes + claims, configs & secrets creation..."
                sh """
                    kubectl get configmap
                    kubectl get secret
                    kubectl get pv
                    kubectl get pvc
                    kubectl get svc
                    kubectl get deployments
                    kubectl get pods -o wide
                """
            }
        }
    }
    post {
        success {
            mail to: "kujtimpllanadev@gmail.com",
                subject: "SUCCESS: Jenkins Pipeline '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
                body: "The pipeline '${env.JOB_NAME} [${env.BUILD_NUMBER}]' succeeded."
        }

        failure {
            mail to: "kujtimpllanadev@gmail.com",
                subject: "FAILURE: Jenkins Pipeline '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
                body: "The pipeline '${env.JOB_NAME} [${env.BUILD_NUMBER}]' failed."
        }
    }
}