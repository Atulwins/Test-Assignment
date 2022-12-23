import { Body, Request, Controller, Get, HttpStatus, Param, Post, Put, Delete, Res, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserModel, LogInUserModel, UpdateUserModel } from "../shared/models/user.model";
import { AuthService } from "../auth/auth.service";
import { hashPassword, comparePassword } from "../shared/helper/utility";
import { JwtAuthGuard } from "../auth/jwt.auth.gaurd";
import *as bcrypt from 'bcrypt'
import { Req } from "@nestjs/common/decorators";


@Controller('api')
export class userController {
  constructor(private userService: UserService,
    private authService: AuthService) { }

  // Register User
  @Post('/user/register')
  async register(@Body() createUserModel: CreateUserModel) {
    try {
      const hashPass = await hashPassword(createUserModel.password);
      createUserModel.password = hashPass;
      const user = await this.userService.createUser(createUserModel);
      const payload: any = {
        email: createUserModel.email,
      };
      const token = await this.authService.createToken(payload);
      return { user, token };
    } catch (error) {
      console.log(error);

    }
  }

  // update user
  @Put('user/update')
  async updateUser(@Res() response, @Req() req, @Body() updateUserModel: UpdateUserModel) {
    try {
      let token = req.headers.authorization;
      let email = await this.authService.verifyToken(token);
      const result = await this.userService.updateUser(email, updateUserModel)
      return response.status(HttpStatus.OK).json({
        message: 'User has been successfully updated',
        result,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }
}
