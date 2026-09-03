import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesModule } from './modules/courses/courses.module';
import { StudentsModule } from './modules/students/students.module';
import { EnrollmentsModule } from './modules/enrollments/enrollments.module';
import { HealthController } from './common/controllers/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USER', 'orplatform'),
        password: configService.get('DB_PASSWORD', 'dev123'),
        database: configService.get('DB_NAME', 'or_platform'),
        entities: ['dist/**/*.entity.js'],
        migrations: ['dist/database/migrations/*.js'],
        synchronize: configService.get('NODE_ENV') === 'development',
        logging: configService.get('NODE_ENV') === 'development',
      }),
    }),
    CoursesModule,
    StudentsModule,
    EnrollmentsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
