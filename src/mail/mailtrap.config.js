const { MailtrapClient } = require('mailtrap');
require('dotenv').config();

const TOKEN = process.env.MAILTRAP_TOKEN;

const client = new MailtrapClient({
  token: TOKEN,
});

const sender = {
  email: 'educahub@yanlima.com',
  name: 'Educahub',
};

module.exports = {
  client,
  sender,
};
