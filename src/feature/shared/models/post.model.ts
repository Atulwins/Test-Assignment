import { prop } from "@typegoose/typegoose";
import {
  IsEmail,
  IsNotEmpty,
  IsString
} from "class-validator";
import { Meta } from "./schema/meta.model";
import { status } from "./schema/enums/enum.status";

export class CreatePostModel {
 

  @IsString()
  @IsNotEmpty()
  description: string

  @IsString()
  @IsNotEmpty()
  title: string

  @prop({})
  meta: Meta;

  @prop({ enum: status, default: status.ACTIVE })
  status: string;
}

export interface UpdatePostModel {
  postId: String

  title: String;

  description: string


  meta: Meta;

  status: string;
}