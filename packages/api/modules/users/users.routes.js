export function getMe(app) {
  return {
    method: 'GET',
    url: '/me',
    handler: () => {
      return {
        id: 'fake',
      }
    },
  }
}

export default async (app) => {
  app.route(getMe(app));
}
