# Environment Variables

This document explains how to configure environment variables for the application.

## Overview

The application uses environment variables for configuration. These variables are validated at startup to ensure the application has all required configuration before running.

## Setup

### 1. Create Environment File

Copy the example environment file to create your local configuration:

```bash
# For the server package
cd packages/server
cp .env.example .env
```

### 2. Configure Variables

Edit the `.env` file with your specific values. See the [Available Variables](#available-variables) section below for details.

### 3. Validation

Environment variables are automatically validated when the application starts. If any required variables are missing or invalid, the application will fail to start with a descriptive error message.

## Available Variables

### Application Environment

| Variable | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `NODE_ENV` | `development` \| `production` | `development` | No | Application environment |

### Server Configuration

| Variable | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `PORT` | number | `3000` | No | Port number for the server (0-65535) |

### Health Check Configuration

| Variable | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `HEALTH_MEMORY_HEAP_THRESHOLD_MB` | number | `150` | No | Memory heap threshold in MB (0-100) for health checks |
| `HEALTH_MEMORY_RSS_THRESHOLD_MB` | number | `500` | No | Memory RSS threshold in MB (0-100) for health checks |

## Adding New Environment Variables

To add new environment variables to the application:

### 1. Update Validation Schema

Edit `packages/server/src/config/configuration.ts` and add your new variable to the `EnvironmentVariables` class:

```typescript
export class EnvironmentVariables {
  // ... existing variables ...

  @IsString()
  @IsOptional() // Remove if the variable is required
  MY_NEW_VARIABLE?: string;
}
```

Use decorators from `class-validator` to define validation rules:
- `@IsString()` - Must be a string
- `@IsNumber()` - Must be a number
- `@IsBoolean()` - Must be a boolean
- `@IsEnum(MyEnum)` - Must be one of the enum values
- `@IsOptional()` - Variable is optional
- `@Min(value)` - Minimum value for numbers
- `@Max(value)` - Maximum value for numbers
- `@IsUrl()` - Must be a valid URL
- `@IsEmail()` - Must be a valid email

### 2. Update Documentation

Add your new variable to this documentation file in the [Available Variables](#available-variables) section.

## Using Environment Variables in Code

### Using ConfigService with Type Safety (Recommended)

Inject the `ConfigService` with the `AppConfig` type into your service or controller:

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '@/config/configuration';

@Injectable()
export class MyService {
  constructor(private configService: ConfigService<AppConfig>) {}

  someMethod() {
    // Direct access to environment variables with type safety
    const port = this.configService.get('PORT', 3000);
    const nodeEnv = this.configService.get('NODE_ENV');

    // Health check thresholds (convert MB to bytes)
    const heapThreshold = this.configService.get('HEALTH_MEMORY_HEAP_THRESHOLD_MB', 150) * 1024 * 1024;
    const rssThreshold = this.configService.get('HEALTH_MEMORY_RSS_THRESHOLD_MB', 500) * 1024 * 1024;
  }
}
```

### Example: Health Controller

Here's a real example from the health controller showing how to use configuration:

```typescript
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
    private configService: ConfigService<AppConfig>,
  ) {}

  @Get('live')
  @HealthCheck()
  async liveness(): Promise<HealthCheckResult> {
    const memoryHeapThreshold =
      this.configService.get('HEALTH_MEMORY_HEAP_THRESHOLD_MB', 150) *
      1024 *
      1024;

    return this.health.check([
      () => this.memory.checkHeap('memory_heap', memoryHeapThreshold),
    ]);
  }
}
```

## Environment-Specific Configuration

### Development

For local development, use `.env` file with development settings:

```bash
NODE_ENV=development
PORT=3000
HEALTH_MEMORY_HEAP_THRESHOLD_MB=150
HEALTH_MEMORY_RSS_THRESHOLD_MB=500
```

### Production

For production, set environment variables through your hosting platform (Docker, Kubernetes, cloud provider, etc.). Never commit production secrets to version control.

Example for Docker:

```dockerfile
ENV NODE_ENV=production
ENV PORT=3000
ENV HEALTH_MEMORY_HEAP_THRESHOLD_MB=150
ENV HEALTH_MEMORY_RSS_THRESHOLD_MB=500
```

Example for Kubernetes:

```yaml
env:
  - name: NODE_ENV
    value: "production"
  - name: PORT
    value: "3000"
  - name: HEALTH_MEMORY_HEAP_THRESHOLD_MB
    value: "150"
  - name: HEALTH_MEMORY_RSS_THRESHOLD_MB
    value: "500"
```

### Testing

For tests, you can override environment variables in your test setup:

```typescript
process.env.NODE_ENV = 'test';
process.env.PORT = '3001';
```

## Best Practices

1. **Never commit `.env` files** - Add `.env` to `.gitignore`
2. **Always provide `.env.example`** - Document all required variables
3. **Use validation** - Catch configuration errors early
4. **Use defaults wisely** - Provide sensible defaults for non-sensitive values
5. **Document everything** - Keep this file up to date
6. **Separate secrets** - Use secret management tools for production
7. **Type your config** - Use TypeScript for better developer experience

## Troubleshooting

### Application won't start

If the application fails to start with a validation error:

1. Check that all required environment variables are set
2. Verify the values match the expected type and format
3. Review the error message for specific validation failures

### Variables not being read

1. Ensure the `.env` file is in the correct location (`packages/server/.env`)
2. Restart the application after changing `.env` values
3. Check that variable names match exactly (case-sensitive)

### Type errors when accessing config

1. Use the exact environment variable names as defined in `EnvironmentVariables` class
2. Import and use the `AppConfig` type: `ConfigService<AppConfig>`
3. Provide default values in `configService.get()` calls for optional variables

## Security Notes

- **Never commit secrets** to version control
- Use environment-specific secret management in production
- Rotate secrets regularly
- Use strong, randomly generated values for secrets
- Limit access to production environment variables
- Consider using tools like HashiCorp Vault, AWS Secrets Manager, or similar for production secrets

## Additional Resources

- [NestJS Configuration Documentation](https://docs.nestjs.com/techniques/configuration)
- [class-validator Documentation](https://github.com/typestack/class-validator)
- [class-transformer Documentation](https://github.com/typestack/class-transformer)

