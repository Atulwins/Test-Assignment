import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { Model } from "mongoose";
import { IUser } from "../shared/interface/user.interface";
import { user } from "../shared/models/schema/user.schema";
import {
  CreateUserModel,
  LogInUserModel,
  UpdateUserModel,
  ResetPasswordModel
} from "../shared/models/user.model";
import { Payload } from "../shared/types.ts/payload";
import { ErrorMessageService } from "../shared/errorHandling/error.message.service";
import { ErrorMessageKeys } from "../shared/errorHandling/error.handling.key";
import { InjectModel } from "nestjs-typegoose";
import { resourceLimits } from "worker_threads";
import * as bcrypt from "bcrypt";
import { status } from "../shared/models/schema/enums/enum.status";
import { Meta } from "../shared/models/schema/meta.model";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(user) private userModel: Model<IUser>,
    private errorMessageService: ErrorMessageService
  ) {}

  // create user
  // async createUser(createUserModel: CreateUserModel): Promise<IUser> {
  //   try {
  //     const newuser = await new this.userModel(createUserModel);
  //     return newuser
  //   } catch (error) {}
  // }
  async createUser(createUserModel: CreateUserModel) {
    try {
      const result = [];
      const { email } = createUserModel;
      const user = await this.userModel.findOne({ email });
      if (user) {
        throw new HttpException("user already exists", HttpStatus.BAD_REQUEST);
      }
      let createdUser = await this.userModel.create({
        status: status.ACTIVE,
        meta: {created_at : new Date(), updated_at: new Date()},
        ...createUserModel
      });

      return this.sanitizeUser(createdUser);
    } catch (error) {
      console.log(error);
    }
  }
  // return user object without password
  sanitizeUser(user: any) {
    const sanitized = user.toObject();
    delete sanitized["password"];
    return sanitized;
  }

  //  update user
  async updateUser(
    email: string,
    updateUserModel: UpdateUserModel
  ): Promise<object> {
    try {
      let isUserExist = await this.userModel.findOne({ email }).lean();
      if (!isUserExist) {
        return {
          message: "user not found"
        };
      }
      let updation = await this.userModel
        .findOneAndUpdate({ email }, updateUserModel)
        .lean();
      if (!updation) {
        return { message: "something went wrong" };
      }
      delete updation.password;
      delete updation.__v;
      return { updatedUser: updation };
    } catch (error) {
      console.log(error);
    }
  }

  async findByPayload(payload: Payload) {
    const { email, password } = payload;
    return await this.userModel.findOne({ email: email });
  }

  // Login User with email and password
  async login(logInUserModel: LogInUserModel) {
    try {
      const { email, password }: any = logInUserModel;
      const user = await this.userModel.findOne({ email: email }).exec();
      if (!user) {
        this.errorMessageService.addErrorMessage({
          message: ErrorMessageKeys.InvalidUser
        });
      } else {
        let comparePassword = await bcrypt.compare(password, user.password);
        if (!comparePassword) {
          this.errorMessageService.addErrorMessage({
            message: ErrorMessageKeys.WrongPassword
          });
        }
        // return result
        return this.sanitizeUser(user);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
