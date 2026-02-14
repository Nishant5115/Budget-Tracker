# Resend Email Setup Guide

## Migration Summary
✅ Successfully migrated from **Nodemailer** to **Resend** email service for BudgetTracker.

## What Changed

### Removed
- ❌ Nodemailer dependency
- ❌ Gmail SMTP credentials (EMAIL_USER, EMAIL_PASS)

### Added
- ✅ Resend SDK
- ✅ Resend API Key

## Setup Instructions

### Step 1: Get Resend API Key
1. Go to [Resend.com](https://resend.com)
2. Sign up for a free account
3. Go to **API Keys** section
4. Copy your API Key

### Step 2: Update Environment Variables

Update your `.env` file:

```env
PORT=5000
MONGO_URI=mongodb+srv://nishantrajput5115_db_user:QVqYRjmighZIC4qQ@budget-tracker.zpp6buh.mongodb.net/
JWT_SECRET=supersecretkey123
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
```

### Step 3: Verify Installation

Resend is already installed:
```bash
npm list resend
```

### Step 4: Test Email Functionality

#### Test OTP Email
**POST** `http://localhost:5000/api/auth/send-otp`

**Body:**
```json
{
  "email": "your-email@example.com"
}
```

**Expected Response:**
```json
{
  "message": "OTP sent successfully",
  "email": "your-email@example.com",
  "expiresIn": "10 minutes"
}
```

**Console Log:**
```
✅ OTP sent successfully to: your-email@example.com
📧 Resend response: { id: "..." }
```

#### Test Other Notifications
- Create transaction → Transaction email sent
- Create bill reminder → Bill reminder email sent
- Set budget → Budget confirmation email sent
- Create savings goal → Savings goal email sent

## Email Configuration

### From Email Address
All emails sent from: `noreply@budgettracker.dev`

To customize this, edit:
- [backend/utils/emailService.js](backend/utils/emailService.js) - Line 5
- [backend/controllers/authController.js](backend/controllers/authController.js) - Line 8

### Email Templates
Professional HTML templates included for:
- ✅ OTP Login
- ✅ Bill Reminders
- ✅ Bill Payments
- ✅ Transactions
- ✅ Budgets
- ✅ Savings Goals

## Troubleshooting

### Issue: "RESEND_API_KEY not configured"

**Solution:**
1. Check `.env` file has `RESEND_API_KEY`
2. Restart backend server: `npm run dev`
3. Check console logs for correct API key

### Issue: "Failed to send OTP email"

**Solution:**
1. Verify API key is correct
2. Check email address is valid
3. Check Resend dashboard for rate limits
4. View backend console for error details

### Issue: Emails not receiving

**Solution:**
1. Check spam/junk folder
2. Verify email address is correct
3. Check Resend sending logs: https://resend.com/emails
4. Ensure API key has email sending permission

## Deployment to Render

1. Go to Render Dashboard
2. Select your backend service
3. Go to **Settings** → **Environment**
4. Add variable:
   - Key: `RESEND_API_KEY`
   - Value: Your API key from step 1

5. Redeploy your application

## API Key Security

⚠️ **Important:**
- Never commit `.env` file to Git
- Keep API key private
- Rotate keys regularly
- Use different keys for dev/production

## Testing Locally vs Production

### Local Testing
```bash
cd backend
npm run dev
```

Uses local `.env` file with RESEND_API_KEY

### Production (Render)
Uses environment variables set in Render dashboard

## Files Modified

- ✏️ [backend/utils/emailService.js](backend/utils/emailService.js)
- ✏️ [backend/controllers/authController.js](backend/controllers/authController.js)
- ✏️ `.env` (Update with RESEND_API_KEY)

## Additional Notes

- Resend provides 100 emails/day free tier
- Professional domain verification needed for custom "from" email
- Webhooks available for bounce/delivery tracking
- Detailed logs available in Resend dashboard

---

For more info: [Resend Documentation](https://resend.com/docs)
