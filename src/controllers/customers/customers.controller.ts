import { Body, Controller, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CustomerRQ } from 'src/dtos/customer-rq.dto';
import { CustomerRS } from 'src/dtos/customer-rs.dto';
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
}
