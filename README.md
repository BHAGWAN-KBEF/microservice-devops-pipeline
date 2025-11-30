# DevOps Microservice Project

Complete production-grade DevOps pipeline with microservices, CI/CD, and observability.

## 🚀 Quick Start

### Phase 1 - Local Development
```bash
npm install
npm test
docker build -t orders-microservice .
docker-compose up -d
```

### Phase 2 - CI/CD Pipeline
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/devops-microservice.git
git push -u origin main
```

### Phase 3 - Infrastructure
```bash
cd terraform
terraform init
terraform apply
```

### Phase 4 - GitOps with ArgoCD
```bash
# Setup EKS cluster access
aws eks update-kubeconfig --region us-east-1 --name orders-microservice-cluster

# Install ArgoCD
bash argocd/setup-argocd.sh

# Deploy application
kubectl apply -f argocd/application.yaml
```

### Phase 5 - Monitoring
```bash
# Install Prometheus & Grafana
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install monitoring prometheus-community/kube-prometheus-stack -f k8s/prometheus-values.yaml
```

## 📁 Project Structure

```
├── src/                    # Node.js microservice
├── test/                   # Unit tests
├── k8s/                    # Kubernetes manifests
├── helmorders-microservice/ # Helm chart
├── terraform/              # Infrastructure as Code
├── argocd/                 # GitOps configuration
├── .githubworkflows/       # CI/CD pipeline
└── docker-compose.yml      # Local development
```

## 🛠 Technologies

- **Backend**: Node.js, Express
- **Containerization**: Docker, Docker Compose
- **Orchestration**: Kubernetes, Helm
- **CI/CD**: GitHub Actions, ArgoCD
- **Infrastructure**: Terraform, AWS EKS, ECR
- **Monitoring**: Prometheus, Grafana
- **Security**: Trivy, IAM least privilege

## 🔧 Configuration

Update these files with your values:
- `argocd/application.yaml` - GitHub repository URL
- `k8s/deployment.yaml` - ECR repository URL
- `.githubworkflows/ci.yml` - AWS credentials

## 📊 Monitoring

Access Grafana dashboard:
```bash
kubectl port-forward svc/monitoring-grafana 3000:80
# Login: admin/admin123
```

## 🔒 Security Features

- Multi-stage Docker builds
- Non-root container user
- Vulnerability scanning with Trivy
- IAM least privilege policies
- Secrets management
- Network policies

## 🚦 Deployment Strategies

- Blue-Green deployments
- Canary rollouts
- Automated rollbacks
- Health checks

## 📈 Observability

- Application metrics
- Infrastructure monitoring
- Log aggregation
- Distributed tracing
- Alerting rules