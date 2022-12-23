import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
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
   
}
export const userSchema = SchemaFactory.createForClass(user);
