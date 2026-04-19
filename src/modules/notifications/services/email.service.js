const nodemailer = require('nodemailer');
const logger = require('../../../utils/logger');

class EmailService {
  constructor() {
    // إعداد الـ Transporter باستخدام إعدادات النود ميلر الاساسية (يمكن تغييرها للـ Production)
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });
  }

  /**
   * إرسال بريد إلكتروني للتنبيه بقرب انتهاء الوثيقة
   */
  async sendExpiryAlert(userEmail, userName, documentTitle, daysLeft) {
    if (!process.env.EMAIL_USER) {
      logger.warn('[Email Service] Email credentials not configured. Skipping email sent to: ' + userEmail);
      return;
    }

    try {
      let subject = '';
      let message = '';

      if (daysLeft <= 0) {
        subject = `عاجل: وثيقتك (${documentTitle}) انتهت صلاحيتها!`;
        message = `مرحباً ${userName}،<br><br>نود تنبيهك بأن الوثيقة الخاصة بك <b>${documentTitle}</b> قد انتهت صلاحيتها بالفعل. الرجاء تجديدها في أقرب وقت لتفادي أي غرامات قانونية.<br><br>مع تحيات،<br>فريق موقع وَثِّق`;
      } else {
        subject = `تذكير: وثيقتك (${documentTitle}) ستنتهي قريباً`;
        message = `مرحباً ${userName}،<br><br>نود تذكيرك بأن الوثيقة الخاصة بك <b>${documentTitle}</b> ستنتهي خلال <b>${daysLeft}</b> أيام. الرجاء اتخاذ الإجراءات اللازمة لتجديدها.<br><br>مع تحيات،<br>فريق موقع وَثِّق`;
      }

      const mailOptions = {
        from: `"نظام وَثِّق للتنبيهات" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: subject,
        html: message,
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`[Email Service] Alert email sent to ${userEmail} (ID: ${info.messageId})`);
    } catch (error) {
      logger.error(`[Email Service Error] Failed to send email to ${userEmail}:`, error.message);
    }
  }
}

module.exports = new EmailService();
