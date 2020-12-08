import multer from 'fastify-multer';
import config from '../../config/index.js';

const allowedMimeTypes = ['image/png', 'image/jpeg'];

const upload = multer({
  dest: 'uploads/',
  fileFilter: (request, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      return cb(null, true);
    }

    cb(null, false);
  }
})

function uploadRoute() {
  return {
    method: 'POST',
    url: '/',
    preHandler: upload.single('file'),
    handler: async (request, reply) => {
      if (!request.file) {
        reply.badRequest('File type not allowed or not found');
      }
      return {
        url: `${config.apiUrl}/${request.file.path}`,
        ...request.file,
      }
    }
  }
}

export default async (app) => {
  app.route(uploadRoute(app));
}