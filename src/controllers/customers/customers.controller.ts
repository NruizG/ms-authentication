import { Body, Controller, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CustomerRQ } from 'src/dtos/customer-rq.dto';
import { CustomerRS } from 'src/dtos/customer-rs.dto';
import { LoginRQ } from 'src/dtos/login-rq.dto';
import { LoginRS } from 'src/dtos/login-rs.dto';
import { CustomersService } from 'src/services/customers/customers.service';

@Controller('customers')
export class CustomersController {
  constructor (private customerService: CustomersService) { }

  @Post()
  @HttpCode(201)
  @UsePipes(ValidationPipe)
  public register(@Body() customer: CustomerRQ): Promise<CustomerRS> {
    return this.customerService.register(customer);
  }

  @Post('auth')
  @UsePipes(ValidationPipe)
  public login(@Body() credentials: LoginRQ): Promise<LoginRS> {
    return this.customerService.login(credentials);
  }
}
