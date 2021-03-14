import { BadRequestException, ConflictException, ForbiddenException, HttpService, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';
import { RequestQueryBuilder } from '@nestjsx/crud-request';
import { CustomerRQ } from 'src/dtos/customer-rq.dto';
import { CustomerRS } from 'src/dtos/customer-rs.dto';
import { ParserService } from '../parser/parser.service';
import { CreateAccountDto } from 'src/dtos/create-account.dto';
import { AccountsService } from '../accounts/accounts.service';
import { LoginRQ } from 'src/dtos/login-rq.dto';
import { LoginRS } from 'src/dtos/login-rs.dto';
import { Customer } from 'src/models/customer.model';
import { sign } from 'jsonwebtoken';

@Injectable()
export class CustomersService {
  private path: string;
  private jwtSecret: string;
  private jwtExpireTime: number;

  constructor(
    private configService: ConfigService,
    private parser: ParserService,
    private http: HttpService,
    private accountService: AccountsService
  ) {
    this.path = this.configService.get('MS_DATA');
    this.jwtSecret = this.configService.get('JWT_SECRET');
    this.jwtExpireTime = this.configService.get('JWT_EXPIRE_TIME') || 3600;
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

  public async login(credentials: LoginRQ): Promise<LoginRS> {
    const found = await this.findUserByDni(credentials.dni);
    if (found) {
      if (found.validatePassword(credentials.password)) {
        const customerRs = new CustomerRS(found);
        return new LoginRS({
          customer: customerRs,
          token: sign({ data: customerRs }, this.jwtSecret, {
            expiresIn: this.jwtExpireTime
          })
        });
      }

      throw new ForbiddenException();
    }

    throw new ForbiddenException();
  }

  public async findUserByDni(dni: string): Promise<Customer> {
    return new Promise<Customer>((resolve, reject) => {
      const query = RequestQueryBuilder.create()
      .setFilter({ field: 'dni', operator: '$eq', value: dni });
      this.http.get<Customer[]>(`${this.path}/customers?${this.parser.parse(query)}`)
        .subscribe((response: AxiosResponse<Customer[]>) => {
          resolve(
            !response.data?.length ? null : new Customer(response.data[0])
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
