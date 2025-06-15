const nodemailer = require('nodemailer')
const fs = require('fs')

const sendMail = async (toEmail, pdfPath) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  await transporter.sendMail({
    from: `"Contractor Quotes" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Your Contractor Quote',
    text: 'Attached is your quote.',
    attachments: [
      {
        filename: 'Quote.pdf',
        content: fs.createReadStream(pdfPath)
      }
    ]
  })
}

module.exports = sendMail
