export const getWelcomeTemplate = (url) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
</head>
<body style="margin: 0; padding: 20px; background-color: #ffffff; font-family: Arial, sans-serif;">
    <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; border-collapse: collapse;">
        <tr>
            <td style="padding: 0;">
                <!-- Header -->
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 30px 20px; text-align: center; background-color: #f8f9fa; border: 1px solid #e9ecef;">
                            <h1 style="color: #333333; margin: 0; font-size: 24px; font-weight: normal;">
                                Visa Verify
                            </h1>
                        </td>
                    </tr>
                </table>
                
                <!-- Main Content -->
                <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #ffffff; border-left: 1px solid #e9ecef; border-right: 1px solid #e9ecef;">
                    <tr>
                        <td style="padding: 30px 20px;">
                            <h2 style="color: #333333; font-size: 20px; margin: 0 0 20px 0;">
                                Please verify your email address
                            </h2>
                            
                            <p style="color: #555555; font-size: 16px; line-height: 1.5; margin: 0 0 20px 0;">
                                Thank you for registering with Visa Verify. Please click the button below to verify your email address and activate your account.
                            </p>
                            
                            <!-- CTA Button -->
                            <table role="presentation" style="margin: 25px 0;">
                                <tr>
                                    <td style="text-align: center;">
                                        <a href="${url}" 
                                           style="display: inline-block; 
                                                  padding: 12px 25px; 
                                                  background-color: #0066cc; 
                                                  color: #ffffff; 
                                                  text-decoration: none; 
                                                  border-radius: 4px; 
                                                  font-size: 16px;">
                                            Verify Email
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="color: #555555; font-size: 14px; line-height: 1.5; margin: 20px 0 0 0;">
                                If you cannot click the button above, please copy and paste this link into your web browser:
                            </p>
                            
                            <p style="color: #0066cc; font-size: 14px; word-break: break-all; margin: 10px 0 20px 0; padding: 10px; background-color: #f8f9fa; border: 1px solid #e9ecef;">
                                ${url}
                            </p>
                            
                            <p style="color: #666666; font-size: 14px; line-height: 1.5; margin: 20px 0 0 0;">
                                This link will expire in 24 hours.
                            </p>
                            
                            <p style="color: #666666; font-size: 14px; line-height: 1.5; margin: 10px 0 0 0;">
                                If you did not create an account, please ignore this email.
                            </p>
                        </td>
                    </tr>
                </table>
                
                <!-- Footer -->
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 20px; text-align: center; background-color: #f8f9fa; border: 1px solid #e9ecef; border-top: none;">
                            <p style="color: #555555; font-size: 14px; margin: 0 0 10px 0;">
                                Best regards,<br>
                                The Visa Verify Team
                            </p>
                            
                            <p style="color: #888888; font-size: 12px; margin: 10px 0 0 0;">
                                This is an automated email. Please do not reply.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

export const getForgotPasswordTemplate = (url) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Request</title>
</head>
<body style="margin: 0; padding: 20px; background-color: #ffffff; font-family: Arial, sans-serif;">
    <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; border-collapse: collapse;">
        <tr>
            <td style="padding: 0;">
                <!-- Header -->
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 30px 20px; text-align: center; background-color: #f8f9fa; border: 1px solid #e9ecef;">
                            <h1 style="color: #333333; margin: 0; font-size: 24px; font-weight: normal;">
                                Visa Verify
                            </h1>
                        </td>
                    </tr>
                </table>
                
                <!-- Main Content -->
                <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #ffffff; border-left: 1px solid #e9ecef; border-right: 1px solid #e9ecef;">
                    <tr>
                        <td style="padding: 30px 20px;">
                            <h2 style="color: #333333; font-size: 20px; margin: 0 0 20px 0;">
                                Password Reset Request
                            </h2>
                            
                            <p style="color: #555555; font-size: 16px; line-height: 1.5; margin: 0 0 20px 0;">
                                We received a request to reset the password for your Visa Verify account. Click the button below to create a new password.
                            </p>
                            
                            <!-- CTA Button -->
                            <table role="presentation" style="margin: 25px 0;">
                                <tr>
                                    <td style="text-align: center;">
                                        <a href="${url}" 
                                           style="display: inline-block; 
                                                  padding: 12px 25px; 
                                                  background-color: #dc3545; 
                                                  color: #ffffff; 
                                                  text-decoration: none; 
                                                  border-radius: 4px; 
                                                  font-size: 16px;">
                                            Reset Password
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="color: #555555; font-size: 14px; line-height: 1.5; margin: 20px 0 0 0;">
                                If you cannot click the button above, please copy and paste this link into your web browser:
                            </p>
                            
                            <p style="color: #dc3545; font-size: 14px; word-break: break-all; margin: 10px 0 20px 0; padding: 10px; background-color: #f8f9fa; border: 1px solid #e9ecef;">
                                ${url}
                            </p>
                            
                            <p style="color: #666666; font-size: 14px; line-height: 1.5; margin: 20px 0 0 0;">
                                This password reset link will expire in 1 hour for security reasons.
                            </p>
                            
                            <!-- Security Notice -->
                            <table role="presentation" style="width: 100%; margin: 20px 0; background-color: #fff3cd; border: 1px solid #ffeaa7;">
                                <tr>
                                    <td style="padding: 15px;">
                                        <p style="color: #856404; font-size: 14px; margin: 0; line-height: 1.5;">
                                            <strong>Security Notice:</strong> If you did not request a password reset, please ignore this email. Your password will remain unchanged. For your account security, consider changing your password if you suspect unauthorized access.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                
                <!-- Footer -->
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 20px; text-align: center; background-color: #f8f9fa; border: 1px solid #e9ecef; border-top: none;">
                            <p style="color: #555555; font-size: 14px; margin: 0 0 10px 0;">
                                Best regards,<br>
                                The Visa Verify Team
                            </p>
                            
                            <p style="color: #888888; font-size: 12px; margin: 10px 0 0 0;">
                                This is an automated security email. Please do not reply.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;
