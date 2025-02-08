import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from '../entities/post.entity';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  async create(createPostDto: Partial<PostEntity>): Promise<PostEntity> {
    const post = this.postRepository.create(createPostDto);
    return this.postRepository.save(post);
  }

  async findAll(): Promise<PostEntity[]> {
    return this.postRepository.find({
      relations: ['agency'],
    });
  }

  async findOne(id: number): Promise<PostEntity> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['agency'],
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async update(
    id: number,
    updatePostDto: Partial<PostEntity>,
  ): Promise<PostEntity> {
    const post = this.postRepository.findOneBy({ id });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    await this.postRepository.update(id, updatePostDto);
    return this.postRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.postRepository.delete(id);
  }
}
