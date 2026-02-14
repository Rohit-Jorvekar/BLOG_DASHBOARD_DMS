import { Test } from '@nestjs/testing';
import { PostsService } from './posts.service';

describe('PostsService', () => {
  let service;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [PostsService],
    }).compile();

    service = module.get(PostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
