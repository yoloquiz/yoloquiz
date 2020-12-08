import _ from 'lodash';

export function eqId(idA, idB) {
  return _.eq(_.toString(idA), _.toString(idB));
}