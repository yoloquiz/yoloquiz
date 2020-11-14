import schema from 'fluent-schema';

const text = schema
  .string()
  .required();

const email = schema
  .string()
  .format(schema.FORMATS.EMAIL)
  .required();

const password = schema
  .string()
  .minLength(8)
  .required();

export const login = {
  body: schema
    .object()
    .title('Login')
    .description('Create a jwt token from email and password')
    .prop('email', email)
    .prop('password', password)
    .valueOf(),
}

export const register = {
  body: schema
    .object()
    .title('Register')
    .description('Create a new user')
    .prop('email', email)
    .prop('password', password)
    .prop('firstName', text.required())
    .prop('lastName', text.required())
    .valueOf(),
}