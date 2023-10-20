import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfitService } from './profit.service';
import { PriceHistoryCommandModule } from './price-history-command/price-history-command.module';
import { PriceRepository } from './price.repository';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    PriceHistoryCommandModule, 
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    })
  ],
  controllers: [AppController],
  providers: [AppService, ProfitService, PriceRepository],
})
export class AppModule {}
