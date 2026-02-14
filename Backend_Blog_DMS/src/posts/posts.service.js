const { Injectable, Dependencies, NotFoundException, BadRequestException } = require('@nestjs/common');
const { InjectRepository, getRepositoryToken } = require('@nestjs/typeorm');
const slugify = require('slugify');
const { Post } = require('./post.entity');

@Injectable()
@Dependencies(getRepositoryToken(Post))
class PostsService {
  constructor(postsRepo) {
    this.postsRepo = postsRepo;
  }

  /**
   * Generate unique slug from title
   */
  async generateUniqueSlug(title, excludeId = null) {
    let slug = slugify(title, { lower: true, strict: true });
    let exists = await this.postsRepo.findOne({ where: { slug } });

    let count = 1;
    while (exists && exists.id !== excludeId) {
      slug = `${slugify(title, { lower: true, strict: true })}-${count}`;
      exists = await this.postsRepo.findOne({ where: { slug } });
      count++;
    }
    return slug;
  }

  /**
   * NEW: Calculate read time based on content length
   * Average reading speed: 200 words per minute
   */
  calculateReadTime(content) {
    const wordsPerMinute = 200;
    // Remove HTML tags
    const plainText = content.replace(/<[^>]*>/g, '');
    const wordCount = plainText.trim().split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return readTime > 0 ? readTime : 1;
  }

  /**
   * NEW: Calculate SEO score based on best practices
   * Score breakdown (100 points total):
   * - Meta Title (50-60 chars): 25 points
   * - Meta Description (150-160 chars): 25 points
   * - SEO Keywords present: 25 points
   * - Slug readability: 25 points
   */
  calculateSeoScore(post) {
    let score = 0;

    // Meta Title Score (25 points)
    if (post.metaTitle) {
      const titleLength = post.metaTitle.length;
      if (titleLength >= 50 && titleLength <= 60) {
        score += 25;
      } else if (titleLength >= 40 && titleLength < 70) {
        score += 15;
      } else if (titleLength >= 30 && titleLength < 80) {
        score += 10;
      }
    }

    // Meta Description Score (25 points)
    if (post.metaDescription) {
      const descLength = post.metaDescription.length;
      if (descLength >= 150 && descLength <= 160) {
        score += 25;
      } else if (descLength >= 120 && descLength < 180) {
        score += 15;
      } else if (descLength >= 100 && descLength < 200) {
        score += 10;
      }
    }

    // SEO Keywords Score (25 points)
    if (post.seoKeywords && post.seoKeywords.trim().length > 0) {
      const keywords = post.seoKeywords.split(',').filter((k) => k.trim());
      if (keywords.length >= 3 && keywords.length <= 5) {
        score += 25;
      } else if (keywords.length > 0) {
        score += 15;
      }
    }

    // Slug Readability Score (25 points)
    if (post.slug) {
      const hasNumbers = /\d/.test(post.slug);
      const slugLength = post.slug.length;

      if (!hasNumbers && slugLength <= 60 && slugLength >= 10) {
        score += 25;
      } else if (!hasNumbers && slugLength < 80) {
        score += 15;
      } else if (slugLength < 100) {
        score += 10;
      }
    }

    return score;
  }

  /**
   * NEW: Get detailed SEO recommendations
   */
  getSeoRecommendations(post) {
    const recommendations = [];

    // Meta Title recommendations
    if (!post.metaTitle) {
      recommendations.push('Add a meta title');
    } else if (post.metaTitle.length < 50) {
      recommendations.push('Meta title is too short (ideal: 50-60 characters)');
    } else if (post.metaTitle.length > 60) {
      recommendations.push('Meta title is too long (ideal: 50-60 characters)');
    }

    // Meta Description recommendations
    if (!post.metaDescription) {
      recommendations.push('Add a meta description');
    } else if (post.metaDescription.length < 150) {
      recommendations.push('Meta description is too short (ideal: 150-160 characters)');
    } else if (post.metaDescription.length > 160) {
      recommendations.push('Meta description is too long (ideal: 150-160 characters)');
    }

    // SEO Keywords recommendations
    if (!post.seoKeywords || post.seoKeywords.trim().length === 0) {
      recommendations.push('Add SEO keywords');
    } else {
      const keywords = post.seoKeywords.split(',').filter((k) => k.trim());
      if (keywords.length < 3) {
        recommendations.push('Add more SEO keywords (ideal: 3-5 keywords)');
      } else if (keywords.length > 5) {
        recommendations.push('Too many keywords (ideal: 3-5 keywords)');
      }
    }

    // Slug recommendations
    if (post.slug) {
      if (/\d/.test(post.slug)) {
        recommendations.push('Slug contains numbers - consider using words only');
      }
      if (post.slug.length > 60) {
        recommendations.push('Slug is too long (ideal: under 60 characters)');
      }
    }

    return recommendations;
  }

  /**
   * Create a new blog post
   */
  async create(data) {
    try {
      // Validate required fields
      if (!data.title || !data.content || !data.metaTitle || !data.metaDescription) {
        throw new BadRequestException('Missing required fields');
      }

      // Generate unique slug
      const slug = await this.generateUniqueSlug(data.title);

      // Calculate read time
      const readTime = this.calculateReadTime(data.content);

      // Create post
      const post = this.postsRepo.create({
        ...data,
        slug,
        readTime,
        tags: data.tags || [],
      });

      // Set published date if status is Published
      if (post.status === 'Published') {
        post.publishedDate = new Date();
      }

      return await this.postsRepo.save(post);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to create post: ' + error.message);
    }
  }

  /**
   * NEW: Find all posts with filters, search, and pagination
   */
  async findAll(query) {
    try {
      const {
        search,
        status,
        page = 1,
        limit = 10,
        sort = 'DESC',
        categoryId,
        authorId,
      } = query;

      const skip = (page - 1) * limit;

      const qb = this.postsRepo.createQueryBuilder('post');

      // Search filter
      if (search) {
        qb.andWhere(
          'post.title LIKE :search OR post.authorName LIKE :search',
          { search: `%${search}%` }
        );
      }

      // Status filter
      if (status) {
        qb.andWhere('post.status = :status', { status });
      }

      // Category filter
      if (categoryId) {
        qb.andWhere('post.category = :category', { category: categoryId });
      }

      // Author filter
      if (authorId) {
        qb.andWhere('post.authorId = :authorId', { authorId: Number(authorId) });
      }

      // Sorting
      qb.orderBy('post.createdAt', sort);

      // Pagination
      qb.skip(skip).take(Number(limit));

      const [posts, total] = await qb.getManyAndCount();

      return {
        data: posts,
        meta: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new BadRequestException('Failed to fetch posts: ' + error.message);
    }
  }

  /**
   * Find one post by ID
   */
  async findById(id) {
    const post = await this.postsRepo.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  /**
   * Preview post without incrementing views
   */
  async preview(id) {
    return this.findById(id);
  }

  /**
   * View post by slug (increments view count for published posts)
   */
  async viewBySlug(slug) {
    const post = await this.postsRepo.findOne({
      where: { slug, status: 'Published' },
    });

    if (!post) {
      throw new NotFoundException(`Published post with slug '${slug}' not found`);
    }

    // Increment view count
    post.views += 1;
    await this.postsRepo.save(post);

    return post;
  }

  /**
   * NEW: Get SEO score for a post
   */
  async getSeoScore(id) {
    const post = await this.findById(id);
    const score = this.calculateSeoScore(post);

    return {
      score,
      details: {
        metaTitleLength: post.metaTitle ? post.metaTitle.length : 0,
        metaDescriptionLength: post.metaDescription ? post.metaDescription.length : 0,
        keywordsCount: post.seoKeywords ? post.seoKeywords.split(',').filter(k => k.trim()).length : 0,
        slugLength: post.slug ? post.slug.length : 0,
      },
      recommendations: this.getSeoRecommendations(post),
    };
  }

  /**
   * NEW: Publish/Unpublish a post
   */
  async togglePublish(id) {
    const post = await this.findById(id);

    if (post.status === 'Published') {
      post.status = 'Draft';
      post.publishedDate = null;
    } else {
      post.status = 'Published';
      post.publishedDate = new Date();
    }

    return await this.postsRepo.save(post);
  }

  /**
   * Update a post
   */
  async update(id, data) {
    try {
      const post = await this.findById(id);

      // If title is changed, regenerate slug
      if (data.title && data.title !== post.title) {
        data.slug = await this.generateUniqueSlug(data.title, id);
      }

      // Recalculate read time if content is changed
      if (data.content) {
        data.readTime = this.calculateReadTime(data.content);
      }

      // Update published date if status changed to Published
      if (data.status === 'Published' && post.status !== 'Published') {
        data.publishedDate = new Date();
      }

      await this.postsRepo.update(id, data);
      return this.findById(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update post: ' + error.message);
    }
  }

  /**
   * Delete a post
   */
  async remove(id) {
    const post = await this.findById(id);
    return this.postsRepo.remove(post);
  }
}

module.exports = { PostsService };