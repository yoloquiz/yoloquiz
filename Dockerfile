FROM node:15 as build-stage

WORKDIR /app

COPY package.json .
COPY yarn.lock .
COPY packages/app/package.json packages/app/

RUN yarn workspace app install --pure-lockfile --non-interactive

COPY ./packages/app packages/app

RUN yarn workspace app run build

FROM nginx:latest as production-app

WORKDIR /app

COPY --from=build-stage /app/packages/app/dist /app

COPY nginx.conf /etc/nginx/nginx.conf

FROM node:15 as production-api

WORKDIR /api

COPY package.json .
COPY yarn.lock .
COPY packages/api/package.json packages/api/

RUN yarn workspace api install --pure-lockfile --non-interactive --production

COPY ./packages/api packages/api

CMD [ "yarn", "workspace", "api", "run", "start" ]