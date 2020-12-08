import _ from 'lodash';
import axios from 'axios';
import bcrypt from 'bcrypt';
import usersModel from './users.model.js';

export function findOneByEmail({ email }) {
  return usersModel.findOne({ email }).select('-password');
}

export function findOneById({ userId }) {
  return usersModel.findOne({ _id: userId }).select('-password');
}

export async function createOneUser({
  email,
  password,
  firstName,
  lastName,
  googleId,
  confirmed = false,
  googleAccessToken,
  googleRefreshToken,
  facebookAccessToken,
  facebookRefreshToken,
}) {
  const hashedPassword = await bcrypt.hash(password, 12);
  return usersModel.create({
    email,
    password: hashedPassword,
    firstName,
    lastName,
    googleId,
    confirmed,
    googleAccessToken,
    googleRefreshToken,
    facebookAccessToken,
    facebookRefreshToken,
  });
}

export async function findOneOrCreateFromEmail({ email }) {
  const user = await findOneByEmail({ email });
  if (user) return { user, newAccount: false };

  const password = _.times(20, () => _.sample('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')).join('');
  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = await createOneUser({
    email,
    password: hashedPassword,
  })

  return { user: newUser, isNewAccount: true };
}

export async function findOneOrCreateFromGoogleProfile({ googleProfile, accessToken, refreshToken }) {
  if (!googleProfile.id) return undefined;

  const userFromGoogle = await usersModel.findOne({ googleId: googleProfile.id });
  if (userFromGoogle) {
    userFromGoogle.googleAccessToken = accessToken;
    userFromGoogle.googleRefreshToken = refreshToken;
    userFromGoogle.confirmed = true;
    await userFromGoogle.save();
    return userFromGoogle;
  }

  const { id: googleId, emails, name } = googleProfile;

  const firstName = _.get(name, 'givenName');
  const lastName = _.get(name, 'familyName');
  const email = _.get(emails, '0.value');

  if (!email) return undefined;

  const userFromEmail = await findOneByEmail({ email });
  if (userFromEmail) {
    userFromEmail.googleId = googleId;
    userFromEmail.googleAccessToken = accessToken;
    userFromEmail.googleRefreshToken = refreshToken;
    userFromEmail.confirmed = true;
    await userFromEmail.save();
    return userFromEmail;
  }

  const password = _.times(20, () => _.sample('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')).join('');

  return createOneUser({
    email,
    firstName,
    lastName,
    googleId,
    googleAccessToken: accessToken,
    googleRefreshToken: refreshToken,
    password,
    confirmed: true,
  })
}

async function fetchFacebookProfile({ accessToken }) {
  try {
    const { data } = await axios.get(`https://graph.facebook.com/v9.0/me?fields=id%2Clast_name%2Cfirst_name%2Cemail&access_token=${accessToken}`);
    return {
      ...data,
      firstName: data.first_name,
      lastName: data.last_name,
    };
  } catch {
    return {};
  }
}

export async function findOneOrCreateFromFacebookProfile({ facebookProfile, accessToken, refreshToken }) {
  if (!facebookProfile.id) return undefined;

  const userFromFacebook = await usersModel.findOne({ facebookId: facebookProfile.id });
  if (userFromFacebook) {
    userFromFacebook.facebookAccessToken = accessToken;
    userFromFacebook.facebookRefreshToken = refreshToken;
    userFromFacebook.confirmed = true;
    await userFromFacebook.save();
    return userFromFacebook;
  }
  
  const { id: facebookId, firstName, lastName, email } = await fetchFacebookProfile({ accessToken });

  if (!email) return undefined;

  const userFromEmail = await findOneByEmail({ email });
  if (userFromEmail) {
    userFromEmail.facebookId = facebookId;
    userFromEmail.facebookAccessToken = accessToken;
    userFromEmail.facebookRefreshToken = refreshToken;
    userFromEmail.confirmed = true;
    await userFromEmail.save();
    return userFromEmail;
  }

  const password = _.times(20, () => _.sample('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')).join('');

  return createOneUser({
    email,
    firstName,
    lastName,
    facebookId,
    facebookAccessToken: accessToken,
    facebookRefreshToken: refreshToken,
    password,
    confirmed: true,
  })
}

export async function updatePassword({ userId, password }) {
  const hashedPassword = await bcrypt.hash(password, 12);
  await usersModel.updateOne({ _id: userId }, {
    $set: {
      confirmed: true,
      password: hashedPassword,
    }
  });
}

export async function updateProfile({ userId, firstName, lastName }) {
  await usersModel.updateOne({ _id: userId }, {
    $set: {
      firstName,
      lastName,
    }
  });
}

export async function flagUserUnreachableForEmail({ email }) {
  await usersModel.findOneAndUpdate({
    email,
    confirmed: { $ne: true },
  }, {
    $set: { unreachable: true },
  });
}
