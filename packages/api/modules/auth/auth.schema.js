import schema from 'fluent-schema';
import { shortText, email, password } from '../shared/common.schema.js';

export const login = {
  body: schema
    .object()
    .title('Login')
    .description('Create a jwt token from email and password')
    .prop('email', email.required())
    .prop('password', password.required())
    .valueOf(),
}

export const register = {
  body: schema
    .object()
    .title('Register')
    .description('Create a new user')
    .prop('email', email.required())
    .prop('password', password.required())
    .prop('firstName', shortText)
    .prop('lastName', shortText)
    .valueOf(),
}

export const recovery = {
  body: schema
    .object()
    .prop('email', email.required())
    .valueOf(),
}

export const resetPassword = {
  body: schema
    .object()
    .title('Reset Password')
    .prop('password', password.required())
    .valueOf(),
}
