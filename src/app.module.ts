import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { userController } from "./feature/user/user.controller";
import { UserService } from './feature/user/user.service';
import { userSchema } from "./feature/shared/models/schema/user.schema";
import { AuthService } from './feature/auth/auth.service';
import { AuthController } from './feature/auth/auth.controller';
import { AuthModule } from "./feature/auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { PostModule } from './feature/post/post.module';


@Module({
  imports: [
    AuthModule,
    MongooseModule.forRoot("mongodb://localhost:27017/nest-crud"),
    MongooseModule.forFeature([{ name: "user", schema: userSchema }]),
    ConfigModule.forRoot({ isGlobal: true }),
    PostModule,
  ],
  controllers: [AppController, 
    userController, AuthController
  ],
  providers: [AppService, 
    UserService, AuthService
  ]
})
export class AppModule {}

