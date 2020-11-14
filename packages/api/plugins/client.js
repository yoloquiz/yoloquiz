import fastifyStatic from 'fastify-static';

export default async function clientPlugin(app, { staticFolder }) {
  app.register(fastifyStatic, { root: staticFolder });
  app.setNotFoundHandler((req, res) => {
    res.sendFile('index.html');
  });
}
