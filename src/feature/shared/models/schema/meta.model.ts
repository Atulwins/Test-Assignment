import { prop } from '@typegoose/typegoose'
import { IsString } from 'class-validator'
export class Meta {
  @IsString()
  @prop({ default: new Date() })
  created_at: number

  @IsString()
  @prop({ default: new Date() })
  updated_at: number
}
