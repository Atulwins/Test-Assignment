import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { status } from "./enums/enum.status";
import { Meta } from "./meta.model";
@Schema()
export class user {
   @Prop()
   firstname: string;
   @Prop()
   lastname: string;
   @Prop()
   password: string;
   @Prop()
   email: string;
   @Prop()
   meta: Meta;
   @Prop()
   status: status;

   

   
}
export const userSchema = SchemaFactory.createForClass(user);
