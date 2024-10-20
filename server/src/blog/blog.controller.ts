import { Body, Controller, Delete, Get, HttpException, HttpStatus, Injectable, Param, Post, Put } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/blog.dto';
import { Blog } from './schemas/blog.schema';

@Controller('blog')
export class BlogController {
    constructor(private blogService: BlogService) {}

    @Post()
    async createBlog(@Body() createBlogDto: CreateBlogDto): Promise<Blog>{
        return await this.blogService.createBlog(createBlogDto);
    }

    @Get('get-blogs') 
    async getBlogs() {
        return this.blogService.getAllBlogs();
    }
    @Get('get-all-blogs')
    async getAllBlogs(
    ) {
      try {
        const { blogs, totalBlogs} = await this.blogService.findAllBlogs();
        
        return {
            blogs,
            totalBlogs,
        };
      } catch (error) {
        throw new HttpException('Error fetching blogs', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

    @Put('/:id')
    async editUser(
        @Param('id') id: string,
        @Body() updateData: Partial<Blog>
    ): Promise<Blog> {
        return await this.blogService.editBlog(id, updateData);
    }

    @Delete('/:id')
    async deleteProduct(
        @Param('id') id: string,
    ): Promise<Blog> {
        return await this.blogService.deleteBlog(id);
    }
}
