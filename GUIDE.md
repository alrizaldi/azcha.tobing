# Photographer Portfolio + Project Management System - Complete Guide

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Frontend Pages](#frontend-pages)
4. [Backend API Endpoints](#backend-api-endpoints)
5. [Feature Breakdown](#feature-breakdown)
6. [Data Flows](#data-flows)
7. [User Flows](#user-flows)
8. [Database Schema](#database-schema)
9. [Implementation Roadmap](#implementation-roadmap)
10. [Environment Variables](#environment-variables)

---

## Project Overview

A full-stack Next.js application that serves two primary purposes:

1. **Public Portfolio Website** - Showcase photographer's work to potential clients
2. **Admin Dashboard** - Track photography projects/productions, manage content

### Key Requirements

- **Frontend Framework:** Next.js 14+ with App Router
- **Backend:** Next.js API routes
- **Database:** Supabase (PostgreSQL)
- **Storage:** Google Drive API for images
- **Deployment:** Vercel
- **Authentication:** Supabase Auth (photographer only)
- **Styling:** Tailwind CSS

---

## Architecture

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         VERCEL CDN                              │
│                    (Deployed Next.js App)                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
    ┌────▼────┐         ┌────▼────┐         ┌───▼────┐
    │  Pages  │         │   API   │         │ Images │
    │ Routes  │         │ Routes  │         │ Static │
    └────┬────┘         └────┬────┘         └───┬────┘
         │                   │                   │
         └───────────────────┼───────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
    ┌────▼─────────┐  ┌─────▼────────────────▼────┐
    │ Supabase     │  │   Google Drive API        │
    │ (PostgreSQL) │  │   (Image Storage)         │
    │              │  │                           │
    │ ├─ Auth JWT  │  │ ├─ File uploads           │
    │ ├─ Database  │  │ ├─ File management        │
    │ └─ RLS       │  │ └─ Shared links           │
    └──────────────┘  └───────────────────────────┘
```

### Folder Structure

```
photographer-portfolio/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                 # Home page
│   │   ├── portfolio/
│   │   │   ├── page.tsx             # Gallery showcase
│   │   │   ├── [category]/page.tsx  # Category filtered view
│   │   │   └── layout.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx             # Blog listing
│   │   │   ├── [slug]/page.tsx      # Individual blog post
│   │   │   └── layout.tsx
│   │   ├── contact/
│   │   │   ├── page.tsx             # Contact form page
│   │   │   └── layout.tsx
│   │   └── layout.tsx               # Public layout
│   │
│   ├── (protected)/
│   │   ├── dashboard/
│   │   │   ├── page.tsx             # Dashboard home
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx         # Projects list
│   │   │   │   ├── create/page.tsx  # Create project
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── page.tsx     # Project details
│   │   │   │   │   ├── edit/page.tsx
│   │   │   │   │   └── layout.tsx
│   │   │   │   └── layout.tsx
│   │   │   ├── gallery/
│   │   │   │   ├── page.tsx         # Manage portfolio photos
│   │   │   │   ├── upload/page.tsx  # Bulk upload
│   │   │   │   └── layout.tsx
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx         # Blog management
│   │   │   │   ├── create/page.tsx  # Create post
│   │   │   │   ├── [id]/edit/page.tsx
│   │   │   │   └── layout.tsx
│   │   │   └── layout.tsx           # Dashboard layout
│   │   │
│   │   └── settings/
│   │       ├── page.tsx             # Photographer profile/settings
│   │       └── layout.tsx
│   │
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/route.ts
│   │   ├── projects/
│   │   │   ├── route.ts             # GET all, POST create
│   │   │   └── [id]/route.ts        # GET, PUT, DELETE single
│   │   ├── projects/[id]/
│   │   │   ├── photos/route.ts      # Upload project photos
│   │   │   └── status/route.ts      # Update status
│   │   ├── gallery/
│   │   │   ├── route.ts             # GET public gallery, POST upload
│   │   │   └── [id]/route.ts        # GET single, DELETE
│   │   ├── blog/
│   │   │   ├── route.ts             # GET posts, POST create
│   │   │   └── [id]/route.ts        # GET, PUT, DELETE
│   │   ├── contact/
│   │   │   └── route.ts             # POST contact form
│   │   └── upload/
│   │       └── route.ts             # Multipart image upload
│   │
│   ├── layout.tsx                   # Root layout
│   └── globals.css
│
├── components/
│   ├── portfolio/
│   │   ├── GalleryGrid.tsx          # Photo grid display
│   │   ├── PhotoCard.tsx            # Single photo card
│   │   ├── CategoryFilter.tsx       # Filter by category
│   │   ├── Lightbox.tsx             # Photo zoom viewer
│   │   └── TestimonialCarousel.tsx  # Client reviews
│   ├── dashboard/
│   │   ├── ProjectForm.tsx          # Create/edit form
│   │   ├── ProjectList.tsx          # Projects table
│   │   ├── ProjectCard.tsx          # Project summary card
│   │   ├── StatusBadge.tsx          # Status indicator
│   │   ├── TimelineView.tsx         # Timeline visualization
│   │   ├── PhotoUploadZone.tsx      # Drag-drop upload
│   │   └── ProjectPhotosGrid.tsx    # Photos gallery
│   ├── common/
│   │   ├── Header.tsx               # Navigation header
│   │   ├── Footer.tsx
│   │   ├── Navigation.tsx           # Main nav menu
│   │   ├── ContactForm.tsx          # Reusable contact form
│   │   ├── AuthGuard.tsx            # Protected route wrapper
│   │   └── LoadingSpinner.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       ├── Card.tsx
│       ├── Badge.tsx
│       └── ...
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                # Client-side Supabase
│   │   ├── server.ts                # Server-side Supabase
│   │   └── queries.ts               # Database helpers
│   ├── google-drive/
│   │   ├── client.ts                # Google Drive API setup
│   │   ├── upload.ts                # File upload helpers
│   │   └── utils.ts                 # Drive utilities
│   ├── api-helpers.ts               # API response utilities
│   ├── auth.ts                      # Auth utilities
│   ├── validators.ts                # Zod schemas
│   ├── constants.ts                 # App constants
│   └── utils.ts                     # General utilities
│
├── hooks/
│   ├── useProjects.ts               # Projects data fetching
│   ├── useGallery.ts                # Gallery photos fetching
│   ├── useBlog.ts                   # Blog posts fetching
│   ├── useAuth.ts                   # Authentication
│   └── useImage.ts                  # Image optimization
│
├── types/
│   ├── index.ts                     # Central export
│   ├── project.ts
│   ├── photo.ts
│   ├── blog.ts
│   ├── user.ts
│   └── api.ts
│
├── public/
│   ├── images/
│   │   ├── logo.png
│   │   └── hero-bg.jpg
│   └── ...
│
├── styles/
│   ├── globals.css
│   ├── variables.css
│   └── ...
│
├── migrations/                      # Supabase SQL migrations
│   ├── 001_init_schema.sql
│   └── ...
│
├── .env.local                       # Environment variables
├── .env.example
├── next.config.js
├── tsconfig.json
├── package.json
├── tailwind.config.js
└── README.md
```

---

## Frontend Pages

### Public Pages (No Authentication Required)

#### 1. **Home Page** - `/`

- **Purpose:** Landing page, introduce photographer and services
- **Components:**
  - Hero section with featured photo/video
  - Quick stats (projects completed, years experience)
  - Featured gallery showcase (4-6 photos)
  - Testimonial carousel
  - Services overview (brief cards)
  - Call-to-action buttons (View Portfolio, Contact)
  - Newsletter signup (optional)
- **Data:** Fetches featured gallery photos, testimonials
- **File:** `app/(public)/page.tsx`

#### 2. **Portfolio Gallery** - `/portfolio`

- **Purpose:** Full gallery showcase with filtering
- **Components:**
  - Category filter sidebar/tabs
  - Photo grid (responsive: 1-4 columns)
  - Search functionality (optional)
  - Sort options (newest, oldest, featured)
  - Lazy loading images
  - Pagination or infinite scroll
- **Data:** All public gallery photos with filters
- **File:** `app/(public)/portfolio/page.tsx`

#### 3. **Category Gallery** - `/portfolio/[category]`

- **Purpose:** Filter gallery by category
- **Components:**
  - Same as portfolio gallery but pre-filtered
  - Breadcrumb navigation
  - Category title & description
- **Data:** Gallery photos filtered by category
- **File:** `app/(public)/portfolio/[category]/page.tsx`

#### 4. **Photo Lightbox Modal** (Part of Gallery)

- **Purpose:** Full-screen photo viewer
- **Components:**
  - Large photo display
  - Navigation arrows (previous/next)
  - Photo info (title, description)
  - Close button
  - Zoom controls (optional)
  - Share buttons (optional)
- **Behavior:** Opens as modal overlay on photo click
- **File:** `components/portfolio/Lightbox.tsx`

#### 5. **Blog Posts Listing** - `/blog`

- **Purpose:** Display all published blog posts
- **Components:**
  - Post cards with thumbnail, title, excerpt, date
  - Featured post highlight
  - Search functionality
  - Pagination
  - Category/tag filters (optional)
  - Sort (newest first)
- **Data:** Published blog posts only
- **File:** `app/(public)/blog/page.tsx`

#### 6. **Individual Blog Post** - `/blog/[slug]`

- **Purpose:** Read full blog post
- **Components:**
  - Post title, author, date, read time
  - Featured image
  - Post content (markdown rendered)
  - Sidebar with: categories, tags, author bio
  - Related posts suggestions (3 similar posts)
  - Share buttons
  - Comment section (optional)
  - Navigation (previous/next post)
- **Data:** Full blog post content, metadata
- **File:** `app/(public)/blog/[slug]/page.tsx`

#### 7. **Contact Page** - `/contact`

- **Purpose:** Contact form for inquiries
- **Components:**
  - Contact form fields: name, email, phone, subject, message
  - Form validation feedback
  - Success/error messages
  - Optional: Map location
  - Optional: Social media links
  - Optional: FAQ section
- **Data:** Submits to POST /api/contact
- **File:** `app/(public)/contact/page.tsx`

#### 8. **About Page** - `/about` (Optional)

- **Purpose:** Photographer's story, experience, services
- **Components:**
  - Photographer bio section
  - Professional photo
  - Service offerings cards
  - Experience timeline
  - Equipment/tech used
  - Call-to-action
- **Data:** Static or from user settings
- **File:** `app/(public)/about/page.tsx`

### Protected Pages (Authentication Required)

#### 1. **Dashboard Home** - `/dashboard`

- **Purpose:** Overview of all content & metrics
- **Components:**
  - Welcome message
  - Quick stats cards: total projects, completed, photos, posts
  - Recent projects list (last 5)
  - Recent uploads
  - Recent contact submissions
  - Quick action buttons (New Project, Upload Photo, Write Post)
  - Chart/analytics (views, uploads) - optional
- **Data:** All user's projects, gallery, blog data
- **File:** `app/(protected)/dashboard/page.tsx`

#### 2. **Projects List** - `/dashboard/projects`

- **Purpose:** View all projects with management options
- **Components:**
  - Project table/cards with: title, client, status, dates, actions
  - Filters: status (planning, in-progress, completed), date range
  - Search by project name/client
  - Sort options
  - Pagination
  - Action buttons: View, Edit, Delete
  - "New Project" button
  - Status legend/badge colors
- **Data:** All user's projects
- **File:** `app/(protected)/dashboard/projects/page.tsx`

#### 3. **Create Project** - `/dashboard/projects/create`

- **Purpose:** Form to create new project
- **Components:**
  - Form fields: title, client name, description, start date, end date, budget (optional), notes
  - Form validation
  - Submit & Preview buttons
  - Cancel button (back to projects)
- **Data:** POST to /api/projects
- **File:** `app/(protected)/dashboard/projects/create/page.tsx`

#### 4. **Project Details** - `/dashboard/projects/[id]`

- **Purpose:** View full project details and manage
- **Components:**
  - Project info section: title, client, dates, status badge
  - Project description & notes
  - Photos grid (production photos uploaded)
  - Photo upload zone (drag-drop)
  - Status update dropdown/button
  - Edit button (to edit page)
  - Delete button (with confirmation)
  - Timeline/calendar view of dates
- **Data:** Full project with all photos
- **File:** `app/(protected)/dashboard/projects/[id]/page.tsx`

#### 5. **Edit Project** - `/dashboard/projects/[id]/edit`

- **Purpose:** Edit project details
- **Components:**
  - Same form as Create Project but pre-filled
  - Submit changes button
  - Cancel button
- **Data:** PUT to /api/projects/[id]
- **File:** `app/(protected)/dashboard/projects/[id]/edit/page.tsx`

#### 6. **Gallery Management** - `/dashboard/gallery`

- **Purpose:** Manage portfolio photos
- **Components:**
  - Photo grid display
  - Filters: category, featured, date range
  - Search by title/description
  - Bulk select checkboxes (optional)
  - Edit button per photo (modal form)
  - Delete button per photo
  - Reorder photos (drag-drop)
  - "Upload New" button
  - View statistics (total photos, views)
- **Data:** All user's gallery photos
- **File:** `app/(protected)/dashboard/gallery/page.tsx`

#### 7. **Upload Photos** - `/dashboard/gallery/upload`

- **Purpose:** Bulk upload portfolio photos
- **Components:**
  - Drag-drop zone for files
  - File selection button
  - Multiple file preview
  - Metadata form fields: category, tags, featured checkbox
  - Upload progress bar
  - Success/error messages
  - Back button
- **Data:** POST to /api/gallery with FormData
- **File:** `app/(protected)/dashboard/gallery/upload/page.tsx`

#### 8. **Edit Photo** - `/dashboard/gallery/[id]/edit` (Modal)

- **Purpose:** Edit single photo metadata
- **Components:**
  - Photo preview
  - Form fields: title, description, category, tags, featured, order
  - Save button
  - Delete button
  - Cancel button
- **Data:** PUT to /api/gallery/[id]
- **File:** Modal component or inline form

#### 9. **Blog Management** - `/dashboard/blog`

- **Purpose:** Manage blog posts
- **Components:**
  - Posts table/list: title, status (draft/published), date, views, actions
  - Filters: published/draft status
  - Search by title
  - Edit button per post
  - Delete button per post
  - Publish/unpublish toggle
  - "New Post" button
  - Pagination
- **Data:** All user's blog posts
- **File:** `app/(protected)/dashboard/blog/page.tsx`

#### 10. **Create Blog Post** - `/dashboard/blog/create`

- **Purpose:** Create new blog post
- **Components:**
  - Title input
  - Slug input (auto-generated from title)
  - Rich text editor for content
  - Featured image upload
  - SEO description textarea
  - Tags input
  - Draft/Publish toggle
  - Save draft button
  - Preview button
  - Publish button
- **Data:** POST to /api/blog
- **File:** `app/(protected)/dashboard/blog/create/page.tsx`

#### 11. **Edit Blog Post** - `/dashboard/blog/[id]/edit`

- **Purpose:** Edit existing blog post
- **Components:**
  - Same as Create but pre-filled with post data
  - Delete button
  - View published button (if published)
- **Data:** PUT to /api/blog/[id]
- **File:** `app/(protected)/dashboard/blog/[id]/edit/page.tsx`

#### 12. **Settings/Profile** - `/dashboard/settings`

- **Purpose:** Photographer profile and preferences
- **Components:**
  - Profile section: name, email, bio, phone, website
  - Profile image upload
  - Business info: business name, address (optional)
  - Social media links (Instagram, Facebook, etc.)
  - Email preferences (notifications on/off)
  - Save changes button
  - Change password button
  - Logout button
  - Delete account button (with confirmation)
- **Data:** PUT to /api/user or own auth provider
- **File:** `app/(protected)/dashboard/settings/page.tsx`

#### 13. **Testimonials Management** - `/dashboard/testimonials` (Optional)

- **Purpose:** Manage client testimonials
- **Components:**
  - Testimonials list/cards
  - Add new testimonial button (modal form)
  - Edit testimonial
  - Delete testimonial
  - Star rating display
  - Featured toggle
- **Data:** GET/POST/DELETE /api/testimonials
- **File:** `app/(protected)/dashboard/testimonials/page.tsx`

#### 14. **Contact Submissions** - `/dashboard/contact-submissions` (Optional)

- **Purpose:** View contact form submissions
- **Components:**
  - Contact submissions table: name, email, date, subject, actions
  - Mark as read/unread
  - View full message (modal)
  - Delete submission
  - Filter: read/unread
  - Search by name/email
  - Reply email button (optional - external email)
- **Data:** GET /api/contact-submissions
- **File:** `app/(protected)/dashboard/contact-submissions/page.tsx`

#### 15. **Login Page** - `/login`

- **Purpose:** Authenticate photographer
- **Components:**
  - Email input
  - Password input
  - "Remember me" checkbox
  - Login button
  - Forgot password link
  - Sign up link (if allowed)
  - Error messages for failed attempts
- **Data:** POST to Supabase Auth
- **File:** `app/(public)/auth/login/page.tsx`

#### 16. **Signup Page** - `/signup` (Optional)

- **Purpose:** Create new photographer account
- **Components:**
  - Email input with validation
  - Password input with strength indicator
  - Confirm password
  - Terms & conditions checkbox
  - Signup button
  - Login link
  - Error messages
- **Data:** POST to Supabase Auth
- **File:** `app/(public)/auth/signup/page.tsx`

---

## Backend API Endpoints

### Authentication Endpoints

```
POST /api/auth/login
├─ Body: { email, password }
├─ Returns: { user, session, token }
├─ Error codes: 401 (invalid credentials), 400 (missing fields)
└─ Public endpoint

POST /api/auth/logout
├─ Body: {}
├─ Returns: { success: true }
├─ Clears session/token
└─ Protected endpoint

POST /api/auth/signup
├─ Body: { email, password, name }
├─ Returns: { user, session }
├─ Error codes: 400 (invalid email), 409 (email exists)
└─ Public endpoint (if registration enabled)

GET /api/auth/session
├─ Returns: { user, session } or null
├─ Validates JWT token from cookies
└─ Protected endpoint

POST /api/auth/refresh
├─ Body: { refreshToken }
├─ Returns: { token, session }
├─ Refreshes expired JWT
└─ Public endpoint
```

### Gallery Endpoints

```
GET /api/gallery
├─ Query: category?, tag?, featured?, limit=20, offset=0, sort=newest
├─ Returns: { data: [photos], total: number }
├─ Error: 400 (invalid query)
└─ Public endpoint

GET /api/gallery/[id]
├─ Returns: { data: photo }
├─ Error: 404 (photo not found)
└─ Public endpoint

POST /api/gallery
├─ Content-Type: multipart/form-data
├─ Body: { file, title, description, category, tags[], featured }
├─ Returns: { data: { id, google_drive_file_id, google_drive_url, ... } }
├─ Validates: file type, size < 50MB, auth required
├─ Error: 400 (invalid file), 401 (not authenticated), 413 (file too large)
└─ Protected endpoint

PUT /api/gallery/[id]
├─ Body: { title, description, category, tags[], featured, order_index }
├─ Returns: { data: updated photo }
├─ Error: 404 (not found), 403 (not owner)
└─ Protected endpoint

DELETE /api/gallery/[id]
├─ Returns: { success: true }
├─ Removes from Google Drive
├─ Error: 404 (not found), 403 (not owner)
└─ Protected endpoint

PUT /api/gallery/[id]/reorder
├─ Body: { order_index: number }
├─ Returns: { data: updated photo }
└─ Protected endpoint
```

### Projects Endpoints

```
GET /api/projects
├─ Query: status?, startDate?, endDate?, limit=50, offset=0, sort=newest
├─ Returns: { data: [projects], total: number }
├─ Error: 400 (invalid query)
└─ Protected endpoint (only own projects)

GET /api/projects/[id]
├─ Returns: { data: { project, photos: [] } }
├─ Error: 404 (not found), 403 (not owner)
└─ Protected endpoint

POST /api/projects
├─ Body: { title, client_name, description, start_date, end_date, budget?, notes }
├─ Returns: { data: created project }
├─ Validates: title required, dates valid
├─ Error: 400 (validation failed)
└─ Protected endpoint

PUT /api/projects/[id]
├─ Body: { title, client_name, description, status, start_date, end_date, budget?, notes }
├─ Returns: { data: updated project }
├─ Error: 404 (not found), 403 (not owner), 400 (invalid status)
└─ Protected endpoint

DELETE /api/projects/[id]
├─ Returns: { success: true }
├─ Cascades to project_photos, removes files from Google Drive
├─ Error: 404 (not found), 403 (not owner)
└─ Protected endpoint

PUT /api/projects/[id]/status
├─ Body: { status: 'planning' | 'in-progress' | 'completed' | 'on-hold' }
├─ Returns: { data: updated project }
├─ Error: 400 (invalid status), 403 (not owner)
└─ Protected endpoint

POST /api/projects/[id]/photos
├─ Content-Type: multipart/form-data
├─ Body: { files[], captions[]? }
├─ Returns: { data: [{ id, google_drive_file_id, google_drive_url, uploaded_at }] }
├─ Validates: file types, size, max 20 files per request
├─ Error: 400 (invalid files), 413 (file too large), 404 (project not found)
└─ Protected endpoint

GET /api/projects/[id]/photos
├─ Query: limit=50, offset=0
├─ Returns: { data: [photos], total: number }
├─ Error: 404 (project not found)
└─ Protected endpoint

DELETE /api/projects/[id]/photos/[photoId]
├─ Returns: { success: true }
├─ Removes from Google Drive
├─ Error: 404 (not found), 403 (not owner)
└─ Protected endpoint

PUT /api/projects/[id]/photos/[photoId]
├─ Body: { caption?, order_index? }
├─ Returns: { data: updated photo }
└─ Protected endpoint
```

### Blog Endpoints

```
GET /api/blog
├─ Query: published=true, limit=10, offset=0, sort=newest, search?
├─ Returns: { data: [posts], total: number }
└─ Public endpoint

GET /api/blog/[slug]
├─ Returns: { data: full post with content }
├─ Error: 404 (post not found)
└─ Public endpoint

GET /api/blog/tags
├─ Returns: { data: [{ tag, count }] }
├─ Lists all tags with usage count
└─ Public endpoint

POST /api/blog
├─ Content-Type: multipart/form-data
├─ Body: { title, content, featured_image?, seo_description, tags[], published }
├─ Auto-generates slug from title
├─ Returns: { data: created post with slug }
├─ Validates: title & content required
├─ Error: 400 (validation failed), 409 (slug exists)
└─ Protected endpoint

PUT /api/blog/[id]
├─ Body: { title, content, featured_image?, seo_description, tags[], published, slug? }
├─ Returns: { data: updated post }
├─ Error: 404 (not found), 403 (not owner), 409 (slug conflict)
└─ Protected endpoint

DELETE /api/blog/[id]
├─ Returns: { success: true }
├─ Removes featured image from Google Drive
├─ Error: 404 (not found), 403 (not owner)
└─ Protected endpoint

PUT /api/blog/[id]/publish
├─ Body: { published: boolean }
├─ Returns: { data: updated post }
└─ Protected endpoint
```

### Testimonials Endpoints

```
GET /api/testimonials
├─ Query: featured?, limit=10
├─ Returns: { data: [testimonials] }
├─ Error: 400 (invalid query)
└─ Public endpoint

POST /api/testimonials
├─ Body: { client_name, client_image?, content, rating, featured? }
├─ Validates: rating 1-5, content min 10 chars
├─ Returns: { data: created testimonial }
├─ Error: 400 (validation failed)
└─ Protected endpoint

PUT /api/testimonials/[id]
├─ Body: { client_name, client_image?, content, rating, featured? }
├─ Returns: { data: updated testimonial }
├─ Error: 404 (not found), 403 (not owner)
└─ Protected endpoint

DELETE /api/testimonials/[id]
├─ Returns: { success: true }
├─ Removes image from Google Drive
├─ Error: 404 (not found), 403 (not owner)
└─ Protected endpoint
```

### Contact Endpoints

```
POST /api/contact
├─ Body: { name, email, phone?, subject, message }
├─ Validates: name, email, message required; message min 10 chars
├─ Returns: { success: true, submissionId: uuid }
├─ Sends email notification (optional)
├─ Error: 400 (validation failed), 429 (rate limited)
└─ Public endpoint (with rate limiting)

GET /api/contact-submissions
├─ Query: read?, limit=50, offset=0, sort=newest
├─ Returns: { data: [submissions], total: number }
├─ Error: 403 (not photographer)
└─ Protected endpoint

GET /api/contact-submissions/[id]
├─ Returns: { data: full submission }
├─ Error: 404 (not found), 403 (not owner)
└─ Protected endpoint

PUT /api/contact-submissions/[id]/read
├─ Body: { read: boolean }
├─ Returns: { data: updated submission }
└─ Protected endpoint

DELETE /api/contact-submissions/[id]
├─ Returns: { success: true }
├─ Error: 404 (not found), 403 (not owner)
└─ Protected endpoint
```

### User/Settings Endpoints

```
GET /api/user
├─ Returns: { data: user profile }
├─ Error: 401 (not authenticated)
└─ Protected endpoint

PUT /api/user
├─ Body: { name, bio, phone, website, profile_image? }
├─ Returns: { data: updated user }
├─ Error: 400 (invalid data)
└─ Protected endpoint

POST /api/user/change-password
├─ Body: { currentPassword, newPassword }
├─ Returns: { success: true }
├─ Error: 400 (invalid password), 401 (wrong current password)
└─ Protected endpoint

DELETE /api/user
├─ Confirms photographer identity
├─ Deletes all user data (projects, photos, posts, etc.)
├─ Returns: { success: true }
├─ Error: 401 (not verified)
└─ Protected endpoint
```

### Google Drive Upload Endpoints

```
POST /api/upload
├─ Content-Type: multipart/form-data
├─ Body: { file, destination: 'gallery' | 'projects' | 'blog' | 'testimonials', parentId? }
├─ Returns: { data: { fileId, fileName, webViewLink, webContentLink } }
├─ Validates: file type (images only), size < 100MB
├─ Error: 400 (invalid file), 413 (too large), 500 (drive error)
└─ Protected endpoint

DELETE /api/upload/[fileId]
├─ Removes file from Google Drive
├─ Returns: { success: true }
├─ Error: 404 (file not found), 403 (not owner)
└─ Protected endpoint

POST /api/upload/batch
├─ Content-Type: multipart/form-data
├─ Body: { files[], destination: string, parentId? }
├─ Returns: { data: [{ fileId, fileName, webViewLink }] }
├─ Uploads multiple files in batch
├─ Error: same as single upload
└─ Protected endpoint
```

### Analytics Endpoints (Optional)

```
GET /api/analytics/dashboard
├─ Returns: { data: { totalProjects, completedProjects, totalPhotos, totalViews, ... } }
├─ Time range: optional query params
└─ Protected endpoint

GET /api/analytics/gallery
├─ Query: startDate?, endDate?
├─ Returns: { data: { photos, views, clicksByPhoto } }
└─ Protected endpoint

GET /api/analytics/blog
├─ Query: startDate?, endDate?
├─ Returns: { data: { posts, views, clicksByPost } }
└─ Protected endpoint
```

---

## Feature Breakdown

### 1. Public Portfolio Gallery

#### Purpose

Display photographer's best work to attract potential clients.

#### Architecture

**Components:**

- `GalleryGrid.tsx` - Main photo grid layout
- `PhotoCard.tsx` - Individual photo with title/description
- `CategoryFilter.tsx` - Filter photos by category
- `Lightbox.tsx` - Full-screen photo viewer with zoom

**Data Flow:**

```
User visits /portfolio
    ↓
Page renders GalleryGrid component
    ↓
Fetches gallery photos from /api/gallery (GET)
    ↓
Displays photos with categories/tags
    ↓
User clicks photo
    ↓
Lightbox opens with full-size image
```

**Database Tables:**

```
gallery
├── id (UUID PK)
├── user_id (FK → users)
├── title
├── description
├── google_drive_file_id (Google Drive file ID)
├── google_drive_url (Shared/public Google Drive URL)
├── category (e.g., "wedding", "portrait", "landscape")
├── tags (TEXT[] - array of tags)
├── featured (Boolean - highlighted on home)
├── order_index (sort order)
├── created_at
└── updated_at
```

**API Endpoints:**

```
GET /api/gallery
├─ Query params: category?, tag?, featured?, limit=20, offset=0
├─ Returns: [{ id, title, description, image_url, category, tags }]
└─ No auth required (public)

GET /api/gallery/[id]
├─ Returns: Single photo with details
└─ No auth required

POST /api/gallery (Protected)
├─ Body: { title, description, image, category, tags, featured }
├─ Returns: Created photo object
└─ Requires auth

PUT /api/gallery/[id] (Protected)
├─ Body: { title, description, category, tags, featured, order_index }
├─ Returns: Updated photo
└─ Requires auth

DELETE /api/gallery/[id] (Protected)
├─ Deletes photo and removes from Google Drive
└─ Requires auth
```

---

### 2. Project/Production Tracking

#### Purpose

Photographer tracks projects from planning through completion with photos during production.

#### Architecture

**Components:**

- `ProjectList.tsx` - Table/list view of all projects
- `ProjectCard.tsx` - Summary card for single project
- `ProjectForm.tsx` - Create/edit project modal/form
- `StatusBadge.tsx` - Visual status indicator
- `TimelineView.tsx` - Gantt-like timeline of projects
- `PhotoUploadZone.tsx` - Drag-drop for production photos
- `ProjectPhotosGrid.tsx` - Photos uploaded during project

**Data Flow (Create Project):**

```
Photographer clicks "New Project"
    ↓
ProjectForm modal opens
    ↓
Fills: title, client_name, description, dates, notes
    ↓
Submits to POST /api/projects
    ↓
API validates, creates project in DB
    ↓
Returns created project with ID
    ↓
Redirect to project details page
```

**Data Flow (Update Status/Add Photos):**

```
Photographer on project details page
    ↓
Uploads photos via drag-drop zone
    ↓
Photos sent to POST /api/projects/[id]/photos
    ↓
Files uploaded to Supabase Storage
    ↓
Records created in project_photos table
    ↓
Grid updates with new photos
```

**Data Flow (Timeline View):**

```
Photographer navigates to Dashboard
    ↓
Fetches all projects from /api/projects
    ↓
TimelineView component renders Gantt chart
    ↓
Each project shows as bar: start_date → end_date
    ↓
Color coded by status (red=planning, yellow=in-progress, green=completed)
```

**Database Tables:**

```
projects
├── id (UUID PK)
├── user_id (FK → users)
├── title
├── client_name
├── description
├── status (enum: 'planning', 'in-progress', 'completed')
├── start_date
├── end_date
├── notes (production notes/comments)
├── created_at
└── updated_at

project_photos
├── id (UUID PK)
├── project_id (FK → projects, CASCADE DELETE)
├── google_drive_file_id (Google Drive file ID)
├── google_drive_url (Shared/public Google Drive URL)
├── caption (optional)
├── order_index (sort order)
└── uploaded_at
```

**API Endpoints:**

```
GET /api/projects (Protected)
├─ Query: status?, limit=50, offset=0
├─ Returns: [{ id, title, client_name, status, start_date, end_date, created_at }]
└─ Only owns projects returned

POST /api/projects (Protected)
├─ Body: { title, client_name, description, start_date, end_date, notes }
├─ Returns: Created project object with id
└─ Auto-sets status to 'planning'

GET /api/projects/[id] (Protected)
├─ Returns: Full project with all photos, notes, metadata
└─ Only if user owns it

PUT /api/projects/[id] (Protected)
├─ Body: { title, client_name, description, status, start_date, end_date, notes }
├─ Returns: Updated project
└─ Only if user owns it

DELETE /api/projects/[id] (Protected)
├─ Deletes project and cascades to project_photos
├─ Removes all images from Google Drive
└─ Only if user owns it

POST /api/projects/[id]/photos (Protected)
├─ Body: FormData with multiple files
├─ Returns: [{ id, google_drive_file_id, google_drive_url, uploaded_at }]
└─ Uploads to Google Drive /projects/[project_id]/ folder

PUT /api/projects/[id]/status (Protected)
├─ Body: { status: 'planning' | 'in-progress' | 'completed' }
├─ Returns: Updated project with new status
└─ Quick status update endpoint
```

---

### 3. Blog System

#### Purpose

Share photography tips, behind-the-scenes stories, and build SEO/credibility.

#### Architecture

**Components:**

- `BlogList.tsx` - Display blog posts with preview
- `BlogPost.tsx` - Full blog post page
- `BlogForm.tsx` - Create/edit blog post with rich editor
- `RelatedPosts.tsx` - Show similar posts

**Data Flow (Create Blog Post):**

```
Photographer: /dashboard/blog/create
    ↓
BlogForm component loads with editor
    ↓
Fills: title, content (rich text), featured_image
    ↓
Submits to POST /api/blog
    ↓
API generates slug from title
    ↓
Post saved as draft (published=false)
    ↓
Can preview or publish later
```

**Data Flow (Public View):**

```
User visits /blog
    ↓
BlogList fetches GET /api/blog?published=true
    ↓
Shows post previews (title, excerpt, date, image)
    ↓
User clicks post title
    ↓
Navigates to /blog/[slug]
    ↓
Fetches GET /api/blog/[slug]
    ↓
Renders full post content
```

**Database Tables:**

```
blog_posts
├── id (UUID PK)
├── user_id (FK → users)
├── slug (TEXT UNIQUE - URL friendly)
├── title
├── content (markdown or HTML)
├── featured_image_google_drive_id (Google Drive file ID)
├── featured_image_url (Public Google Drive URL)
├── published (Boolean)
├── published_at (Timestamp)
├── created_at
├── updated_at
└── seo_description (for meta tags)
```

**API Endpoints:**

```
GET /api/blog
├─ Query: published=true, limit=10, offset=0
├─ Returns: [{ id, slug, title, seo_description, featured_image_url, published_at }]
└─ No auth required

GET /api/blog/[slug]
├─ Returns: Full post content, metadata
└─ No auth required

POST /api/blog (Protected)
├─ Body: { title, content, featured_image, published }
├─ Auto-generates slug from title
├─ Returns: Created post with slug
└─ Requires auth

PUT /api/blog/[id] (Protected)
├─ Body: { title, content, featured_image, published, seo_description }
├─ Returns: Updated post
└─ Requires auth

DELETE /api/blog/[id] (Protected)
├─ Deletes post
└─ Requires auth
```

---

### 4. Client Testimonials

#### Purpose

Build credibility by displaying client reviews on public portfolio.

#### Architecture

**Components:**

- `TestimonialCarousel.tsx` - Rotating carousel on home page
- `TestimonialForm.tsx` - Admin form to add testimonials
- `TestimonialCard.tsx` - Single testimonial display

**Data Flow:**

```
Photographer adds testimonial in dashboard
    ↓
POST /api/testimonials
    ↓
Saves to DB
    ↓
Public site auto-fetches and displays in carousel on home
```

**Database Tables:**

```
testimonials
├── id (UUID PK)
├── user_id (FK → users)
├── client_name
├── client_image_google_drive_id (optional, Google Drive file ID)
├── client_image_url (optional, Public Google Drive URL)
├── content (review text)
├── rating (1-5 stars)
└── created_at
```

**API Endpoints:**

```
GET /api/testimonials
├─ Returns: [{ client_name, client_image_url, content, rating }]
└─ No auth required

POST /api/testimonials (Protected)
├─ Body: { client_name, client_image_url?, content, rating }
├─ Returns: Created testimonial
└─ Requires auth

DELETE /api/testimonials/[id] (Protected)
├─ Deletes testimonial
└─ Requires auth
```

---

### 5. Contact Form

#### Purpose

Allow potential clients to inquire about services.

#### Architecture

**Components:**

- `ContactForm.tsx` - Form on /contact page
- `ContactFormWidget.tsx` - Optional sidebar/footer widget

**Data Flow:**

```
Visitor fills contact form on /contact page
    ↓
Validates client-side with Zod
    ↓
Submits to POST /api/contact
    ↓
Server validates again
    ↓
Saves to contact_submissions table
    ↓
(Optional: Send email to photographer)
    ↓
Returns success message to user
```

**Database Tables:**

```
contact_submissions
├── id (UUID PK)
├── name
├── email
├── phone (optional)
├── subject
├── message
└── submitted_at
```

**API Endpoints:**

```
POST /api/contact
├─ Body: { name, email, phone?, subject, message }
├─ Validates: name, email required; message min 10 chars
├─ Returns: { success: true }
├─ (Optional) Sends transactional email
└─ No auth required (public)
```

---

### 6. Authentication & Authorization

#### Purpose

Protect admin dashboard so only photographer can manage content.

#### Architecture

**Flow:**

```
Photographer visits /dashboard
    ↓
AuthGuard component checks if logged in
    ↓
If not logged in:
    ↓ → Redirect to /login with return URL
    ↓
Login page renders Supabase Auth form
    ↓
Photographer enters email/password
    ↓
Supabase returns JWT token
    ↓
Token stored in httpOnly cookie (secure)
    ↓
AuthGuard validates token
    ↓ → Allows access to dashboard
    ↓
On API calls, token automatically included
    ↓
Server verifies token with Supabase
    ↓ → Grants access if valid
```

**Supabase Auth Configuration:**

- Authentication method: Email + Password
- Session management: JWT in httpOnly cookies
- Admin user: Must be created manually in Supabase console with custom role
- Row-level security (RLS): Enforced at database level

**Implementation Points:**

```typescript
// lib/auth.ts - Helper functions
export async function getSession() {
  // Get JWT from cookies
  // Verify with Supabase
  // Return user or null
}

export async function requireAuth() {
  // Middleware for protected routes
  // Redirects if not authenticated
}

// middleware.ts - Route protection
export function middleware(request: NextRequest) {
  // Check if route is protected
  // Validate session
  // Redirect if needed
}
```

---

### 7. Image Optimization & CDN

#### Purpose

Fast loading, automatic responsive images, SEO optimization.

#### Architecture

**Implementation:**

```
Image Upload
    ↓
Uploaded to Google Drive
    ↓
Stored in photographer's folder structure
    ↓
Google Drive share link generated for public access
    ↓
Next.js Image component uses: https://drive.google.com/uc?export=view&id=[fileId]
    ↓
Vercel CDN caches images from Google Drive
    ↓
Fast delivery globally

SEO:
    ↓
All images have: alt text, title
    ↓
Meta tags for og:image
    ↓
Sitemap includes image URLs
    ↓
Structured data for photos
```

**Components & Utilities:**

```typescript
// Use Next.js Image component
import Image from 'next/image';

<Image
  src={supabaseImageUrl}
  alt={photoTitle}
  width={800}
  height={600}
  priority={isFeatured}
  placeholder="blur"
  blurDataURL={placeholderUrl}
/>

// Custom hook for optimization
export function useOptimizedImage(url: string) {
  return {
    srcSet: generateSrcSet(url),
    sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw",
  };
}
```

---

### 8. SEO Optimization

#### Purpose

Improve search engine visibility for portfolio and blog.

#### Architecture

**Meta Tags:**

```typescript
// app/layout.tsx - Base metadata
export const metadata = {
  title: "Portfolio | Photographer Name",
  description: "Professional photography services...",
  openGraph: {
    title: "Portfolio | Photographer Name",
    description: "Professional photography services...",
    images: ["/og-image.jpg"],
    type: "website",
  },
};

// app/portfolio/page.tsx - Gallery page
export const metadata = {
  title: "Gallery | Professional Photography",
  description: "Browse my photography portfolio...",
};

// app/blog/[slug]/page.tsx - Blog post
export async function generateMetadata({ params }) {
  const post = await getBlogPost(params.slug);
  return {
    title: post.title,
    description: post.seo_description,
    openGraph: {
      title: post.title,
      description: post.seo_description,
      images: [post.featured_image_url],
    },
  };
}
```

**Sitemap & Robots:**

```
// public/sitemap.xml - Dynamic sitemap
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://domain.com/</loc>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://domain.com/portfolio</loc>
    <priority>0.8</priority>
  </url>
  <!-- Gallery photos -->
  <!-- Blog posts -->
</urlset>

// public/robots.txt
User-agent: *
Allow: /
Disallow: /dashboard/*
Sitemap: https://domain.com/sitemap.xml
```

**Structured Data (Schema.org):**

```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Photographer Name",
  "url": "https://domain.com",
  "image": "https://domain.com/og-image.jpg",
  "areaServed": ["US", "CA"],
  "priceRange": "$$",
  "potentialAction": {
    "@type": "ContactAction",
    "target": "https://domain.com/contact"
  }
}
```

---

## Data Flows

### User Registration & Login Flow

```
New User → /login
    ↓
Enters email + password
    ↓
Submits to Supabase Auth
    ↓
Supabase creates user account
    ↓
Returns JWT token
    ↓
Token stored in httpOnly cookie
    ↓
Redirected to /dashboard
    ↓
Can now manage content
```

### Photo Upload Flow

```
Photographer uploads photo from /dashboard/gallery/upload
    ↓
Selects file(s) + fills metadata
    ↓
Client validates: file type (jpg/png/webp), size < 50MB
    ↓
Sends to POST /api/gallery (with FormData)
    ↓
Server validates again
    ↓
Uploads to Google Drive:
  /gallery/[photographer-folder]/[photo-id]/[filename]
    ↓
Gets file ID + public share link back
    ↓
Creates gallery record with google_drive_file_id
    ↓
Returns gallery object
    ↓
Frontend updates display immediately (SWR refetch)
```

### Project Timeline Update Flow

```
Photographer on /dashboard/projects
    ↓
Updates project status from "planning" → "in-progress"
    ↓
Uploads production photos via drag-drop
    ↓
Photos sent to POST /api/projects/[id]/photos
    ↓
Each photo uploaded to Google Drive:
  /projects/[project-id]/[photo-id]
    ↓
Records created in project_photos table with file IDs
    ↓
Updates project updated_at timestamp
    ↓
TimelineView re-renders to show progress
    ↓
Status badge color changes visually
```

### Blog Post Publishing Flow

```
Photographer creates post: /dashboard/blog/create
    ↓
Fills: title, content (rich editor), featured image
    ↓
Initial save creates draft (published=false)
    ↓
Can review at: /dashboard/blog/[id]/preview
    ↓
Clicks "Publish"
    ↓
Sets published=true, published_at=now
    ↓
API response includes public slug URL
    ↓
Post now visible on /blog to public
    ↓
Indexed by search engines (sitemaps updated)
```

### Public Client Inquiry Flow

```
Visitor browses /portfolio
    ↓
Clicks "Get in Touch" or navigates to /contact
    ↓
Fills contact form: name, email, message
    ↓
Client-side Zod validation
    ↓
Submits to POST /api/contact
    ↓
Server re-validates data
    ↓
Saves to contact_submissions table
    ↓
(Optional: Email sent to photographer)
    ↓
User sees: "Message sent! We'll be in touch soon"
    ↓
Photographer sees new submission in /dashboard/contact
```

---

## User Flows

### Photographer User Flow

#### First Visit (Setup)

```
1. Creates Supabase account
2. Logs in to /dashboard
3. Navigates to /dashboard/settings
4. Fills profile: bio, profile image, contact info
5. Uploads portfolio photos to /dashboard/gallery/upload
6. Organizes photos: assigns categories, tags, order
7. Creates first project: /dashboard/projects/create
8. Checks public site: /portfolio to verify display
```

#### Ongoing Management

```
Daily:
  - Check /dashboard for overview
  - Review new contact submissions
  - Check project timelines

During Shoots:
  - Navigate to project in /dashboard
  - Upload production photos
  - Add notes about shoot

Weekly:
  - Update project statuses
  - Add testimonials from completed projects

Monthly:
  - Write blog post about recent work
  - Review portfolio gallery
  - Update project descriptions
```

#### Content Publishing Workflow

```
1. Upload gallery photos to portfolio
2. Create blog post about recent project
3. Add client testimonial
4. Mark project as completed
5. Share blog post on social media
6. Check analytics (if configured)
```

### Public User Flow

#### First Visit (Browsing)

```
1. Lands on home page
2. Sees featured portfolio photos
3. Reads testimonial carousel
4. Clicks "View Gallery" → /portfolio
5. Browses photos by category
6. Clicks photo to see larger version
7. Scrolls down to see related photos
```

#### Inquiry Flow

```
1. Impressed with portfolio
2. Reads about services (if available)
3. Navigates to /contact
4. Fills contact form with inquiry
5. Receives confirmation message
6. Photographer responds via email
```

#### Content Engagement

```
1. Discovers blog link in header/footer
2. Reads blog posts: /blog
3. Gains confidence in photographer's expertise
4. Returns to /portfolio with increased interest
5. Makes inquiry
```

---

## Database Schema

### Complete SQL Schema

```sql
-- ============ Users ============
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  bio TEXT,
  profile_image_url TEXT,
  phone TEXT,
  website TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- ============ Portfolio Gallery ============
CREATE TABLE gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  google_drive_file_id TEXT NOT NULL,
  google_drive_url TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 999,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_gallery_user_id ON gallery(user_id);
CREATE INDEX idx_gallery_category ON gallery(category);

ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view gallery"
  ON gallery FOR SELECT
  USING (true);

CREATE POLICY "Users can manage own gallery"
  ON gallery FOR INSERT, UPDATE, DELETE
  USING (auth.uid() = user_id);

-- ============ Projects ============
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  client_name TEXT,
  status TEXT NOT NULL DEFAULT 'planning'
    CHECK (status IN ('planning', 'in-progress', 'completed', 'on-hold')),
  start_date DATE,
  end_date DATE,
  budget DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_dates ON projects(start_date, end_date);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see own projects"
  ON projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own projects"
  ON projects FOR INSERT, UPDATE, DELETE
  USING (auth.uid() = user_id);

-- ============ Project Photos ============
CREATE TABLE project_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  google_drive_file_id TEXT NOT NULL,
  google_drive_url TEXT NOT NULL,
  caption TEXT,
  order_index INTEGER DEFAULT 999,
  uploaded_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_project_photos_project_id ON project_photos(project_id);

ALTER TABLE project_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view project photos if they own project"
  ON project_photos FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_photos.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage photos in own projects"
  ON project_photos FOR INSERT, UPDATE, DELETE
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_photos.project_id
    AND projects.user_id = auth.uid()
  ));

-- ============ Blog Posts ============
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image_google_drive_id TEXT,
  featured_image_url TEXT,
  seo_description TEXT,
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_blog_posts_user_id ON blog_posts(user_id);
CREATE INDEX idx_blog_posts_published ON blog_posts(published);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published posts"
  ON blog_posts FOR SELECT
  USING (published = true);

CREATE POLICY "Authors can read own posts"
  ON blog_posts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Authors can manage own posts"
  ON blog_posts FOR INSERT, UPDATE, DELETE
  USING (auth.uid() = user_id);

-- ============ Testimonials ============
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_image_google_drive_id TEXT,
  client_image_url TEXT,
  content TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  featured BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_testimonials_user_id ON testimonials(user_id);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view testimonials"
  ON testimonials FOR SELECT
  USING (true);

CREATE POLICY "Authors can manage own testimonials"
  ON testimonials FOR INSERT, UPDATE, DELETE
  USING (auth.uid() = user_id);

-- ============ Contact Submissions ============
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX idx_contact_submissions_created_at ON contact_submissions(created_at DESC);

-- No RLS needed - form submissions are not sensitive
```

### Relationships Diagram

```
┌─────────────────────┐
│      users          │
├─────────────────────┤
│ id (PK)             │
│ email               │
│ name                │
│ bio                 │
│ profile_image_url   │
└─────────────────────┘
         │
         ├─── 1:M ──→ gallery
         │            ├── image_url
         │            ├── category
         │            └── tags
         │
         ├─── 1:M ──→ projects
         │            ├── title
         │            ├── status
         │            ├── client_name
         │            └── dates
         │                 │
         │                 └─── 1:M ──→ project_photos
         │                              ├── image_url
         │                              └── uploaded_at
         │
         ├─── 1:M ──→ blog_posts
         │            ├── title
         │            ├── content
         │            ├── published
         │            └── slug
         │
         └─── 1:M ──→ testimonials
                      ├── client_name
                      ├── content
                      └── rating
```

---

## Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)

**Setup & Infrastructure:**

- [ ] Initialize Next.js project with TypeScript
- [ ] Set up Supabase project and connect
- [ ] Configure environment variables
- [ ] Set up Tailwind CSS and UI component library
- [ ] Deploy basic setup to Vercel

**Authentication:**

- [ ] Implement Supabase Auth (login/signup)
- [ ] Create protected route middleware
- [ ] Build login/signup pages
- [ ] Implement session management

**Database:**

- [ ] Create all tables with RLS policies
- [ ] Set up Supabase Storage buckets
- [ ] Create database indexes
- [ ] Write database helper functions

**Estimate:** 1-2 weeks

---

### Phase 2: Public Portfolio (Weeks 3-4)

**Home Page:**

- [ ] Design hero section with featured photos
- [ ] Create navigation header/footer
- [ ] Add testimonial carousel
- [ ] Add call-to-action buttons

**Portfolio Gallery:**

- [ ] Build photo grid component
- [ ] Implement category filtering
- [ ] Add lightbox/zoom viewer
- [ ] Optimize images with Next.js Image

**Contact Form:**

- [ ] Create contact form component
- [ ] Set up form validation (Zod)
- [ ] Create /api/contact endpoint
- [ ] (Optional) Email notifications

**Estimate:** 2 weeks

---

### Phase 3: Admin Dashboard (Weeks 5-6)

**Dashboard Core:**

- [ ] Dashboard home/overview page
- [ ] Main navigation/sidebar
- [ ] Protected routes setup

**Project Management:**

- [ ] List projects table
- [ ] Create project form modal
- [ ] Edit/delete projects
- [ ] Upload project photos
- [ ] Timeline/Gantt view
- [ ] Status management

**Gallery Management:**

- [ ] Manage portfolio photos
- [ ] Bulk upload photos
- [ ] Edit photo metadata
- [ ] Organize by category/tags

**Estimate:** 2 weeks

---

### Phase 4: Blog & CMS (Weeks 7-8)

**Blog System:**

- [ ] Blog post editor (rich text)
- [ ] Create/edit/delete posts
- [ ] Draft/publish workflow
- [ ] Slug generation
- [ ] Public blog pages
- [ ] Related posts suggestions

**SEO:**

- [ ] Meta tags implementation
- [ ] Sitemap generation
- [ ] Robots.txt setup
- [ ] Structured data (Schema.org)

**Estimate:** 2 weeks

---

### Phase 5: Polish & Deployment (Weeks 9+)

**Performance:**

- [ ] Image optimization review
- [ ] Bundle size analysis
- [ ] Caching strategies
- [ ] Database query optimization

**Testing:**

- [ ] Unit tests for utils
- [ ] Integration tests for APIs
- [ ] E2E tests for critical flows

**Deployment:**

- [ ] Deploy to Vercel
- [ ] Set up CI/CD pipeline
- [ ] Configure custom domain
- [ ] SSL certificate

**Documentation:**

- [ ] API documentation
- [ ] User guide for photographer
- [ ] Deployment guide

**Estimate:** 2+ weeks

---

### Total Estimate

**10-14 weeks** for full implementation (depending on customization & complexity)

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Google Drive API
GOOGLE_DRIVE_FOLDER_ID=your-main-drive-folder-id
GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json
# OR for OAuth:
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-secret
GOOGLE_REFRESH_TOKEN=your-refresh-token

# Email (for contact form)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Image CDN
NEXT_PUBLIC_IMAGE_DOMAIN=drive.google.com

# Vercel
VERCEL_PROJECT_ID=your-project-id
VERCEL_ORG_ID=your-org-id
```

---

## Key Considerations

### Security

- [ ] Enable RLS on all tables
- [ ] Use httpOnly cookies for JWT
- [ ] Validate all inputs server-side
- [ ] Rate limit API endpoints
- [ ] Never expose Supabase service role key to client

### Performance

- [ ] Use Next.js Image for automatic optimization
- [ ] Implement ISR for blog posts
- [ ] Cache API responses with SWR/TanStack Query
- [ ] Lazy load components
- [ ] Optimize bundle size

### SEO

- [ ] Add meta tags to all pages
- [ ] Generate sitemap dynamically
- [ ] Use descriptive URLs (slugs)
- [ ] Add structured data (JSON-LD)
- [ ] Ensure mobile responsiveness

### Scalability

- [ ] Use database indexes on frequently queried fields
- [ ] Implement pagination for large datasets
- [ ] Consider CDN for large files
- [ ] Monitor Supabase usage
- [ ] Set up analytics

---

## Testing Strategy

### Unit Tests

```typescript
// lib/__tests__/validators.test.ts
- Test validation schemas
- Input edge cases

// lib/__tests__/utils.test.ts
- Test utility functions
- Date parsing, string formatting, etc.
```

### Integration Tests

```typescript
// __tests__/api/gallery.test.ts
- Test API endpoints
- Auth requirements
- Database interactions

// __tests__/api/projects.test.ts
- CRUD operations
- Status updates
- Photo uploads
```

### E2E Tests

```typescript
// e2e/portfolio.spec.ts
- Browse public gallery
- Submit contact form

// e2e/dashboard.spec.ts
- Login flow
- Create project
- Upload photos
- Edit content
```

---

## Next Steps

1. **Start with Phase 1:** Set up Next.js, Supabase, authentication
2. **Build Phase 2:** Get the public site live quickly
3. **Phase 3:** Develop admin dashboard
4. **Iterate:** Get photographer feedback before major features
5. **Polish:** Optimize, test, deploy

Each phase should be deployable independently to Vercel for early feedback.

---

**Need clarification on any specific feature? Let me know!**
