import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfitService } from './profit.service';
import { PriceHistoryCommandModule } from './price-history-command/price-history-command.module';
import { PriceRepository } from './price.repository';

@Module({
  imports: [PriceHistoryCommandModule],
  controllers: [AppController],
  providers: [AppService, ProfitService, PriceRepository],
})
export class AppModule {}
