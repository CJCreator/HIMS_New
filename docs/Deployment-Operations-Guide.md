# Deployment and Operations Guide
## AROCORD-HIMS (Healthcare Information Management System)

**Project Name**: AROCORD-HIMS  
**Version**: 2.3  
**Date**: December 2025  
**Status**: Production Ready (90% Complete)  

---

## 1. Introduction

### 1.1 Purpose
This Deployment and Operations Guide provides comprehensive instructions for deploying, maintaining, and operating the AROCORD-HIMS system in production environments.

### 1.2 Scope
This guide covers deployment procedures, environment management, monitoring, maintenance, and operational procedures for the HIMS system.

---

## 2. Infrastructure Requirements

### 2.1 Production Environment

#### **Cloud Infrastructure (AWS)**
```
VPC (10.0.0.0/16)
├── Public Subnets (AZ-1a, AZ-1b, AZ-1c)
│   ├── Application Load Balancer
│   ├── NAT Gateway
│   └── Bastion Host
├── Private Subnets (AZ-1a, AZ-1b, AZ-1c)
│   ├── ECS Fargate Tasks (Frontend)
│   ├── ECS Fargate Tasks (Backend API)
│   ├── RDS PostgreSQL (Primary)
│   ├── RDS PostgreSQL (Read Replicas)
│   ├── ElastiCache Redis
│   └── EFS (File Storage)
└── Security Groups & NACLs
```

#### **Compute Resources**
- **Frontend**: ECS Fargate (2-10 tasks, 0.5-2 vCPU, 1-4 GB RAM)
- **Backend API**: ECS Fargate (3-15 tasks, 1-4 vCPU, 2-8 GB RAM)
- **Database**: RDS PostgreSQL (db.r6g.xlarge, 32 GB RAM)
- **Cache**: ElastiCache Redis (cache.r6g.large)
- **File Storage**: EFS (General Purpose, 100 GB)

### 2.2 Development Environment

#### **Local Development**
```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://user:password@db:5432/hims_dev
    depends_on:
      - db
      - redis

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=hims_dev
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
```

### 2.3 Staging Environment

#### **Pre-Production Setup**
- **Mirror Production**: Identical infrastructure to production
- **Data Subset**: Anonymized production data subset
- **Access Control**: Restricted to development and QA teams
- **Automated Deployment**: CI/CD pipeline integration

---

## 3. Deployment Process

### 3.1 CI/CD Pipeline

#### **GitHub Actions Workflow**
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm run test:ci
      - name: Build application
        run: npm run build

  security-scan:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Run Snyk
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

  deploy-staging:
    needs: [test, security-scan]
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Staging
        run: |
          aws ecs update-service --cluster hims-staging --service hims-api --force-new-deployment

  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Deploy to Production
        run: |
          aws ecs update-service --cluster hims-production --service hims-api --force-new-deployment
```

### 3.2 Blue-Green Deployment

#### **Deployment Strategy**
1. **Prepare New Environment**: Deploy to blue environment
2. **Health Checks**: Verify application health
3. **Database Migration**: Run schema migrations
4. **Traffic Switch**: Route traffic to blue environment
5. **Monitor**: Watch for issues
6. **Cleanup**: Terminate green environment

#### **Automated Blue-Green Script**
```bash
#!/bin/bash

# Deploy to blue environment
aws ecs update-service --cluster hims-prod --service hims-api-blue --force-new-deployment

# Wait for deployment to complete
aws ecs wait services-stable --cluster hims-prod --services hims-api-blue

# Run health checks
curl -f https://api-blue.hims.arocord.com/health || exit 1

# Switch traffic (update ALB target groups)
aws elbv2 modify-listener \
  --listener-arn $LISTENER_ARN \
  --default-actions Type=forward,TargetGroupArn=$BLUE_TARGET_GROUP

# Monitor for 5 minutes
sleep 300

# Check error rates and latency
ERROR_RATE=$(aws cloudwatch get-metric-statistics \
  --namespace AWS/ApplicationELB \
  --metric-name HTTPCode_Target_5XX_Count \
  --start-time $(date -u -d '5 minutes ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 300 \
  --statistics Sum)

if [ "$ERROR_RATE" -gt 10 ]; then
  echo "High error rate detected, rolling back..."
  # Rollback logic
fi
```

### 3.3 Database Deployment

#### **Migration Strategy**
```bash
# Prisma migrations
npx prisma migrate deploy

# Data seeding (if needed)
npm run db:seed

# Migration verification
npm run db:verify
```

#### **Zero-Downtime Migrations**
- **Backward Compatible**: Ensure old code works with new schema
- **Feature Flags**: Use feature flags for schema changes
- **Gradual Rollout**: Deploy schema changes before code changes
- **Rollback Plan**: Ability to revert schema changes

---

## 4. Environment Configuration

### 4.1 Environment Variables

#### **Application Configuration**
```bash
# Application
NODE_ENV=production
PORT=3000
API_VERSION=v1

# Database
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
DATABASE_MAX_CONNECTIONS=20
DATABASE_IDLE_TIMEOUT=30000

# Redis
REDIS_URL=redis://host:6379
REDIS_PASSWORD=password

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# External Services
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=user@gmail.com
SMTP_PASS=password

# AWS
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=key
AWS_SECRET_ACCESS_KEY=secret

# Monitoring
SENTRY_DSN=https://dsn@sentry.io/project
DATADOG_API_KEY=key
```

#### **Feature Flags**
```typescript
export const FEATURES = {
  ADAPTIVE_CONSULTATION: process.env.FEATURE_ADAPTIVE_CONSULTATION === 'true',
  TELEMEDICINE: process.env.FEATURE_TELEMEDICINE === 'true',
  AI_DIAGNOSIS: process.env.FEATURE_AI_DIAGNOSIS === 'true',
  ADVANCED_ANALYTICS: process.env.FEATURE_ADVANCED_ANALYTICS === 'true',
};
```

### 4.2 Secrets Management

#### **AWS Secrets Manager**
```bash
# Store secrets
aws secretsmanager create-secret \
  --name hims/database \
  --secret-string '{"username":"admin","password":"secret"}'

# Retrieve in application
import { SecretsManager } from 'aws-sdk';

const secretsManager = new SecretsManager();
const secret = await secretsManager.getSecretValue({ SecretId: 'hims/database' }).promise();
const dbConfig = JSON.parse(secret.SecretString);
```

---

## 5. Monitoring and Alerting

### 5.1 Application Monitoring

#### **APM Setup (DataDog/New Relic)**
```typescript
// Application monitoring
import * as ddTrace from 'dd-trace';

ddTrace.init({
  service: 'hims-api',
  env: process.env.NODE_ENV,
  version: process.env.npm_package_version,
});

// Custom metrics
import { metrics } from 'datadog-metrics';

metrics.init({
  apiKey: process.env.DATADOG_API_KEY,
  appKey: process.env.DATADOG_APP_KEY,
  prefix: 'hims.',
});

// Track custom metrics
metrics.increment('consultation.started');
metrics.histogram('api.response_time', responseTime);
```

#### **Health Check Endpoints**
```typescript
// Basic health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
  });
});

// Detailed health check
app.get('/health/detailed', async (req, res) => {
  const health = {
    database: await checkDatabaseHealth(),
    redis: await checkRedisHealth(),
    externalServices: await checkExternalServices(),
  };

  const isHealthy = Object.values(health).every(h => h.status === 'healthy');

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'healthy' : 'unhealthy',
    checks: health,
    timestamp: new Date().toISOString(),
  });
});
```

### 5.2 Infrastructure Monitoring

#### **CloudWatch Alarms**
```yaml
# High CPU utilization
alarm:
  name: HighCPUUtilization
  metric: AWS/ECS CPUUtilization
  threshold: 80
  comparison: GreaterThanThreshold
  evaluationPeriods: 2
  datapointsToAlarm: 2

# Database connection count
alarm:
  name: HighDBConnections
  metric: DatabaseConnections
  threshold: 80
  comparison: GreaterThanThreshold

# Error rate monitoring
alarm:
  name: HighErrorRate
  metric: HTTPCode_Target_5XX_Count
  threshold: 10
  comparison: GreaterThanThreshold
```

### 5.3 Alert Management

#### **Alert Classification**
- **P1 - Critical**: System down, data loss, security breach
- **P2 - High**: Degraded performance, high error rates
- **P3 - Medium**: Minor issues, performance warnings
- **P4 - Low**: Informational alerts

#### **Escalation Procedures**
```yaml
# PagerDuty integration
alert_rules:
  - name: "API Down"
    condition: "up == 0"
    severity: critical
    channels: [pagerduty, slack, email]

  - name: "High Error Rate"
    condition: "rate(http_requests_total{status=~'5..'} [5m]) > 0.1"
    severity: high
    channels: [slack, email]

  - name: "Slow Response Time"
    condition: "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket [5m])) > 5"
    severity: medium
    channels: [slack]
```

---

## 6. Backup and Recovery

### 6.1 Database Backup Strategy

#### **Automated Backups**
```bash
# Daily full backup
pg_dump --host=$DB_HOST --username=$DB_USER --dbname=$DB_NAME \
  --format=custom --compress=9 --file=backup_$(date +%Y%m%d).dump

# Upload to S3
aws s3 cp backup_$(date +%Y%m%d).dump s3://hims-backups/database/

# Retention policy: 30 days for daily, 1 year for monthly
```

#### **Point-in-Time Recovery**
```bash
# Restore to specific timestamp
pg_restore --host=$DB_HOST --username=$DB_USER \
  --dbname=$DB_NAME --format=custom \
  --target=2025-01-15T10:00:00Z \
  backup_20250115.dump
```

### 6.2 Application Backup

#### **Configuration Backup**
```bash
# Backup environment configurations
tar -czf config_backup_$(date +%Y%m%d).tar.gz \
  /opt/hims/config/ \
  /etc/nginx/sites-available/

# Backup to S3
aws s3 sync /opt/hims/config/ s3://hims-backups/config/
```

### 6.3 Disaster Recovery

#### **Recovery Time Objective (RTO)**
- **Critical Systems**: 4 hours
- **Important Systems**: 24 hours
- **Standard Systems**: 72 hours

#### **Recovery Point Objective (RPO)**
- **Critical Data**: 1 hour data loss
- **Important Data**: 8 hours data loss
- **Standard Data**: 24 hours data loss

#### **DR Testing Schedule**
- **Quarterly**: Full disaster recovery test
- **Monthly**: Backup restoration test
- **Weekly**: Automated backup verification

---

## 7. Maintenance Procedures

### 7.1 Routine Maintenance

#### **Weekly Tasks**
```bash
# Database maintenance
vacuumdb --analyze --verbose hims_prod
reindexdb --verbose hims_prod

# Log rotation
logrotate /etc/logrotate.d/hims

# Certificate renewal check
certbot renew --dry-run
```

#### **Monthly Tasks**
```bash
# Security updates
yum update --security

# Dependency updates
npm audit fix

# Performance optimization
# Analyze slow queries
# Update indexes if needed
```

### 7.2 Emergency Maintenance

#### **System Outage Response**
1. **Detection**: Monitoring alerts trigger
2. **Assessment**: Evaluate impact and scope
3. **Communication**: Notify stakeholders
4. **Response**: Implement fix or workaround
5. **Recovery**: Restore normal operations
6. **Review**: Post-mortem analysis

#### **Rollback Procedures**
```bash
# Application rollback
kubectl rollout undo deployment/hims-api

# Database rollback (if needed)
pg_restore --clean --if-exists backup_previous.dump

# Configuration rollback
git checkout HEAD~1 -- config/
```

---

## 8. Security Operations

### 8.1 Access Management

#### **SSH Access Control**
```bash
# Bastion host setup
aws ec2-instance-connect send-ssh-public-key \
  --instance-id i-1234567890abcdef0 \
  --username ec2-user \
  --ssh-public-key file://~/.ssh/id_rsa.pub

# Session recording
script -a /var/log/ssh/$(date +%Y%m%d_%H%M%S)_${USER}.log
```

#### **Database Access**
```bash
# Read-only user for analytics
CREATE USER analytics_user WITH PASSWORD 'password';
GRANT CONNECT ON DATABASE hims_prod TO analytics_user;
GRANT USAGE ON SCHEMA public TO analytics_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO analytics_user;

# Audit logging
ALTER SYSTEM SET log_statement = 'all';
ALTER SYSTEM SET log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h ';
```

### 8.2 Security Monitoring

#### **Intrusion Detection**
```bash
# Fail2Ban configuration
[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 3600

# AWS GuardDuty integration
aws guardduty create-detector --enable
```

#### **Vulnerability Scanning**
```bash
# Container scanning
trivy image arocord/hims-api:latest

# Dependency scanning
npm audit --audit-level=moderate

# Infrastructure scanning
aws inspector create-assessment-template \
  --assessment-target-arn $TARGET_ARN \
  --assessment-template-name "HIMS Security Assessment"
```

---

## 9. Performance Optimization

### 9.1 Application Performance

#### **Caching Strategy**
```typescript
// API response caching
const cacheMiddleware = (duration) => (req, res, next) => {
  const key = `api:${req.originalUrl}`;
  redis.get(key, (err, data) => {
    if (data) {
      res.json(JSON.parse(data));
    } else {
      res.originalJson = res.json;
      res.json = (body) => {
        redis.setex(key, duration, JSON.stringify(body));
        res.originalJson(body);
      };
      next();
    }
  });
};
```

#### **Database Optimization**
```sql
-- Query optimization
EXPLAIN ANALYZE SELECT * FROM patients WHERE last_name LIKE 'Smith%';

-- Index optimization
CREATE INDEX CONCURRENTLY idx_patients_search ON patients (last_name, first_name);
ANALYZE patients;

-- Partitioning for large tables
CREATE TABLE consultations_y2025 PARTITION OF consultations
  FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
```

### 9.2 Infrastructure Scaling

#### **Auto-scaling Configuration**
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: hims-api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: hims-api
  minReplicas: 3
  maxReplicas: 15
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

---

## 10. Incident Management

### 10.1 Incident Response Process

#### **Phase 1: Detection & Assessment**
1. **Alert Triggered**: Monitoring system detects anomaly
2. **Initial Assessment**: On-call engineer evaluates severity
3. **Stakeholder Notification**: Notify relevant teams
4. **Incident Declaration**: Escalate if needed

#### **Phase 2: Response & Mitigation**
1. **Investigation**: Gather logs and metrics
2. **Root Cause Analysis**: Identify underlying issue
3. **Temporary Fix**: Implement immediate workaround
4. **Permanent Fix**: Develop and test solution

#### **Phase 3: Recovery & Review**
1. **System Recovery**: Restore normal operations
2. **Validation**: Confirm fix effectiveness
3. **Documentation**: Record incident details
4. **Post-Mortem**: Conduct lessons learned session

### 10.2 Communication Templates

#### **Customer Communication**
```
Subject: HIMS Service Update - [Incident ID]

Dear Valued Customer,

We are currently experiencing [brief description] that may affect [specific services].

Status: [Active/Monitoring/Resolved]
Start Time: [timestamp]
Estimated Resolution: [time or "Monitoring"]

We apologize for any inconvenience and are working to resolve this quickly.

Best regards,
AROCORD HIMS Support Team
```

#### **Internal Communication**
```
INCIDENT REPORT

ID: INC-2025-001
Priority: [P1/P2/P3]
Status: [Active/Resolved]

Affected Services: [list]
Impact: [description]
Timeline:
- Detected: [time]
- Responded: [time]
- Resolved: [time]

Actions Taken: [summary]
Root Cause: [analysis]
Prevention: [measures]
```

---

## 11. Compliance and Audit

### 11.1 HIPAA Compliance Monitoring

#### **Access Logging**
```sql
-- Audit all PHI access
CREATE TABLE phi_access_log (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  patient_id INTEGER REFERENCES patients(id),
  action VARCHAR(50),
  resource_type VARCHAR(50),
  resource_id INTEGER,
  ip_address INET,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger for automatic logging
CREATE OR REPLACE FUNCTION log_phi_access() RETURNS trigger AS $$
BEGIN
  INSERT INTO phi_access_log (user_id, patient_id, action, resource_type, resource_id)
  VALUES (NEW.user_id, NEW.patient_id, TG_OP, TG_TABLE_NAME, NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

#### **Regular Audits**
- **Monthly**: Access log review
- **Quarterly**: Security assessment
- **Annually**: Full HIPAA compliance audit

### 11.2 Change Management

#### **Change Approval Process**
1. **Change Request**: Submit detailed change description
2. **Impact Assessment**: Evaluate risk and impact
3. **Approval**: CAB (Change Advisory Board) review
4. **Implementation**: Scheduled change window
5. **Validation**: Post-change verification
6. **Documentation**: Update change log

---

## 12. Support and Documentation

### 12.1 Runbooks

#### **Common Issues and Solutions**
```yaml
# Database connection issues
symptom: "Database connection timeout"
solution:
  - Check database server status
  - Verify connection pool settings
  - Restart application if needed
  - Escalate to DBA if persistent

# High CPU usage
symptom: "CPU utilization > 90%"
solution:
  - Check running processes
  - Review application logs
  - Scale up instances if needed
  - Investigate memory leaks
```

### 12.2 Knowledge Base

#### **Troubleshooting Guides**
- **Application Errors**: Common error codes and resolutions
- **Performance Issues**: Optimization techniques
- **Security Incidents**: Response procedures
- **Infrastructure Problems**: Recovery steps

#### **Maintenance Checklists**
- **Daily Checks**: Health monitoring, log review
- **Weekly Tasks**: Backup verification, security scans
- **Monthly Activities**: Performance tuning, updates
- **Quarterly Reviews**: Architecture assessment, DR testing

---

**Document Control**  
**Version**: 1.0  
**Last Updated**: December 2025  
**Next Review**: March 2026  
**Document Owner**: DevOps/Operations Team