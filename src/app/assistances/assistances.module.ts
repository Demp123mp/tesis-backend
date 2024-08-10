import { Module } from '@nestjs/common';
import { AssistanceService } from './assistances.service';
import { assistanceController } from './assistances.controller';

@Module({
  controllers: [assistanceController],
  providers: [AssistanceService]
})
export class assistanceModule {}
