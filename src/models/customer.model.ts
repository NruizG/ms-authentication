import * as bcrypt from 'bcrypt';

export class Customer {
  public id?: number;
  public name: string;
  public dni: string;
  public email: string;
  public password: string;

  constructor(data?: any) {
    this.id = data.id || undefined;
    this.name = data.name;
    this.dni = data.dni;
    this.email = data.email;
    this.password = data.password;
  }

  public validatePassword(password: string): boolean {
    return bcrypt.compareSync(password, this.password);
  }
}