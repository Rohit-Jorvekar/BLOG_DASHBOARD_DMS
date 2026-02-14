const { Module } = require('@nestjs/common');
const { TypeOrmModule } = require('@nestjs/typeorm');
const { PostsService } = require('./posts.service');
const { PostsController } = require('./posts.controller');
const { Post } = require('./post.entity');

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
class PostsModule {}

module.exports = { PostsModule };