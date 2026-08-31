const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendNewsAlertEmail = async (toEmail, articles) => {
  if (!articles.length) return;

  const listHtml = articles
    .map(
      (a) =>
        `<li><a href="${a.url}" target="_blank">${a.title}</a> ${
          a.category ? `<em>(${a.category})</em>` : ''
        }</li>`
    )
    .join('');

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: 'Your News Alerts',
    html: `<h2>Latest News Updates</h2><ul>${listHtml}</ul>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Alert email sent to ${toEmail}`);
  } catch (err) {
    console.error(`Failed to send email to ${toEmail}:`, err.message);
  }
};

module.exports = { sendNewsAlertEmail };
