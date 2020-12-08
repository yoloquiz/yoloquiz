import { isEmpty, size } from 'lodash-es';
import isEmail from 'validator/es/lib/isEmail';

export const getIsRequiredRule = (errorMessage) => (inputValue) =>
  !isEmpty(inputValue) || errorMessage || 'Le champ est nécessaire';

export const getIsEmailRule = (errorMessage) => (inputValue) =>
  (!isEmpty(inputValue) && isEmail(inputValue)) || errorMessage || 'Le champ doit être une adresse email valide';

export const getIsLengthRule = (errorMessage, minLength = 8) => (inputValue) =>
  (!isEmpty(inputValue) && size(inputValue) >= minLength) ||
  errorMessage ||
  `Le champ doit faire au moins ${minLength} caractères`;
