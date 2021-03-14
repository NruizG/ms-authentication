import { IsNotEmpty, IsString } from "class-validator";

export class LoginRQ {
  @IsNotEmpty()
  @IsString()
  public dni: string;

  @IsNotEmpty()
  @IsString()
  public password: string;
}