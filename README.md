# 📝 Blog Management Dashboard (Advanced)

A full-stack, production-ready **Blog Management Dashboard** built as part of a full-stack developer assignment.

**Frontend:** Next.js (App Router) &nbsp;|&nbsp; **Backend:** NestJS &nbsp;|&nbsp; **Database:** MySQL

---

## 📸 Overview

This CMS-level dashboard enables creating, managing, previewing, and publishing blog posts with SEO analysis, view tracking, rich text editing, and a modern responsive UI — all requirements from the assignment brief are fully implemented.

---
## 📸 Screenshots

![image (5)](https://github.com/user-attachments/assets/408fd32f-c435-4faf-a3ed-7cb8d97f2368)
![image (4)](https://github.com/user-attachments/assets/3d1dce59-ad4d-444c-ae7e-94e0e079a20f)
![image (3)](https://github.com/user-attachments/assets/2431343b-c192-4e8f-8780-e3346d35297e)
![image (2)](https://github.com/user-attachments/assets/6a468e4a-a61a-46cb-ae48-6c27a14a92e6)
![image (1)](https://github.com/user-attachments/assets/e8c09520-053c-4ec9-a087-9e4e2502c520)
![image (6)](https://github.com/user-attachments/assets/a3984673-ee02-4c8c-be40-209d3547226e)


## ✅ Assignment Checklist

### Blog Fields
| Field | Status |
|---|---|
| Title | ✅ |
| Slug (auto-generated + unique) | ✅ |
| Author Name | ✅ |
| Author ID | ✅ |
| Category | ✅ |
| Tags (multi-select) | ✅ |
| Featured Image | ✅ |
| Meta Title | ✅ |
| Meta Description | ✅ |
| Content (Rich Text Editor) | ✅ |
| Status (Draft / Published / Archived) | ✅ |
| Read Time (auto-calculated) | ✅ |
| Published Date | ✅ |
| SEO Keywords | ✅ |
| Views Count | ✅ |
| Is Featured | ✅ |
| Created At / Updated At | ✅ |

### Dashboard / Listing Page
| Feature | Status |
|---|---|
| Filter by Draft / Published / Archived | ✅ |
| Search by Title or Author Name | ✅ |
| Pagination | ✅ |
| Inline Publish / Unpublish toggle | ✅ |
| Delete with confirmation dialog | ✅ |
| Sort by date (Newest / Oldest) | ✅ |
| Visual status badges | ✅ |

### Advanced Features
| Feature | Status |
|---|---|
| Slug uniqueness validation (auto-suffix on duplicate) | ✅ |
| Blog Preview Mode (no view count increment) | ✅ |
| View Count Simulation (published posts only) | ✅ |
| SEO Score Indicator (color-coded visual) | ✅ |

---

## 🚀 Features

- **Rich Text Editor** — Full WYSIWYG editing powered by a dynamic, SSR-safe editor component
- **Auto Slug Generation** — Slugs are generated from title using `slugify`; duplicates automatically get a numeric suffix (e.g., `my-post-1`, `my-post-2`)
- **SEO Score** — Real-time score out of 100 with visual circular indicator (🔴 Red / 🟡 Yellow / 🟢 Green) and actionable recommendations
- **Preview Mode** — Full post rendering with SEO metadata, featured image, and rich content — without incrementing views
- **View Tracking** — View count increments only when a published post is accessed via slug (`/posts/view/:slug`)
- **Read Time** — Auto-calculated on the backend at ~200 words per minute, stripping HTML before counting
- **Tag System** — Multi-tag input with Enter/Add support and inline removal
- **Featured Image** — URL-based with graceful error fallback
- **Status Management** — Draft → Published → Archived workflow with one-click toggle
- **Responsive UI** — Mobile, tablet, and desktop layouts using Tailwind CSS

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), React, Tailwind CSS |
| Backend | NestJS, TypeORM |
| Database | MySQL |
| Rich Text | Dynamic Rich Text Editor (SSR-safe via `next/dynamic`) |
| Slugs | `slugify` (frontend + backend) |
| Notifications | `react-hot-toast` |

> **Router Choice:** This project uses the **Next.js App Router** (`app/` directory) with `'use client'` directives on interactive components and Server Components where appropriate.

---


---

## ⚙️ Getting Started

### Prerequisites

- Node.js >= 18
- MySQL 8+

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/blog-dashboard.git
cd blog-dashboard
```

### 2. Database Setup

Create a MySQL database:

```sql
CREATE DATABASE blog_dashboard;
```

### 3. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=
DB_NAME=blog_dashboard

PORT=3001
FRONTEND_URL=http://localhost:3000
```

Start the backend:

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

> The API will be available at `http://localhost:3001/api`

### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

> The frontend will be available at `http://localhost:3000`

---

## 🔌 API Reference

Base URL: `http://localhost:3001/api`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/posts` | List posts (search, filter, pagination, sort) |
| `POST` | `/posts` | Create a new post |
| `GET` | `/posts/:id` | Get a single post by ID |
| `PATCH` | `/posts/:id` | Update a post |
| `DELETE` | `/posts/:id` | Delete a post |
| `GET` | `/posts/:id/preview` | Preview post — **no view increment** |
| `GET` | `/posts/:id/seo-score` | Get SEO score + recommendations |
| `PATCH` | `/posts/:id/toggle-publish` | Toggle between Published ↔ Draft |
| `GET` | `/posts/view/:slug` | View published post by slug — **increments views** |

### Query Parameters — `GET /posts`

| Parameter | Type | Description |
|---|---|---|
| `search` | string | Search title or author name |
| `status` | string | `Draft`, `Published`, or `Archived` |
| `page` | number | Page number (default: `1`) |
| `limit` | number | Items per page (default: `10`) |
| `sort` | string | `ASC` or `DESC` (default: `DESC`) |
| `categoryId` | string | Filter by category |
| `authorId` | number | Filter by author ID |

### Paginated Response Shape

```json
{
  "data": [ "...array of posts..." ],
  "meta": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

### SEO Score Response

```json
{
  "score": 75,
  "details": {
    "metaTitleLength": 55,
    "metaDescriptionLength": 152,
    "keywordsCount": 4,
    "slugLength": 38
  },
  "recommendations": [
    "Meta description is too short (ideal: 150-160 characters)",
    "Slug contains numbers - consider using words only"
  ]
}
```

---

## 📊 SEO Scoring System

Scores are calculated out of **100 points** across four criteria:

| Criterion | Max Points | Ideal Range | Logic |
|---|---|---|---|
| Meta Title | 25 pts | 50–60 characters | Full: 50–60 / Partial: 40–69 / Minimal: 30–79 |
| Meta Description | 25 pts | 150–160 characters | Full: 150–160 / Partial: 120–179 / Minimal: 100–199 |
| SEO Keywords | 25 pts | 3–5 keywords | Full: 3–5 / Partial: 1–2 or 6+ |
| Slug Readability | 25 pts | 10–60 chars, no numbers | Penalized for numbers or excessive length |

**Score Labels:**
- 🟢 **75–100** — Good
- 🟡 **50–74** — Average
- 🔴 **0–49** — Poor

---

## 🗄️ Database Schema

### Post Entity (TypeORM)

```
posts
├── id              INT, PK, AUTO_INCREMENT
├── title           VARCHAR, NOT NULL
├── slug            VARCHAR, UNIQUE, INDEX
├── authorName      VARCHAR, NOT NULL
├── authorId        INT, INDEX (FK → authors)
├── category        VARCHAR, INDEX (FK → categories)
├── tags            JSON (stored as array)
├── featuredImage   VARCHAR, NULLABLE
├── metaTitle       VARCHAR, NOT NULL
├── metaDescription TEXT, NOT NULL
├── content         LONGTEXT, NOT NULL
├── seoKeywords     VARCHAR, NULLABLE
├── status          ENUM('Draft','Published','Archived'), INDEX
├── isFeatured      BOOLEAN, DEFAULT false
├── readTime        INT (auto-calculated, not user-editable)
├── views           INT, DEFAULT 0
├── publishedDate   DATETIME, NULLABLE
├── createdAt       DATETIME, AUTO
└── updatedAt       DATETIME, AUTO
```

> Indexes applied on: `slug` (unique constraint), `status`, `authorId`

---

## 📦 Post Data Model

```json
{
  "id": 1,
  "title": "Getting Started with NestJS",
  "slug": "getting-started-with-nestjs",
  "authorName": "Jane Doe",
  "authorId": 1,
  "category": "Technology",
  "tags": ["nestjs", "backend", "node"],
  "featuredImage": "https://example.com/image.jpg",
  "content": "<h2>Introduction</h2><p>NestJS is...</p>",
  "metaTitle": "Getting Started with NestJS | Blog",
  "metaDescription": "A comprehensive guide to building scalable APIs with NestJS and TypeORM.",
  "seoKeywords": "nestjs, node, api, typescript, backend",
  "status": "Published",
  "isFeatured": true,
  "readTime": 5,
  "views": 214,
  "publishedDate": "2025-01-15T10:00:00.000Z",
  "createdAt": "2025-01-10T08:00:00.000Z",
  "updatedAt": "2025-01-16T12:00:00.000Z"
}
```

---

## 🎨 UI Components

All components are built with Tailwind CSS and designed to be fully reusable:

| Component | Description |
|---|---|
| `Button` | Primary, outline, ghost variants with loading state |
| `Input` | Labeled input with error and helper text |
| `Select` | Styled dropdown |
| `Card / CardBody / CardHeader` | Consistent content containers |
| `Badge` | Color-coded status indicators (Draft / Published / Archived / Featured) |
| `RichTextEditor` | SSR-safe dynamic editor |
| `SEOScore` | Circular progress indicator with color coding and recommendations list |
| `PostCard` | Full post summary card with inline publish/delete actions |
| `PostPreview` | Full post rendering for preview mode |
| `PostForm` | Multi-section create/edit form with client-side validation |

---

## 🌐 CORS Configuration

The backend accepts requests from the following origins out of the box:

```
http://localhost:3000 – 3002
http://127.0.0.1:3000 – 3002
http://192.168.1.x:3000 – 3002  (local network)
Custom FRONTEND_URL via .env
```

---

## 🧱 Architecture & Design Decisions

**App Router** — Chosen for better support of React Server Components, layouts, and nested routing in Next.js 14.

**Dynamic Import for Editor** — The Rich Text Editor is loaded via `next/dynamic` with `ssr: false` to prevent hydration errors caused by browser-only APIs.

**Auto Read Time** — Calculated server-side by stripping HTML tags then counting words at 200 wpm. Never stored as a user-editable field; always recomputed on save.

**Slug Uniqueness** — Enforced at both the database level (UNIQUE constraint on `slug` column) and the service level (loop with incrementing numeric suffix until a free slug is found).

**View Counter Security** — Views only increment via the `/view/:slug` endpoint and only for `status = 'Published'` posts. The `/preview` endpoint calls `findById` directly and never touches the view count.

**SEO Score on Demand** — The score is computed at request time via `/posts/:id/seo-score` and never stored, ensuring it always reflects the current state of the post metadata.

**Route Order in Controller** — Specific routes (`/view/:slug`, `/:id/preview`, `/:id/seo-score`, `/:id/toggle-publish`) are declared before the generic `/:id` route to prevent NestJS from catching them as ID lookups.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
