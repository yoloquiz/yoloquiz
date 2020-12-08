// eslint-disable-next-line import/prefer-default-export
export function sleep(timeInMs) {
  return new Promise((resolve) => setTimeout(resolve, timeInMs));
}
