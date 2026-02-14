import { Test } from '@nestjs/testing';
import { PostsController } from './posts.controller';

describe('Posts Controller', () => {
  let controller;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [PostsController],
    }).compile();

    controller = module.get(PostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
