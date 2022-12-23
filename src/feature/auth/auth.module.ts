import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { RoleMiddleware } from "./auth.middleware";
import { AuthService } from "./auth.service";
import { jwtConstants } from "./jwt.constant";
import { JwtStrategy } from "./jwt.strategy";
import { RolesGuard } from "./role.auth.gaurd";
import { user, userSchema } from "../shared/models/schema/user.schema";
import { ErrorMessageService } from "../shared/errorHandling/error.message.service";
import { ForgottenPasswordSchema } from "../shared/models/schema/forgottenpassword.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: user.name, schema: userSchema },
    ]),
    AuthModule,
    UserModule,
      PassportModule.register({
          defaultStrategy: 'jwt'
      }),

      JwtModule.register({
        secret: jwtConstants.secret,
    }),
      UserModule
  ],
  controllers: [AuthController],
  providers: [AuthService, 
    JwtStrategy,
    ErrorMessageService,
      //  roles validation
      {
          provide: APP_GUARD,
          useClass: RolesGuard,
      },],
  exports: [AuthService, PassportModule, JwtModule, ErrorMessageService],
})
export class AuthModule { }
