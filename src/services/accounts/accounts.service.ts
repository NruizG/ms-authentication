import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AccountRS } from 'src/dtos/account-rs.dto';
import { CreateAccountDto } from 'src/dtos/create-account.dto';
import { ParserService } from '../parser/parser.service';

@Injectable()
export class AccountsService {
  private path: string;

  constructor(
    private configService: ConfigService,
    private http: HttpService
  ) {
    this.path = this.configService.get('MS_DATA');
  }

  public async create(account: CreateAccountDto): Promise<AccountRS> {
    return new Promise<AccountRS>((resolve, reject) => {
      this.http.post(`${this.path}/accounts`, account).subscribe(response => {
        resolve(new AccountRS(response.data));
      }, error => {
        console.log(error)
        reject(error);
      });
    });
  }
}
