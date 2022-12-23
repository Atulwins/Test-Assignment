import { Controller, Body, Request, Post, UseGuards, Res, HttpStatus, Req } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import {
  ChangePasswordModel,
  LogInUserModel,
  ResetPasswordModel
} from "../shared/models/user.model";
import { UserService } from "../user/user.service";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./jwt.auth.gaurd";
import * as jwt from "jsonwebtoken";
import * as jwtConstants from "./jwt.constant";

@Controller("api")
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) { }
  // login user by email and password
  @Post("user/login")
  async login(@Body() logInUserModel: LogInUserModel) {
    try {
      const user = await this.userService.login(logInUserModel)
      const payload = {
        email: user.email,
        password: user.password

      };
      const token = await this.authService.createToken(payload);
      return { user, token };
    } catch (error) {
      console.log(error);
    }
  }

  // change password
  @Post("user/changePassword")
  async changePassword(
    @Request() req: any,
    @Body() changePasswordModel: ChangePasswordModel
  ) {
    try {
      let token = req.headers.authorization;
      let email = await this.authService.verifyToken(token);
      return this.authService.changePassword(changePasswordModel, email);
    } catch (error) {
      return { error };
    }
  }

  // forget Password
  @Post('user/forgetPassword')
  async forgetPassword(@Req() req, @Res() response, @Body('password') password: string) {
    try {
      let token = req.headers.authorization;
      let email = await this.authService.verifyToken(token);
      const result = await this.authService.forgetPassword(email, password);
      return response.status(HttpStatus.OK).json({
        result,
      });
    } catch (err) {
      return err;
    }
  }
}
