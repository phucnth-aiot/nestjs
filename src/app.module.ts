import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig, appConfig } from './config';

// Import modules
import { EmployeeModule } from './modules/employee/employee.module';
import { DepartmentModule } from './modules/department/department.module';
import { SalaryModule } from './modules/salary/salary.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        ...getDatabaseConfig(configService),
        synchronize: false, // Tắt cái này khi có db các bảng rồi
      }),
      inject: [ConfigService],
    }),
    EmployeeModule,
    DepartmentModule,
    SalaryModule,
  ],
})
export class AppModule {}
