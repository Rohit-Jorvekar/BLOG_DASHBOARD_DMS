const {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Dependencies,
  HttpCode,
  HttpStatus,
} = require('@nestjs/common');

const { PostsService } = require('./posts.service');

@Controller('posts')
@Dependencies(PostsService)
class PostsController {
  constructor(postsService) {
    this.postsService = postsService;
  }

  /**
   * Create a new post
   * POST /posts
   */
  @Post()
  create(@Body() body) {
    return this.postsService.create(body);
  }

  /**
   * Get all posts with filters and pagination
   * GET /posts?search=&status=&page=1&limit=10&sort=DESC
   */
  @Get()
  findAll(@Query() query) {
    return this.postsService.findAll(query);
  }

  /**
   * View a published post by slug (increments views)
   * GET /posts/view/:slug
   * ⚠️ MUST BE BEFORE @Get(':id') to avoid conflict
   */
  @Get('view/:slug')
  view(@Param('slug') slug) {
    return this.postsService.viewBySlug(slug);
  }

  /**
   * Preview a post (doesn't increment views)
   * GET /posts/:id/preview
   */
  @Get(':id/preview')
  preview(@Param('id') id) {
    return this.postsService.preview(Number(id));
  }

  /**
   * Get SEO score for a post
   * GET /posts/:id/seo-score
   */
  @Get(':id/seo-score')
  getSeoScore(@Param('id') id) {
    return this.postsService.getSeoScore(Number(id));
  }

  /**
   * Toggle publish/unpublish status
   * PATCH /posts/:id/toggle-publish
   */
  @Patch(':id/toggle-publish')
  togglePublish(@Param('id') id) {
    return this.postsService.togglePublish(Number(id));
  }

  /**
   * Get a single post by ID
   * GET /posts/:id
   * ⚠️ MUST BE AFTER specific routes to avoid catching them
   */
  @Get(':id')
  findOne(@Param('id') id) {
    return this.postsService.findById(Number(id));
  }

  /**
   * Update a post
   * PATCH /posts/:id
   */
  @Patch(':id')
  update(@Param('id') id, @Body() body) {
    return this.postsService.update(Number(id), body);
  }

  /**
   * Delete a post
   * DELETE /posts/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id) {
    return this.postsService.remove(Number(id));
  }
}

module.exports = { PostsController };