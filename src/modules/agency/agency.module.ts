import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AgencyController } from './controllers';
import { Agency, AgencyRelationship } from './entities';
import { AgencyService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([Agency, AgencyRelationship])],
  controllers: [AgencyController],
  providers: [AgencyService],
})
export class AgencyModule {}
