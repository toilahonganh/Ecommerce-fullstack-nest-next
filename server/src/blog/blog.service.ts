import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from './schemas/blog.schema';
import { Model } from 'mongoose';
import { CreateBlogDto } from "./dto/blog.dto";

@Injectable()
export class BlogService {
    constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) { }

    async createBlog(createBlogDto: CreateBlogDto) {
        const { user_id, title, content, images } = createBlogDto;

        const newBlog = new this.blogModel({
            user_id, title, content, images
        })
        return await newBlog.save();
    }
    async getAllBlogs(): Promise<Blog[]> {
        return this.blogModel.find();
    }
    async findAllBlogs(page: number = 1, limit: number = 5) {
        const skip = (page - 1) * limit;
        const blogs = await this.blogModel.find().skip(skip).limit(limit).exec();
        const totalBlogs = await this.blogModel.countDocuments();

        return {
            blogs,
            totalBlogs,
            totalPages: Math.ceil(totalBlogs / limit),
            currentPage: page,
        };
    }

    async editBlog(id: string, updateData: Partial<Blog>): Promise<Blog> {
        const response = await this.blogModel.findByIdAndUpdate(id, updateData, { new: true });
        return response;
    }

    async deleteBlog(id: string): Promise<Blog> {
        const response = await this.blogModel.findByIdAndDelete(id, { new: true });
        return response;
    }

}
