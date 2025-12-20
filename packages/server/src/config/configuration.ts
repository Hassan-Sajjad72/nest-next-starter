import { plainToClass } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, Max, Min } from "class-validator";

export enum Environment {
	Development = "development",
	Production = "production",
}

export class EnvironmentVariables {
	@IsEnum(Environment)
	@IsOptional()
	NODE_ENV: Environment = Environment.Development;

	@IsNumber()
	@Min(0)
	@Max(65535)
	@IsOptional()
	PORT: number = 3000;

	@IsNumber()
	@Min(0)
	@Max(100)
	@IsOptional()
	HEALTH_MEMORY_HEAP_THRESHOLD_MB: number = 150;

	@IsNumber()
	@Min(0)
	@Max(100)
	@IsOptional()
	HEALTH_MEMORY_RSS_THRESHOLD_MB: number = 500;
}

export type AppConfig = InstanceType<typeof EnvironmentVariables>;

export function validate(config: Record<string, unknown>) {
	const validatedConfig = plainToClass(EnvironmentVariables, config, {
		enableImplicitConversion: true,
	});

	return validatedConfig;
}
