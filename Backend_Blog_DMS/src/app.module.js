require('reflect-metadata');
require('dotenv').config();

const { Module } = require('@nestjs/common');
const { TypeOrmModule } = require('@nestjs/typeorm');
const { PostsModule } = require('./posts/posts.module');
const { Post } = require('./posts/post.entity');

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'blog_db',
      entities: [Post], // Explicitly list entities
      synchronize: true, // OK for development/assignment
      logging: false,
    }),
    PostsModule,
  ],
})
class AppModule {}

module.exports = { AppModule };