import schema from 'fluent-schema';
import { shortText } from "../shared/common.schema.js";

export const updateProfile = {
  body: schema.object()
    .prop('firstName', shortText.required())
    .prop('lastName', shortText.required())
    .valueOf()
}