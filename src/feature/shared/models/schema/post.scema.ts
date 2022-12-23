import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { prop } from "@typegoose/typegoose";
import { Meta } from "./meta.model";
import { user } from "./user.schema";
import { status } from "./enums/enum.status"
import { PostStatus } from "./enums/post.status.enum";
import { nanoid } from "nanoid";

@Schema()
export class post {
    @Prop()
    user_id: string;

    @Prop()
    title: string;

    @Prop({ default:()=> nanoid(),})
   slug: string

    @Prop()
    description: string;

    @Prop()
    status: PostStatus.PUBLISHED;

    @Prop()
    meta: Meta;
}
export const postSchema = SchemaFactory.createForClass(post);