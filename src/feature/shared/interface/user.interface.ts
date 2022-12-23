import { Document } from 'mongoose';
export interface IUser extends Document{
     firstname: string;
     lastnmae: string;
     email: string;
     password: string;
}