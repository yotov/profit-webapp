import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfitService } from './profit.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, ProfitService],
})
export class AppModule {}
