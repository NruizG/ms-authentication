import { Customer } from "src/models/customer.model";

export class CustomerRS implements Partial<Customer>{
  public id: number;
  public name: string;
  public dni: string;
  public email: string;

  constructor(data?: any) {
    this.id = data.id;
    this.name = data.name;
    this.dni = data.dni;
    this.email = data.email;
  }
}