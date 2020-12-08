import schema from 'fluent-schema';

export const email = schema
  .string()
  .format(schema.FORMATS.EMAIL);

export const password = schema
  .string()
  .minLength(8);

export const shortText = schema
  .string()
  .maxLength(255);

export const id = schema
  .string()
  .minLength(24)
  .maxLength(24);

export const date = schema
  .string()
  .format(schema.FORMATS.DATE_TIME);
