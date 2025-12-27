# Deployment Guide
## AROCORD-HIMS (Healthcare Information Management System)

## Document Information
- **Guide Version**: 1.0
- **System Version**: 2.2
- **Date**: January 2025
- **Deployment Environments**: Development, Staging, Production
- **Document Owner**: DevOps Engineering Team

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Environment Setup](#2-environment-setup)
3. [Infrastructure Provisioning](#3-infrastructure-provisioning)
4. [Application Deployment](#4-application-deployment)
5. [Database Setup](#5-database-setup)
6. [Configuration Management](#6-configuration-management)
7. [Security Setup](#7-security-setup)
8. [Monitoring Setup](#8-monitoring-setup)
9. [Testing Deployment](#9-testing-deployment)
10. [Rollback Procedures](#10-rollback-procedures)
11. [Troubleshooting](#11-troubleshooting)

---

## 1. Prerequisites

### 1.1 System Requirements

#### Hardware Requirements
- **CPU**: 4-core minimum, 8-core recommended
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 100GB SSD minimum, 500GB recommended
- **Network**: 1Gbps minimum bandwidth

#### Software Requirements
- **Operating System**: Ubuntu 20.04 LTS or RHEL 8+
- **Container Runtime**: Docker 24.0+ or Podman 4.0+
- **Orchestration**: Kubernetes 1.25+ or Docker Compose
- **Reverse Proxy**: Nginx 1.20+ or Traefik 2.0+
- **SSL Certificate**: Valid SSL certificate from trusted CA

### 1.2 Access Requirements

#### Cloud Platform Access
- AWS Account with appropriate IAM permissions
- Azure subscription with contributor access
- GCP project with editor permissions

#### Domain and DNS
- Registered domain name
- DNS management access
- SSL certificate for HTTPS

#### Third-Party Services
- SMTP server for email notifications
- SMS gateway for text messages
- Payment processor API access
- External system API credentials

### 1.3 Team Requirements

#### Deployment Team
- DevOps Engineer (Lead)
- Database Administrator
- Security Engineer
- Network Administrator
- Application Developer (for support)

#### Access Credentials
- SSH keys for server access
- Database admin credentials
- Cloud platform credentials
- Third-party service API keys

---

## 2. Environment Setup

### 2.1 Development Environment

#### Local Development Setup
```bash
# Clone the repository
git clone https://github.com/arocord/hims.git
cd hims

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with local configuration

# Start development server
npm run dev
```

#### Docker Development Environment
```bash
# Build and run with Docker Compose
docker-compose -f docker-compose.dev.yml up -d

# Access the application
open http://localhost:3000
```

### 2.2 Staging Environment

#### Infrastructure Requirements
- **Servers**: 2-4 EC2 instances (t3.medium)
- **Database**: RDS PostgreSQL (db.t3.medium)
- **Cache**: ElastiCache Redis (cache.t3.micro)
- **Storage**: S3 bucket for file storage
- **Load Balancer**: ALB for traffic distribution

#### Network Configuration
- **VPC**: Isolated network with public/private subnets
- **Security Groups**: Restrictive inbound/outbound rules
- **NAT Gateway**: For private subnet internet access

### 2.3 Production Environment

#### High Availability Setup
- **Application Servers**: 4+ EC2 instances across multiple AZs
- **Database**: RDS Multi-AZ PostgreSQL
- **Cache**: ElastiCache Redis cluster
- **Load Balancer**: ALB with health checks
- **CDN**: CloudFront for static assets

#### Scalability Configuration
- **Auto Scaling Groups**: For application servers
- **RDS Read Replicas**: For read-heavy operations
- **ElastiCache Cluster**: For session storage and caching

---

## 3. Infrastructure Provisioning

### 3.1 AWS Infrastructure Setup

#### VPC and Networking
```bash
# Create VPC
aws ec2 create-vpc --cidr-block 10.0.0.0/16

# Create subnets
aws ec2 create-subnet --vpc-id vpc-12345678 --cidr-block 10.0.1.0/24 --availability-zone us-east-1a
aws ec2 create-subnet --vpc-id vpc-12345678 --cidr-block 10.0.2.0/24 --availability-zone us-east-1b

# Create Internet Gateway
aws ec2 create-internet-gateway
aws ec2 attach-internet-gateway --vpc-id vpc-12345678 --internet-gateway-id igw-12345678

# Create NAT Gateway for private subnets
aws ec2 create-nat-gateway --subnet-id subnet-12345678 --allocation-id eipalloc-12345678
```

#### Security Groups
```bash
# Application Load Balancer Security Group
aws ec2 create-security-group --group-name hims-alb-sg --description "HIMS ALB Security Group" --vpc-id vpc-12345678

# Allow HTTP and HTTPS
aws ec2 authorize-security-group-ingress --group-id sg-12345678 --protocol tcp --port 80 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress --group-id sg-12345678 --protocol tcp --port 443 --cidr 0.0.0.0/0

# Application Server Security Group
aws ec2 create-security-group --group-name hims-app-sg --description "HIMS Application Security Group" --vpc-id vpc-12345678

# Allow traffic from ALB only
aws ec2 authorize-security-group-ingress --group-id sg-87654321 --protocol tcp --port 80 --source-group sg-12345678
aws ec2 authorize-security-group-ingress --group-id sg-87654321 --protocol tcp --port 443 --source-group sg-12345678
```

#### EC2 Instances
```bash
# Launch template for application servers
aws ec2 create-launch-template --launch-template-name hims-app-lt \
  --image-id ami-12345678 \
  --instance-type t3.medium \
  --key-name hims-keypair \
  --security-group-ids sg-87654321 \
  --user-data file://user-data.sh

# Create Auto Scaling Group
aws autoscaling create-auto-scaling-group --auto-scaling-group-name hims-app-asg \
  --launch-template LaunchTemplateName=hims-app-lt \
  --min-size 2 --max-size 10 --desired-capacity 4 \
  --vpc-zone-identifier subnet-12345678,subnet-87654321 \
  --target-group-arns arn:aws:elasticloadbalancing:region:account:targetgroup/hims-targets/12345678
```

### 3.2 Database Setup

#### RDS PostgreSQL
```bash
# Create RDS subnet group
aws rds create-db-subnet-group --db-subnet-group-name hims-db-subnet-group \
  --db-subnet-group-description "HIMS Database Subnet Group" \
  --subnet-ids subnet-12345678 subnet-87654321

# Create RDS instance
aws rds create-db-instance --db-instance-identifier hims-db \
  --db-instance-class db.t3.medium \
  --engine postgres \
  --engine-version 15.4 \
  --master-username hims_admin \
  --master-user-password "SecurePassword123!" \
  --allocated-storage 100 \
  --db-subnet-group-name hims-db-subnet-group \
  --vpc-security-group-ids sg-db-12345678 \
  --backup-retention-period 7 \
  --multi-az \
  --storage-encrypted \
  --enable-performance-insights
```

#### ElastiCache Redis
```bash
# Create ElastiCache subnet group
aws elasticache create-cache-subnet-group --cache-subnet-group-name hims-redis-subnet-group \
  --cache-subnet-group-description "HIMS Redis Subnet Group" \
  --subnet-ids subnet-12345678 subnet-87654321

# Create ElastiCache cluster
aws elasticache create-cache-cluster --cache-cluster-id hims-redis \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --engine-version 7.0 \
  --num-cache-nodes 1 \
  --cache-subnet-group-name hims-redis-subnet-group \
  --security-group-ids sg-redis-12345678 \
  --snapshot-retention-limit 7
```

### 3.3 Load Balancer Configuration

#### Application Load Balancer
```bash
# Create ALB
aws elbv2 create-load-balancer --name hims-alb \
  --subnets subnet-12345678 subnet-87654321 \
  --security-groups sg-12345678

# Create target group
aws elbv2 create-target-group --name hims-targets \
  --protocol HTTP --port 80 \
  --vpc-id vpc-12345678 \
  --health-check-path /health

# Create listener
aws elbv2 create-listener --load-balancer-arn alb-arn \
  --protocol HTTPS --port 443 \
  --certificates CertificateArn=cert-arn \
  --default-actions Type=forward,TargetGroupArn=target-arn
```

---

## 4. Application Deployment

### 4.1 Build Process

#### Frontend Build
```bash
# Install dependencies
npm ci

# Build for production
npm run build

# Create build artifact
tar -czf hims-frontend-v2.2.0.tar.gz dist/
```

#### Backend Build
```bash
# Install dependencies
npm ci

# Build application
npm run build

# Create Docker image
docker build -t arocord/hims-backend:v2.2.0 .
docker push arocord/hims-backend:v2.2.0
```

### 4.2 Docker Configuration

#### Dockerfile (Frontend)
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Dockerfile (Backend)
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY dist/ ./
COPY .env.production ./

EXPOSE 3001
USER node

CMD ["npm", "start"]
```

#### Docker Compose (Development)
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://user:password@db:5432/hims
    depends_on:
      - db
      - redis

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=hims
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - db_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine

volumes:
  db_data:
```

### 4.3 Kubernetes Deployment

#### Deployment Manifest
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hims-backend
  labels:
    app: hims-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: hims-backend
  template:
    metadata:
      labels:
        app: hims-backend
    spec:
      containers:
      - name: hims-backend
        image: arocord/hims-backend:v2.2.0
        ports:
        - containerPort: 3001
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: hims-secrets
              key: database-url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3001
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3001
          initialDelaySeconds: 5
          periodSeconds: 5
```

#### Service Manifest
```yaml
apiVersion: v1
kind: Service
metadata:
  name: hims-backend-service
spec:
  selector:
    app: hims-backend
  ports:
    - port: 80
      targetPort: 3001
  type: ClusterIP
```

#### Ingress Configuration
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: hims-ingress
  annotations:
    kubernetes.io/ingress.class: "nginx"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
  - hosts:
    - hims.clinic.com
    secretName: hims-tls
  rules:
  - host: hims.clinic.com
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: hims-backend-service
            port:
              number: 80
      - path: /
        pathType: Prefix
        backend:
          service:
            name: hims-frontend-service
            port:
              number: 80
```

---

## 5. Database Setup

### 5.1 Database Initialization

#### Create Database and User
```sql
-- Connect as postgres superuser
CREATE DATABASE hims_db;
CREATE USER hims_app WITH ENCRYPTED PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE hims_db TO hims_app;

-- Create schema
\c hims_db;
CREATE SCHEMA IF NOT EXISTS hims;
GRANT ALL ON SCHEMA hims TO hims_app;
```

#### Run Migrations
```bash
# Using Flyway (recommended)
flyway -url=jdbc:postgresql://localhost:5432/hims_db \
       -user=hims_app \
       -password=secure_password \
       -locations=filesystem:./migrations \
       migrate

# Or using custom migration script
npm run db:migrate
```

### 5.2 Seed Data

#### Reference Data
```sql
-- Insert user roles
INSERT INTO user_roles (name, display_name, permissions) VALUES
('patient', 'Patient', '{"read": ["own_records"], "update": ["own_profile"]}'),
('receptionist', 'Receptionist', '{"create": ["patients", "appointments"], "read": ["all_patients"], "update": ["patient_status"]}'),
('doctor', 'Doctor', '{"create": ["consultations", "prescriptions"], "read": ["all_patients"], "update": ["consultation_status"]}'),
('pharmacist', 'Pharmacist', '{"create": ["medication_dispensing"], "read": ["prescriptions"], "update": ["prescription_status"]}'),
('lab_technician', 'Lab Technician', '{"create": ["lab_results"], "read": ["lab_orders"], "update": ["result_status"]}'),
('administrator', 'Administrator', '{"create": ["users"], "read": ["all_data"], "update": ["system_settings"]}');

-- Insert ICD-10 codes (sample)
INSERT INTO icd10_codes (code, description, category) VALUES
('R51', 'Headache', 'Symptoms'),
('J00', 'Common cold', 'Respiratory'),
('M54.2', 'Cervicalgia', 'Musculoskeletal');
```

#### Test Data (Development Only)
```sql
-- Create test users
INSERT INTO users (email, password_hash, first_name, last_name, role_id) VALUES
('admin@clinic.com', '$2b$10$hashedpassword', 'System', 'Administrator', (SELECT id FROM user_roles WHERE name = 'administrator')),
('doctor@clinic.com', '$2b$10$hashedpassword', 'Sarah', 'Smith', (SELECT id FROM user_roles WHERE name = 'doctor')),
('nurse@clinic.com', '$2b$10$hashedpassword', 'Emily', 'Johnson', (SELECT id FROM user_roles WHERE name = 'nurse'));
```

### 5.3 Database Backup

#### Automated Backup Setup
```bash
# Create backup script
cat > /usr/local/bin/hims-backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/hims_backup_${DATE}.sql"

# Create backup
pg_dump -h localhost -U hims_app -d hims_db -Fc > "$BACKUP_FILE"

# Upload to S3
aws s3 cp "$BACKUP_FILE" "s3://hims-backups/"

# Clean up old backups (keep last 30 days)
find "$BACKUP_DIR" -name "hims_backup_*.sql" -mtime +30 -delete
EOF

chmod +x /usr/local/bin/hims-backup.sh

# Add to cron for daily backups
echo "0 2 * * * /usr/local/bin/hims-backup.sh" | crontab -
```

---

## 6. Configuration Management

### 6.1 Environment Variables

#### Application Configuration
```bash
# .env.production
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://hims_app:secure_password@db-host:5432/hims_db
REDIS_URL=redis://redis-host:6379
JWT_SECRET=your-super-secure-jwt-secret
ENCRYPTION_KEY=your-256-bit-encryption-key

# External Services
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=notifications@clinic.com
SMTP_PASS=secure-app-password

SMS_API_KEY=your-sms-gateway-key
PAYMENT_API_KEY=your-payment-processor-key

# AWS Configuration
AWS_REGION=us-east-1
S3_BUCKET=hims-uploads
CLOUDFRONT_URL=https://cdn.clinic.com

# Monitoring
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project
DATADOG_API_KEY=your-datadog-key
```

#### Database Configuration
```sql
-- PostgreSQL configuration
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
ALTER SYSTEM SET pg_stat_statements.max = 10000;
ALTER SYSTEM SET pg_stat_statements.track = 'all';

-- Connection pooling
ALTER SYSTEM SET max_connections = 200;
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET work_mem = '4MB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
```

### 6.2 Secrets Management

#### AWS Secrets Manager
```bash
# Store secrets
aws secretsmanager create-secret --name hims/database \
  --secret-string '{"username":"hims_app","password":"secure_password","host":"db-host","port":"5432","database":"hims_db"}'

aws secretsmanager create-secret --name hims/jwt \
  --secret-string '{"secret":"your-super-secure-jwt-secret"}'

# Retrieve in application
aws secretsmanager get-secret-value --secret-id hims/database
```

#### Kubernetes Secrets
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: hims-secrets
type: Opaque
data:
  database-url: cG9zdGdyZXM6Ly91c2VyOnBhc3NAZGJfaG9zdDo1NDMyL2hpbXNfZGI=  # base64 encoded
  jwt-secret: eW91ci1zdXBlci1zZWN1cmUtam10LXNlY3JldA==  # base64 encoded
  encryption-key: eW91ci0yNTYtYml0LWVuY3J5cHRpb24ta2V5  # base64 encoded
```

---

## 7. Security Setup

### 7.1 SSL/TLS Configuration

#### Nginx SSL Configuration
```nginx
server {
    listen 443 ssl http2;
    server_name hims.clinic.com;

    ssl_certificate /etc/ssl/certs/hims.crt;
    ssl_certificate_key /etc/ssl/private/hims.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

    location / {
        proxy_pass http://app_servers;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### Certificate Management
```bash
# Using Certbot for Let's Encrypt
certbot certonly --nginx -d hims.clinic.com

# Certificate renewal
certbot renew --nginx
```

### 7.2 Firewall Configuration

#### UFW Configuration
```bash
# Enable UFW
ufw enable

# Allow SSH (restrict to specific IPs)
ufw allow from 192.168.1.0/24 to any port 22

# Allow HTTP/HTTPS
ufw allow 80
ufw allow 443

# Allow database access (internal only)
ufw allow from 10.0.0.0/16 to any port 5432

# Default deny
ufw default deny incoming
ufw default allow outgoing
```

### 7.3 Security Hardening

#### Server Hardening
```bash
# Disable root login
sed -i 's/#PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config

# Use key-based authentication only
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config

# Install fail2ban
apt install fail2ban
systemctl enable fail2ban
systemctl start fail2ban

# Configure automatic updates
apt install unattended-upgrades
dpkg-reconfigure unattended-upgrades
```

#### Application Security
```bash
# Install security updates
apt update && apt upgrade

# Configure logrotate for application logs
cat > /etc/logrotate.d/hims << EOF
/var/log/hims/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    create 644 hims hims
    postrotate
        systemctl reload hims
    endscript
}
EOF
```

---

## 8. Monitoring Setup

### 8.1 Application Monitoring

#### Health Check Endpoints
```javascript
// /health endpoint
app.get('/health', (req, res) => {
  // Check database connectivity
  const dbHealth = await checkDatabaseHealth();
  
  // Check Redis connectivity
  const redisHealth = await checkRedisHealth();
  
  // Check external services
  const externalHealth = await checkExternalServices();
  
  const overallHealth = dbHealth && redisHealth && externalHealth;
  
  res.status(overallHealth ? 200 : 503).json({
    status: overallHealth ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    checks: {
      database: dbHealth,
      redis: redisHealth,
      external: externalHealth
    }
  });
});
```

#### Prometheus Metrics
```javascript
const promClient = require('prom-client');

// Create metrics
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
});

const activeUsers = new promClient.Gauge({
  name: 'active_users_total',
  help: 'Number of active users'
});

// Middleware to collect metrics
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .observe(duration);
  });
  next();
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});
```

### 8.2 Infrastructure Monitoring

#### CloudWatch Configuration
```bash
# Install CloudWatch agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
dpkg -i amazon-cloudwatch-agent.deb

# Configure CloudWatch agent
cat > /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json << EOF
{
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          {
            "file_path": "/var/log/hims/application.log",
            "log_group_name": "hims-application",
            "log_stream_name": "{instance_id}"
          }
        ]
      }
    }
  },
  "metrics": {
    "metrics_collected": {
      "statsd": {
        "service_address": ":8125"
      }
    }
  }
}
EOF

# Start CloudWatch agent
systemctl enable amazon-cloudwatch-agent
systemctl start amazon-cloudwatch-agent
```

### 8.3 Alerting Setup

#### Alert Manager Configuration
```yaml
global:
  smtp_smtp:
    host: smtp.gmail.com
    port: 587
    username: alerts@clinic.com
    password: secure-password

route:
  group_by: ['alertname']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 1h
  receiver: 'email-alerts'
  routes:
  - match:
      severity: critical
    receiver: 'critical-alerts'

receivers:
- name: 'email-alerts'
  email_configs:
  - to: 'devops@clinic.com'
    subject: 'HIMS Alert: {{ .GroupLabels.alertname }}'
    
- name: 'critical-alerts'
  email_configs:
  - to: 'oncall@clinic.com'
  pagerduty_configs:
  - service_key: 'your-pagerduty-key'
```

---

## 9. Testing Deployment

### 9.1 Pre-Deployment Checks

#### Health Checks
```bash
# Test application health
curl -f https://hims.clinic.com/health

# Test database connectivity
psql -h db-host -U hims_app -d hims_db -c "SELECT 1;"

# Test Redis connectivity
redis-cli -h redis-host ping

# Test external services
curl -f https://api.external-service.com/health
```

#### Configuration Validation
```bash
# Validate environment variables
node -e "console.log('Environment check passed'); process.exit(0);"

# Test database migrations
npm run db:migrate:status

# Validate SSL certificate
openssl s_client -connect hims.clinic.com:443 -servername hims.clinic.com < /dev/null
```

### 9.2 Smoke Testing

#### Automated Smoke Tests
```bash
# Run smoke test suite
npm run test:smoke

# Test critical user journeys
npx playwright test --grep "smoke"

# API smoke tests
newman run api-tests.postman_collection.json --environment staging.postman_environment.json
```

#### Manual Verification
- [ ] Login functionality works
- [ ] Dashboard loads correctly
- [ ] Patient search functions
- [ ] Appointment scheduling works
- [ ] Basic CRUD operations function
- [ ] Reports generate successfully

### 9.3 Performance Testing

#### Load Testing
```bash
# Using k6 for load testing
k6 run --vus 100 --duration 5m load-test.js

# Performance test script
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 100,
  duration: '5m',
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.1'],
  },
};

export default function () {
  let response = http.get('https://hims.clinic.com/dashboard');
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  sleep(1);
}
```

---

## 10. Rollback Procedures

### 10.1 Application Rollback

#### Blue-Green Deployment
```bash
# Switch traffic to previous version
kubectl set image deployment/hims-backend hims-backend=arocord/hims-backend:v2.1.0

# Verify rollback
kubectl rollout status deployment/hims-backend

# Confirm application health
curl -f https://hims.clinic.com/health
```

#### Database Rollback
```sql
-- Create restore point before deployment
CREATE EXTENSION pg_buffercache;

-- Rollback using backup
pg_restore -h db-host -U hims_app -d hims_db /backups/hims_backup_20240115.sql

-- Verify data integrity
SELECT COUNT(*) FROM patients;
SELECT COUNT(*) FROM appointments;
```

### 10.2 Emergency Rollback

#### Quick Rollback Script
```bash
#!/bin/bash
# emergency-rollback.sh

echo "Starting emergency rollback..."

# Stop current deployment
kubectl scale deployment hims-backend --replicas=0

# Rollback to previous version
kubectl set image deployment/hims-backend hims-backend=arocord/hims-backend:v2.1.0

# Scale back up
kubectl scale deployment hims-backend --replicas=4

# Wait for rollout
kubectl rollout status deployment/hims-backend

# Test health
if curl -f https://hims.clinic.com/health; then
    echo "Rollback successful"
else
    echo "Rollback failed - manual intervention required"
    exit 1
fi
```

### 10.3 Rollback Validation

#### Post-Rollback Checks
- [ ] Application starts successfully
- [ ] Database connections work
- [ ] User authentication functions
- [ ] Critical workflows operate
- [ ] Data integrity maintained
- [ ] External integrations function
- [ ] Monitoring and alerting work

---

## 11. Troubleshooting

### 11.1 Common Deployment Issues

#### Application Won't Start
**Symptoms**: Container crashes, health checks fail
**Causes**: Configuration errors, missing dependencies, port conflicts
**Solutions**:
```bash
# Check container logs
kubectl logs -f deployment/hims-backend

# Check environment variables
kubectl exec -it deployment/hims-backend -- env

# Verify configuration
kubectl describe configmap hims-config
```

#### Database Connection Issues
**Symptoms**: Application errors about database connectivity
**Causes**: Wrong credentials, network issues, database down
**Solutions**:
```bash
# Test database connectivity
psql -h db-host -U hims_app -d hims_db -c "SELECT version();"

# Check database logs
aws rds describe-db-log-files --db-instance-identifier hims-db

# Verify security groups
aws ec2 describe-security-groups --group-ids sg-db-12345678
```

#### High Memory Usage
**Symptoms**: Application pods restarting, out of memory errors
**Causes**: Memory leaks, insufficient resources, high load
**Solutions**:
```bash
# Check memory usage
kubectl top pods

# Increase memory limits
kubectl patch deployment hims-backend -p '{"spec":{"template":{"spec":{"containers":[{"name":"hims-backend","resources":{"limits":{"memory":"1Gi"}}}]}}}}'

# Check for memory leaks
kubectl exec -it deployment/hims-backend -- node --inspect
```

#### SSL Certificate Issues
**Symptoms**: HTTPS not working, certificate errors
**Causes**: Expired certificate, wrong domain, configuration errors
**Solutions**:
```bash
# Check certificate expiry
openssl s_client -connect hims.clinic.com:443 -servername hims.clinic.com 2>/dev/null | openssl x509 -noout -dates

# Renew certificate
certbot renew --nginx

# Check nginx configuration
nginx -t
systemctl reload nginx
```

### 11.2 Performance Issues

#### Slow Response Times
**Symptoms**: Pages load slowly, API calls timeout
**Causes**: Database queries slow, insufficient resources, network issues
**Solutions**:
```bash
# Check database performance
SELECT * FROM pg_stat_activity WHERE state = 'active';

# Analyze slow queries
SELECT query, mean_time, calls FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;

# Check application metrics
curl https://hims.clinic.com/metrics
```

#### High CPU Usage
**Symptoms**: Server CPU at 100%, application slow
**Causes**: Infinite loops, heavy computations, high traffic
**Solutions**:
```bash
# Check CPU usage
top -p $(pgrep -f "node")

# Profile application
kubectl exec -it deployment/hims-backend -- node --prof app.js

# Scale horizontally
kubectl scale deployment hims-backend --replicas=6
```

### 11.3 Monitoring Issues

#### Missing Metrics
**Symptoms**: Monitoring dashboards empty, no alerts
**Causes**: Monitoring agent not running, configuration errors
**Solutions**:
```bash
# Check monitoring agent status
systemctl status amazon-cloudwatch-agent

# Verify configuration
cat /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json

# Restart monitoring
systemctl restart amazon-cloudwatch-agent
```

#### False Alerts
**Symptoms**: Alerts triggering incorrectly
**Causes**: Wrong thresholds, flapping services
**Solutions**:
```bash
# Review alert rules
kubectl get prometheusrules

# Adjust thresholds
kubectl edit prometheusrules hims-alerts

# Check alert history
kubectl logs -f deployment/alertmanager
```

---

## Deployment Checklist

### Pre-Deployment
- [ ] Infrastructure provisioned
- [ ] Security groups configured
- [ ] SSL certificates installed
- [ ] DNS records updated
- [ ] Database created and migrated
- [ ] Environment variables set
- [ ] Secrets configured
- [ ] Monitoring setup
- [ ] Backup configured

### Deployment
- [ ] Code built and tested
- [ ] Docker images created
- [ ] Kubernetes manifests updated
- [ ] Blue-green deployment executed
- [ ] Health checks passing
- [ ] Smoke tests completed
- [ ] Traffic switched to new version

### Post-Deployment
- [ ] Application accessible
- [ ] User authentication working
- [ ] Critical workflows tested
- [ ] Performance verified
- [ ] Monitoring active
- [ ] Alerts configured
- [ ] Documentation updated
- [ ] Team notified

---

## Contact Information

### Deployment Support
- **DevOps Team**: devops@clinic.com
- **Emergency**: +1 (555) 123-DEPLOY
- **On-Call**: PagerDuty integration

### Documentation
- **Runbooks**: `/docs/runbooks/`
- **Incident Response**: `/docs/incidents/`
- **Architecture**: `/docs/architecture/`

---

## Document Control

- **Version**: 1.0
- **Last Updated**: January 2025
- **Review Cycle**: Quarterly
- **Document Owner**: DevOps Engineering Team

---

**Approval Sign-off**

**DevOps Lead**: ___________________________ Date: ____________

**Infrastructure Architect**: ___________________________ Date: ____________

**Security Officer**: ___________________________ Date: ____________