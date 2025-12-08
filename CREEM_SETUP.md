# Creem Payment Integration Setup

This guide explains how to set up and use the Creem payment integration for VideoForge AI.

## Environment Variables

Add these to your `.env.local` or Vercel environment variables:

\`\`\`bash
CREEM_API_KEY=your_creem_api_key
CREEM_WEBHOOK_SECRET=your_webhook_secret
\`\`\`

## Database Setup

Run the SQL migration scripts to create the necessary tables:

1. `scripts/01_create_users_table.sql` - User profiles with credits
2. `scripts/02_create_transactions_table.sql` - Payment transaction history
3. `scripts/03_create_subscriptions_table.sql` - Active subscriptions
4. `scripts/04_create_credit_history_table.sql` - Credit usage tracking
5. `scripts/05_create_functions.sql` - Database functions for credit management

Run these in your Supabase SQL Editor or use the v0 script runner.

## Features

### 1. Subscription Plans
- Monthly, Yearly, and One-Time payment options
- Four tiers: Starter, Basic, Pro, Max
- Automatic credit allocation
- Credit rollover for subscriptions

### 2. One-Time Purchases
- Credits never expire
- No recurring billing
- Instant access

### 3. Credit System
- Credits are added automatically after payment
- Deducted when generating videos
- Full transaction history
- Real-time balance updates

### 4. Webhook Handling
The webhook at `/api/webhooks/creem` handles:

- `checkout.completed` - Process one-time purchases
- `subscription.created` - Activate new subscriptions
- `subscription.updated` - Handle renewals and changes
- `subscription.cancelled` - Process cancellations
- `transaction.paid` - Update payment records

All webhooks include:
- Signature verification for security
- Database updates
- Email notifications
- Credit management

## Webhook Configuration

In your Creem dashboard:

1. Set webhook URL: `https://yourdomain.com/api/webhooks/creem`
2. Enable events: `checkout.completed`, `subscription.*`, `transaction.paid`
3. Copy webhook secret to `CREEM_WEBHOOK_SECRET`

## Credit Pricing

Default credit allocations per plan:
- Starter: 249 credits (~10 videos)
- Basic: 749 credits (~30 videos)
- Pro: 1,499 credits (~60 videos)
- Max: 2,249 credits (~90 videos)

Adjust in the webhook handler if needed.

## Email Notifications

Email service is configured in `lib/email.ts`. Currently logs to console.

To enable actual emails, integrate with:
- Resend
- SendGrid
- AWS SES
- Or any SMTP service

## Testing

Use Creem test mode for development:
1. Create test products in Creem dashboard
2. Use test API keys
3. Test webhook with Creem's webhook testing tool

## Production Checklist

- [ ] Add production Creem API keys
- [ ] Configure webhook URL in Creem dashboard
- [ ] Test webhook signature verification
- [ ] Set up email service
- [ ] Run database migrations
- [ ] Test complete purchase flow
- [ ] Verify credit allocation
- [ ] Test subscription renewal
- [ ] Test cancellation flow

## Support

For Creem-specific issues, refer to: https://docs.creem.io
For VideoForge AI support: support@videoforge.ai
