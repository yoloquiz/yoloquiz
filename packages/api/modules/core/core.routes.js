function healthRoute(app) {
  return {
    method: 'GET',
    url: '/_healthz',
    handler: async (request, reply) => {
      reply.send('ok');
    }
  }
}

export default async (app) => {
  app.route(healthRoute(app))
}
