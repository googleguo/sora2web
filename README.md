# Sora AI Video Generator 

A modern AI video generation platform built with Next.js and Tailwind CSS, featuring text-to-video and image-to-video capabilities with integrated payment processing.

## Features

- **Video Generation**
  - Text-to-video generation
  - Image-to-video generation with upload support
  - Real-time task status polling
  - Multiple aspect ratios (16:9, 9:16, 1:1, 4:3)
  - Variable duration (10s, 15s, 25s)
  - Video history tracking

- **Authentication**
  - GitHub OAuth via Supabase
  - Google OAuth via Supabase
  - Protected routes and user sessions

- **Payment Integration**
  - Creem payment processing
  - Multiple subscription tiers
  - Monthly and yearly billing options
  - Automated checkout flow

- **Additional Features**
  - Example showcase
  - User testimonials
  - FAQ section
  - Pricing page with live checkout

## Tech Stack

- Next.js 16.0.7
- React 19.1.0
- Tailwind CSS v4
- TypeScript
- Shadcn UI Components
- Supabase (Authentication & Storage)
- Creem (Payments)

## Setup

### 1. Clone and Install

\`\`\`bash
git clone <repository-url>
cd sora-clone
npm install
\`\`\`

### 2. Environment Variables

Copy `.env.local.example` to `.env.local` and configure:

\`\`\`bash
# Sora API Configuration
SORA_API_KEY=your_api_key_here

# Creem Payment Configuration
CREEM_API_KEY=your_creem_api_key_here
CREEM_WEBHOOK_SECRET=your_webhook_secret_here
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase Configuration (automatically provided by integration)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

### 3. Configure Integrations

#### Sora API
1. Get API key from [Duomi API]
2. Add to `SORA_API_KEY` in environment variables

#### Creem Payments
1. Sign up at [Creem]
2. Create products for each pricing tier (see `CREEM_SETUP.md`)
3. Update product IDs in `components/pricing-cards.tsx`
4. Add API key to environment variables

#### Supabase
1. Create project at [Supabase](https://supabase.com)
2. Enable GitHub and Google OAuth providers
3. Create storage bucket named "video-images" (see `STORAGE_SETUP.md`)
4. Configure environment variables

### 4. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the application.

## API Endpoints

### Video Generation
- `POST /api/generate-video` - Create video generation task
- `GET /api/check-video-status?taskId={id}` - Check task status
- `POST /api/upload-image` - Upload image for image-to-video
- `POST /api/remix-video` - Re-edit existing video

### Payments
- `POST /api/create-checkout` - Create Creem checkout session
- `POST /api/webhooks/creem` - Handle Creem webhook events

### Authentication
- `/auth/login` - OAuth login page
- `/auth/callback` - OAuth callback handler
- `/auth/auth-code-error` - OAuth error page

## Project Structure

\`\`\`
├── app/
│   ├── api/                    # API routes
│   ├── auth/                   # Authentication pages
│   ├── generate/               # Video generation page
│   ├── history/                # Video history page
│   ├── pricing/                # Pricing and success pages
│   └── page.tsx                # Homepage
├── components/
│   ├── ui/                     # Shadcn UI components
│   ├── *-form.tsx              # Form components
│   └── *.tsx                   # Page components
├── lib/
│   ├── supabase/               # Supabase client utilities
│   └── video-history.ts        # Video history management
└── middleware.ts               # Authentication middleware
\`\`\`

## Documentation

- `CREEM_SETUP.md` - Creem payment integration guide
- `STORAGE_SETUP.md` - Supabase storage configuration

## Technical Support
- Please add WeChat: luckgather

## License

MIT
