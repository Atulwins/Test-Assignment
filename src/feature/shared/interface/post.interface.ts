import { Document } from "mongoose";
export interface IPost extends Document {
  user_id: string;
  title: string;
  password: string;
  slug: string;
  description: string;
  status: string;
}
