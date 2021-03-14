import { CustomerRS } from "./customer-rs.dto";

export class LoginRS {
  public customer: Partial<CustomerRS>;
  public token: string;

  constructor(data: any = null) {
    if (data) {
      this.customer = data.customer;
      this.token = data.token;
    }
  }
}