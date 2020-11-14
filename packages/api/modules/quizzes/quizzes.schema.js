import schema from 'fluent-schema';

export const createOneQuizSchema = {
  body: schema
    .object()
    .title('Create a quiz')
    .description('Allow you to create an empty quiz')
    .prop('name', schema
      .string()
      .maxLength(255)
      .required())
    .valueOf()
};
