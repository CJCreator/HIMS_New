# Backend Documentation
## AROCORD-HIMS (Healthcare Information Management System)

**Project Name**: AROCORD-HIMS  
**Version**: 2.3  
**Date**: December 2025  
**Status**: Production Ready (90% Complete)  

---

## 1. Backend Architecture Overview

### 1.1 Technology Stack
- **Runtime**: Node.js 18.17.0 LTS
- **Framework**: Express.js 4.18.2
- **Language**: TypeScript 5.7.2
- **Database**: PostgreSQL 15.0
- **Cache**: Redis 7.0
- **ORM**: Prisma 5.0 (TypeScript ORM)
- **Authentication**: JWT with Passport.js
- **Validation**: Joi for request validation
- **Logging**: Winston for structured logging
- **Testing**: Jest with Supertest

### 1.2 Architecture Patterns
- **Layered Architecture**: Controller → Service → Repository → Database
- **Dependency Injection**: InversifyJS for IoC container
- **Repository Pattern**: Data access abstraction
- **CQRS Pattern**: Separate read/write models for complex operations
- **Event Sourcing**: Audit trail and state reconstruction

---

## 2. Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   ├── controllers/      # HTTP request handlers
│   ├── services/         # Business logic layer
│   ├── repositories/     # Data access layer
│   ├── models/          # Data models and DTOs
│   ├── middleware/      # Express middleware
│   ├── utils/           # Utility functions
│   ├── events/          # Event handlers
│   ├── jobs/            # Background jobs
│   └── routes/          # API route definitions
├── tests/               # Test files
├── migrations/          # Database migrations
├── scripts/            # Utility scripts
└── docs/               # API documentation
```

---

## 3. Core Components

### 3.1 Controllers

#### **PatientController**
```typescript
@Controller('/api/v1/patients')
export class PatientController {
  constructor(
    private patientService: PatientService,
    private auditService: AuditService
  ) {}

  @Get()
  @Authorize([Roles.DOCTOR, Roles.NURSE, Roles.ADMIN])
  async getPatients(@Query() query: PatientQuery) {
    return this.patientService.findPatients(query);
  }

  @Post()
  @Authorize([Roles.RECEPTIONIST, Roles.ADMIN])
  async createPatient(@Body() data: CreatePatientDto) {
    const patient = await this.patientService.createPatient(data);
    await this.auditService.log('PATIENT_CREATED', patient.id);
    return patient;
  }
}
```

#### **ConsultationController**
```typescript
@Controller('/api/v1/consultations')
export class ConsultationController {
  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('doctor')
  async startConsultation(@Body() data: StartConsultationDto) {
    return this.consultationService.startConsultation(data);
  }

  @Put(':id/step')
  async updateStep(
    @Param('id') consultationId: string,
    @Body() data: UpdateStepDto
  ) {
    return this.consultationService.updateStep(consultationId, data);
  }
}
```

### 3.2 Services

#### **PatientService**
```typescript
@Injectable()
export class PatientService {
  constructor(
    private patientRepository: PatientRepository,
    private notificationService: NotificationService,
    private cacheManager: CacheManager
  ) {}

  async createPatient(data: CreatePatientDto): Promise<Patient> {
    // Validate patient data
    await this.validatePatientData(data);

    // Create patient record
    const patient = await this.patientRepository.create(data);

    // Send welcome notification
    await this.notificationService.sendWelcomeEmail(patient);

    // Cache patient data
    await this.cacheManager.set(`patient:${patient.id}`, patient, 3600);

    return patient;
  }
}
```

#### **ConsultationWorkflowService**
```typescript
@Injectable()
export class ConsultationWorkflowService {
  async executeStep(consultationId: string, stepData: any) {
    const consultation = await this.getConsultation(consultationId);

    // Validate step dependencies
    await this.validateStepDependencies(consultation, stepData);

    // Execute step logic
    const result = await this.processStep(consultation, stepData);

    // Auto-save progress
    await this.autoSaveProgress(consultationId, result);

    // Trigger notifications if needed
    await this.triggerNotifications(consultation, result);

    return result;
  }
}
```

### 3.3 Repositories

#### **PatientRepository**
```typescript
@Injectable()
export class PatientRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<Patient | null> {
    return this.prisma.patient.findUnique({
      where: { id },
      include: {
        medicalRecords: {
          where: { isActive: true },
          orderBy: { recordedAt: 'desc' }
        },
        appointments: {
          where: {
            scheduledTime: { gte: new Date() }
          },
          orderBy: { scheduledTime: 'asc' }
        }
      }
    });
  }

  async searchPatients(query: PatientSearchQuery) {
    return this.prisma.patient.findMany({
      where: this.buildSearchWhereClause(query),
      include: this.getSearchIncludes(),
      orderBy: this.getSearchOrderBy(query),
      skip: query.offset,
      take: query.limit
    });
  }
}
```

---

## 4. Database Layer

### 4.1 Prisma Schema

```prisma
model Patient {
  id                String   @id @default(cuid())
  mrn               String   @unique
  firstName         String
  lastName          String
  dateOfBirth       DateTime
  gender            Gender
  phone             String?
  email             String?  @unique
  address           Json?
  emergencyContact  Json?
  insuranceInfo     Json?
  isActive          Boolean  @default(true)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  // Relations
  appointments      Appointment[]
  consultations     Consultation[]
  prescriptions     Prescription[]
  medicalRecords    MedicalRecord[]

  @@map("patients")
}

model Consultation {
  id            String            @id @default(cuid())
  patientId     String
  doctorId      String
  appointmentId String?
  workflowType  WorkflowType      @default(STANDARD)
  currentStep   Int               @default(1)
  totalSteps    Int               @default(5)
  stepData      Json?
  status        ConsultationStatus @default(IN_PROGRESS)
  startedAt     DateTime          @default(now())
  completedAt   DateTime?
  duration      Int?

  patient       Patient           @relation(fields: [patientId], references: [id])
  doctor        User              @relation(fields: [doctorId], references: [id])
  appointment   Appointment?      @relation(fields: [appointmentId], references: [id])

  @@map("consultations")
}
```

### 4.2 Database Optimization

#### **Indexing Strategy**
```sql
-- Composite indexes for common queries
CREATE INDEX CONCURRENTLY idx_patients_name_dob ON patients (first_name, last_name, date_of_birth);
CREATE INDEX CONCURRENTLY idx_appointments_doctor_time ON appointments (doctor_id, scheduled_time);
CREATE INDEX CONCURRENTLY idx_consultations_status_started ON consultations (status, started_at);

-- Partial indexes for active records
CREATE INDEX CONCURRENTLY idx_active_medical_records ON medical_records (patient_id, recorded_at DESC) WHERE is_active = true;

-- Full-text search
CREATE INDEX CONCURRENTLY idx_patients_fts ON patients USING gin(to_tsvector('english', first_name || ' ' || last_name || ' ' || mrn));
```

#### **Connection Pooling**
```typescript
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: ['query', 'info', 'warn', 'error'],
});
```

---

## 5. Middleware and Security

### 5.1 Authentication Middleware

```typescript
@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = this.extractTokenFromHeader(req);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      req.user = payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }

    next();
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
```

### 5.2 Authorization Middleware

```typescript
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
```

### 5.3 Request Validation

```typescript
export class CreatePatientDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsDateString()
  dateOfBirth: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
```

---

## 6. Background Processing

### 6.1 Job Queue System

#### **Bull Queue Implementation**
```typescript
@Injectable()
export class NotificationQueue {
  private queue: Queue;

  constructor() {
    this.queue = new Queue('notifications', {
      redis: process.env.REDIS_URL,
      defaultJobOptions: {
        removeOnComplete: 50,
        removeOnFail: 100,
      },
    });

    this.queue.process('send-email', async (job) => {
      await this.emailService.send(job.data);
    });
  }

  async addNotificationJob(type: string, data: any) {
    await this.queue.add(type, data, {
      priority: this.getPriority(type),
      delay: this.getDelay(type),
    });
  }
}
```

#### **Scheduled Jobs**
```typescript
@Injectable()
export class AppointmentReminderJob {
  @Cron('0 */2 * * *') // Every 2 hours
  async sendAppointmentReminders() {
    const upcomingAppointments = await this.appointmentService
      .findUpcomingAppointments(24); // Next 24 hours

    for (const appointment of upcomingAppointments) {
      await this.notificationQueue.addNotificationJob('appointment-reminder', {
        patientId: appointment.patientId,
        appointmentTime: appointment.scheduledTime,
      });
    }
  }
}
```

---

## 7. Error Handling and Logging

### 7.1 Global Error Handler

```typescript
@Injectable()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private logger: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = 500;
    let message = 'Internal server error';

    if (exception instanceof BadRequestException) {
      status = 400;
      message = exception.message;
    } else if (exception instanceof UnauthorizedException) {
      status = 401;
      message = 'Unauthorized';
    }

    this.logger.error('Exception caught', {
      exception: exception.toString(),
      stack: exception.stack,
      url: request.url,
      method: request.method,
      ip: request.ip,
    });

    response.status(status).json({
      success: false,
      error: {
        code: this.getErrorCode(exception),
        message,
        timestamp: new Date().toISOString(),
        path: request.url,
      },
    });
  }
}
```

### 7.2 Structured Logging

```typescript
@Injectable()
export class LoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
      ],
    });
  }

  info(message: string, meta?: any) {
    this.logger.info(message, meta);
  }

  error(message: string, error?: Error, meta?: any) {
    this.logger.error(message, { error: error?.stack, ...meta });
  }
}
```

---

## 8. API Documentation

### 8.1 OpenAPI/Swagger Integration

```typescript
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('AROCORD-HIMS API')
  .setDescription('Healthcare Information Management System API')
  .setVersion('1.0')
  .addTag('patients', 'Patient management endpoints')
  .addTag('appointments', 'Appointment scheduling endpoints')
  .addTag('consultations', 'Medical consultation endpoints')
  .addBearerAuth(
    { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    'JWT'
  )
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api-docs', app, document);
```

### 8.2 API Response Format

```typescript
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
    timestamp: string;
    requestId: string;
  };
}
```

---

## 9. Performance Optimization

### 9.1 Caching Strategy

#### **Redis Caching**
```typescript
@Injectable()
export class CacheService {
  constructor(private redis: Redis) {}

  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    const serialized = JSON.stringify(value);
    if (ttlSeconds) {
      await this.redis.setex(key, ttlSeconds, serialized);
    } else {
      await this.redis.set(key, serialized);
    }
  }

  async invalidatePattern(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }
}
```

#### **Database Query Optimization**
```typescript
@Injectable()
export class PatientService {
  @UseCache('patients:list', 300) // Cache for 5 minutes
  async findPatients(query: PatientQuery) {
    return this.patientRepository.findMany({
      where: this.buildWhereClause(query),
      include: this.getIncludes(),
      orderBy: this.getOrderBy(query),
      skip: query.offset,
      take: query.limit,
    });
  }

  @CacheInvalidate('patients:*')
  async updatePatient(id: string, data: UpdatePatientDto) {
    return this.patientRepository.update({
      where: { id },
      data,
    });
  }
}
```

---

## 10. Testing Strategy

### 10.1 Unit Testing

```typescript
describe('PatientService', () => {
  let service: PatientService;
  let mockRepository: MockType<PatientRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PatientService,
        {
          provide: PatientRepository,
          useFactory: jest.fn(() => ({
            create: jest.fn(),
            findById: jest.fn(),
          })),
        },
      ],
    }).compile();

    service = module.get<PatientService>(PatientService);
    mockRepository = module.get(PatientRepository);
  });

  it('should create a patient', async () => {
    const patientData = { firstName: 'John', lastName: 'Doe' };
    mockRepository.create.mockReturnValue(patientData);

    const result = await service.createPatient(patientData);
    expect(result).toEqual(patientData);
  });
});
```

### 10.2 Integration Testing

```typescript
describe('Patient API (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/patients (GET)', () => {
    return request(app.getHttpServer())
      .get('/patients')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data.patients)).toBe(true);
      });
  });
});
```

---

## 11. Deployment and Monitoring

### 11.1 Docker Configuration

```dockerfile
FROM node:18-alpine AS base

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist/ ./dist/

EXPOSE 3000

CMD ["node", "dist/main.js"]
```

### 11.2 Health Checks

```typescript
@Controller('health')
export class HealthController {
  constructor(
    private databaseHealth: DatabaseHealthIndicator,
    private redisHealth: RedisHealthIndicator
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return HealthCheckService
      .getBuilder()
      .addCheck('database', () => this.databaseHealth.pingCheck('database'))
      .addCheck('redis', () => this.redisHealth.pingCheck('redis'))
      .build()
      .check();
  }
}
```

---

## 12. Security Best Practices

### 12.1 Input Validation and Sanitization

```typescript
import { body } from 'express-validator';

export const createPatientValidation = [
  body('firstName')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('First name must be 1-100 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('First name contains invalid characters'),

  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email format'),
];
```

### 12.2 Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later',
});
```

---

**Document Control**  
**Version**: 1.0  
**Last Updated**: December 2025  
**Next Review**: March 2026  
**Document Owner**: Backend Development Team