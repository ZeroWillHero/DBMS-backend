const nodemailer = require('nodemailer');

// Configure transporter (example: Gmail)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS  // your email password or app password
    }
});

/**
 * Send an email using nodemailer.
 * @param {Object} options
 * @param {string} options.to - Recipient email address.
 * @param {string} options.subject - Email subject.
 * @param {string} [options.text] - Plain text body.
 * @param {string} [options.html] - HTML body (optional).
 * @param {string} [options.from] - Sender email (optional, defaults to EMAIL_USER).
 * @returns {Promise}
 */
async function sendEmail({ to, subject, text, html, from }) {
    try {
        return await transporter.sendMail({
            from: from || process.env.EMAIL_USER,
            to,
            subject,
            text,
            html
        });
    } catch (error) {
        // Throw error to be handled in the controller
        const err = new Error('Failed to send email: ' + error.message);
        err.status = 500;
        throw err;
    }
}

module.exports = sendEmail;