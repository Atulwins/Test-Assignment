import { Module, MiddlewareConsumer, RequestMethod } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "../auth/auth.module";
import { AuthService } from "../auth/auth.service";
import { ErrorMessageService } from "../shared/errorHandling/error.message.service";
import { user, userSchema } from "../shared/models/schema/user.schema";
import { userController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  imports: [MongooseModule.forFeature([{ name: user.name, schema: userSchema }])],
  controllers: [userController],
  providers: [UserService, AuthService, JwtService, ErrorMessageService ],
  exports: [UserService, AuthService,ErrorMessageService]
})
export class UserModule {}
