import { BadRequestException, ConflictException, HttpService, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';
import { RequestQueryBuilder } from '@nestjsx/crud-request';
import { CustomerRQ } from 'src/dtos/customer-rq.dto';
import { CustomerRS } from 'src/dtos/customer-rs.dto';
import { ParserService } from '../parser/parser.service';
import { CreateAccountDto } from 'src/dtos/create-account.dto';
import { AccountsService } from '../accounts/accounts.service';

@Injectable()
export class CustomersService {
  private path: string;

  constructor(
    private configService: ConfigService,
    private parser: ParserService,
    private http: HttpService,
    private accountService: AccountsService
  ) {
    this.path = this.configService.get('MS_DATA');
  }

  public async register(customer: CustomerRQ): Promise<CustomerRS> {
    const found = await this.findUserByDni(customer.dni);
    if (!found) {
      const created = await this.create(customer);
      if (created) {
        const account = new CreateAccountDto();
        account.prepare(created.id);
        await this.accountService.create(account);
        return created;
      }
      return created;
    }

    throw new ConflictException('USER_EXIST');
  }

  public async findUserByDni(dni: string): Promise<CustomerRS> {
    return new Promise<CustomerRS>((resolve, reject) => {
      const query = RequestQueryBuilder.create()
      .setFilter({ field: 'dni', operator: '$eq', value: dni });
      this.http.get<CustomerRS[]>(`${this.path}/customers?${this.parser.parse(query)}`)
        .subscribe((response: AxiosResponse<CustomerRS[]>) => {
          resolve(
            !response.data?.length ? null : new CustomerRS(response.data[0])
          );
        }, error => {
          throw new BadRequestException(error);
        });
    });
  }

  public async create(customer: CustomerRQ): Promise<CustomerRS> {
    return new Promise<CustomerRS>((resolve, reject) => {
      this.http.post(`${this.path}/customers`, customer).subscribe(response => {
        resolve(new CustomerRS(response.data));
      }, error => {
        reject(error);
      });
    });
  }
}
