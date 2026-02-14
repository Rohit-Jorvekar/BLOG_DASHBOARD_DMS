const {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  Index,
} = require('typeorm');

@Entity('posts')
class Post {
  @PrimaryGeneratedColumn()
  id;

  @Column({ type: 'varchar', length: 255 })
  title;

  @Column({ type: 'varchar', length: 255, unique: true })
  @Index()
  slug;

  @Column({ type: 'varchar', length: 100 })
  authorName;

  @Column({ type: 'int' })
  @Index()
  authorId;

  @Column({ type: 'varchar', length: 100 })
  category;

  // NEW: Tags as JSON array (simplified - no separate Tag entity needed)
  @Column({ type: 'simple-json', nullable: true })
  tags;

  // NEW: Featured Image URL
  @Column({ type: 'varchar', length: 500, nullable: true })
  featuredImage;

  @Column({ type: 'varchar', length: 255 })
  metaTitle;

  @Column({ type: 'text' })
  metaDescription;

  @Column({ type: 'longtext' })
  content;

  @Column({
    type: 'enum',
    enum: ['Draft', 'Published', 'Archived'],
    default: 'Draft',
  })
  @Index()
  status;

  // NEW: Read Time in minutes (auto-calculated)
  @Column({ type: 'int', default: 0 })
  readTime;

  @Column({ type: 'datetime', nullable: true })
  publishedDate;

  // NEW: SEO Keywords (comma-separated string)
  @Column({ type: 'text', nullable: true })
  seoKeywords;

  @Column({ type: 'int', default: 0 })
  views;

  @Column({ type: 'boolean', default: false })
  isFeatured;

  @CreateDateColumn({ type: 'datetime' })
  createdAt;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt;
}

module.exports = { Post };