import { Customer } from "src/models/customer.model";

export class CreateAccountDto {
  public number: number;
  public balance: number;
  public customer: number;

  constructor(data?: any) {
    if (data) {
      this.number = data.number;
      this.balance = data.balance;
      this.customer = data.customer
    }
  }

  public prepare(customerId: number) {
    this.number = Math.floor(100000000 + Math.random() * 900000000);
    this.balance = 0;
    this.customer = customerId;
  }
}