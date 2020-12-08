import fs from 'fs';
import path from 'path';
import ejs from 'ejs';
import * as emailApi from './emails.api.js';

async function attemptRenderEmail({ template, type, options }) {
  try {
    const filePath = path.resolve(process.cwd(), 'modules/emails/templates/', `${template}.${type}.ejs`);
    fs.accessSync(filePath, fs.F_OK);
    return ejs.renderFile(filePath, options);
  } catch (err) {
    return;
  }
}

async function renderEmail({ template, options }) {
  const html = await attemptRenderEmail({
    type: 'html',
    template,
    options,
  });
  const text = await attemptRenderEmail({
    type: 'text',
    template,
    options,
  });
  return { html, text };
}

export async function sendEventInvitation({ fromUser, toUser, event, joinUrl }) {
  const email = await renderEmail({
    template: 'eventInvitation',
    options: { fromUser, event, joinUrl },
  });

  return emailApi.sendEmail({
    subject: `${fromUser.firstName || 'On'} vous a invité sur Gifty`,
    to: toUser.email,
    email,
  });
}

export async function sendWelcomeToApp({ toUser, confirmUrl }) {
  const email = await renderEmail({
    template: 'welcomeToApp',
    options: { confirmUrl },
  });
  
  return emailApi.sendEmail({
    subject: 'Bienvenue sur Gifty 👋',
    to: toUser.email,
    email,
  });
}

export async function sendCongratsForUserFirstEvent({ toUser, eventUrl }) {
  const email = await renderEmail({
    template: 'congratsForUserFirstEvent',
    options: { eventUrl },
  });
  
  return emailApi.sendEmail({
    subject: 'Youhou ! Votre premier événement sur Gifty 🎉',
    to: toUser.email,
    email,
  });
}

export async function sendSecretSantaAlert({ eventUrl, event, toUser }) {
  const email = await renderEmail({
    template: 'secretSantaAlert',
    options: { event, eventUrl },
  });
  
  return emailApi.sendEmail({
    subject: '🎁 Pssssst ! Vous êtes le Père Noël secret de ...',
    to: toUser.email,
    email,
  });
}

export async function sendResetPassword({ toUser, resetUrl }) {
  const email = await renderEmail({
    template: 'resetPassword',
    options: { resetUrl },
  });
  
  return emailApi.sendEmail({
    subject: '🔐 Réinitialisation des accès sur Gifty',
    to: toUser.email,
    email,
  });
}