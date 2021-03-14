import { HttpModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CustomersController } from './controllers/customers/customers.controller';
import { CustomersService } from './services/customers/customers.service';
import { ParserService } from './services/parser/parser.service';
import { AccountsService } from './services/accounts/accounts.service';
@Module({
  imports: [
    HttpModule
  ],
  controllers: [CustomersController],
  providers: [
    CustomersService,
    ParserService,
    ConfigService,
    AccountsService
  ],
})
export class AppModule {}
