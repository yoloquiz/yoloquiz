import jwt from 'jsonwebtoken';

export async function getUserFromAuthPayload({ email, password }) {
  let user = usersService.findOneByEmail(email);

  if (!user) {
    throw new Error('Cannot find user with this email!');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if (!isPasswordValid) {
    throw new Error('Cannot find user with this email!');
  }

  return user;
}

export function getAccessToken({ user }) {
  return jwt.sign({ userId: user._id }, config.secret, { expiresIn: '1M' });
}
