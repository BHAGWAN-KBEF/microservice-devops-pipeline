# Microservice DevOps Pipeline

**Production-ready Node.js microservice with complete DevOps pipeline featuring Docker containerization, GitHub Actions CI/CD, Terraform infrastructure, Kubernetes deployment, ArgoCD GitOps, and Prometheus monitoring.**

## 🎯 Project Overview

This project demonstrates a **complete DevOps pipeline** implementing modern cloud-native practices with a RESTful orders microservice. Built for **intermediate-to-advanced** DevOps engineering skills demonstration.

### 🏗️ Architecture
```
Developer → GitHub → CI/CD → ECR → ArgoCD → EKS → Monitoring
    ↓         ↓        ↓      ↓       ↓      ↓        ↓
  Code    Actions   Docker  Registry GitOps K8s   Grafana
```

## ✅ Implemented Features

### **Phase 1: Microservice Development**
- ✅ **Node.js REST API** with Express framework
- ✅ **Comprehensive testing** (94% code coverage)
- ✅ **Docker containerization** with multi-stage builds
- ✅ **Security hardening** (non-root user, vulnerability scanning)

### **Phase 2: CI/CD Pipeline**
- ✅ **GitHub Actions workflow** with automated testing
- ✅ **Code quality checks** (ESLint, Jest)
- ✅ **Security scanning** with Trivy
- ✅ **Docker image building** and ECR publishing

### **Phase 3: Infrastructure as Code**
- ✅ **Terraform configuration** for AWS resources
- ✅ **EKS cluster** with managed node groups
- ✅ **VPC networking** with public/private subnets
- ✅ **ECR repository** for container images

### **Phase 4: GitOps Deployment**
- ✅ **ArgoCD installation** and configuration
- ✅ **Helm chart** for Kubernetes deployment
- ✅ **Automated synchronization** from Git repository
- ✅ **Self-healing applications** with drift detection

### **Phase 5: Monitoring & Observability**
- ✅ **Prometheus** metrics collection
- ✅ **Grafana dashboards** for visualization
- ✅ **Custom monitoring** for microservice metrics
- ✅ **Health checks** and readiness probes

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+
- Docker & Docker Compose
- AWS CLI configured
- kubectl installed
- Terraform installed

### **1. Local Development**
```bash
# Clone repository
git clone https://github.com/BHAGWAN-KBEF/microservice-devops-pipeline.git
cd microservice-devops-pipeline

# Install dependencies and test
npm install
npm test
npm run lint

# Run locally
npm start
# OR with Docker
docker-compose up -d
```

### **2. Deploy Infrastructure**
```bash
# Deploy AWS infrastructure
cd terraform
terraform init
terraform plan
terraform apply

# Configure kubectl
aws eks update-kubeconfig --region us-east-1 --name orders-microservice-cluster
```

### **3. Setup GitOps**
```bash
# Install ArgoCD
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Deploy application
kubectl apply -f argocd/application.yaml
```

### **4. Setup Monitoring**
```bash
# Install monitoring stack
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install monitoring prometheus-community/kube-prometheus-stack -n monitoring --create-namespace
```

## 📁 Project Structure

```
microservice-devops-pipeline/
├── src/                          # Node.js microservice source
│   ├── handlers/                 # Business logic
│   └── server.js                 # Main application
├── srcroutes/                    # API routes
├── srcutils/                     # Utilities (logging)
├── test/                         # Unit tests (94% coverage)
├── .github/workflows/            # GitHub Actions CI/CD
├── terraform/                    # Infrastructure as Code
│   ├── main.tf                   # AWS resources
│   ├── variables.tf              # Input variables
│   └── outputs.tf                # Output values
├── k8s/                          # Kubernetes manifests
├── helmorders-microservice/      # Helm chart
│   ├── Chart.yaml
│   ├── values.yaml
│   └── templates/
├── argocd/                       # GitOps configuration
├── Dockerfile                    # Multi-stage container build
├── docker-compose.yml            # Local development
└── package.json                  # Dependencies
```

## 🛠 Technology Stack

### **Application**
- **Runtime**: Node.js 18 with Express framework
- **Testing**: Jest with 94% code coverage
- **Validation**: Joi for input validation
- **Logging**: Winston for structured logging
- **Security**: Helmet, CORS, rate limiting

### **DevOps & Infrastructure**
- **Containerization**: Docker with multi-stage builds
- **Orchestration**: Kubernetes (AWS EKS)
- **Package Management**: Helm charts
- **Infrastructure**: Terraform (AWS VPC, EKS, ECR)
- **CI/CD**: GitHub Actions
- **GitOps**: ArgoCD
- **Monitoring**: Prometheus + Grafana
- **Security**: Trivy vulnerability scanning

### **AWS Services**
- **EKS**: Managed Kubernetes service
- **ECR**: Container registry
- **VPC**: Network isolation
- **LoadBalancer**: Traffic distribution
- **IAM**: Identity and access management

## 🔧 Configuration

### **Required GitHub Secrets**
```
AWS_ACCESS_KEY_ID     # AWS access key
AWS_SECRET_ACCESS_KEY # AWS secret key
```

### **Key Configuration Files**
- `helmorders-microservice/values.yaml` - Helm chart values
- `argocd/application.yaml` - ArgoCD application config
- `terraform/variables.tf` - Infrastructure variables
- `.github/workflows/ci.yml` - CI/CD pipeline

## 📊 Accessing Services

### **Application Endpoints**
```bash
# Get LoadBalancer URL
kubectl get svc -n orders-microservice

# Test endpoints
curl http://<EXTERNAL-IP>/health
curl http://<EXTERNAL-IP>/api/orders
```

### **Monitoring Dashboards**
```bash
# Grafana (admin/admin123)
kubectl port-forward svc/monitoring-grafana -n monitoring 3000:80
# Access: http://localhost:3000

# Prometheus
kubectl port-forward svc/monitoring-kube-prometheus-prometheus -n monitoring 9090:9090
# Access: http://localhost:9090

# ArgoCD (admin/<generated-password>)
kubectl port-forward svc/argocd-server -n argocd 8080:443
# Access: https://localhost:8080
```

## 🔒 Security Implementation

### **Container Security**
- ✅ **Multi-stage Docker builds** for minimal attack surface
- ✅ **Non-root user** execution
- ✅ **Vulnerability scanning** with Trivy in CI pipeline
- ✅ **Minimal base images** (Alpine Linux)

### **Kubernetes Security**
- ✅ **Resource limits** and requests
- ✅ **Health checks** (liveness/readiness probes)
- ✅ **Namespace isolation**
- ✅ **Service accounts** with least privilege

### **Infrastructure Security**
- ✅ **Private subnets** for worker nodes
- ✅ **IAM roles** with minimal permissions
- ✅ **Security groups** with restricted access
- ✅ **Secrets management** via GitHub Secrets

## 🚦 Deployment Strategy

### **Current Implementation: Rolling Deployment**
- **Zero-downtime** updates via Kubernetes rolling deployment
- **Health checks** ensure traffic only goes to healthy pods
- **Automatic rollback** on deployment failure
- **Gradual traffic shifting** during updates

### **Future Enhancements**
- **Blue-Green deployment** for instant switching
- **Canary releases** for gradual rollouts
- **Feature flags** for controlled feature releases

## 📈 Monitoring & Observability

### **Metrics Collected**
- **Application**: Request rate, response time, error rate
- **Infrastructure**: CPU, memory, disk, network usage
- **Kubernetes**: Pod status, deployments, services
- **Business**: Order creation rate, success metrics

### **Key Dashboards**
- **Application Performance**: Response times, throughput
- **Infrastructure Health**: Resource utilization
- **Kubernetes Overview**: Cluster and pod status
- **Custom Metrics**: Business-specific monitoring

## 🎯 Project Highlights

### **Production-Ready Features**
- ✅ **94% test coverage** with comprehensive unit tests
- ✅ **Automated CI/CD** with quality gates
- ✅ **Infrastructure as Code** with Terraform
- ✅ **GitOps deployment** with ArgoCD
- ✅ **Full observability** stack
- ✅ **Security scanning** and hardening
- ✅ **High availability** with multiple replicas

### **DevOps Best Practices**
- ✅ **Version control** for everything (code, infrastructure, config)
- ✅ **Automated testing** and quality checks
- ✅ **Immutable infrastructure** with containers
- ✅ **Declarative configuration** with Kubernetes
- ✅ **Monitoring and alerting** for observability
- ✅ **Security by design** throughout the pipeline

## 🏆 Skills Demonstrated

This project showcases **intermediate-to-advanced** DevOps engineering skills:
- **Microservices Architecture**
- **Containerization & Orchestration**
- **CI/CD Pipeline Design**
- **Infrastructure as Code**
- **GitOps Practices**
- **Monitoring & Observability**
- **Security Implementation**
- **Cloud-Native Development**

---

**Built with ❤️ for demonstrating modern DevOps practices and cloud-native application development.**