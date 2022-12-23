import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { ErrorMessageService } from '../shared/errorHandling/error.message.service';
import { IPost } from '../shared/interface/post.interface';
import { IUser } from '../shared/interface/user.interface';
import { CreatePostModel, UpdatePostModel } from '../shared/models/post.model';
import { post } from '../shared/models/schema/post.scema';
import { user } from '../shared/models/schema/user.schema';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(post) private postModel: Model<IPost>,
    @InjectModel(user) private userModel: Model<IUser>,
    private errorMessageService: ErrorMessageService,

  ) { }

  // Create Post
  async createPost(email: string, createPostModel: CreatePostModel) {
    try {
      let user = await this.userModel.findOne({ email }).lean();
      if (!user) {
        return { message: "invalid user" }
      } else {
        let post = await this.postModel.create({ user_id: user._id, ...createPostModel });
        if (!post) {
          return { message: "something went wrong" }
        } else {
          delete post.__v
          return { data: post }
        }
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  // Update Post
  async updatePost(email: string, updatePostModel: UpdatePostModel): Promise<object> {
    try {
      let user = await this.userModel.findOne({ email }).lean();
      if (!user) {
        return { message: "invalid user" }
      } else {
        let postId = updatePostModel.postId;
        delete updatePostModel.postId
        let updation = await this.postModel.findByIdAndUpdate(postId, updatePostModel);
        if (!updation) {
          return { message: "something went wrong" }
        } 
        else {
          delete updation.__v
          return { data: updation }
        }
      }
    } catch (error) {
      return error
    }
  }

  // Delete Post
  async deletePost(id: string): Promise<IPost> {
    try {
      let deletion = await this.postModel.findByIdAndDelete(id);
      if (!deletion) {
        throw new NotFoundException(`post #${id} not found`);
      }
      return deletion;
    } catch (e) {
      return e
    }
  }

  // Get All Posts Those Status Is Published
  async getAllPosts(status: string, email: string): Promise<any> {
    try {
      let user = await this.userModel.findOne({ email }).lean();
      if (!user) {
        return { message: "invalid user" }
      } else {
        const postData = await this.postModel.find({ status, user_id: user._id });
        if (!postData || postData.length == 0) {
          return { message: "no posts found" }
        }
        if (postData)
          return postData;
      }
    }
    catch (e) {

    }
  }
}