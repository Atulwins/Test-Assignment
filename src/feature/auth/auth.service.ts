import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose'
import { IUser } from 'src/feature/shared/interface/user.interface';
import { user } from 'src/feature/shared/models/schema/user.schema';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { sign, verify } from 'jsonwebtoken';
import { Payload } from '../shared/types.ts/payload';
import { jwtConstants } from './jwt.constant';
import { ChangePasswordModel, ResetPasswordModel } from '../shared/models/user.model';
import { comparePassword, hashPassword } from '../shared/helper/utility'
import { ErrorMessageKeys } from '../shared/errorHandling/error.handling.key';
import { ErrorMessageService } from '../shared/errorHandling/error.message.service'
import * as bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class AuthService {
  constructor(@InjectModel(user) private userModel: Model<IUser>,



    private userService: UserService,
    private jwtService: JwtService,
    private errorMessageService: ErrorMessageService

  ) { }

  // change Password
  async changePassword(changePasswordModel: ChangePasswordModel, email: string) {
    const result: any = { data: [] }
    if (changePasswordModel.password == undefined || changePasswordModel.password.trim() == '') {
      this.errorMessageService.addErrorMessage({
        message: ErrorMessageKeys.InvalidPassword,
      })
      return result
    }
    if (
      changePasswordModel.newPassword == undefined ||
      changePasswordModel.newPassword.trim() == ''
    ) {
      this.errorMessageService.addErrorMessage({
        message: ErrorMessageKeys.InvalidPassword,
      })
      return result
    }
    if (
      changePasswordModel.confirmPassword == undefined ||
      changePasswordModel.confirmPassword.trim() == ''
    ) {
      this.errorMessageService.addErrorMessage({
        message: ErrorMessageKeys.InvalidConfirmPassword,
      })
      return result
    }
    if (changePasswordModel.newPassword.trim() !== changePasswordModel.confirmPassword.trim()) {
      this.errorMessageService.addErrorMessage({
        message: ErrorMessageKeys.NewPasswordConfirmPasswordNotMatch,
      })
      return result
    }
    if (changePasswordModel.password.trim() == changePasswordModel.confirmPassword.trim()) {
      this.errorMessageService.addErrorMessage({
        message: ErrorMessageKeys.NewPasswordCurrentPasswordCantBeSame,
      })
      return result
    }
    // first finding user by username into database
    const user: any = await this.userModel.findOne({ email })
    if (!user) {
      this.errorMessageService.addErrorMessage({
        message: ErrorMessageKeys.InvalidUser,
      })
      return result
    }
    // // verifying old password
    const isCorrect = await comparePassword(changePasswordModel.password, user.password)
    if (!isCorrect) {
      this.errorMessageService.addErrorMessage({
        message: ErrorMessageKeys.WrongPassword,
      })
      return result
    }
    // // then updating password (encrypted)
    const hashedPassword = await hashPassword(changePasswordModel.newPassword.trim())
    await this.userModel.findOneAndUpdate(
      { _id: user._id },
      { password: hashedPassword },
      { new: true, upsert: true },
    )
    result.data.push({ message: 'PasswordUpdated' })
    return result
  }

  // Create Token
  async createToken(payload: Payload) {
    return sign(payload, jwtConstants.secret, { expiresIn: '7d' });
  }
  // verify Token
  async verifyToken(token) {
    token = token.split(" ")[1]
    let isDecoded: any = verify(token, jwtConstants.secret);
    if (!isDecoded || !isDecoded.email)
      this.errorMessageService.addErrorMessage({ message: "invalidUser" })
    return isDecoded.email
  }

  async validateUser(payload: Payload) {
    return await this.userService.findByPayload(payload);
  }

  // forget password
  async forgetPassword(email: string, password: string): Promise<{ message: string }> {
    try {
      if (!password) {
        return { message: 'passwordIsRequired' }
      }
      const existingUser = await this.userModel.findOne({ email }).lean();
      if (!existingUser) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      let updation = await this.userModel.findByIdAndUpdate(existingUser._id, { password: await hashPassword(password) });
      if (updation) {
        return { message: "PasswordUpdated" };
      }
      else {
        return { message: "something went wrong" }
      }
    } catch (error) {
      return error;
    }
  }
}
