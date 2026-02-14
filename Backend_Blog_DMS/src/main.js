require('reflect-metadata');
require('dotenv').config();

const { NestFactory } = require('@nestjs/core');
const { ValidationPipe } = require('@nestjs/common');
const { AppModule } = require('./app.module');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend - FIXED
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'http://127.0.0.1:3002',
      'http://192.168.1.180:3000',
      'http://192.168.1.180:3001',
      'http://192.168.1.180:3002',
      process.env.FRONTEND_URL,
    ].filter(Boolean), // Remove undefined values
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // API prefix
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3001;
  
  // Listen on all network interfaces
  await app.listen(port, '0.0.0.0');

  console.log('🚀 Blog Management API Server running');
  console.log(`📍 Local:   http://localhost:${port}/api`);
  console.log(`📍 Network: http://192.168.1.180:${port}/api`);
  console.log(`\n📚 Available endpoints:`);
  console.log(`   GET    /api/posts`);
  console.log(`   POST   /api/posts`);
  console.log(`   GET    /api/posts/:id`);
  console.log(`   PATCH  /api/posts/:id`);
  console.log(`   DELETE /api/posts/:id`);
  console.log(`   GET    /api/posts/:id/preview`);
  console.log(`   GET    /api/posts/:id/seo-score`);
  console.log(`   PATCH  /api/posts/:id/toggle-publish`);
  console.log(`   GET    /api/posts/view/:slug`);
  console.log(`\n🔓 CORS enabled for:`);
  console.log(`   http://localhost:3000-3002`);
  console.log(`   http://192.168.1.180:3000-3002`);
}

bootstrap();