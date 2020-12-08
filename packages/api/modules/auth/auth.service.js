import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import * as usersService from '../users/users.service.js';
import * as emailsService from '../emails/emails.service.js';
import config from '../../config/index.js';

export async function isUserPasswordValid({ user, password }) {

  if (!user) {
    throw new Error('Cannot find user with this email!');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if (!isPasswordValid) {
    throw new Error('Cannot find user with this email!');
  }

  return user;
}

export function getAccessToken({ userId, expiresIn = '30 days', ...options }) {
  return jwt.sign({ ...options, userId }, config.secret, { expiresIn });
}

export async function authenticateUserFromToken({ token }) {
  const { userId } = jwt.verify(token, config.secret);

  return usersService.findOneById({ userId });
}

export function getConfirmAccountUrl({ userId }) {
  const accessToken = getAccessToken({ userId });
  return `${config.apiUrl}/api/auth/confirm?token=${accessToken}`;
}

export async function registerUser({
  email,
  password,
  firstName,
  lastName,
}) {
  const user = await usersService.findOneByEmail({ email });

  if (user) {
    throw new Error('Email is already taken. Please try to login instead.');
  }

  const newUser = await usersService.createOneUser({
    email,
    password,
    firstName,
    lastName,
  });

  const confirmUrl = getConfirmAccountUrl({ userId: newUser._id });

  await emailsService.sendWelcomeToApp({ toUser: newUser, confirmUrl });
}

function getResetUrl({ userId }) {
  const accessToken = getAccessToken({ userId });
  return `${config.appUrl}/auth?token=${accessToken}&redirect=/reset-password`;
}

export async function sendResetPasswordEmail({ email }) {
  const user = await usersService.findOneByEmail({ email });
  if (user) return;

  const resetUrl = getResetUrl({ userId: user._id });
  await emailsService.sendResetPassword({ toUser: newUser, resetUrl });  
}

export async function confirmAccount({ userId }) {
  const user = await usersService.findOneById({ userId });
  user.confirmed = true;
  await user.save();
}