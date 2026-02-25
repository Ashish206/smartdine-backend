const nodemailer = require('nodemailer');
const logger = require('../config/logger');
const { getWelcomeTemplate, getForgotPasswordTemplate } = require('../constants/emailTemplates');

/**
 * Email utility for sending various types of emails
 */
class EmailUtil {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      secure: true,
    });
  }

  /**
   * Send email
   * @param {Object} options - Email options
   * @param {string} options.to - Recipient email
   * @param {string} options.subject - Email subject
   * @param {string} options.text - Plain text content
   * @param {string} options.html - HTML content
   * @returns {Promise}
   */
  async send(options) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      };

      const info = await this.transporter.sendMail(mailOptions);

      logger.info('Email sent successfully', {
        messageId: info.messageId,
        to: options.to,
        subject: options.subject,
      });
    } catch (error) {
      logger.error(`Email send error:[${options.to}][${options.subject}]`, error);
    }
  }

  /**
   * Send welcome email (fire and forget)
   * @param {Object} email - Email address of the user
   * @param {string} verificationToken - Email verification token
   */
  sendWelcome(email, url) {
    // Fire and forget - don't await or return promise
    this.send({
      to: email,
      subject: 'Welcome! Please verify your email',
      text: `Welcome to our platform! Please verify your email by clicking: ${url}`,
      html: getWelcomeTemplate(url),
    }).catch((error) => {
      // Log error but don't throw to avoid affecting the main flow
      logger.error('Failed to send welcome email', { email, error: error.message });
    });
  }

  /**
   * Send password reset email (fire and forget)
   * @param {Object} email - Email address of the user
   * @param {string} resetToken - Password reset token
   */
  sendPasswordReset(email, url) {
    // Fire and forget - don't await or return promise
    this.send({
      to: email,
      subject: 'Password Reset Request',
      text: `To reset your password, click: ${url}. If you didn't request this, please ignore this email.`,
      html: getForgotPasswordTemplate(url),
    }).catch((error) => {
      // Log error but don't throw to avoid affecting the main flow
      logger.error('Failed to send password reset email', { email, error: error.message });
    });
  }
}

// Create and export singleton instance
const emailUtil = new EmailUtil();
module.exports = emailUtil;
