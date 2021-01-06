FROM node:15 as build-stage

WORKDIR /app

COPY package.json .
COPY yarn.lock .
COPY packages/app/package.json packages/app/

RUN yarn workspace app install --pure-lockfile --non-interactive

COPY ./packages/app packages/app

RUN yarn workspace app run build

FROM node:15

RUN apt-get update && apt-get install -y \
    nginx \
  && rm -rf /var/lib/apt/lists/* \
  && rm /var/log/nginx/* \
  && ln -s /dev/stdout /var/log/nginx/access.log \
  && ln -s /dev/stderr /var/log/nginx/error.log

COPY nginx.conf /etc/nginx/nginx.conf

WORKDIR /app

COPY package.json .
COPY yarn.lock .
COPY packages/api/package.json packages/api/

RUN yarn workspace api install --pure-lockfile --non-interactive --production

COPY --from=build-stage /app/packages/app/dist packages/app
COPY ./packages/api packages/api

COPY ./docker-entrypoint.sh /usr/local/bin/

EXPOSE 80

VOLUME ["/app/packages/api/uploads"]

CMD [ "yarn", "start" ]
