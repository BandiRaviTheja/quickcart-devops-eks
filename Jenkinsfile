pipeline {
    agent any

    environment {
        AWS_REGION      = 'ap-south-1'
        PROJECT_NAME    = 'devops-project'
        AWS_CREDENTIALS = credentials('aws-creds-id')
        ECR_ACCOUNT     = '775826428475'
        ECR_REGION      = "${env.AWS_REGION}"
        KUBE_NAMESPACE  = 'backend'
        EC2_NODEGROUP   = 'devops-project-alb-nodes'
    }

    stages{

        stage('Terraform Init & Apply') {
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aws-creds-id']]) {
                    dir('terraform') {
                        sh """
                        terraform init
                        terraform apply -auto-approve
                        """
                    }
                }
            }
        }

        stage('Configure Kubeconfig') {
            steps {
                dir('terraform') {
                    sh '''
                    export TF_IN_AUTOMATION=1
                    CLUSTER_NAME=$(terraform output -raw eks_cluster_name)
                    aws eks --region ${AWS_REGION} update-kubeconfig --name $CLUSTER_NAME
                    kubectl get namespace backend >/dev/null 2>&1 || kubectl create namespace backend
                    kubectl get nodes
                    '''
                }
            }
        }

        stage('Create ALB ServiceAccount & product pod service account') {
            steps {
                sh "kubectl apply -f ${env.WORKSPACE}/k8s/product-sa.yaml"
                sh "kubectl apply -f ${env.WORKSPACE}/k8s/aws-load-balancer-controller-sa.yaml"
            }
        }

        stage('Install ALB Controller on EC2 Node') {
            steps {
                dir('terraform') {
                    script {
                        def alb_sg_id = sh(script: "terraform output -raw alb_sg_id", returnStdout: true).trim()
                        def vpc_id = sh(script: "terraform output -raw vpc_id", returnStdout: true).trim()
                        def cluster_name = sh(script: "terraform output -raw eks_cluster_name", returnStdout: true).trim()

                        sh """
                        kubectl create namespace kube-system || true
                        helm repo add eks https://aws.github.io/eks-charts
                        helm repo update
                        helm upgrade --install aws-load-balancer-controller eks/aws-load-balancer-controller \\
                          -n kube-system \\
                          --set clusterName=${cluster_name} \\
                          --set serviceAccount.create=false \\
                          --set serviceAccount.name=aws-load-balancer-controller-service-account \\
                          --set region=${AWS_REGION} \\
                          --set vpcId=${vpc_id}
                        sleep 20
                        kubectl -n kube-system get pods -l app.kubernetes.io/name=aws-load-balancer-controller
                        kubectl -n kube-system wait --for=condition=ready pod -l app.kubernetes.io/name=aws-load-balancer-controller --timeout=10m || echo "⚠️ ALB Controller pods not ready yet, continuing..."
                        sed -i 's|<ALB_SG_ID>|${alb_sg_id}|' ${env.WORKSPACE}/k8s/ingress/backend-ingress.yaml
                        """
                    }
                }
            }
        }

        stage('Build & Push Docker Images') {
            steps {
                script {
                    def services = ['auth','product','cart','order','payment','email']
                    for (service in services) {
                        sh """
                        aws ecr describe-repositories --repository-names ${service} --region ${ECR_REGION} || \
                        aws ecr create-repository --repository-name ${service} --region ${ECR_REGION}

                        cd ${service}
                        docker build -t ${ECR_ACCOUNT}.dkr.ecr.${ECR_REGION}.amazonaws.com/${service}:latest .
                        aws ecr get-login-password --region ${ECR_REGION} | docker login --username AWS --password-stdin ${ECR_ACCOUNT}.dkr.ecr.${ECR_REGION}.amazonaws.com
                        docker push ${ECR_ACCOUNT}.dkr.ecr.${ECR_REGION}.amazonaws.com/${service}:latest
                        cd ..
                        """
                    }
                }
            }
        }

        stage('Deploy Kubernetes Resources') {
            steps {
                script {
                    sh """
                    sed -i 's|<ECR_ACCOUNT>|${ECR_ACCOUNT}|' ${env.WORKSPACE}/k8s/deployments/*.yaml
                    sed -i 's|<AWS_REGION>|${ECR_REGION}|' ${env.WORKSPACE}/k8s/deployments/*.yaml

                    kubectl apply -f ${env.WORKSPACE}/k8s/namespace/
                    kubectl apply -f ${env.WORKSPACE}/k8s/config/
                    kubectl apply -f ${env.WORKSPACE}/k8s/secrets/
                    kubectl apply -f ${env.WORKSPACE}/k8s/deployments/
                    kubectl apply -f ${env.WORKSPACE}/k8s/services/
                    kubectl apply -f ${env.WORKSPACE}/k8s/hpa/
                    kubectl apply -f ${env.WORKSPACE}/k8s/ingress/
                    """
                }
            }
        }

        stage('Wait for ALB DNS') {
            steps {
                script {
                    def alb_dns = ''
                    for(int i=0; i<20; i++) {
                        alb_dns = sh(script: "kubectl get ingress backend-ingress -n ${KUBE_NAMESPACE} -o jsonpath='{.status.loadBalancer.ingress[0].hostname}' || echo ''", returnStdout: true).trim()
                        if (alb_dns != '') {
                            echo "ALB DNS ready: ${alb_dns}"
                            break
                        }
                        sleep 30
                    }
                    if (alb_dns == '') {
                        error "ALB DNS not ready after retries!"
                    }
                    env.ALB_DNS = alb_dns
                }
            }
        }

        stage('Update ConfigMap & Restart Deployments') {
            steps {
                dir('terraform') {
                    script {
                        def db_host = sh(script: "terraform output -raw db_endpoint", returnStdout: true).trim()
                        sh """
                        sed -i 's|REPLACE_DB_ENDPOINT|${db_host}|' ${env.WORKSPACE}/k8s/config/backend-configmap.yaml
                        sed -i 's|REPLACE_ORDERS_ALB_DNS|http://${env.ALB_DNS}|' ${env.WORKSPACE}/k8s/config/backend-configmap.yaml
                        kubectl apply -f ${env.WORKSPACE}/k8s/config/backend-configmap.yaml -n ${KUBE_NAMESPACE}
                        """
                        def services = ['auth','product','cart','order','payment','email']
                        for (service in services) {
                            sh "kubectl rollout restart deployment ${service}-deployment -n ${KUBE_NAMESPACE}"
                        }
                    }
                }
            }
        }

        stage('Build & Deploy Frontend to S3') {
            steps {
                script {
                    echo "ALB DNS: ${env.ALB_DNS}"
                    sh """
                    cd frontend
                    sed -i 's|REACT_APP_API_URL=.*|REACT_APP_API_URL=http://${env.ALB_DNS}|' .env

                    rm -rf node_modules package-lock.json
                    npm install

                    chmod +x node_modules/.bin/*

                    # Disable ESLint warnings-as-errors in CI
                    export CI=false
                    npm run build

                    aws s3 sync build/ s3://devops-project-frontend-rajesh --region ${AWS_REGION}
                    """
                }
            }
        }
    }

    post {
        success { 
            echo 'Deployment to EKS + ALB + frontend S3 complete!' 
        }
        failure { 
            echo 'Deployment failed.' 
        }
    }
}
