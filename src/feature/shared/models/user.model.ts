import { prop } from "@typegoose/typegoose";
import {
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsObject,
  IsString
} from "class-validator";
import { Meta } from "./schema/meta.model";
import { status } from "./schema/enums/enum.status";

export class CreateUserModel {
  @IsString()
  @IsNotEmpty()
  firstname: String;

  @IsString()
  @IsNotEmpty()
  lastname: String;

  @IsNotEmpty()
  password: String;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @prop({ required: true, unique: true })
  email: String;

  @prop({})
  meta: Meta;

  @prop({ enum: status, default: status.ACTIVE })
  status: string;
}

export interface UpdateUserModel {
  firstname: String;

  lastname: String;

  password: String;
}

export class LogInUserModel {
  @IsString()
  @IsNotEmpty()
  email: String;

  @IsString()
  @IsNotEmpty()
  password: String;
}

export class ChangePasswordModel {


  @IsString()
  @IsNotEmpty()
  password: String;

  // @IsString()
  // @IsNotEmpty()
  // @prop({ required: true })
  // oldPassword: string;

  @IsString()
  @IsNotEmpty()
  @prop({ required: true })
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  @prop({ required: true })
  confirmPassword: string;
}

export class ForgetPasswordModel {
  @IsString()
  @IsNotEmpty()
  @prop({ required: true })
  email: string;

  @IsString()
  @IsNotEmpty()
  newPasswordToken: string;

  @IsString()
  @IsNotEmpty()
  timestamp: Date;
}
export class ResetPasswordModel {
  @IsString()
  @IsNotEmpty()
  @prop({ required: true })
  email: string;

  @IsString()
  @IsNotEmpty()
  @prop({ required: true })
  newPasswordToken: string;

  @IsString()
  @IsNotEmpty()
  @prop({ required: true })
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  @prop({ required: true })
  confirmPassword: string;
}