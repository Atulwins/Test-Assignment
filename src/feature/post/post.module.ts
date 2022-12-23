import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { post, postSchema } from '../shared/models/schema/post.scema';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ErrorMessageService } from '../shared/errorHandling/error.message.service';
import { user, userSchema } from '../shared/models/schema/user.schema';
import { UserService } from '../user/user.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: post.name, schema: postSchema },
    { name: user.name, schema: userSchema },
  ])],
  controllers: [PostController],
  providers: [PostService, AuthService, UserService,JwtService, ErrorMessageService],
  exports: [PostService, AuthService, ErrorMessageService]
})
export class PostModule {}




