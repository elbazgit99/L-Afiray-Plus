import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter for email sending
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can change this to other services like 'outlook', 'yahoo', etc.
  auth: {
    user: process.env.EMAIL_SERVICE || 'lafirayservice@gmail.com',
    pass: process.env.SERVICE_EMAIL_PASSWORD || 'kziwlialeklrqjvf'
  }
});

// Email templates
const emailTemplates = {
  partnerApproved: (partnerName, companyName) => ({
    subject: ' Your Partner Account Has Been Approved!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg,rgb(255, 255, 255) 0%,rgb(0, 0, 0) 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;"> 🎉 Welcome to L'Afiray!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your partner account has been approved</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${partnerName},</h2>
          
          <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
            Great news! Your partner account for <strong>${companyName}</strong> has been approved.
            You can now access all partner features and start managing your car parts inventory.
          </p>
          
          <div style="background: #e8f5e8; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <h3 style="color: #155724; margin: 0 0 10px 0;">✅ What you can do now:</h3>
            <ul style="color: #155724; margin: 0; padding-left: 20px;">
              <li>Access your partner dashboard</li>
              <li>Add car models and parts to your inventory</li>
              <li>Manage orders and sales reports</li>
              <li>Update your company profile</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" 
               style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
              Login to Your Dashboard
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">
            If you have any questions or need assistance, please don't hesitate to contact our support team.
          </p>
          
          <p style="color: #666; font-size: 14px; margin: 10px 0;">
            Best regards,<br>
            The L'Afiray Team
          </p>
        </div>
      </div>
    `
  }),
  
  partnerRejected: (partnerName, companyName) => ({
    subject: '❌ Partner Account Application Update',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Application Update</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Regarding your partner account application</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${partnerName},</h2>
          
          <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
            Thank you for your interest in becoming a partner with L'Afiray. After careful review of your application 
            for <strong>${companyName}</strong>, we regret to inform you that we are unable to approve your partner account at this time.
          </p>
          
          <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <h3 style="color: #856404; margin: 0 0 10px 0;">📝 What happens next:</h3>
            <ul style="color: #856404; margin: 0; padding-left: 20px;">
              <li>You can reapply in the future with updated information</li>
              <li>Consider reviewing your company details and documentation</li>
              <li>Ensure all required information is complete and accurate</li>
            </ul>
          </div>
          
          <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
            If you believe this decision was made in error or if you have additional information to provide, 
            please contact our support team for further assistance.
          </p>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">
            Thank you for your understanding.
          </p>
          
          <p style="color: #666; font-size: 14px; margin: 10px 0;">
            Best regards,<br>
            The L'Afiray Team
          </p>
        </div>
      </div>
    `
  }),

  passwordReset: (userName, resetCode) => ({
    subject: 'Password Reset Request - L\'Afiray.ma',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg,rgb(255, 255, 255) 0%,rgb(0, 0, 0) 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">🔐 Password Reset</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your L'Afiray.ma account</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${userName},</h2>
          
          <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
            We received a request to reset your password for your L'Afiray.ma account. 
            If you didn't make this request, you can safely ignore this email.
          </p>
          
          <div style="background: #e3f2fd; border-left: 4px solid #2196f3; padding: 20px; margin: 20px 0; border-radius: 5px; text-align: center;">
            <h3 style="color: #1565c0; margin: 0 0 15px 0;">Your Reset Code:</h3>
            <div style="background: #fff; border: 2px solid #2196f3; border-radius: 8px; padding: 15px; margin: 10px 0; display: inline-block; min-width: 200px;">
              <span style="font-size: 24px; font-weight: bold; color: #1565c0; letter-spacing: 3px;">${resetCode}</span>
            </div>
            <p style="color: #1565c0; margin: 10px 0 0 0; font-size: 14px;">
              Enter this code in the password reset form
            </p>
          </div>
          
          <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <h3 style="color: #856404; margin: 0 0 10px 0;">⚠️ Important:</h3>
            <ul style="color: #856404; margin: 0; padding-left: 20px;">
              <li>This code will expire in 10 minutes</li>
              <li>Do not share this code with anyone</li>
              <li>If you didn't request this reset, please ignore this email</li>
            </ul>
          </div>
          
          <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
            If you have any questions or need assistance, please contact our support team.
          </p>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">
            Best regards,<br>
            The L'Afiray Team
          </p>
        </div>
      </div>
    `
  })
};

// Send email function
export const sendEmail = async (to, template, data = {}) => {
  try {
    let emailTemplate;
    
    if (template === 'passwordReset') {
      emailTemplate = emailTemplates[template](data.userName, data.resetCode);
    } else {
      emailTemplate = emailTemplates[template](data.partnerName, data.companyName);
    }
    
    const mailOptions = {
      from: process.env.EMAIL_SERVICE || 'lafirayservice@gmail.com',
      to: to,
      subject: emailTemplate.subject,
      html: emailTemplate.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Test email configuration
export const testEmailConfig = async () => {
  try {
    await transporter.verify();
    console.log('Email configuration is valid');
    return true;
  } catch (error) {
    console.error('Email configuration error:', error);
    return false;
  }
};

export default { sendEmail, testEmailConfig }; 