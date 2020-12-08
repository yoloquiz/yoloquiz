import schema from 'fluent-schema';
import { id } from '../shared/common.schema.js';

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

export const updateQuestionSchema = {
  body: schema
    .object()
    .prop('_id', id)
    .prop('answers', schema
      .object()
      .prop('choices', schema
        .object()
        .prop('choices', schema
          .array()
          .items(schema
            .object()
            .prop('text', schema.string().required())
            .prop('isCorrectAnswer', schema.boolean())))))
    .prop('attachment', schema
      .object()
      .prop('type', schema.string().enum(['image']))
      .prop('url', schema.string().format(schema.FORMATS.URI)))
    .prop('format', schema.string().enum(['choices']))
    .prop('question', schema.string().required())
    .valueOf(),
}

export const deleteQuestionSchema = {
  body: schema
    .object()
    .prop('questionId', id.required())
    .valueOf()
}