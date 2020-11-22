import { isEmpty } from 'lodash-es';
import isEmail from 'validator/es/lib/isEmail';

export const getIsRequiredRule = (errorMessage) => (inputValue) =>
  !isEmpty(inputValue) || errorMessage || 'Le champs est nécessaire';

export const getIsEmailRule = (errorMessage) => (inputValue) =>
  (!isEmpty(inputValue) && isEmail(inputValue)) || errorMessage || 'Le champs doit être une adresse email valide';
