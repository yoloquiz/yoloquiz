import mailgun from 'mailgun-js';
import isEmpty from 'lodash/isEmpty.js';
import config from '../../config/index.js';

export function sendEmail({
  subject,
  to,
  from = config.mailgun.from,
  email: { text, html },
}) {
  if (isEmpty(config.mailgun.apiKey)) return;

  const instance = mailgun({
    host: 'api.eu.mailgun.net',
    apiKey: config.mailgun.apiKey,
    domain: config.mailgun.domain,
  });
  instance.messages().send({
    subject,
    to,
    from,
    text,
    html,
  }).catch(() => {});
}