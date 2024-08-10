import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';
import { assistanceModule } from './assistances/assistances.module';
import { JwtStrategy } from './users/auth/jwt.strategy';

@Module({
  imports: [
    HealthModule,
    UsersModule,
    assistanceModule
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy]
})
export class AppModule {}
