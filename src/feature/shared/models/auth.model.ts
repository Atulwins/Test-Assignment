import { prop } from "@typegoose/typegoose";
import { IsNotEmpty, IsString } from "class-validator";

export class logInModel {
    @IsString()
    @IsNotEmpty()
    @prop({ required: true , unique :true})
    email: string;

    @IsString()
    @IsNotEmpty()
    @prop({ required: true })
    password: string;
}