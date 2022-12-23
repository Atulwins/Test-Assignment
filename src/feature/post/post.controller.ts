import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Request, Res } from '@nestjs/common';
import { Req } from '@nestjs/common/decorators';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt.auth.gaurd';
import { IPost } from '../shared/interface/post.interface';
import { CreatePostModel, UpdatePostModel } from '../shared/models/post.model';
// import { post } from '../shared/models/schema/post.scema';
import { PostService } from './post.service';

@Controller('api')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private authService: AuthService) { }

  // Create Post
  @Post('post/create')
  async createPost(@Req() req, @Body() createPostModel: CreatePostModel) {
    try {
      let token = req.headers.authorization;
      let email = await this.authService.verifyToken(token);
      const result = await this.postService.createPost(email, createPostModel);
      return result
    } catch (error) {
      console.log(error);
    }
  }

  // Update Post
  @Put('post/update')
  async updatePost(@Res() response, @Req() req, @Body() UpdatePostModel: UpdatePostModel) {
    try {
      let token = req.headers.authorization;
      let email = await this.authService.verifyToken(token);
      const result = await this.postService.updatePost(email, UpdatePostModel)
      if (result) {
        return response.status(HttpStatus.OK).json({
          message: 'Post has been successfully updated',
          result,
        });
      }
      else {
        return { message: "Something went wrong" }
      }
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  // delete user
  @Delete('post/delete/:id')
  async deletePost(@Res() response, @Req() req, @Param('id') id: string) {
    try {
      let token = req.headers.authorization;
      await this.authService.verifyToken(token);
      const deletePost = await this.postService.deletePost(id);
      return response.status(HttpStatus.OK).json({
        message: 'post deleted successfully', deletePost
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  //  get all posts status wise
  @Get('/post/list/:status?')
  async getAllUsers(@Res() response, @Req() req, @Param('status') status) {
    try {
      let token = req.headers.authorization;
      let email = await this.authService.verifyToken(token);
      const posts = await this.postService.getAllPosts(status, email);
      return response.status(HttpStatus.OK).json({
        message: 'Success', posts,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }


}
