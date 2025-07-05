# Email Setup Guide for Partner Approval System

This guide explains how to set up email notifications for the partner approval system.

## Environment Variables

Add the following variables to your `.env` file in the root directory:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:5173
```

## Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Navigate to Security
   - Under "2-Step Verification", click "App passwords"
   - Generate a new app password for "Mail"
   - Use this password in your `EMAIL_PASSWORD` environment variable

## Alternative Email Services

You can modify the email service configuration in `Backend/Config/emailService.js`:

### Outlook/Hotmail
```javascript
const transporter = nodemailer.createTransporter({
  service: 'outlook',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
```

### Yahoo
```javascript
const transporter = nodemailer.createTransporter({
  service: 'yahoo',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
```

### Custom SMTP
```javascript
const transporter = nodemailer.createTransporter({
  host: 'your-smtp-host.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
```

## Testing Email Configuration

You can test your email configuration by adding this route to your backend:

```javascript
// Add this to your routes for testing
app.get('/test-email', async (req, res) => {
  try {
    const result = await sendEmail('test@example.com', 'partnerApproved', {
      partnerName: 'Test Partner',
      companyName: 'Test Company'
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Email Templates

The system includes two email templates:

1. **partnerApproved** - Sent when a partner is approved
2. **partnerRejected** - Sent when a partner is rejected

You can customize these templates in `Backend/Config/emailService.js`.

## Troubleshooting

### Common Issues

1. **Authentication Failed**: Make sure you're using an app password, not your regular Gmail password
2. **Connection Timeout**: Check your internet connection and firewall settings
3. **Email Not Sending**: Verify your email credentials and SMTP settings

### Debug Mode

Enable debug logging by adding this to your email service:

```javascript
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  debug: true, // Enable debug output
  logger: true // Log to console
});
```

## Security Notes

- Never commit your `.env` file to version control
- Use app passwords instead of regular passwords
- Consider using environment-specific email accounts for production
- Regularly rotate your email credentials 