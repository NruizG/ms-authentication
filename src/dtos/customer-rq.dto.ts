import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { Customer } from "src/models/customer.model";

export class CustomerRQ implements Partial<Customer>{
  @IsNotEmpty()
  @IsString()
  public name: string;

  @IsNotEmpty()
  @IsString()
  public dni: string;

  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @IsString()
  public password: string;
}